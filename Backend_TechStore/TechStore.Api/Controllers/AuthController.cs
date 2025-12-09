using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Api.Data;
using TechStore.Api.DTOs.Auth;
using TechStore.Api.Models;

namespace TechStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            // ⭐ Random avatar (1–70)
            int avatarId = new Random().Next(1, 70);
            string avatarUrl = $"https://i.pravatar.cc/300?img={avatarId}";

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                AvatarUrl = avatarUrl,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Register success",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.AvatarUrl,
                    user.CreatedAt
                }
            });
        }
  

            // ⭐ GET ALL USERS
            [HttpGet]
            public async Task<IActionResult> GetAllUsers()
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        u.Role,
                        u.AvatarUrl,
                        u.IsActive,
                        u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(users);
            }
        
    


    // LOGIN
    [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            bool passOk = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!passOk)
                return Unauthorized("Invalid credentials");

            return Ok(new
            {
                message = "Login success",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.AvatarUrl
                }
            });
        }
    }
}
