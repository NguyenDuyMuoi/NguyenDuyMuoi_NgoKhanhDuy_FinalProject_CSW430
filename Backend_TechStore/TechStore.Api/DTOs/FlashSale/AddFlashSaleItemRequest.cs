namespace TechStore.Api.DTOs.FlashSale
{
    public class AddFlashSaleItemRequest
    {
        public int ProductId { get; set; }
        public decimal FlashPrice { get; set; }
        public int LimitQuantity { get; set; }
    }
}
