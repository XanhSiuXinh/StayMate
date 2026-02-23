using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class Interest
{
    public int InterestId { get; set; }

    public string InterestName { get; set; } = null!;

    public string? Category { get; set; }

    public string? IconUrl { get; set; }

    public virtual ICollection<UserInterest> UserInterests { get; set; } = new List<UserInterest>();
}
