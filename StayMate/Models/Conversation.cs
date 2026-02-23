using System;
using System.Collections.Generic;

namespace StayMate.Models;

public partial class Conversation
{
    public int ConversationId { get; set; }

    public int MatchId { get; set; }

    public DateTime? LastMessageAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Match Match { get; set; } = null!;

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
