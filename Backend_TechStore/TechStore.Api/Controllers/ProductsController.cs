using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TechStore.Api.Data;
using TechStore.Api.DTOs.Products;
using TechStore.Api.Mappings;
using TechStore.Api.Models;

namespace TechStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll(
            [FromQuery] string? brand,
            [FromQuery] string? category,
            [FromQuery] string? keyword)
        {
            var query = _context.Products
                .Include(p => p.ProductImages)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(brand))
                query = query.Where(p => p.Brand.Contains(brand));

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(p => p.Category.Contains(category));

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(p =>
                    p.Name.Contains(keyword) ||
                    p.Description.Contains(keyword));

            query = query.OrderByDescending(x => x.CreatedAt);

            var data = await query.ToListAsync();

            return Ok(data.Select(x => x.ToProductDto()));
        }

        // GET: api/products/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return Ok(product.ToProductDto());
        }

        // POST: api/products/add
        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromBody] AddProductRequest dto)
        {
            try
            {
                var product = dto.ToProductEntity();

                _context.Products.Add(product);
                await _context.SaveChangesAsync(); // có Id

                // Lưu ảnh
                if (dto.Images != null && dto.Images.Count > 0)
                {
                    foreach (var img in dto.Images)
                    {
                        var fileName = Path.GetFileName(img.Trim());

                        _context.ProductImages.Add(new ProductImage
                        {
                            ProductId = product.Id,
                            ImageUrl = fileName,
                            CreatedAt = DateTime.Now
                        });
                    }

                    await _context.SaveChangesAsync();
                }

                // reload images để mapping ra dto
                await _context.Entry(product)
                    .Collection(p => p.ProductImages)
                    .LoadAsync();

                return Ok(product.ToProductDto());
            }
            catch (Exception ex)
            {
                return BadRequest("Không thể thêm sản phẩm: " + ex.Message);
            }
        }

        // PUT: api/products/update/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest dto)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.ProductImages)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound("Product not found");

                // Update các field cơ bản
                product.UpdateProductEntity(dto);
                await _context.SaveChangesAsync();

                // Xóa ảnh cũ (nếu có)
                if (product.ProductImages != null && product.ProductImages.Count > 0)
                {
                    _context.ProductImages.RemoveRange(product.ProductImages);
                    await _context.SaveChangesAsync();
                }

                // Thêm ảnh mới
                if (dto.Images != null && dto.Images.Count > 0)
                {
                    foreach (var img in dto.Images)
                    {
                        var fileName = Path.GetFileName(img.Trim());

                        _context.ProductImages.Add(new ProductImage
                        {
                            ProductId = product.Id,
                            ImageUrl = fileName,
                            CreatedAt = DateTime.Now
                        });
                    }

                    await _context.SaveChangesAsync();
                }

                // reload images để mapping ra dto
                await _context.Entry(product)
                    .Collection(p => p.ProductImages)
                    .LoadAsync();

                return Ok(product.ToProductDto());
            }
            catch (Exception ex)
            {
                return BadRequest("Không thể cập nhật sản phẩm: " + ex.Message);
            }
        }
        //search product
        [HttpGet("search")]
        public IActionResult SearchProducts(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return Ok(new List<ProductDto>());

            keyword = keyword.ToLower();

            var products = _context.Products
                .Include(p => p.ProductImages) // 🔥 phải include
                .Where(p =>
                    p.Name.ToLower().Contains(keyword) ||
                    p.Brand.ToLower().Contains(keyword) ||
                    p.Category.ToLower().Contains(keyword)
                )
                .ToList();

            return Ok(products.Select(p => p.ToProductDto()));
        }
        // GET: api/products/category/{category}
        
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
                return BadRequest("Category is required.");

            var products = await _context.Products
                .Where(p => p.Category.ToLower() == category.ToLower())
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var result = products.Select(p => p.ToProductDto());

            return Ok(result);
        }


        //get brands
        [HttpGet("brand/{brand}")]
        public async Task<IActionResult> GetProductsByBrand(string brand)
        {
            if (string.IsNullOrWhiteSpace(brand))
                return BadRequest("Brand is required.");

            var products = await _context.Products
                .Where(p => p.Brand.ToLower() == brand.ToLower())
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var result = products.Select(p => p.ToProductDto());

            return Ok(result);
        }


        // DELETE: api/products/delete/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.ProductImages)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound("Product not found");

                // XÓA FLASH SALE ITEMS trước
                var flashSaleItems = _context.FlashSaleItems.Where(f => f.ProductId == id);
                if (flashSaleItems.Any())
                {
                    _context.FlashSaleItems.RemoveRange(flashSaleItems);
                }

                // XÓA ORDER ITEMS trước
                var orderItems = _context.OrderItems.Where(o => o.ProductId == id);
                if (orderItems.Any())
                {
                    _context.OrderItems.RemoveRange(orderItems);
                }

                // XÓA IMAGE
                if (product.ProductImages != null && product.ProductImages.Count > 0)
                {
                    _context.ProductImages.RemoveRange(product.ProductImages);
                }

                // XÓA PRODUCT
                _context.Products.Remove(product);

                await _context.SaveChangesAsync();

                return Ok("Deleted");
            }
            catch (Exception ex)
            {
                return BadRequest("Không thể xóa sản phẩm: " + ex.Message);
            }
        }

    }
}
