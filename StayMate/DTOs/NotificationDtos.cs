using System;

namespace StayMate.DTOs
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public string? NotificationType { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateNotificationStatusDto
    {
        public bool IsRead { get; set; }
    }
}
