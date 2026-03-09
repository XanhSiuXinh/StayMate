using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using StayMate.Hubs;
using StayMate.Models;

namespace StayMate.Services
{
    public interface INotificationService
    {
        Task<Notification> CreateNotificationAsync(int userId, string title, string content, string notificationType);
        Task BroadcastNotificationAsync(Notification notification);
        Task BroadcastNotificationAsync(int userId, string title, string content, string notificationType);
    }

    public class NotificationService : INotificationService
    {
        private readonly StayMateDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationService(StayMateDbContext context, IHubContext<NotificationHub> notificationHubContext)
        {
            _context = context;
            _notificationHubContext = notificationHubContext;
        }

        public async Task<Notification> CreateNotificationAsync(int userId, string title, string content, string notificationType)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Content = content,
                NotificationType = notificationType,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return notification;
        }

        public async Task BroadcastNotificationAsync(Notification notification)
        {
            await _notificationHubContext.Clients.Group($"User_{notification.UserId}").SendAsync("ReceiveNotification", new
            {
                notification.NotificationId,
                notification.Title,
                notification.Content,
                notification.NotificationType,
                notification.CreatedAt,
                notification.IsRead
            });
        }

        public async Task BroadcastNotificationAsync(int userId, string title, string content, string notificationType)
        {
            var notification = await CreateNotificationAsync(userId, title, content, notificationType);
            await BroadcastNotificationAsync(notification);
        }
    }
}
