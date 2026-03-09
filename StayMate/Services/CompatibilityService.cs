using Microsoft.EntityFrameworkCore;
using StayMate.Interfaces;
using StayMate.Models;

namespace StayMate.Services
{
    public class CompatibilityService : ICompatibilityService
    {
        private readonly StayMateDbContext _context;

        public CompatibilityService(StayMateDbContext context)
        {
            _context = context;
        }

        public async Task<int> CalculateCompatibilityAsync(int userId1, int userId2)
        {
            var user1Lifestyle = await _context.LifestylePreferences.FirstOrDefaultAsync(lp => lp.UserId == userId1);
            var user2Lifestyle = await _context.LifestylePreferences.FirstOrDefaultAsync(lp => lp.UserId == userId2);

            var user1Interests = await _context.UserInterests.Where(ui => ui.UserId == userId1).Select(ui => ui.InterestId).ToListAsync();
            var user2Interests = await _context.UserInterests.Where(ui => ui.UserId == userId2).Select(ui => ui.InterestId).ToListAsync();

            var user1Location = await _context.UserLocations.FirstOrDefaultAsync(ul => ul.UserId == userId1);
            var user2Location = await _context.UserLocations.FirstOrDefaultAsync(ul => ul.UserId == userId2);

            double totalScore = 0;
            double maxPoints = 100;

            // 1. Lifestyle (40 Points)
            if (user1Lifestyle != null && user2Lifestyle != null)
            {
                double lifestyleScore = 0;

                // Wake Up Time (5 pts)
                if (user1Lifestyle.WakeUpTime == user2Lifestyle.WakeUpTime) lifestyleScore += 5;
                else if (IsSemiCompatible(user1Lifestyle.WakeUpTime, user2Lifestyle.WakeUpTime)) lifestyleScore += 2.5;

                // Sleep Time (5 pts)
                if (user1Lifestyle.SleepTime == user2Lifestyle.SleepTime) lifestyleScore += 5;
                else if (IsSemiCompatible(user1Lifestyle.SleepTime, user2Lifestyle.SleepTime)) lifestyleScore += 2.5;

                // Cleanliness (10 pts)
                int cleanDiff = Math.Abs((user1Lifestyle.CleanlinessLevel ?? 3) - (user2Lifestyle.CleanlinessLevel ?? 3));
                lifestyleScore += Math.Max(0, 10 - (cleanDiff * 2.5));

                // Noise level (5 pts)
                int noiseDiff = Math.Abs((user1Lifestyle.NoiseLevel ?? 3) - (user2Lifestyle.NoiseLevel ?? 3));
                lifestyleScore += Math.Max(0, 5 - (noiseDiff * 1.25));

                // Smoking (10 pts)
                if (user1Lifestyle.SmokingStatus == user2Lifestyle.SmokingStatus) lifestyleScore += 10;
                else if (user1Lifestyle.SmokingStatus == "Non-smoking" || user2Lifestyle.SmokingStatus == "Non-smoking")
                {
                    // If one is smoker and other is not, big penalty for shared space
                    lifestyleScore += 0;
                }
                else lifestyleScore += 5;

                // Pets (5 pts)
                if (user1Lifestyle.HasPets == user2Lifestyle.HasPets) lifestyleScore += 5;
                else lifestyleScore += 2; // Neutral if one has and one doesn't but not dealbreaker normally

                totalScore += lifestyleScore;
            }
            else
            {
                totalScore += 20; // Default midpoint if lifestyle missing
            }

            // 2. Interests (40 Points) - Jaccard Similarity
            if (user1Interests.Any() || user2Interests.Any())
            {
                var intersection = user1Interests.Intersect(user2Interests).Count();
                var union = user1Interests.Union(user2Interests).Count();
                double jaccard = union > 0 ? (double)intersection / union : 0;
                totalScore += jaccard * 40;
            }
            else
            {
                totalScore += 15; // Baseline
            }

            // 3. Location & Misc (20 Points)
            double miscScore = 0;
            if (user1Location != null && user2Location != null)
            {
                if (user1Location.District == user2Location.District) miscScore += 12;
                else if (user1Location.City == user2Location.City) miscScore += 6;
            }
            
            if (user1Lifestyle?.WorkFromHome == user2Lifestyle?.WorkFromHome) miscScore += 8;
            
            totalScore += miscScore;

            // Final normalization
            int finalScore = (int)Math.Clamp(totalScore, 0, 100);
            
            // UX Polish: Randomize slightly to not have too many round numbers
            finalScore = Math.Min(99, finalScore + new Random().Next(-2, 3));

            return finalScore;
        }

        private bool IsSemiCompatible(string? time1, string? time2)
        {
            if (string.IsNullOrEmpty(time1) || string.IsNullOrEmpty(time2)) return false;
            // Early vs Normal is ok, Early vs Night Owl is NOT
            if (time1.Contains("Early") && time2.Contains("Normal")) return true;
            if (time1.Contains("Normal") && time2.Contains("Early")) return true;
            if (time1.Contains("Normal") && time2.Contains("Late")) return true;
            if (time1.Contains("Late") && time2.Contains("Normal")) return true;
            return false;
        }
    }
}
