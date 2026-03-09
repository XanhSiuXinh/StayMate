using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class VerificationRequest
{
    public int RequestId { get; set; }

    public int UserId { get; set; }

    public string DocumentType { get; set; } = null!;

    public string DocumentImageUrl { get; set; } = null!;

    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

    public string? AdminNotes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
