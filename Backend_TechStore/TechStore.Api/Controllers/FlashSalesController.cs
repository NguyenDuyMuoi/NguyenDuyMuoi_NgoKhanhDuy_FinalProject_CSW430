using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;
using TechStore.Api.DTOs;
using TechStore.Api.DTOs.FlashSale;
using TechStore.Api.Mappings;
using TechStore.Api.Models;

namespace TechStore.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class FlashSaleAdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlashSaleAdminController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // AUTO UPDATE STATUS
        // ============================
        private void UpdateFlashSaleStatus(FlashSale fs)
        {
            var now = DateTime.UtcNow;

            if (fs.EndTime < now)
                fs.Status = "Finished";
            else if (fs.StartTime > now)
                fs.Status = "Upcoming";
            else
                fs.Status = "Ongoing";
        }

        // ============================
        // GET ALL FLASH SALES
        // ============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.FlashSales
                .Include(fs => fs.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.ProductImages)
                .OrderByDescending(fs => fs.CreatedAt)
                .ToListAsync();

            // Auto-update status
            foreach (var fs in data)
                UpdateFlashSaleStatus(fs);

            await _context.SaveChangesAsync();

            return Ok(data.Select(fs => fs.ToFlashSaleDto()));
        }

        // ============================
        // CREATE FLASH SALE
        // ============================
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] AddFlashSaleRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var flashSale = new FlashSale
            {
                Name = dto.Name,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                CreatedAt = DateTime.UtcNow
            };

            UpdateFlashSaleStatus(flashSale);

            _context.FlashSales.Add(flashSale);
            await _context.SaveChangesAsync();

            return Ok(flashSale.Id);
        }

        // ============================
        // GET FLASH SALE BY ID
        // ============================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var fs = await _context.FlashSales
                .Include(x => x.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (fs == null)
                return NotFound("Flash sale not found");

            UpdateFlashSaleStatus(fs);
            await _context.SaveChangesAsync();

            return Ok(fs.ToFlashSaleDto());
        }

        // ============================
        // UPDATE FLASH SALE
        // ============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FlashSale request)
        {
            var fs = await _context.FlashSales.FindAsync(id);
            if (fs == null) return NotFound("Flash sale not found");

            fs.Name = request.Name;
            fs.StartTime = request.StartTime;
            fs.EndTime = request.EndTime;

            // Auto update status
            UpdateFlashSaleStatus(fs);

            await _context.SaveChangesAsync();
            return Ok("Updated");
        }

        // ============================
        // DELETE FLASH SALE
        // ============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fs = await _context.FlashSales
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (fs == null) return NotFound("Flash sale not found");

            _context.FlashSaleItems.RemoveRange(fs.Items);
            _context.FlashSales.Remove(fs);

            await _context.SaveChangesAsync();
            return Ok("Deleted");
        }

        // ============================
        // ADD ITEM TO FLASH SALE
        // ============================
        [HttpPost("{flashSaleId}/add-item")]
        public async Task<IActionResult> AddItem(int flashSaleId, [FromBody] AddFlashSaleItemRequest dto)
        {
            var fs = await _context.FlashSales.FindAsync(flashSaleId);
            if (fs == null) return NotFound("Flash sale not found");

            var item = new FlashSaleItem
            {
                FlashSaleId = flashSaleId,
                ProductId = dto.ProductId,
                FlashPrice = dto.FlashPrice,
                LimitQuantity = dto.LimitQuantity,
                SoldQuantity = 0,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.FlashSaleItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok("Item added");
        }

        // ============================
        // GET ACTIVE FLASH SALE
        // ============================
        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var now = DateTime.UtcNow;

            var fs = await _context.FlashSales
                .Include(x => x.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.ProductImages)
                .Where(x => x.StartTime <= now && x.EndTime >= now)
                .FirstOrDefaultAsync();

            if (fs == null) return Ok(null);

            UpdateFlashSaleStatus(fs);
            await _context.SaveChangesAsync();

            return Ok(fs.ToFlashSaleDto());
        }

        // ============================
        // DELETE FLASH SALE ITEM
        // ============================
        [HttpDelete("item/{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            var item = await _context.FlashSaleItems.FindAsync(itemId);
            if (item == null) return NotFound("Item not found");

            _context.FlashSaleItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Item deleted");
        }
    }
}
