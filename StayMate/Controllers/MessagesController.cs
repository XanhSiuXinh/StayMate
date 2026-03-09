using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using StayMate.Hubs;
using StayMate.Models;
using System.Security.Claims;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly StayMateDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesController(StayMateDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("conversations")]
        [Authorize]
        public async Task<IActionResult> GetConversations()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var conversations = await _context.Conversations
                .Include(c => c.Match)
                    .ThenInclude(m => m.User1)
                .Include(c => c.Match)
                    .ThenInclude(m => m.User2)
                .Include(c => c.Messages)
                .Where(c => (c.Match.User1Id == userId || c.Match.User2Id == userId) && c.Match.IsActive == true)
                .OrderByDescending(c => c.LastMessageAt)
                .Select(c => new
                {
                    id = c.ConversationId,
                    matchId = c.MatchId,
                    targetUser = c.Match.User1Id == userId 
                        ? new { c.Match.User2.UserId, c.Match.User2.FullName, c.Match.User2.AvatarUrl, c.Match.User2.School }
                        : new { c.Match.User1.UserId, c.Match.User1.FullName, c.Match.User1.AvatarUrl, c.Match.User1.School },
                    lastMessage = c.Messages.OrderByDescending(m => m.SentAt).Select(m => new { m.MessageContent, m.SentAt, m.SenderId, m.IsRead }).FirstOrDefault(),
                    unreadCount = c.Messages.Count(m => m.SenderId != userId && (m.IsRead == false || m.IsRead == null)),
                    matchPercentage = 85 // Fallback/Dummy score or we can calculate similarly 
                })
                .ToListAsync();

            var result = conversations.Select(c => new
            {
                c.id,
                c.matchId,
                otherUserId = c.targetUser.UserId,
                name = c.targetUser.FullName ?? "Unknown",
                avatar = !string.IsNullOrEmpty(c.targetUser.AvatarUrl) ? c.targetUser.AvatarUrl : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                lastMessage = c.lastMessage?.MessageContent ?? "You are now connected!",
                time = c.lastMessage?.SentAt != null ? c.lastMessage.SentAt.Value.ToString("g") : "",
                unread = c.unreadCount > 0,
                match = c.matchPercentage,
                online = false // Replace with real online status later if possible
            });

            return Ok(result);
        }

        [HttpGet("{conversationId}")]
        [Authorize]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var conversation = await _context.Conversations
                .Include(c => c.Match)
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (conversation == null || (conversation.Match.User1Id != userId && conversation.Match.User2Id != userId))
            {
                return Forbid();
            }

            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.MessageId,
                    m.SenderId,
                    m.MessageContent,
                    m.SentAt,
                    m.IsRead
                })
                .ToListAsync();


            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderId != userId && (m.IsRead == false || m.IsRead == null))
                .ToListAsync();

            if (unreadMessages.Any())
            {
                foreach (var msg in unreadMessages)
                {
                    msg.IsRead = true;
                }
                await _context.SaveChangesAsync();
            }

            return Ok(messages);
        }

        [HttpPost("{conversationId}")]
        [Authorize]
        public async Task<IActionResult> SendMessage(int conversationId, [FromBody] SendMessageRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Message content cannot be empty.");
            }

            var conversation = await _context.Conversations
                .Include(c => c.Match)
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (conversation == null || (conversation.Match.User1Id != userId && conversation.Match.User2Id != userId))
            {
                return Forbid();
            }

            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = userId,
                MessageContent = request.Content,
                SentAt = DateTime.Now,
                IsRead = false,
                MessageType = "Text"
            };

            _context.Messages.Add(message);
            

            conversation.LastMessageAt = DateTime.Now;

            await _context.SaveChangesAsync();

            var messageResponse = new
            {
                message.MessageId,
                message.SenderId,
                message.MessageContent,
                message.SentAt,
                message.IsRead
            };

            await _hubContext.Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", messageResponse);

            return Ok(messageResponse);
        }
    }

    public class SendMessageRequest
    {
        public string Content { get; set; } = string.Empty;
    }
}
