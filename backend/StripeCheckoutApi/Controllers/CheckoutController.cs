using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StripeCheckoutApi.Models;
using StripeCheckoutApi.Services;

namespace StripeCheckoutApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly StripeService _stripeService;

        public CheckoutController(StripeService stripeService)
        {
            _stripeService = stripeService;
        }

        [HttpGet("products")]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _stripeService.GetProductsAsync();
            return Ok(products);
        }

        [HttpPost("create-payment-intent")]
        public async Task<ActionResult<CreateCheckoutSessionResponse>> CreateCheckoutSession(CreateCheckoutSessionRequest request)
        {
            var response = await _stripeService.CreateCheckoutSessionAsync(request);
            return Ok(response);
        }
    }
} 