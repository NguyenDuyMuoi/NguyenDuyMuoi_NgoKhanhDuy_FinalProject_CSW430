using TechStore.Api.Models;

public class FlashSaleItem
{
    public int Id { get; set; }
    public int FlashSaleId { get; set; }
    public int ProductId { get; set; }

    public decimal FlashPrice { get; set; }
    public int LimitQuantity { get; set; }
    public int SoldQuantity { get; set; }
    public string Status { get; set; }   // Active, SoldOut, Disabled
    public DateTime CreatedAt { get; set; }

    public FlashSale FlashSale { get; set; }
    public Product Product { get; set; }
}
