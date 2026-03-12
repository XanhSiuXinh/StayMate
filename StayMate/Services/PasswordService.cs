using System.Security.Cryptography;
using System.Text;

namespace StayMate.Services
{
    public static class PasswordService
    {
        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }

        public static string CreatePasswordHashString(string password)
        {
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            return Convert.ToBase64String(passwordSalt) + "." + Convert.ToBase64String(passwordHash);
        }

        public static bool VerifyPasswordHashString(string password, string passwordHashString)
        {
            var parts = passwordHashString.Split('.');
            if (parts.Length != 2) return false;

            var salt = Convert.FromBase64String(parts[0]);
            var storedHash = Convert.FromBase64String(parts[1]);

            return VerifyPasswordHash(password, storedHash, salt);
        }
    }
}
