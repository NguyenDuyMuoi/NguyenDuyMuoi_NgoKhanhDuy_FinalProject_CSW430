namespace TechStore.Api.DTOs.Payments
{
    public class PaymentRequestDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; }
    }
}
