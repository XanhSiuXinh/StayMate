using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayMate.Models;

public class RoomPhoto
{
    [Key]
    public int PhotoId { get; set; }

    public int RoomId { get; set; }

    [ForeignKey("RoomId")]
    public virtual Room Room { get; set; } = null!;

    [Required]
    public string PhotoUrl { get; set; } = null!;

    public DateTime UploadedAt { get; set; } = DateTime.Now;
}
