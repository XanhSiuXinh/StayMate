using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StayMate.DTOs;
using StayMate.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace StayMate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly StayMateDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(StayMateDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto request)
        {
            // 1. Check if user exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already exists." });
            }

            // 2. Hash password
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // 3. Create User entity
            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                DateOfBirth = DateOnly.FromDateTime(request.DateOfBirth), // Convert DateTime to DateOnly
                Gender = "Khác", 
                PasswordHash = Convert.ToBase64String(passwordSalt) + "." + Convert.ToBase64String(passwordHash),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsActive = true,
                AccountStatus = "Active"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Generate Token
            var token = CreateToken(user);

            return Ok(new AuthResponseDto 
            { 
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

       
            var parts = user.PasswordHash.Split('.');
            if (parts.Length != 2) return BadRequest(new { message = "Invalid password format in DB." });

            var salt = Convert.FromBase64String(parts[0]);
            var storedHash = Convert.FromBase64String(parts[1]);

            if (!VerifyPasswordHash(request.Password, storedHash, salt))
            {
                return BadRequest(new { message = "Wrong password." });
            }

            var token = CreateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl
            });
        }

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponseDto>> GoogleLogin(GoogleLoginDto request)
        {
            try
            {
                // Xác thực Google ID Token
                var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(
                    request.IdToken,
                    new Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _configuration["Google:ClientId"] }
                    });

                // Tìm hoặc tạo user
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    // Tạo user mới từ Google account
                    user = new User
                    {
                        Email = payload.Email,
                        FullName = payload.Name,
                        DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-18)), // Mặc định 18 tuổi
                        Gender = "Khác",
                        PasswordHash = "", // Google login không cần password
                        AvatarUrl = payload.Picture,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        IsActive = true,
                        IsVerified = payload.EmailVerified, // Google đã verify email
                        AccountStatus = "Active"
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Đồng bộ Avatar khi đăng nhập bằng Google nếu nó khác hoặc trống
                    if (!string.IsNullOrEmpty(payload.Picture) && user.AvatarUrl != payload.Picture)
                    {
                        user.AvatarUrl = payload.Picture;
                        await _context.SaveChangesAsync();
                    }
                }

                // Tạo JWT token
                var token = CreateToken(user);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Email = user.Email,
                    FullName = user.FullName,
                    AvatarUrl = user.AvatarUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Invalid Google token: {ex.Message}" });
            }
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Key").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }
    }
}
