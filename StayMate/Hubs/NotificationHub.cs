using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace StayMate.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        // NotificationHub can be used to notify users in real-time
        // Users are automatically added to a group named after their UserId for targeted notifications
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
            await base.OnConnectedAsync();
        }
    }
}
