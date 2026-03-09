using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.Models;
using StayMate.DTOs;
using StayMate.Services;
using System.Security.Claims;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly StayMateDbContext _context;
        private readonly INotificationService _notificationService;

        public AdminController(StayMateDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // Get dashboard statistics
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                ActiveUsers = await _context.Users.CountAsync(u => u.IsActive == true),
                VerifiedUsers = await _context.Users.CountAsync(u => u.IsVerified == true),
                TotalRooms = await _context.Rooms.CountAsync(),
                AvailableRooms = await _context.Rooms.CountAsync(r => r.IsAvailable == true),
                PendingVerifications = await _context.VerificationRequests.CountAsync(vr => vr.Status == "Pending"),
                TotalMatches = await _context.Matches.CountAsync(m => m.IsActive == true),
                RecentRegistrations = await _context.Users
                    .Where(u => u.CreatedAt >= DateTime.UtcNow.AddDays(7))
                    .CountAsync()
            };

            return Ok(stats);
        }

        // Get all verification requests
        [HttpGet("verifications")]
        public async Task<IActionResult> GetVerificationRequests([FromQuery] string? status = null)
        {
            var query = _context.VerificationRequests
                .Include(vr => vr.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(vr => vr.Status == status);
            }

            var requests = await query
                .OrderByDescending(vr => vr.CreatedAt)
                .Select(vr => new
                {
                    vr.RequestId,
                    vr.UserId,
                    UserFullName = vr.User.FullName,
                    UserEmail = vr.User.Email,
                    vr.DocumentType,
                    vr.DocumentImageUrl,
                    vr.Status,
                    vr.AdminNotes,
                    vr.CreatedAt,
                    vr.UpdatedAt,
                    UserAvatar = vr.User.AvatarUrl
                })
                .ToListAsync();

            return Ok(requests);
        }

        // Get all rooms for moderation
        [HttpGet("rooms")]
        public async Task<IActionResult> GetRoomsForModeration([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var rooms = await _context.Rooms
                .Include(r => r.HostUser)
                .Include(r => r.Photos)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new
                {
                    r.RoomId,
                    r.Title,
                    r.Description,
                    r.Price,
                    r.Address,
                    r.District,
                    r.City,
                    r.IsAvailable,
                    r.CreatedAt,
                    HostUser = new
                    {
                        r.HostUser.UserId,
                        r.HostUser.FullName,
                        r.HostUser.Email,
                        r.HostUser.IsVerified,
                        AvatarUrl = r.HostUser.AvatarUrl
                    },
                    PhotoCount = r.Photos.Count,
                    MainPhoto = r.Photos.FirstOrDefault() != null ? r.Photos.First().PhotoUrl : null
                })
                .ToListAsync();

            var totalCount = await _context.Rooms.CountAsync();

            return Ok(new { rooms, totalCount, page, pageSize });
        }

        // Get reported/violating rooms
        [HttpGet("rooms/reported")]
        public async Task<IActionResult> GetReportedRooms()
        {
            // For now, return rooms that might need attention
            // In a real system, this would be based on user reports
            var suspiciousRooms = await _context.Rooms
                .Include(r => r.HostUser)
                .Include(r => r.Photos)
                .Where(r => !r.IsAvailable || r.Price < 1000000 || r.Price > 20000000) // Suspicious pricing
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.RoomId,
                    r.Title,
                    r.Description,
                    r.Price,
                    r.Address,
                    r.District,
                    r.City,
                    r.IsAvailable,
                    r.CreatedAt,
                    HostUser = new
                    {
                        r.HostUser.UserId,
                        r.HostUser.FullName,
                        r.HostUser.Email,
                        r.HostUser.IsVerified,
                        AvatarUrl = r.HostUser.AvatarUrl
                    },
                    PhotoCount = r.Photos.Count,
                    MainPhoto = r.Photos.FirstOrDefault() != null ? r.Photos.First().PhotoUrl : null,
                    SuspiciousReason = r.Price < 1000000 ? "Price too low" : 
                                    r.Price > 20000000 ? "Price too high" : 
                                    "Currently unavailable"
                })
                .ToListAsync();

            return Ok(suspiciousRooms);
        }

        // Delete a room (admin action)
        [HttpDelete("rooms/{roomId}")]
        public async Task<IActionResult> DeleteRoom(int roomId, [FromBody] AdminActionRequest request)
        {
            var room = await _context.Rooms
                .Include(r => r.HostUser)
                .FirstOrDefaultAsync(r => r.RoomId == roomId);

            if (room == null) return NotFound();

            // Log the admin action
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var adminName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";

            // Remove room photos first
            var photos = await _context.RoomPhotos.Where(rp => rp.RoomId == roomId).ToListAsync();
            _context.RoomPhotos.RemoveRange(photos);

            // Remove the room
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            // Send notification to room owner
            await _notificationService.BroadcastNotificationAsync(
                room.HostUserId,
                "Room Removed",
                $"Your room '{room.Title}' has been removed by admin. Reason: {request.Reason ?? "Violation of terms"}",
                "System"
            );

            return Ok(new { success = true, message = "Room deleted successfully" });
        }

        // Toggle room availability
        [HttpPatch("rooms/{roomId}/availability")]
        public async Task<IActionResult> ToggleRoomAvailability(int roomId)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null) return NotFound();

            room.IsAvailable = !room.IsAvailable;
            room.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, isAvailable = room.IsAvailable });
        }

        // Get all users for management
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = status.ToLower() switch
                {
                    "active" => query.Where(u => u.IsActive == true),
                    "inactive" => query.Where(u => u.IsActive == false),
                    "verified" => query.Where(u => u.IsVerified == true),
                    "unverified" => query.Where(u => u.IsVerified == false),
                    _ => query
                };
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.IsActive,
                    u.IsVerified,
                    u.CreatedAt,
                    u.LastLoginAt,
                    AvatarUrl = u.AvatarUrl,
                    RoomCount = _context.Rooms.Count(r => r.HostUserId == u.UserId)
                })
                .ToListAsync();

            var totalCount = await query.CountAsync();

            return Ok(new { users, totalCount, page, pageSize });
        }

        // Toggle user status
        [HttpPatch("users/{userId}/status")]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.IsActive = !user.IsActive;
            user.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            // Send notification to user
            await _notificationService.BroadcastNotificationAsync(
                userId,
                user.IsActive == true ? "Account Activated" : "Account Deactivated",
                user.IsActive == true ? "Your account has been activated by admin." : "Your account has been deactivated by admin.",
                "System"
            );

            return Ok(new { success = true, isActive = user.IsActive });
        }

        // Get system logs (simplified version)
        [HttpGet("logs")]
        public async Task<IActionResult> GetSystemLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            // This is a simplified version - in production, you'd have a proper logging system
            var logs = new
            {
                RecentRegistrations = await _context.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(10)
                    .Select(u => new { u.FullName, u.Email, u.CreatedAt, Action = "User Registered" })
                    .ToListAsync(),
                RecentVerifications = await _context.VerificationRequests
                    .OrderByDescending(vr => vr.UpdatedAt)
                    .Take(10)
                    .Select(vr => new { vr.User.FullName, vr.Status, vr.UpdatedAt, Action = "Verification Updated" })
                    .ToListAsync(),
                RecentRoomCreations = await _context.Rooms
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(10)
                    .Select(r => new { r.HostUser.FullName, r.Title, r.CreatedAt, Action = "Room Created" })
                    .ToListAsync()
            };

            return Ok(logs);
        }
    }

    public class AdminActionRequest
    {
        public string? Reason { get; set; }
    }
}
