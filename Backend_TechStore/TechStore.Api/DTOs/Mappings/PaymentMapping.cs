using TechStore.Api.DTOs.Payments;
using TechStore.Api.Models;

public static class PaymentMapping
{
    public static PaymentDto ToDto(this Payment p)
        => new PaymentDto
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
