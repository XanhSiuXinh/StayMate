using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayMate.Models;

public class Room
{
    [Key]
    public int RoomId { get; set; }

    public int HostUserId { get; set; }

    [ForeignKey("HostUserId")]
    public virtual User HostUser { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    [Required]
    public string Address { get; set; } = null!;
    
    [Required]
    public string District { get; set; } = null!;
    
    [Required]
    public string City { get; set; } = null!;
    
    public string? Ward { get; set; }

    public double? AreaSqm { get; set; }

    public string? Amenities { get; set; } // JSON or comma separated string

    public bool IsAvailable { get; set; } = true;

    public bool IsBoosted { get; set; } = false;

    public DateTime? BoostExpiryDate { get; set; }

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<RoomPhoto> Photos { get; set; } = new List<RoomPhoto>();

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
}
