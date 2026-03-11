using StayMate.DTOs;
using System.Collections.Generic;

namespace StayMate.Services.PaymentService
{
    public interface IPaymentService
    {
        string CreatePaymentUrl(PaymentRequestDto model, int userId, string returnUrl);
        bool ValidateSignature(string secureHash, string hashSecret, IDictionary<string, string> vnpayData);
    }
}
