namespace TechStore.Api.DTOs.Payments
{
    public class CreatePaymentRequest
    {
        public int OrderId { get; set; }
        public string Method { get; set; }
    }
}