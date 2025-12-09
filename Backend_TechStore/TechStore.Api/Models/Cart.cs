using TechStore.Api.Models;

public class Cart
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
    public ICollection<CartItem> CartItems { get; set; }
}
