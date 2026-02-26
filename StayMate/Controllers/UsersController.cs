using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
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

    [HttpPost("profile/avatar")]
    [Authorize]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null) return NotFound("User not found.");

        if (file == null || file.Length == 0) return BadRequest(new { message = "Vui lòng chọn một file ảnh." });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var avatarUrl = $"{baseUrl}/uploads/avatars/{fileName}";

        user.AvatarUrl = avatarUrl;
        user.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật ảnh đại diện thành công.", avatarUrl });
    }

    [HttpGet("photos")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<UserPhotoDto>>> GetUserPhotos()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var photos = await _context.UserPhotos.Where(p => p.UserId == userId).ToListAsync();
        return Ok(photos.Select(p => new UserPhotoDto
        {
            PhotoId = p.PhotoId,
            PhotoUrl = p.PhotoUrl,
            DisplayOrder = p.DisplayOrder,
            IsProfilePhoto = p.IsProfilePhoto
        }));
    }

    [HttpPost("photos")]
    [Authorize]
    public async Task<IActionResult> AddUserPhoto(IFormFile file)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var photoCount = await _context.UserPhotos.CountAsync(p => p.UserId == userId);

        if (photoCount >= 6) return BadRequest(new { message = "Bạn chỉ có thể thêm tối đa 6 ảnh." });

        if (file == null || file.Length == 0) return BadRequest(new { message = "Vui lòng chọn một file ảnh." });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var photoUrl = $"{baseUrl}/uploads/profiles/{fileName}";

        var newPhoto = new UserPhoto
        {
            UserId = userId,
            PhotoUrl = photoUrl,
            DisplayOrder = photoCount + 1,
            IsProfilePhoto = false,
            UploadedAt = DateTime.Now
        };

        _context.UserPhotos.Add(newPhoto);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            message = "Thêm ảnh thành công.", 
            photo = new UserPhotoDto 
            { 
                PhotoId = newPhoto.PhotoId, 
                PhotoUrl = newPhoto.PhotoUrl, 
                DisplayOrder = newPhoto.DisplayOrder, 
                IsProfilePhoto = newPhoto.IsProfilePhoto 
            }
        });
    }

    [HttpDelete("photos/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUserPhoto(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var photo = await _context.UserPhotos.FirstOrDefaultAsync(p => p.PhotoId == id && p.UserId == userId);
        
        if (photo == null) return NotFound(new { message = "Không tìm thấy ảnh." });

        _context.UserPhotos.Remove(photo);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Xóa ảnh thành công." });
    }

    [HttpGet("profile/status")]
    [Authorize]
    public async Task<IActionResult> GetProfileStatus()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        var hasLifestyle = await _context.LifestylePreferences
            .AnyAsync(lp => lp.UserId == userId);

        var user = await _context.Users.FindAsync(userId);
        bool hasBasicProfile = user != null && !string.IsNullOrEmpty(user.Bio);

        return Ok(new
        {
            hasMatchingProfile = hasLifestyle,
            hasBasicProfile = hasBasicProfile
        });
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized("Token invalid");

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found.");

        if (string.IsNullOrEmpty(user.PasswordHash))
            return BadRequest(new { message = "Accounts created via Google cannot change password here." });

        var parts = user.PasswordHash.Split('.');
        if (parts.Length != 2) return BadRequest(new { message = "Invalid password format in DB." });

        var salt = Convert.FromBase64String(parts[0]);
        var storedHash = Convert.FromBase64String(parts[1]);

        if (!VerifyPasswordHash(request.CurrentPassword, storedHash, salt))
            return BadRequest(new { message = "Wrong current password." });

        CreatePasswordHash(request.NewPassword, out byte[] newHash, out byte[] newSalt);
        user.PasswordHash = Convert.ToBase64String(newSalt) + "." + Convert.ToBase64String(newHash);
        user.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Password changed successfully." });
    }

    [HttpDelete("account")]
    [Authorize]
    public async Task<IActionResult> DeleteAccount()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            return Unauthorized("Token invalid");

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found.");

        // For this implementation, hard delete the user
        // (EF Core should cascade delete related entities like LifestylePreferences, Photos if configured correctly,
        // otherwise we might need to delete them manually.)
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Account deleted successfully." });
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }

    private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        using (var hmac = new HMACSHA512(storedSalt))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }
    }
}
