using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayMate.Models;

public class Appointment
{
    [Key]
    public int AppointmentId { get; set; }

    public int RequesterId { get; set; }

    [ForeignKey("RequesterId")]
    public virtual User Requester { get; set; } = null!;

    public int RoomId { get; set; }

    [ForeignKey("RoomId")]
    public virtual Room Room { get; set; } = null!;

    public int HostId { get; set; }

    [ForeignKey("HostId")]
    public virtual User Host { get; set; } = null!;

    [Required]
    public DateTime AppointmentDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
}
