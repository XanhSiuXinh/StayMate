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
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly StayMateDbContext _context;

        public AppointmentsController(StayMateDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto createDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var room = await _context.Rooms.FindAsync(createDto.RoomId);
            if (room == null) return NotFound("Room not found");

            if (room.HostUserId == userId)
                return BadRequest("You cannot book an appointment for your own room.");

            var appointment = new Appointment
            {
                RequesterId = userId,
                RoomId = createDto.RoomId,
                HostId = room.HostUserId,
                AppointmentDate = createDto.AppointmentDate,
                Notes = createDto.Notes,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return await GetAppointmentDto(appointment.AppointmentId);
        }

        [HttpGet("outgoing")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetOutgoingAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var appointments = await _context.Appointments
                .Include(a => a.Room).ThenInclude(r => r.Photos)
                .Include(a => a.Host)
                .Where(a => a.RequesterId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        [HttpGet("incoming")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetIncomingAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var appointments = await _context.Appointments
                .Include(a => a.Room).ThenInclude(r => r.Photos)
                .Include(a => a.Requester)
                .Where(a => a.HostId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return appointments.Select(MapToDto).ToList();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateAppointmentStatusDto statusDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null) return NotFound();

            // Only host can Approve/Reject, Requester can Cancel
            if (statusDto.Status == "Cancelled")
            {
                if (appointment.RequesterId != userId) return Forbid();
            }
            else
            {
                if (appointment.HostId != userId) return Forbid();
            }

            appointment.Status = statusDto.Status;
            appointment.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<AppointmentDto> GetAppointmentDto(int id)
        {
            var a = await _context.Appointments
                .Include(a => a.Room).ThenInclude(r => r.Photos)
                .Include(a => a.Requester)
                .Include(a => a.Host)
                .FirstAsync(a => a.AppointmentId == id);
            
            return MapToDto(a);
        }

        private static AppointmentDto MapToDto(Appointment a)
        {
            return new AppointmentDto
            {
                AppointmentId = a.AppointmentId,
                RequesterId = a.RequesterId,
                RequesterName = a.Requester?.FullName ?? "Unknown",
                RequesterAvatar = a.Requester?.AvatarUrl,
                RoomId = a.RoomId,
                RoomTitle = a.Room.Title,
                RoomPhoto = a.Room.Photos.FirstOrDefault()?.PhotoUrl,
                HostId = a.HostId,
                HostName = a.Host?.FullName ?? "Unknown",
                AppointmentDate = a.AppointmentDate,
                Notes = a.Notes,
                Status = a.Status,
                CreatedAt = a.CreatedAt
            };
        }
    }
}
