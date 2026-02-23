using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class Match
{
    public int MatchId { get; set; }

    public int User1Id { get; set; }

    public int User2Id { get; set; }

    public DateTime? MatchedAt { get; set; }

    public bool? IsActive { get; set; }

    public int? UnmatchedBy { get; set; }

    public DateTime? UnmatchedAt { get; set; }

    public virtual Conversation? Conversation { get; set; }

    public virtual User? UnmatchedByNavigation { get; set; }

    public virtual User User1 { get; set; } = null!;

    public virtual User User2 { get; set; } = null!;
}
