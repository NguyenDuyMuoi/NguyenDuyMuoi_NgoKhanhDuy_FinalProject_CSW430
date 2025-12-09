using TechStore.Api.Models;

public class CartItem
{
    public int CartId { get; set; }
    public int ProductId { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateTime CreatedAt { get; set; }

    public Cart Cart { get; set; }
    public Product Product { get; set; }
}
