using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class UserInterest
{
    public int UserInterestId { get; set; }

    public int UserId { get; set; }

    public int InterestId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Interest Interest { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
