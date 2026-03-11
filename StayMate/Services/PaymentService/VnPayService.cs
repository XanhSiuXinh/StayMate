using Microsoft.Extensions.Configuration;
using StayMate.DTOs;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace StayMate.Services.PaymentService
{
    public class VnPayService : IPaymentService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(PaymentRequestDto model, int userId, string returnUrl)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            var tick = DateTime.Now.Ticks.ToString();
            
            var vnp_TmnCode = _configuration["VnPay:TmnCode"];
            var vnp_HashSecret = _configuration["VnPay:HashSecret"];
            var vnp_Url = _configuration["VnPay:Url"];
            
            var vnpayData = new SortedList<string, string>(new VnPayCompare())
            {
                { "vnp_Version", "2.1.0" },
                { "vnp_Command", "pay" },
                { "vnp_TmnCode", vnp_TmnCode },
                { "vnp_Locale", "vn" },
                { "vnp_CurrCode", "VND" },
                { "vnp_TxnRef", tick }, // Order ID is ticks
                { "vnp_OrderInfo", $"Thanh toan tien coc phong {model.RoomId} tu user {userId}" },
                { "vnp_OrderType", "other" }, 
                { "vnp_Amount", ((long)(model.Amount * 100)).ToString() },
                { "vnp_ReturnUrl", returnUrl },
                { "vnp_IpAddr", "127.0.0.1" },
                { "vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss") },
                { "vnp_ExpireDate", timeNow.AddMinutes(15).ToString("yyyyMMddHHmmss") }
            };

            var paymentUrl = BuildQueryString(vnp_Url, vnp_HashSecret, vnpayData);
            return paymentUrl;
        }

        public bool ValidateSignature(string secureHash, string hashSecret, IDictionary<string, string> vnpayData)
        {
            // Remove secureHash from data to validate
            if (vnpayData.ContainsKey("vnp_SecureHashType"))
            {
                vnpayData.Remove("vnp_SecureHashType");
            }
            if (vnpayData.ContainsKey("vnp_SecureHash"))
            {
                vnpayData.Remove("vnp_SecureHash");
            }

            var sortedData = new SortedList<string, string>(vnpayData, new VnPayCompare());
            var signData = string.Join("&", sortedData.Where(kv => !string.IsNullOrEmpty(kv.Value))
                                                      .Select(kv => $"{kv.Key}={WebUtility.UrlEncode(kv.Value)}"));
                                                      
            var computedHash = HmacSHA512(hashSecret, signData);

            return secureHash.Equals(computedHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string BuildQueryString(string baseUrl, string hashSecret, SortedList<string, string> vnpayData)
        {
            var data = new StringBuilder();
            foreach (var kv in vnpayData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            // Remove last '&'
            var querystring = data.ToString();
            if (querystring.EndsWith("&"))
                querystring = querystring.Substring(0, querystring.Length - 1);

            var signData = querystring;
            var vnp_SecureHash = HmacSHA512(hashSecret, signData);

            baseUrl += "?" + querystring;
            baseUrl += "&vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        private string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}
