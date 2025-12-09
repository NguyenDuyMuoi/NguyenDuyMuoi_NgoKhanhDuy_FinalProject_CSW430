using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;
using TechStore.Api.Models;
using TechStore.Api.DTOs.Orders;
using TechStore.Api.Mappings;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // ============================================================
    // 1) CREATE ORDER (Tạo đơn hàng từ giỏ hàng)
    // ============================================================
    [HttpPost("{userId}/create")]
    public async Task<IActionResult> CreateOrder(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || cart.CartItems.Count == 0)
            return BadRequest("Giỏ hàng rỗng.");

        decimal total = cart.CartItems.Sum(i => i.Quantity * i.Product.FinalPrice);

        var order = new Order
        {
            UserId = userId,
            TotalPrice = total,
            Status = "Pending",
            CreatedAt = DateTime.Now
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var item in cart.CartItems)
        {
            _context.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.Product.OriginalPrice,
                FinalPrice = item.Product.FinalPrice
            });
        }

        _context.CartItems.RemoveRange(cart.CartItems);
        await _context.SaveChangesAsync();

        var dto = await _context.Orders
            .Include(o => o.OrderItems).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        return Ok(dto.ToOrderDto());
    }

    // ============================================================
    // 2) GET ALL ORDERS OF USER
    // ============================================================
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetOrders(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems).ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o => o.ToOrderDto()));
    }

    // ============================================================
    // 3) GET ORDER DETAIL
    // ============================================================
    [HttpGet("detail/{orderId}")]
    public async Task<IActionResult> GetOrderDetail(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound();

        return Ok(order.ToOrderDto());
    }

    // ============================================================
    // 4) USER UPDATE ORDER STATUS (Pending → Paid / Cancelled)
    // ============================================================
    [HttpPost("{orderId}/update-status")]
    public async Task<IActionResult> UpdateStatus(int orderId, UpdateOrderStatusRequest req)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound("Order not found.");

        string newStatus = req.Status;

        if (newStatus != "Pending" && newStatus != "Paid" && newStatus != "Cancelled")
            return BadRequest("Invalid status.");

        if (order.Status == "Paid" || order.Status == "Cancelled")
            return BadRequest("This order can no longer be modified.");

        order.Status = newStatus;
        await _context.SaveChangesAsync();

        return Ok($"Order status updated to {order.Status}");
    }

    // ============================================================
    // 5) CANCEL ORDER QUICK
    // ============================================================
    [HttpPost("{orderId}/cancel")]
    public async Task<IActionResult> CancelOrder(int orderId)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound();

        order.Status = "Cancelled";
        await _context.SaveChangesAsync();

        return Ok("Đã hủy đơn hàng.");
    }
    // ============================================================
    // 6) ADMIN: GET ALL ORDERS
    // ============================================================
    [HttpGet("admin/all")]
    public async Task<IActionResult> AdminGetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o => o.ToOrderDto()));
    }

    // ============================================================
    // 7) ADMIN: GET ORDER DETAIL
    // ============================================================
    [HttpGet("admin/detail/{orderId}")]
    public async Task<IActionResult> AdminGetOrderDetail(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound("Order not found");

        return Ok(order.ToOrderDto());
    }

    // ============================================================
    // 8) ADMIN: UPDATE STATUS
    // ============================================================
    [HttpPut("admin/{orderId}/status")]
    public async Task<IActionResult> AdminUpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest req)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound("Order not found");

        if (req.Status != "Pending" && req.Status != "Paid" && req.Status != "Cancelled")
            return BadRequest("Invalid status");

        order.Status = req.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated", status = order.Status });
    }

}
