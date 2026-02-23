using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class LifestylePreference
{
    public int PreferenceId { get; set; }

    public int UserId { get; set; }

    public string? WakeUpTime { get; set; }

    public string? SleepTime { get; set; }

    public int? CleanlinessLevel { get; set; }

    public int? NoiseLevel { get; set; }

    public string? SmokingStatus { get; set; }

    public string? DrinkingStatus { get; set; }

    public bool? HasPets { get; set; }

    public string? PetType { get; set; }

    public bool? WorkFromHome { get; set; }

    public string? GuestFrequency { get; set; }

    public string? CookingFrequency { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
