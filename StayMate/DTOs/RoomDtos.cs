using System.ComponentModel.DataAnnotations;

namespace StayMate.DTOs;

public class RoomDto
{
    public int RoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Address { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public double? AreaSqm { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> PhotoUrls { get; set; } = new List<string>();
    public int HostUserId { get; set; }
    public string HostName { get; set; } = string.Empty;
    public string? HostAvatar { get; set; }
}

public class CreateRoomDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    public decimal Price { get; set; }
    
    [Required]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    public string District { get; set; } = string.Empty;
    
    [Required]
    public string City { get; set; } = string.Empty;
    
    public double? AreaSqm { get; set; }
    
    public List<IFormFile> Photos { get; set; } = new List<IFormFile>();
}

public class UpdateRoomDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    public decimal Price { get; set; }
    
    [Required]
    public string Address { get; set; } = string.Empty;

    public bool IsAvailable { get; set; }
    
    public double? AreaSqm { get; set; }
}
