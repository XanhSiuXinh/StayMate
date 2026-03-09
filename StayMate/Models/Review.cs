using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayMate.Models;

public class Review
{
    [Key]
    public int ReviewId { get; set; }

    [Required]
    public int ReviewerId { get; set; }

    [ForeignKey("ReviewerId")]
    public virtual User Reviewer { get; set; } = null!;

    // Targeted Room (optional)
    public int? TargetRoomId { get; set; }

    [ForeignKey("TargetRoomId")]
    public virtual Room? TargetRoom { get; set; }

    // Targeted User (optional, for roommates or landlords)
    public int? TargetUserId { get; set; }

    [ForeignKey("TargetUserId")]
    public virtual User? TargetUser { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
