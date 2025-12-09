namespace TechStore.Api.DTOs.FlashSale
{
    public class AddFlashSaleRequest
    {
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
