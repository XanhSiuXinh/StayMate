using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace StayMate.Models;

public partial class StayMateDbContext : DbContext
{
    public StayMateDbContext()
    {
    }

    public StayMateDbContext(DbContextOptions<StayMateDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CompatibilityScore> CompatibilityScores { get; set; }

    public virtual DbSet<Conversation> Conversations { get; set; }

    public virtual DbSet<Interest> Interests { get; set; }

    public virtual DbSet<LifestylePreference> LifestylePreferences { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<RoomPreference> RoomPreferences { get; set; }

    public virtual DbSet<Swipe> Swipes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserInterest> UserInterests { get; set; }

    public virtual DbSet<UserLocation> UserLocations { get; set; }

    public virtual DbSet<UserPhoto> UserPhotos { get; set; }
    
    public virtual DbSet<Room> Rooms { get; set; }
    
    public virtual DbSet<RoomPhoto> RoomPhotos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost;Database=StayMateDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CompatibilityScore>(entity =>
        {
            entity.HasKey(e => e.ScoreId).HasName("PK__Compatib__7DD229F1773F8E49");

            entity.HasIndex(e => new { e.User1Id, e.User2Id }, "UQ_CompatibilityScore").IsUnique();

            entity.Property(e => e.ScoreId).HasColumnName("ScoreID");
            entity.Property(e => e.CalculatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CompatibilityScore1)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("CompatibilityScore");
            entity.Property(e => e.InterestScore).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.LifestyleScore).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.LocationScore).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.User1Id).HasColumnName("User1ID");
            entity.Property(e => e.User2Id).HasColumnName("User2ID");

            entity.HasOne(d => d.User1).WithMany(p => p.CompatibilityScoreUser1s)
                .HasForeignKey(d => d.User1Id)
                .HasConstraintName("FK__Compatibi__User1__00200768");

            entity.HasOne(d => d.User2).WithMany(p => p.CompatibilityScoreUser2s)
                .HasForeignKey(d => d.User2Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Compatibi__User2__01142BA1");
        });

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__Conversa__C050D8972EE1ADEC");

            entity.HasIndex(e => e.MatchId, "UQ__Conversa__4218C836290942BB").IsUnique();

            entity.Property(e => e.ConversationId).HasColumnName("ConversationID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LastMessageAt).HasColumnType("datetime");
            entity.Property(e => e.MatchId).HasColumnName("MatchID");

            entity.HasOne(d => d.Match).WithOne(p => p.Conversation)
                .HasForeignKey<Conversation>(d => d.MatchId)
                .HasConstraintName("FK__Conversat__Match__73BA3083");
        });

        modelBuilder.Entity<Interest>(entity =>
        {
            entity.HasKey(e => e.InterestId).HasName("PK__Interest__20832C0759DDE1F1");

            entity.HasIndex(e => e.InterestName, "UQ__Interest__D2704B36E4131C3E").IsUnique();

            entity.Property(e => e.InterestId).HasColumnName("InterestID");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.IconUrl)
                .HasMaxLength(500)
                .HasColumnName("IconURL");
            entity.Property(e => e.InterestName).HasMaxLength(100);
        });

        modelBuilder.Entity<LifestylePreference>(entity =>
        {
            entity.HasKey(e => e.PreferenceId).HasName("PK__Lifestyl__E228490FC3C93FE2");

            entity.HasIndex(e => e.UserId, "UQ__Lifestyl__1788CCAD6DFEE750").IsUnique();

            entity.Property(e => e.PreferenceId).HasColumnName("PreferenceID");
            entity.Property(e => e.CookingFrequency).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DrinkingStatus).HasMaxLength(50);
            entity.Property(e => e.GuestFrequency).HasMaxLength(50);
            entity.Property(e => e.HasPets).HasDefaultValue(false);
            entity.Property(e => e.PetType).HasMaxLength(100);
            entity.Property(e => e.SleepTime).HasMaxLength(50);
            entity.Property(e => e.SmokingStatus).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.WakeUpTime).HasMaxLength(50);
            entity.Property(e => e.WorkFromHome).HasDefaultValue(false);

            entity.HasOne(d => d.User).WithOne(p => p.LifestylePreference)
                .HasForeignKey<LifestylePreference>(d => d.UserId)
                .HasConstraintName("FK__Lifestyle__UserI__52593CB8");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK__Matches__4218C837F1615985");

            entity.ToTable(tb => tb.HasTrigger("TR_Matches_AutoChat"));

            entity.HasIndex(e => new { e.User1Id, e.User2Id }, "IX_Matches_Users");

            entity.HasIndex(e => new { e.User1Id, e.User2Id }, "UQ_Match").IsUnique();

            entity.Property(e => e.MatchId).HasColumnName("MatchID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MatchedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UnmatchedAt).HasColumnType("datetime");
            entity.Property(e => e.User1Id).HasColumnName("User1ID");
            entity.Property(e => e.User2Id).HasColumnName("User2ID");

            entity.HasOne(d => d.UnmatchedByNavigation).WithMany(p => p.MatchUnmatchedByNavigations)
                .HasForeignKey(d => d.UnmatchedBy)
                .HasConstraintName("FK__Matches__Unmatch__6E01572D");

            entity.HasOne(d => d.User1).WithMany(p => p.MatchUser1s)
                .HasForeignKey(d => d.User1Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Matches__User1ID__6C190EBB");

            entity.HasOne(d => d.User2).WithMany(p => p.MatchUser2s)
                .HasForeignKey(d => d.User2Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Matches__User2ID__6D0D32F4");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Messages__C87C037C4AC54BB5");

            entity.ToTable(tb => tb.HasTrigger("TR_Messages_UpdateChatTime"));

            entity.HasIndex(e => e.ConversationId, "IX_Messages_Conversation");

            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.ConversationId).HasColumnName("ConversationID");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.MediaUrl)
                .HasMaxLength(500)
                .HasColumnName("MediaURL");
            entity.Property(e => e.MessageContent).HasMaxLength(2000);
            entity.Property(e => e.MessageType)
                .HasMaxLength(20)
                .HasDefaultValue("Text");
            entity.Property(e => e.SenderId).HasColumnName("SenderID");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Conversation).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ConversationId)
                .HasConstraintName("FK__Messages__Conver__7A672E12");

            entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Messages__Sender__7B5B524B");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E329A420D12");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.Content).HasMaxLength(500);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.NotificationType).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__05D8E0BE");
        });

        modelBuilder.Entity<RoomPreference>(entity =>
        {
            entity.HasKey(e => e.RoomPreferenceId).HasName("PK__RoomPref__BB609FA3E4F9A2FC");

            entity.HasIndex(e => e.UserId, "UQ__RoomPref__1788CCAD1BC6D05B").IsUnique();

            entity.Property(e => e.RoomPreferenceId).HasColumnName("RoomPreferenceID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MaxBudget).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.MinBudget).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PreferredGender).HasMaxLength(10);
            entity.Property(e => e.PreferredRoomType).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithOne(p => p.RoomPreference)
                .HasForeignKey<RoomPreference>(d => d.UserId)
                .HasConstraintName("FK__RoomPrefe__UserI__5FB337D6");
        });

        modelBuilder.Entity<Swipe>(entity =>
        {
            entity.HasKey(e => e.SwipeId).HasName("PK__Swipes__486E327C51CAC5F1");

            entity.HasIndex(e => new { e.UserId, e.TargetUserId }, "IX_Swipes_UserTarget");

            entity.HasIndex(e => new { e.UserId, e.TargetUserId }, "UQ_Swipe").IsUnique();

            entity.Property(e => e.SwipeId).HasColumnName("SwipeID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SwipeType).HasMaxLength(10);
            entity.Property(e => e.TargetUserId).HasColumnName("TargetUserID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.TargetUser).WithMany(p => p.SwipeTargetUsers)
                .HasForeignKey(d => d.TargetUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Swipes__TargetUs__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.SwipeUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Swipes__UserID__656C112C");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC91A1B1A2");

            entity.ToTable(tb => tb.HasTrigger("TR_Users_Timestamp"));

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534423390EE").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.AccountStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Active");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500)
                .HasColumnName("AvatarURL");
            entity.Property(e => e.Bio).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.LastLoginAt).HasColumnType("datetime");
            entity.Property(e => e.Occupation).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.School).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<UserInterest>(entity =>
        {
            entity.HasKey(e => e.UserInterestId).HasName("PK__UserInte__28E6EBDEF6F47DEB");

            entity.HasIndex(e => new { e.UserId, e.InterestId }, "UQ_UserInterest").IsUnique();

            entity.Property(e => e.UserInterestId).HasColumnName("UserInterestID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.InterestId).HasColumnName("InterestID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Interest).WithMany(p => p.UserInterests)
                .HasForeignKey(d => d.InterestId)
                .HasConstraintName("FK__UserInter__Inter__5AEE82B9");

            entity.HasOne(d => d.User).WithMany(p => p.UserInterests)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserInter__UserI__59FA5E80");
        });

        modelBuilder.Entity<UserLocation>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PK__UserLoca__E7FEA477E23E9DFE");

            entity.HasIndex(e => new { e.City, e.District }, "IX_UserLocations_City");

            entity.Property(e => e.LocationId).HasColumnName("LocationID");
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.IsPreferred).HasDefaultValue(true);
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Ward).HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.UserLocations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserLocat__UserI__4316F928");
        });

        modelBuilder.Entity<UserPhoto>(entity =>
        {
            entity.HasKey(e => e.PhotoId).HasName("PK__UserPhot__21B7B582754E344C");

            entity.Property(e => e.PhotoId).HasColumnName("PhotoID");
            entity.Property(e => e.DisplayOrder).HasDefaultValue(0);
            entity.Property(e => e.IsProfilePhoto).HasDefaultValue(false);
            entity.Property(e => e.PhotoUrl)
                .HasMaxLength(500)
                .HasColumnName("PhotoURL");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.UserPhotos)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserPhoto__UserI__48CFD27E");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
