using System;

namespace StripeCheckoutApi.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; } // Price in cents
        public string Currency { get; set; } = "usd";
        public int Quantity { get; set; } = 1;
        public string ImageUrl { get; set; }
    }
} 