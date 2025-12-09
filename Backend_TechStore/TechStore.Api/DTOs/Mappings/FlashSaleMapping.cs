using TechStore.Api.Mappings;

using TechStore.Api.DTOs;
using TechStore.Api.Models;

public static class FlashSaleMapping
{
    // -------------------------------
    // MAP FlashSale → FlashSaleDto
    // -------------------------------
    public static FlashSaleDto ToFlashSaleDto(this FlashSale fs)
    {
        return new FlashSaleDto
        {
            Id = fs.Id,
            Name = fs.Name,
            StartTime = fs.StartTime,
            EndTime = fs.EndTime,
            Status = fs.Status,
            CreatedAt = fs.CreatedAt,

            Items = fs.Items?
                .Select(i => i.ToFlashSaleItemDto())
                .ToList()
        };
    }

    // -------------------------------
    // MAP FlashSaleItem → FlashSaleItemDto
    // -------------------------------
    public static FlashSaleItemDto ToFlashSaleItemDto(this FlashSaleItem item)
    {
        return new FlashSaleItemDto
        {
            Id = item.Id,
            FlashSaleId = item.FlashSaleId,
            ProductId = item.ProductId,

            ProductName = item.Product?.Name,
            ImageUrl = item.Product?.ProductImages.FirstOrDefault()?.ImageUrl,

            FlashPrice = item.FlashPrice,
            LimitQuantity = item.LimitQuantity,
            SoldQuantity = item.SoldQuantity,
            Status = item.Status,

            CreatedAt = item.CreatedAt
        };
    }
}
