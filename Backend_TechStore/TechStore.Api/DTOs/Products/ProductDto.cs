using System;
using System.Collections.Generic;

namespace TechStore.Api.DTOs.Products
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";
        public string Brand { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";

        public decimal OriginalPrice { get; set; }
        public int DiscountPercent { get; set; }
        public decimal FinalPrice { get; set; }
        public int Quantity { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // Ảnh đầu tiên – dùng cho list
        public string FirstImage { get; set; } = "";

        // Danh sách TÊN FILE ảnh
        public List<string> Images { get; set; } = new();
    }
}
