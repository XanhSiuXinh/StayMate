using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class UserPhoto
{
    public int PhotoId { get; set; }

    public int UserId { get; set; }

    public string PhotoUrl { get; set; } = null!;

    public int? DisplayOrder { get; set; }

    public bool? IsProfilePhoto { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
