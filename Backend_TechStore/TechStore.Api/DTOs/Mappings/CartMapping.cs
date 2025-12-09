public static class CartMapping
{
    public static CartItemDto ToCartItemDto(this CartItem item)
        => new CartItemDto
        {
            ProductId = item.ProductId,
            ProductName = item.Product?.Name ?? "",
            // ⛔ Chỉ trả về TÊN FILE, không ghép BaseUrl
            ImageUrl = item.Product?.ProductImages.FirstOrDefault()?.ImageUrl ?? "",
            UnitPrice = item.UnitPrice,
            Quantity = item.Quantity
        };

    public static CartDto ToCartDto(this Cart cart)
        => new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = cart.CartItems
                        .Select(x => x.ToCartItemDto())
                        .ToList(),
            TotalPrice = cart.CartItems.Sum(x => x.UnitPrice * x.Quantity)
        };
}
