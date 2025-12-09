using System;
using System.Linq;
using TechStore.Api.DTOs.Products;
using TechStore.Api.Models;

namespace TechStore.Api.Mappings
{
    public static class ProductMapping
    {
        // Product -> ProductDto
        public static ProductDto ToProductDto(this Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Brand = p.Brand,
                Category = p.Category,
                Description = p.Description,
                OriginalPrice = p.OriginalPrice,
                DiscountPercent = p.DiscountPercent,
                FinalPrice = p.FinalPrice,
                Quantity = p.Quantity,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,

                FirstImage = p.ProductImages.FirstOrDefault()?.ImageUrl ?? "",
                Images = p.ProductImages.Select(x => x.ImageUrl).ToList()
            };
        }

        // AddProductRequest -> Product
        public static Product ToProductEntity(this AddProductRequest dto)
        {
            return new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Category = dto.Category,
                Quantity = dto.Quantity,
                Description = dto.Description,
                OriginalPrice = dto.OriginalPrice,
                DiscountPercent = dto.DiscountPercent,

                // Server tự tính FinalPrice
                FinalPrice = dto.OriginalPrice - (dto.OriginalPrice * dto.DiscountPercent / 100m),

                IsActive = true,
                CreatedAt = DateTime.Now,
            };
        }

        // UpdateProductRequest -> Product (update)
        public static void UpdateProductEntity(this Product p, UpdateProductRequest dto)
        {
            p.Name = dto.Name;
            p.Brand = dto.Brand;
            p.Category = dto.Category;
            p.Description = dto.Description;
            p.OriginalPrice = dto.OriginalPrice;
            p.DiscountPercent = dto.DiscountPercent;
            p.Quantity = dto.Quantity;
            p.IsActive = dto.IsActive;

            // Tính lại giá sau giảm
            p.FinalPrice = p.OriginalPrice - (p.OriginalPrice * p.DiscountPercent / 100m);
        }
    }
}
