using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class UserLocation
{
    public int LocationId { get; set; }

    public int UserId { get; set; }

    public string City { get; set; } = null!;

    public string District { get; set; } = null!;

    public string? Ward { get; set; }

    public string? Address { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public bool? IsPreferred { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
