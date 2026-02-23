using System;
using System.ComponentModel.DataAnnotations;

namespace StayMate.DTOs;

public class UserProfileDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? AvatarUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
    public string? Occupation { get; set; }
    public string? School { get; set; }
    public bool? IsVerified { get; set; }
}

public class UpdateUserProfileDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? AvatarUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
    public string? Occupation { get; set; }
    public string? School { get; set; }
}
