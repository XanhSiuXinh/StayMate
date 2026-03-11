using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.DTOs;
using StayMate.Models;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly StayMateDbContext _context;

        public RoomsController(StayMateDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-rooms")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetMyRooms()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var rooms = await _context.Rooms
                .Include(r => r.Photos)
                .Include(r => r.HostUser)
                .Where(r => r.HostUserId == userId)
                .OrderByDescending(r => r.IsBoosted && r.BoostExpiryDate >= DateTime.UtcNow)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync();

            return rooms.Select(r => new RoomDto
            {
                RoomId = r.RoomId,
                Title = r.Title,
                Description = r.Description,
                Price = r.Price,
                Address = r.Address,
                District = r.District,
                City = r.City,
                Ward = r.Ward,
                Amenities = r.Amenities,
                AreaSqm = r.AreaSqm,
                IsAvailable = r.IsAvailable,
                CreatedAt = r.CreatedAt,
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                PhotoUrls = r.Photos.Select(p => p.PhotoUrl).ToList(),
                HostUserId = r.HostUserId,
                HostName = r.HostUser.FullName,
                HostAvatar = r.HostUser.AvatarUrl,
                AverageRating = _context.Reviews.Where(rev => rev.TargetRoomId == r.RoomId).Any() 
                    ? _context.Reviews.Where(rev => rev.TargetRoomId == r.RoomId).Average(rev => rev.Rating) 
                    : 0,
                ReviewsCount = _context.Reviews.Count(rev => rev.TargetRoomId == r.RoomId),
                IsBoosted = r.IsBoosted,
                BoostExpiryDate = r.BoostExpiryDate
            }).ToList();
        }

        [HttpGet("landlord-stats")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<object>> GetLandlordStats()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var roomsCount = await _context.Rooms.CountAsync(r => r.HostUserId == userId);
            var availableRooms = await _context.Rooms.CountAsync(r => r.HostUserId == userId && r.IsAvailable);

            return new
            {
                TotalRooms = roomsCount,
                AvailableRooms = availableRooms,
                OccupiedRooms = roomsCount - availableRooms
            };
        }

        [HttpPatch("{id}/toggle-availability")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var room = await _context.Rooms.FindAsync(id);

            if (room == null) return NotFound();
            if (room.HostUserId != userId) return Forbid();

            room.IsAvailable = !room.IsAvailable;
            room.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { isAvailable = room.IsAvailable });
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms([FromQuery] string? city, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] int? minArea, [FromQuery] int? maxArea)
        {
            var query = _context.Rooms.Include(r => r.Photos).Include(r => r.HostUser).AsQueryable();

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(r => r.City.Contains(city));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(r => r.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(r => r.Price <= maxPrice.Value);
            }

            if (minArea.HasValue)
            {
                query = query.Where(r => r.AreaSqm >= minArea.Value);
            }

            if (maxArea.HasValue)
            {
                query = query.Where(r => r.AreaSqm <= maxArea.Value);
            }

            query = query
                .OrderByDescending(r => r.IsBoosted && r.BoostExpiryDate >= DateTime.UtcNow)
                .ThenByDescending(r => r.CreatedAt);

            var rooms = await query.ToListAsync();

            return rooms.Select(r => new RoomDto
            {
                RoomId = r.RoomId,
                Title = r.Title,
                Description = r.Description,
                Price = r.Price,
                Address = r.Address,
                District = r.District,
                City = r.City,
                Ward = r.Ward,
                Amenities = r.Amenities,
                AreaSqm = r.AreaSqm,
                IsAvailable = r.IsAvailable,
                CreatedAt = r.CreatedAt,
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                PhotoUrls = r.Photos.Select(p => p.PhotoUrl).ToList(),
                HostUserId = r.HostUserId,
                HostName = r.HostUser.FullName,
                HostAvatar = r.HostUser.AvatarUrl,
                AverageRating = _context.Reviews.Where(rev => rev.TargetRoomId == r.RoomId).Any() 
                    ? _context.Reviews.Where(rev => rev.TargetRoomId == r.RoomId).Average(rev => rev.Rating) 
                    : 0,
                ReviewsCount = _context.Reviews.Count(rev => rev.TargetRoomId == r.RoomId),
                IsBoosted = r.IsBoosted,
                BoostExpiryDate = r.BoostExpiryDate
            }).ToList();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Photos)
                .Include(r => r.HostUser)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound();
            }

            return new RoomDto
            {
                RoomId = room.RoomId,
                Title = room.Title,
                Description = room.Description,
                Price = room.Price,
                Address = room.Address,
                District = room.District,
                City = room.City,
                Ward = room.Ward,
                Amenities = room.Amenities,
                AreaSqm = room.AreaSqm,
                IsAvailable = room.IsAvailable,
                CreatedAt = room.CreatedAt,
                Latitude = room.Latitude,
                Longitude = room.Longitude,
                PhotoUrls = room.Photos.Select(p => p.PhotoUrl).ToList(),
                HostUserId = room.HostUserId,
                HostName = room.HostUser.FullName,
                HostAvatar = room.HostUser.AvatarUrl,
                AverageRating = _context.Reviews.Where(rev => rev.TargetRoomId == room.RoomId).Any() 
                    ? _context.Reviews.Where(rev => rev.TargetRoomId == room.RoomId).Average(rev => rev.Rating) 
                    : 0,
                ReviewsCount = _context.Reviews.Count(rev => rev.TargetRoomId == room.RoomId),
                IsBoosted = room.IsBoosted,
                BoostExpiryDate = room.BoostExpiryDate
            };
        }


        [HttpPost]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<RoomDto>> PostRoom([FromForm] CreateRoomDto createRoomDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Unauthorized();

            var room = new Room
            {
                HostUserId = userId,
                Title = createRoomDto.Title,
                Description = createRoomDto.Description,
                Price = createRoomDto.Price,
                Address = createRoomDto.Address,
                District = createRoomDto.District,
                City = createRoomDto.City,
                Ward = createRoomDto.Ward,
                Amenities = createRoomDto.Amenities,
                AreaSqm = createRoomDto.AreaSqm,
                Latitude = createRoomDto.Latitude,
                Longitude = createRoomDto.Longitude,
                IsAvailable = true,
                CreatedAt = DateTime.Now
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var savedPhotoUrls = new List<string>();

            if (createRoomDto.Photos != null && createRoomDto.Photos.Any())
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "rooms");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                var request = HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}";

                foreach (var file in createRoomDto.Photos)
                {
                    if (file.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(uploadsPath, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var photoUrl = $"{baseUrl}/uploads/rooms/{fileName}";
                        savedPhotoUrls.Add(photoUrl);

                        _context.RoomPhotos.Add(new RoomPhoto
                        {
                            RoomId = room.RoomId,
                            PhotoUrl = photoUrl
                        });
                    }
                }
                await _context.SaveChangesAsync();
            }

            var roomDto = new RoomDto
            {
                RoomId = room.RoomId,
                Title = room.Title,
                Description = room.Description,
                Price = room.Price,
                Address = room.Address,
                District = room.District,
                City = room.City,
                Ward = room.Ward,
                Amenities = room.Amenities,
                AreaSqm = room.AreaSqm,
                IsAvailable = room.IsAvailable,
                CreatedAt = room.CreatedAt,
                Latitude = room.Latitude,
                Longitude = room.Longitude,
                PhotoUrls = savedPhotoUrls,
                HostUserId = userId,
                HostName = user.FullName,
                HostAvatar = user.AvatarUrl,
                AverageRating = 0,
                ReviewsCount = 0,
                IsBoosted = false,
                BoostExpiryDate = null
            };

            return CreatedAtAction("GetRoom", new { id = room.RoomId }, roomDto);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> PutRoom(int id, UpdateRoomDto updateRoomDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            if (room.HostUserId != userId)
            {
                return Forbid();
            }

            room.Title = updateRoomDto.Title;
            room.Description = updateRoomDto.Description;
            room.Price = updateRoomDto.Price;
            room.City = room.City; // Assuming City doesn't change or add if needed
            room.District = room.District; 
            room.Address = updateRoomDto.Address;
            room.Ward = updateRoomDto.Ward;
            room.Amenities = updateRoomDto.Amenities;
            room.AreaSqm = updateRoomDto.AreaSqm;
            room.Latitude = updateRoomDto.Latitude;
            room.Longitude = updateRoomDto.Longitude;
            room.IsAvailable = updateRoomDto.IsAvailable;
            room.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            if (room.HostUserId != userId)
            {
                return Forbid();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
