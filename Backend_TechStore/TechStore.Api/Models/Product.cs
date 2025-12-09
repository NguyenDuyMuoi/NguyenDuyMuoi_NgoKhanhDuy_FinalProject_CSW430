using System;
using System.Collections.Generic;

namespace TechStore.Api.Models
{
    public class Product
    {
        public Product()
        {
            ProductImages = new List<ProductImage>();
            OrderItems = new List<OrderItem>();
            CartItems = new List<CartItem>();
            FlashSaleItems = new List<FlashSaleItem>();
        }

        public int Id { get; set; }

        public string Name { get; set; } = "";
        public string Brand { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";

        public int Quantity { get; set; }

        public decimal OriginalPrice { get; set; }
        public int DiscountPercent { get; set; }
        public decimal FinalPrice { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; }

        // Giữ lại nếu hệ thống có dùng
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
        public ICollection<FlashSaleItem> FlashSaleItems { get; set; }
    }
}
