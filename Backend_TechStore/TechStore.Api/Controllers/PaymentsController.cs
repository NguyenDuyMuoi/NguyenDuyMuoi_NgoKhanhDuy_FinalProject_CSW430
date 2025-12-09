using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;
using TechStore.Api.Models;
using TechStore.Api.DTOs.Payments;

namespace TechStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // ================================
        // 1. CREATE PAYMENT
        // ================================
        [HttpPost("{userId}/create")]
        public async Task<IActionResult> CreatePayment(int userId, CreatePaymentRequest req)
        {
            // 1. Kiểm tra Order có tồn tại không
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == req.OrderId);

            if (order == null)
                return BadRequest("Order not found.");

            // 2. Kiểm tra user có quyền thanh toán order này không
            if (order.UserId != userId)
                return BadRequest("Unauthorized.");

            // 3. Tạo mã giao dịch ngẫu nhiên
            string transactionId = $"PAY-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

            // 4. Tạo payment
            var payment = new Payment
            {
                OrderId = order.Id,
                UserId = userId,
                Amount = order.TotalPrice,
                Method = req.Method,
                Status = "Success",          // Thanh toán COD = success luôn
                TransactionId = transactionId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // 5. Cập nhật trạng thái Order
            order.Status = "Paid";

            await _context.SaveChangesAsync();

            // 6. Trả về Dto
            var dto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                UserId = payment.UserId,
                Amount = payment.Amount,
                Method = payment.Method,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                CreatedAt = payment.CreatedAt
            };

            return Ok(dto);
        }

        // ================================
        // 2. LẤY DANH SÁCH PAYMENT CỦA USER
        // ================================
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetPayments(int userId)
        {
            var payments = await _context.Payments
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var list = payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                UserId = p.UserId,
                Amount = p.Amount,
                Method = p.Method,
                Status = p.Status,
                TransactionId = p.TransactionId,
                CreatedAt = p.CreatedAt
            });

            return Ok(list);
        }
    }
}
