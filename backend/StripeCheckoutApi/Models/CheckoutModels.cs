using System.Collections.Generic;

namespace StripeCheckoutApi.Models
{
    public class CreateCheckoutSessionRequest
    {
        public List<Product> Products { get; set; }
        public string SuccessUrl { get; set; }
        public string CancelUrl { get; set; }
    }

    public class CreateCheckoutSessionResponse
    {
        public string ClientSecret { get; set; }
        public string PublishableKey { get; set; }
        public string SessionId { get; set; }
    }

    public class PaymentIntentResponse
    {
        public string ClientSecret { get; set; }
    }
} 