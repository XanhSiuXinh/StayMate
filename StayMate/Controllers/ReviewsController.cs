using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.Models;
using StayMate.DTOs;
using System.Security.Claims;

namespace StayMate.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly StayMateDbContext _context;

    public ReviewsController(StayMateDbContext context)
    {
        _context = context;
    }

    // POST: api/reviews
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> PostReview(CreateReviewDto createDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        int reviewerId = int.Parse(userIdClaim.Value);

        if (createDto.TargetRoomId == null && createDto.TargetUserId == null)
        {
            return BadRequest("A review must target either a room or a user.");
        }

        var review = new Review
        {
            ReviewerId = reviewerId,
            TargetRoomId = createDto.TargetRoomId,
            TargetUserId = createDto.TargetUserId,
            Rating = createDto.Rating,
            Comment = createDto.Comment,
            CreatedAt = DateTime.Now
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // Reload to get navigation properties
        var savedReview = await _context.Reviews
            .Include(r => r.Reviewer)
            .FirstOrDefaultAsync(r => r.ReviewId == review.ReviewId);

        return Ok(new ReviewDto
        {
            ReviewId = savedReview!.ReviewId,
            ReviewerId = savedReview.ReviewerId,
            ReviewerName = savedReview.Reviewer.FullName,
            ReviewerAvatar = savedReview.Reviewer.AvatarUrl,
            TargetRoomId = savedReview.TargetRoomId,
            TargetUserId = savedReview.TargetUserId,
            Rating = savedReview.Rating,
            Comment = savedReview.Comment,
            CreatedAt = savedReview.CreatedAt
        });
    }

    // GET: api/reviews/room/{id}
    [HttpGet("room/{id}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetRoomReviews(int id)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.TargetRoomId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId = r.ReviewId,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FullName,
                ReviewerAvatar = r.Reviewer.AvatarUrl,
                TargetRoomId = r.TargetRoomId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // GET: api/reviews/user/{id}
    [HttpGet("user/{id}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetUserReviews(int id)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.TargetUserId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId = r.ReviewId,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer.FullName,
                ReviewerAvatar = r.Reviewer.AvatarUrl,
                TargetUserId = r.TargetUserId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }
}
