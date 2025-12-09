
using TechStore.Api.DTOs.Users;

namespace TechStore.Api.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}