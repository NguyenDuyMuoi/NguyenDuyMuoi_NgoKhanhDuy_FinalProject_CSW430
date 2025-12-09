namespace TechStore.Api.DTOs.Products
{
    public class ProductFilterDto
    {
        public string? Brand { get; set; }

        public string? Category { get; set; }

        // Từ khóa tìm kiếm: tên, mô tả
        public string? Keyword { get; set; }

        // Optional: lọc giá
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        // Optional: sắp xếp
        // newest | priceAsc | priceDesc | discount
        public string? Sort { get; set; }

        // Optional: phân trang
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
