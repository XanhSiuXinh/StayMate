using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.Models;
using System.Security.Claims;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscoverController : ControllerBase
    {
        private readonly StayMateDbContext _context;

        public DiscoverController(StayMateDbContext context)
        {
            _context = context;
        }

        [HttpGet("recommendations")]
        [Authorize]
        public async Task<IActionResult> GetRecommendations()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }


            var currentUserLifestyle = await _context.LifestylePreferences
                .FirstOrDefaultAsync(lp => lp.UserId == userId);


            var swipedUserIds = await _context.Swipes
                .Where(s => s.UserId == userId)
                .Select(s => s.TargetUserId)
                .ToListAsync();


            var otherUsersInfo = await _context.Users
                .Where(u => u.UserId != userId && u.IsActive == true && !swipedUserIds.Contains(u.UserId))
                .Select(u => new
                {
                    User = u,
                    Lifestyle = _context.LifestylePreferences.FirstOrDefault(lp => lp.UserId == u.UserId),
                    Interests = _context.UserInterests
                        .Where(ui => ui.UserId == u.UserId)
                        .Select(ui => new { ui.Interest.InterestName, ui.Interest.IconUrl })
                        .ToList(),
                    Photos = _context.UserPhotos.Where(up => up.UserId == u.UserId).Select(up => up.PhotoUrl).ToList()
                })
                .ToListAsync();

            var recommendations = new List<object>();

            foreach (var other in otherUsersInfo)
            {

                int matchScore = 0;
                int maxScore = 0;


                if (currentUserLifestyle != null && other.Lifestyle != null)
                {
                    maxScore += 40; // Total weight for lifestyle

                    if (currentUserLifestyle.WakeUpTime == other.Lifestyle.WakeUpTime) matchScore += 10;
                    if (currentUserLifestyle.SleepTime == other.Lifestyle.SleepTime) matchScore += 10;
                    if (Math.Abs((currentUserLifestyle.CleanlinessLevel ?? 3) - (other.Lifestyle.CleanlinessLevel ?? 3)) <= 1) matchScore += 10;
                    if (currentUserLifestyle.SmokingStatus == other.Lifestyle.SmokingStatus) matchScore += 10;
                }


                int matchPercentage = maxScore > 0 ? (int)((double)matchScore / maxScore * 100) : new Random().Next(60, 95);


                if (matchPercentage > 95) matchPercentage = new Random().Next(90, 98);


                var traits = new List<object>();
                
                if (other.Lifestyle != null)
                {
                    if (other.Lifestyle.SleepTime != null && other.Lifestyle.SleepTime.Contains("Sớm"))
                         traits.Add(new { icon = "Sun", text = "Early Bird" });
                    else if (other.Lifestyle.SleepTime != null && other.Lifestyle.SleepTime.Contains("Cú đêm"))
                         traits.Add(new { icon = "Moon", text = "Night Owl" });

                    if (other.Lifestyle.CleanlinessLevel >= 4)
                        traits.Add(new { icon = "Sparkles", text = "Very Tidy" });

                    if (other.Lifestyle.HasPets == true)
                        traits.Add(new { icon = "Dog", text = "Pet Friendly" });
                }


                foreach (var interest in other.Interests.Take(2))
                {
                     if(traits.Count < 3) {
                         traits.Add(new { icon = "Heart", text = interest.InterestName }); // Using Heart as fallback icon for interests for now
                     }
                }


                int age = DateTime.Now.Year - other.User.DateOfBirth.Year;
                if (DateTime.Now.DayOfYear < other.User.DateOfBirth.DayOfYear) age--;

                recommendations.Add(new
                {
                    id = other.User.UserId,
                    name = other.User.FullName,
                    age = age > 0 ? age : 20, // fallback
                    university = !string.IsNullOrEmpty(other.User.School) ? other.User.School : "Student",
                    occupation = !string.IsNullOrEmpty(other.User.Occupation) ? other.User.Occupation : "Không có thông tin nghề nghiệp",
                    bio = !string.IsNullOrEmpty(other.User.Bio) ? other.User.Bio : "Xin chào, mình đang tìm bạn cùng phòng!",
                    matchPercentage = matchPercentage,
                    image = !string.IsNullOrEmpty(other.User.AvatarUrl) 
                            ? other.User.AvatarUrl 
                            : $"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Keep dummy image fallback for empty avatars
                    photos = other.Photos,
                    traits = traits,
                    lifestyle = other.Lifestyle != null ? new {
                        wakeUpTime = other.Lifestyle.WakeUpTime,
                        sleepTime = other.Lifestyle.SleepTime,
                        cleanlinessLevel = other.Lifestyle.CleanlinessLevel,
                        noiseLevel = other.Lifestyle.NoiseLevel,
                        smokingStatus = other.Lifestyle.SmokingStatus,
                        drinkingStatus = other.Lifestyle.DrinkingStatus,
                        hasPets = other.Lifestyle.HasPets,
                        petType = other.Lifestyle.PetType,
                        workFromHome = other.Lifestyle.WorkFromHome,
                        guestFrequency = other.Lifestyle.GuestFrequency,
                        cookingFrequency = other.Lifestyle.CookingFrequency
                    } : null
                });
            }


            return Ok(recommendations.OrderByDescending(r => r.GetType().GetProperty("matchPercentage").GetValue(r)));
        }

        [HttpPost("swipe/{targetUserId}")]
        [Authorize]
        public async Task<IActionResult> Swipe(int targetUserId, [FromQuery] string swipeType)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            if (userId == targetUserId) return BadRequest("Cannot swipe yourself.");

            var existingSwipe = await _context.Swipes
                .FirstOrDefaultAsync(s => s.UserId == userId && s.TargetUserId == targetUserId);

            if (existingSwipe != null)
            {
                existingSwipe.SwipeType = swipeType; // Update if changed
                existingSwipe.CreatedAt = DateTime.Now;
            }
            else
            {
                _context.Swipes.Add(new Swipe 
                {
                    UserId = userId,
                    TargetUserId = targetUserId,
                    SwipeType = swipeType,
                    CreatedAt = DateTime.Now
                });
            }

            bool isMatch = false;

            if (swipeType == "Like")
            {
                var reciprocity = await _context.Swipes
                    .FirstOrDefaultAsync(s => s.UserId == targetUserId && s.TargetUserId == userId && s.SwipeType == "Like");

                if (reciprocity != null)
                {
                    var existingMatch = await _context.Matches
                        .FirstOrDefaultAsync(m => (m.User1Id == userId && m.User2Id == targetUserId) || (m.User1Id == targetUserId && m.User2Id == userId));

                    if (existingMatch == null)
                    {
                        var match = new Match
                        {
                            User1Id = userId,
                            User2Id = targetUserId,
                            MatchedAt = DateTime.Now,
                            IsActive = true
                        };
                        _context.Matches.Add(match);
                        await _context.SaveChangesAsync();

                        var conversation = new Conversation
                        {
                            MatchId = match.MatchId,
                            CreatedAt = DateTime.Now,
                            LastMessageAt = DateTime.Now
                        };
                        _context.Conversations.Add(conversation);
                        isMatch = true;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, isMatch = isMatch });
        }

        [HttpGet("saved")]
        [Authorize]
        public async Task<IActionResult> GetSavedProfiles()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var savedUsers = await _context.Swipes
                .Include(s => s.TargetUser)
                .Where(s => s.UserId == userId && s.SwipeType == "Like")
                .Select(s => new {
                    id = s.TargetUser.UserId,
                    name = s.TargetUser.FullName,
                    age = DateTime.Now.Year - s.TargetUser.DateOfBirth.Year - (DateTime.Now.DayOfYear < s.TargetUser.DateOfBirth.DayOfYear ? 1 : 0),
                    university = !string.IsNullOrEmpty(s.TargetUser.School) ? s.TargetUser.School : "Student",
                    occupation = !string.IsNullOrEmpty(s.TargetUser.Occupation) ? s.TargetUser.Occupation : "Không có thông tin nghề nghiệp",
                    bio = !string.IsNullOrEmpty(s.TargetUser.Bio) ? s.TargetUser.Bio : "Xin chào, mình đang tìm bạn cùng phòng!",
                    image = !string.IsNullOrEmpty(s.TargetUser.AvatarUrl) 
                        ? s.TargetUser.AvatarUrl 
                        : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    savedAt = s.CreatedAt
                })
                .OrderByDescending(s => s.savedAt)
                .ToListAsync();

            return Ok(savedUsers);
        }

        [HttpGet("passed")]
        [Authorize]
        public async Task<IActionResult> GetPassedProfiles()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var passedUsers = await _context.Swipes
                .Include(s => s.TargetUser)
                .Where(s => s.UserId == userId && s.SwipeType == "Pass")
                .Select(s => new {
                    id = s.TargetUser.UserId,
                    name = s.TargetUser.FullName,
                    age = DateTime.Now.Year - s.TargetUser.DateOfBirth.Year - (DateTime.Now.DayOfYear < s.TargetUser.DateOfBirth.DayOfYear ? 1 : 0),
                    university = !string.IsNullOrEmpty(s.TargetUser.School) ? s.TargetUser.School : "Student",
                    occupation = !string.IsNullOrEmpty(s.TargetUser.Occupation) ? s.TargetUser.Occupation : "Không có thông tin",
                    image = !string.IsNullOrEmpty(s.TargetUser.AvatarUrl)
                        ? s.TargetUser.AvatarUrl
                        : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    passedAt = s.CreatedAt
                })
                .OrderByDescending(s => s.passedAt)
                .Take(10)
                .ToListAsync();

            return Ok(passedUsers);
        }
    }
}
