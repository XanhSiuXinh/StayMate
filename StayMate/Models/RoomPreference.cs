using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class RoomPreference
{
    public int RoomPreferenceId { get; set; }

    public int UserId { get; set; }

    public decimal? MinBudget { get; set; }

    public decimal? MaxBudget { get; set; }

    public string? PreferredRoomType { get; set; }

    public DateOnly? MoveInDate { get; set; }

    public string? PreferredGender { get; set; }

    public int? PreferredAgeMin { get; set; }

    public int? PreferredAgeMax { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
