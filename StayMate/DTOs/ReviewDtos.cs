using System;
using System.ComponentModel.DataAnnotations;

namespace StayMate.DTOs;

public class ReviewDto
{
    public int ReviewId { get; set; }
    public int ReviewerId { get; set; }
    public string ReviewerName { get; set; } = null!;
    public string? ReviewerAvatar { get; set; }
    public int? TargetRoomId { get; set; }
    public int? TargetUserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int? TargetRoomId { get; set; }
    public int? TargetUserId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
}
