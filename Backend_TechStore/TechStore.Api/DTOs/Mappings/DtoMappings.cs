using TechStore.Api.DTOs.Auth;
using TechStore.Api.DTOs.Cart;
using TechStore.Api.DTOs.FlashSale;
using TechStore.Api.DTOs.Orders;
using TechStore.Api.DTOs.Payments;
using TechStore.Api.DTOs.Products;
using TechStore.Api.DTOs.Users;
using TechStore.Api.Models;

namespace TechStore.Api.Mappings
{
    public static class DtoMappings
    {
        // Flash Sale
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
                Items = fs.Items?.Select(i => i.ToFlashSaleItemDto()).ToList()
            };
        }

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

        // Product

        // Users
        public static UserDto ToUserDto(this User u) => new()
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            AvatarUrl = u.AvatarUrl
        };

        // Cart
       
            // ===== CART ITEM DTO =====
            public static CartItemDto ToCartItemDto(this CartItem item)
            {
                return new CartItemDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product?.Name,
                    ImageUrl = item.Product?.ProductImages?.FirstOrDefault()?.ImageUrl,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity
                };
            }

        // ===== CART DTO =====
        // ===== CART DTO =====
        public static CartDto ToCartDto(this Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                TotalPrice = cart.CartItems.Sum(i => i.Quantity * i.UnitPrice),

                Items = cart.CartItems.Select(i => new CartItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    ImageUrl = i.Product.ProductImages.FirstOrDefault()?.ImageUrl,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                }).ToList()
            };
        }





        // Order
        public static OrderDto ToOrderDto(this Order o)
        {
            return new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            };
        }

        // Payment
        public static PaymentDto ToPaymentDto(this Payment p)
        {
            return new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                UserId = p.UserId,
                Amount = p.Amount,
                Method = p.Method,
                Status = p.Status,
                TransactionId = p.TransactionId,
                CreatedAt = p.CreatedAt
            };
        }
    }
}
