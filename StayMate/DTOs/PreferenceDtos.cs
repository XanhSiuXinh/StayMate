using System;
using System.Collections.Generic;

namespace StayMate.DTOs
{
    public class LifestylePreferenceDto
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
    }

    public class UpdateLifestylePreferenceDto
    {
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
    }

    public class InterestDto
    {
        public int InterestId { get; set; }
        public string InterestName { get; set; } = null!;
        public string? Category { get; set; }
        public string? IconUrl { get; set; }
    }

    public class UpdateUserInterestsDto
    {
        public List<int> InterestIds { get; set; } = new List<int>();
    }
}
