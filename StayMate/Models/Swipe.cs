using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class Swipe
{
    public int SwipeId { get; set; }

    public int UserId { get; set; }

    public int TargetUserId { get; set; }

    public string? SwipeType { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User TargetUser { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
