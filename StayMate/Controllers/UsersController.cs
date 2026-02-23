using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.DTOs;
using StayMate.Models;

namespace StayMate.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly StayMateDbContext _context;

    public UsersController(StayMateDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found.");

        return Ok(new UserProfileDto
        {
            UserId = user.UserId,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            PhoneNumber = user.PhoneNumber,
            Bio = user.Bio,
            Occupation = user.Occupation,
            School = user.School,
            IsVerified = user.IsVerified
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(UpdateUserProfileDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found.");

        user.FullName = dto.FullName;
        user.DateOfBirth = dto.DateOfBirth;
        user.Gender = dto.Gender;
        user.AvatarUrl = dto.AvatarUrl; // Trong thực tế có thể upload ảnh xong trả về URL
        user.PhoneNumber = dto.PhoneNumber;
        user.Bio = dto.Bio;
        user.Occupation = dto.Occupation;
        user.School = dto.School;
        user.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Profile updated successfully.", user });
    }
}
