using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;

[ApiController]
[Route("api/[controller]")]
public class HomeAddressController : ControllerBase
{
    private readonly AppDbContext _context;

    public HomeAddressController(AppDbContext context)
    {
        _context = context;
    }

    // Lấy địa chỉ theo user
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAddress(int userId)
    {
        var addr = await _context.HomeAddresses
            .FirstOrDefaultAsync(a => a.UserId == userId);

        return Ok(addr);
    }

    // Tạo hoặc cập nhật
    [HttpPost("{userId}")]
    public async Task<IActionResult> SaveAddress(int userId, CreateAddressRequest req)
    {
        var exist = await _context.HomeAddresses
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (exist == null)
        {
            var newAddr = new HomeAddress
            {
                UserId = userId,
                FullName = req.FullName,
                Phone = req.Phone,
                Province = req.Province,
                District = req.District,
                Ward = req.Ward,
                AddressLine = req.AddressLine,
            };

            _context.HomeAddresses.Add(newAddr);
        }
        else
        {
            exist.FullName = req.FullName;
            exist.Phone = req.Phone;
            exist.Province = req.Province;
            exist.District = req.District;
            exist.Ward = req.Ward;
            exist.AddressLine = req.AddressLine;
        }

        await _context.SaveChangesAsync();
        return Ok("Saved");
    }
}
