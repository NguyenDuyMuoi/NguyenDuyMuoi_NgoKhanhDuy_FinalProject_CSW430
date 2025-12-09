namespace TechStore.Api.DTOs.Users
{
    public class UpdateUserDto
    {
        public string? Name { get; set; }

        public string? OldPassword { get; set; }

        public string? NewPassword { get; set; }
    }
}
