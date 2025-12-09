using TechStore.Api.Models;

public static class OrderMapping
{
    public static OrderDto ToOrderDto(this Order o)
        => new OrderDto
        {
            Id = o.Id,
            UserId = o.UserId,
            Status = o.Status,
            TotalPrice = o.TotalPrice,
            CreatedAt = o.CreatedAt,

            Items = o.OrderItems?.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ProductImage = i.Product.ProductImages.FirstOrDefault()?.ImageUrl,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                FinalPrice = i.FinalPrice
            }).ToList()
        };
}
