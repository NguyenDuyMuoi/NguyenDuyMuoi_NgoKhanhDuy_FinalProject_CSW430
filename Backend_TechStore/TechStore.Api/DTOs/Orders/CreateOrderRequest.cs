namespace TechStore.Api.DTOs.Orders
{
    public class CreateOrderRequest
    {
        public int AddressId { get; set; }
        public string PaymentMethod { get; set; }
    }
}