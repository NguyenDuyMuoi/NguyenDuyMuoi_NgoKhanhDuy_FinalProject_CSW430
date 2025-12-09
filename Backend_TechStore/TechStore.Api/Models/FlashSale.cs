public class FlashSale
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; }   // Upcoming, Active, Ended
    public DateTime CreatedAt { get; set; }

    public ICollection<FlashSaleItem> Items { get; set; }
}
