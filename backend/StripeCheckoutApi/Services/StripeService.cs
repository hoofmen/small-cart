using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Stripe;
using StripeCheckoutApi.Models;

namespace StripeCheckoutApi.Services
{
    public class StripeService
    {
        private readonly string _stripeSecretKey;
        private readonly string _stripePublishableKey;

        public StripeService(IConfiguration configuration)
        {
            _stripeSecretKey = configuration["Stripe:SecretKey"];
            _stripePublishableKey = configuration["Stripe:PublishableKey"];
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        public async Task<CreateCheckoutSessionResponse> CreateCheckoutSessionAsync(CreateCheckoutSessionRequest request)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = CalculateTotalAmount(request.Products),
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "klarna", "card" }, // Allow Klarna and card
                AutomaticPaymentMethods = null, // Disable automatic payment methods
                Metadata = new Dictionary<string, string>
                {
                    { "integration_check", "klarna_and_card" }
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return new CreateCheckoutSessionResponse
            {
                ClientSecret = paymentIntent.ClientSecret,
                PublishableKey = _stripePublishableKey,
                SessionId = paymentIntent.Id
            };
        }

        private long CalculateTotalAmount(List<StripeCheckoutApi.Models.Product> products)
        {
            long total = 0;
            foreach (var product in products)
            {
                total += product.Price * product.Quantity;
            }
            return total;
        }

        public async Task<List<StripeCheckoutApi.Models.Product>> GetProductsAsync()
        {
            // In a real application, this would come from a database
            return new List<StripeCheckoutApi.Models.Product>
            {
                new StripeCheckoutApi.Models.Product
                {
                    Id = "prod_1",
                    Name = "T-Shirt",
                    Description = "Comfortable cotton t-shirt",
                    Price = 1999, // $19.99
                    ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                },
                new StripeCheckoutApi.Models.Product
                {
                    Id = "prod_2",
                    Name = "Hoodie",
                    Description = "Warm hoodie for cold days",
                    Price = 4999, // $49.99
                    ImageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                },
                new StripeCheckoutApi.Models.Product
                {
                    Id = "prod_3",
                    Name = "Cap",
                    Description = "Stylish cap with logo",
                    Price = 1499, // $14.99
                    ImageUrl = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                }
            };
        }
    }
} 