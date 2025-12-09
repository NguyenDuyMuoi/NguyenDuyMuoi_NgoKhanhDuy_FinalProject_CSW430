public class FlashSaleItemDto
{
    public int Id { get; set; }
    public int FlashSaleId { get; set; }
    public int ProductId { get; set; }

    public string ProductName { get; set; }
    public string ImageUrl { get; set; }

    public decimal FlashPrice { get; set; }
    public int LimitQuantity { get; set; }
    public int SoldQuantity { get; set; }
    public string Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
