using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.Models;
using StayMate.Hubs;
using StayMate.Services;
using System.Security.Claims;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerificationsController : ControllerBase
    {
        private readonly StayMateDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly INotificationService _notificationService;

        public VerificationsController(StayMateDbContext context, IWebHostEnvironment environment, INotificationService notificationService)
        {
            _context = context;
            _environment = environment;
            _notificationService = notificationService;
        }

        [HttpGet("status")]
        [Authorize]
        public async Task<IActionResult> GetVerificationStatus()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var request = await _context.VerificationRequests
                .Where(vr => vr.UserId == userId)
                .OrderByDescending(vr => vr.CreatedAt)
                .FirstOrDefaultAsync();

            var user = await _context.Users.FindAsync(userId);

            return Ok(new
            {
                isVerified = user?.IsVerified ?? false,
                currentRequest = request == null ? null : new
                {
                    request.RequestId,
                    request.Status,
                    request.DocumentType,
                    request.CreatedAt,
                    request.AdminNotes
                }
            });
        }

        [HttpPost("request")]
        [Authorize]
        public async Task<IActionResult> SubmitVerificationRequest([FromForm] VerificationRequestSubmission submission)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            if (submission.File == null || submission.File.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Check if there's already a pending request
            var existingPending = await _context.VerificationRequests
                .AnyAsync(vr => vr.UserId == userId && vr.Status == "Pending");
            
            if (existingPending)
            {
                return BadRequest("You already have a pending verification request.");
            }

            // Save the file
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "verifications");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(submission.File.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await submission.File.CopyToAsync(stream);
            }

            var documentUrl = $"/uploads/verifications/{uniqueFileName}";

            var request = new VerificationRequest
            {
                UserId = userId,
                DocumentType = submission.DocumentType,
                DocumentImageUrl = documentUrl,
                Status = "Pending",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.VerificationRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, requestId = request.RequestId });
        }

        // Mock Admin API for approval (for demo purposes)
        [HttpPut("{requestId}/approve")]
        [Authorize] // In a real app, this would be [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveVerification(int requestId)
        {
            var request = await _context.VerificationRequests.FindAsync(requestId);
            if (request == null) return NotFound();

            request.Status = "Approved";
            request.UpdatedAt = DateTime.Now;

            var user = await _context.Users.FindAsync(request.UserId);
            if (user != null)
            {
                user.IsVerified = true;
                user.UpdatedAt = DateTime.Now;
            }

            // Create and broadcast notification for verification approval using the centralized service
            await _notificationService.BroadcastNotificationAsync(
                request.UserId,
                "Verification Approved! 🎉",
                "Your profile has been verified. You now have the verified badge!",
                "Verification"
            );

            return Ok(new { success = true });
        }

        [HttpPut("{requestId}/reject")]
        [Authorize]
        public async Task<IActionResult> RejectVerification(int requestId, [FromBody] RejectRequest reject)
        {
            var request = await _context.VerificationRequests.FindAsync(requestId);
            if (request == null) return NotFound();

            request.Status = "Rejected";
            request.AdminNotes = reject.Notes;
            request.UpdatedAt = DateTime.Now;

            var user = await _context.Users.FindAsync(request.UserId);
            if (user != null)
            {
                user.IsVerified = false;
            }

            // Create and broadcast notification for verification rejection using the centralized service
            await _notificationService.BroadcastNotificationAsync(
                request.UserId,
                "Verification Rejected",
                $"Your verification request was rejected. {(!string.IsNullOrEmpty(reject.Notes) ? $"Reason: {reject.Notes}" : "Please resubmit with correct documents.")}",
                "Verification"
            );

            return Ok(new { success = true });
        }
    }

    public class VerificationRequestSubmission
    {
        public string DocumentType { get; set; } = "StudentCard";
        public IFormFile File { get; set; } = null!;
    }

    public class RejectRequest
    {
        public string Notes { get; set; } = string.Empty;
    }
}
