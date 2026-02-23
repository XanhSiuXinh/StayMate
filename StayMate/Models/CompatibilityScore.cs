using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class CompatibilityScore
{
    public int ScoreId { get; set; }

    public int User1Id { get; set; }

    public int User2Id { get; set; }

    public decimal? CompatibilityScore1 { get; set; }

    public decimal? LifestyleScore { get; set; }

    public decimal? InterestScore { get; set; }

    public decimal? LocationScore { get; set; }

    public DateTime? CalculatedAt { get; set; }

    public virtual User User1 { get; set; } = null!;

    public virtual User User2 { get; set; } = null!;
}
