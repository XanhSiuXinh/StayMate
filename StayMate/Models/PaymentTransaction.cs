using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StayMate.Models
{
    public class PaymentTransaction
    {
        [Key]
        public int Id { get; set; }

        public int? TenantId { get; set; }

        [ForeignKey("TenantId")]
        public virtual User Tenant { get; set; }

        public int? LandlordId { get; set; }

        [ForeignKey("LandlordId")]
        public virtual User Landlord { get; set; }

        public int? RoomId { get; set; }

        [ForeignKey("RoomId")]
        public virtual Room Room { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        /// <summary>
        /// Processing: Đang chờ thanh toán VNPay
        /// Held: Đã thanh toán, tiền đang bị tạm giữ bởi Admin
        /// Released: Đã giải ngân cho chủ phòng
        /// Refunded: Đã hoàn tiền cho người thuê
        /// Failed: Thanh toán thất bại hoặc bị hủy
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Processing";

        [Required]
        [StringLength(50)]
        public string TransactionType { get; set; } = "Deposit"; // Deposit, Premium, Boost

        [StringLength(255)]
        public string VnPayTransactionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
