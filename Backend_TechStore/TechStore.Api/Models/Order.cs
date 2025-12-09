using System;
using System.Collections.Generic;

namespace TechStore.Api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ⭐ Navigation properties MUST HAVE
        public User User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
