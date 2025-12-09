public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}
