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

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms([FromQuery] string? city, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
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
                AreaSqm = r.AreaSqm,
                IsAvailable = r.IsAvailable,
                CreatedAt = r.CreatedAt,
                PhotoUrls = r.Photos.Select(p => p.PhotoUrl).ToList(),
                HostUserId = r.HostUserId,
                HostName = r.HostUser.FullName,
                HostAvatar = r.HostUser.AvatarUrl
            }).ToList();
        }

        // GET: api/Rooms/5
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
                AreaSqm = room.AreaSqm,
                IsAvailable = room.IsAvailable,
                CreatedAt = room.CreatedAt,
                PhotoUrls = room.Photos.Select(p => p.PhotoUrl).ToList(),
                HostUserId = room.HostUserId,
                HostName = room.HostUser.FullName,
                HostAvatar = room.HostUser.AvatarUrl
            };
        }

        // POST: api/Rooms
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RoomDto>> PostRoom(CreateRoomDto createRoomDto)
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
                AreaSqm = createRoomDto.AreaSqm,
                IsAvailable = true,
                CreatedAt = DateTime.Now
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            // Add Photos
            if (createRoomDto.PhotoUrls != null && createRoomDto.PhotoUrls.Any())
            {
                foreach (var url in createRoomDto.PhotoUrls)
                {
                    _context.RoomPhotos.Add(new RoomPhoto
                    {
                        RoomId = room.RoomId,
                        PhotoUrl = url
                    });
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
                AreaSqm = room.AreaSqm,
                IsAvailable = room.IsAvailable,
                CreatedAt = room.CreatedAt,
                PhotoUrls = createRoomDto.PhotoUrls ?? new List<string>(),
                HostUserId = userId,
                HostName = user.FullName,
                HostAvatar = user.AvatarUrl
            };

            return CreatedAtAction("GetRoom", new { id = room.RoomId }, roomDto);
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        [Authorize]
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
            room.Address = updateRoomDto.Address;
            room.AreaSqm = updateRoomDto.AreaSqm;
            room.IsAvailable = updateRoomDto.IsAvailable;
            room.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        [Authorize]
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
