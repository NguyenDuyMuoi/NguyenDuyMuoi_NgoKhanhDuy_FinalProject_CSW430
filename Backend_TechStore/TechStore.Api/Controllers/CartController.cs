using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TechStore.Api.Data;
using TechStore.Api.DTOs;
using TechStore.Api.DTOs.Cart;
using TechStore.Api.Mappings; // nơi chứa ToCartDto()
using TechStore.Api.Models;

namespace TechStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // GET CART BY USER ID
        // ============================
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("Cart not found");

            return Ok(cart.ToCartDto());
        }


        // ============================
        // ADD TO CART
        // ============================
        [HttpPost("{userId}/add")]
        public async Task<IActionResult> AddToCart(int userId, AddToCartRequest req)
        {
            // Kiểm tra user tồn tại
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
                return BadRequest("User does not exist");

            // Tải sản phẩm
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == req.ProductId);

            if (product == null)
                return BadRequest("Product not found");

            // Tìm cart hiện tại
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            // Nếu chưa có -> tạo mới
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    Status = "Active",
                    CreatedAt = DateTime.Now
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Kiểm tra CartItem tồn tại
            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == req.ProductId);

            if (item == null)
            {
                item = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = req.ProductId,
                    Quantity = req.Quantity,
                    UnitPrice = product.FinalPrice,
                    CreatedAt = DateTime.Now
                };

                _context.CartItems.Add(item); // ⚠ Đây mới là đúng!
            }
            else
            {
                item.Quantity += req.Quantity;
                _context.CartItems.Update(item);
            }

            await _context.SaveChangesAsync();

            // Load lại cart với product → tránh lỗi null
            cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.Id == cart.Id);

            return Ok(cart.ToCartDto());
        }



        // ============================
        // UPDATE CART ITEM
        // ============================
        [HttpPut("{userId}/update")]
        public async Task<IActionResult> UpdateItem(int userId, [FromQuery] int productId, UpdateCartItemRequest req)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound("Cart not found");

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
            if (item == null) return NotFound("Item not found");

            item.Quantity = req.Quantity;
            await _context.SaveChangesAsync();

            return Ok(cart.ToCartDto());
        }

        // ============================
        // REMOVE ITEM
        // ============================
        [HttpDelete("{userId}/remove/{productId}")]
        public async Task<IActionResult> RemoveItem(int userId, int productId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound("Cart not found");

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
            if (item == null) return NotFound("Item not found");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(cart.ToCartDto());
        }

        // ============================
        // CLEAR CART
        // ============================
        [HttpDelete("{userId}/clear")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return Ok(new CartDto
                {
                    UserId = userId,
                    Items = new List<CartItemDto>(),
                    TotalPrice = 0
                });
            }

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return Ok(cart.ToCartDto());
        }
    }
}
