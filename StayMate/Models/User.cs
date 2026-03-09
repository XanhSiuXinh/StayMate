using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Bio { get; set; }

    public string? Occupation { get; set; }

    public string? School { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsVerified { get; set; }

    public string? AccountStatus { get; set; }

    public string Role { get; set; } = "Student";

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

    public virtual ICollection<CompatibilityScore> CompatibilityScoreUser1s { get; set; } = new List<CompatibilityScore>();

    public virtual ICollection<CompatibilityScore> CompatibilityScoreUser2s { get; set; } = new List<CompatibilityScore>();

    public virtual LifestylePreference? LifestylePreference { get; set; }

    public virtual ICollection<Match> MatchUnmatchedByNavigations { get; set; } = new List<Match>();

    public virtual ICollection<Match> MatchUser1s { get; set; } = new List<Match>();

    public virtual ICollection<Match> MatchUser2s { get; set; } = new List<Match>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual RoomPreference? RoomPreference { get; set; }

    public virtual ICollection<Swipe> SwipeTargetUsers { get; set; } = new List<Swipe>();

    public virtual ICollection<Swipe> SwipeUsers { get; set; } = new List<Swipe>();

    public virtual ICollection<UserInterest> UserInterests { get; set; } = new List<UserInterest>();

    public virtual ICollection<UserLocation> UserLocations { get; set; } = new List<UserLocation>();

    public virtual ICollection<UserPhoto> UserPhotos { get; set; } = new List<UserPhoto>();
}
