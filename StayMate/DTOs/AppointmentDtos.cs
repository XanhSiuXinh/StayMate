using System;
using System.ComponentModel.DataAnnotations;

namespace StayMate.DTOs;

public class AppointmentDto
{
    public int AppointmentId { get; set; }
    public int RequesterId { get; set; }
    public string RequesterName { get; set; } = null!;
    public string? RequesterAvatar { get; set; }
    public int RoomId { get; set; }
    public string RoomTitle { get; set; } = null!;
    public string? RoomPhoto { get; set; }
    public int HostId { get; set; }
    public string HostName { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class CreateAppointmentDto
{
    [Required]
    public int RoomId { get; set; }
    
    [Required]
    public DateTime AppointmentDate { get; set; }
    
    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateAppointmentStatusDto
{
    [Required]
    [RegularExpression("Approved|Rejected|Cancelled")]
    public string Status { get; set; } = null!;
}
