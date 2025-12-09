using System.Collections.Generic;

namespace TechStore.Api.DTOs.Products
{
    public class UpdateProductRequest
    {
        public string Name { get; set; } = "";
        public string Brand { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";

        public decimal OriginalPrice { get; set; }
        public int DiscountPercent { get; set; }
        public int Quantity { get; set; }

        public bool IsActive { get; set; }

        // Danh sách TÊN FILE ảnh sau khi sửa
        public List<string>? Images { get; set; }
    }
}
