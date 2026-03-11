using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StayMate.DTOs;
using StayMate.Models;
using StayMate.Services.PaymentService;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly StayMateDbContext _context;
        private readonly IPaymentService _paymentService;

        public PaymentsController(StayMateDbContext context, IPaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        [HttpPost("create-deposit")]
        public async Task<IActionResult> CreateDeposit([FromBody] PaymentRequestDto request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId))
                return Unauthorized();

            var room = await _context.Rooms.FindAsync(request.RoomId);
            if (room == null || room.HostUserId != request.LandlordId)
                return BadRequest("Invalid room or landlord.");

            // Create Transaction Record
            var transaction = new PaymentTransaction
            {
                TenantId = userId,
                LandlordId = request.LandlordId,
                RoomId = request.RoomId,
                Amount = request.Amount,
                Status = "Processing"
            };

            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Generate VNPay URL
            var returnUrl = $"{Request.Scheme}://{Request.Host}/api/payments/vnpay-return?transactionId={transaction.Id}";
            var paymentUrl = _paymentService.CreatePaymentUrl(request, userId, returnUrl);

            return Ok(new { paymentUrl, transactionId = transaction.Id });
        }

        [AllowAnonymous]
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn([FromQuery] int transactionId, [FromQuery] string vnp_SecureHash, [FromQuery] string vnp_TransactionStatus)
        {
            // Note: Secure hash validation would logically happen here
            var transaction = await _context.PaymentTransactions.FindAsync(transactionId);
            if (transaction == null)
                return NotFound("Transaction not found.");

            if (vnp_TransactionStatus == "00")
            {
                transaction.Status = "Held";
                transaction.VnPayTransactionId = Request.Query["vnp_TransactionNo"];
            }
            else
            {
                transaction.Status = "Failed";
            }

            transaction.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Redirect to frontend status page
            return Redirect($"http://localhost:5173/payment/status?status={transaction.Status}&amount={transaction.Amount}&roomId={transaction.RoomId}");
        }

        [HttpPost("{id}/release")]
        public async Task<IActionResult> ReleasePayment(int id)
        {
            var tenantIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(tenantIdStr, out int tenantId))
                return Unauthorized();

            var transaction = await _context.PaymentTransactions
                .Include(t => t.Landlord)
                .FirstOrDefaultAsync(t => t.Id == id && t.TenantId == tenantId);

            if (transaction == null)
                return NotFound("Transaction not found.");

            if (transaction.Status != "Held")
                return BadRequest($"Transaction is not in Held status. Current status: {transaction.Status}");

            // Giải ngân
            transaction.Status = "Released";
            transaction.UpdatedAt = DateTime.UtcNow;
            
            // Chuyển tiền vào Balance của chủ phòng
            transaction.Landlord.Balance += transaction.Amount;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment successfully released to landlord." });
        }

        [HttpGet("my-transactions")]
        public async Task<IActionResult> GetMyTransactions()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId))
                return Unauthorized();

            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Landlord")
            {
                var transactions = await _context.PaymentTransactions
                    .Include(t => t.Tenant)
                    .Include(t => t.Room)
                    .Where(t => t.LandlordId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => new
                    {
                        t.Id,
                        t.Amount,
                        t.Status,
                        t.CreatedAt,
                        RoomTitle = t.Room.Title,
                        TenantName = t.Tenant.FullName
                    })
                    .ToListAsync();
                return Ok(transactions);
            }
            else
            {
                var transactions = await _context.PaymentTransactions
                    .Include(t => t.Landlord)
                    .Include(t => t.Room)
                    .Where(t => t.TenantId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .Select(t => new
                    {
                        t.Id,
                        t.Amount,
                        t.Status,
                        t.CreatedAt,
                        RoomTitle = t.Room.Title,
                        LandlordName = t.Landlord.FullName,
                        t.RoomId
                    })
                    .ToListAsync();
                return Ok(transactions);
            }
        }
    }
}
