using TechStore.Api.Models;

public class HomeAddress
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string FullName { get; set; }
    public string Phone { get; set; }
    public string Province { get; set; }
    public string District { get; set; }
    public string Ward { get; set; }
    public string AddressLine { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; }
}
