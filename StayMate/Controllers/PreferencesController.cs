using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.DTOs;
using StayMate.Models;

namespace StayMate.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PreferencesController : ControllerBase
{
    private readonly StayMateDbContext _context;

    public PreferencesController(StayMateDbContext context)
    {
        _context = context;
    }



    [HttpGet("lifestyle")]
    [Authorize]
    public async Task<ActionResult<LifestylePreferenceDto>> GetLifestylePreference()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
        var preference = await _context.LifestylePreferences.FirstOrDefaultAsync(p => p.UserId == userId);
        
        if (preference == null)
        {
            return NotFound("Lifestyle preference not found for this user.");
        }

        return Ok(new LifestylePreferenceDto
        {
            PreferenceId = preference.PreferenceId,
            UserId = preference.UserId,
            WakeUpTime = preference.WakeUpTime,
            SleepTime = preference.SleepTime,
            CleanlinessLevel = preference.CleanlinessLevel,
            NoiseLevel = preference.NoiseLevel,
            SmokingStatus = preference.SmokingStatus,
            DrinkingStatus = preference.DrinkingStatus,
            HasPets = preference.HasPets,
            PetType = preference.PetType,
            WorkFromHome = preference.WorkFromHome,
            GuestFrequency = preference.GuestFrequency,
            CookingFrequency = preference.CookingFrequency
        });
    }

    [HttpPut("lifestyle")]
    [Authorize]
    public async Task<IActionResult> UpdateLifestylePreference(UpdateLifestylePreferenceDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
        var preference = await _context.LifestylePreferences.FirstOrDefaultAsync(p => p.UserId == userId);
        
        if (preference == null)
        {

            preference = new LifestylePreference
            {
                UserId = userId,
                CreatedAt = DateTime.Now
            };
            _context.LifestylePreferences.Add(preference);
        }

        preference.WakeUpTime = dto.WakeUpTime;
        preference.SleepTime = dto.SleepTime;
        preference.CleanlinessLevel = dto.CleanlinessLevel;
        preference.NoiseLevel = dto.NoiseLevel;
        preference.SmokingStatus = dto.SmokingStatus;
        preference.DrinkingStatus = dto.DrinkingStatus;
        preference.HasPets = dto.HasPets;
        preference.PetType = dto.PetType;
        preference.WorkFromHome = dto.WorkFromHome;
        preference.GuestFrequency = dto.GuestFrequency;
        preference.CookingFrequency = dto.CookingFrequency;
        preference.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Lifestyle preference updated successfully." });
    }



    [HttpGet("interests")]
    public async Task<ActionResult<List<InterestDto>>> GetAllInterests()
    {
        var interests = await _context.Interests.ToListAsync();
        
        return interests.Select(i => new InterestDto
        {
            InterestId = i.InterestId,
            InterestName = i.InterestName,
            Category = i.Category,
            IconUrl = i.IconUrl
        }).ToList();
    }

    [HttpGet("user-interests")]
    [Authorize]
    public async Task<ActionResult<List<InterestDto>>> GetUserInterests()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        
        var userInterests = await _context.UserInterests
            .Include(ui => ui.Interest)
            .Where(ui => ui.UserId == userId)
            .Select(ui => ui.Interest)
            .ToListAsync();

        return userInterests.Select(i => new InterestDto
        {
            InterestId = i.InterestId,
            InterestName = i.InterestName,
            Category = i.Category,
            IconUrl = i.IconUrl
        }).ToList();
    }

    [HttpPut("user-interests")]
    [Authorize]
    public async Task<IActionResult> UpdateUserInterests(UpdateUserInterestsDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        

        var existingInterests = await _context.UserInterests.Where(ui => ui.UserId == userId).ToListAsync();
        _context.UserInterests.RemoveRange(existingInterests);


        if (dto.InterestIds != null && dto.InterestIds.Any())
        {
            foreach (var interestId in dto.InterestIds)
            {
                _context.UserInterests.Add(new UserInterest
                {
                    UserId = userId,
                    InterestId = interestId,
                    CreatedAt = DateTime.Now
                });
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "User interests updated successfully." });
    }
}
