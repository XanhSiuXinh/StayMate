using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StayMate.DTOs;
using StayMate.Models;
using StayMate.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already exists." });
            }


            PasswordService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);


            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                DateOfBirth = DateOnly.FromDateTime(request.DateOfBirth), // Convert DateTime to DateOnly
                Gender = "Khác", 
                PasswordHash = PasswordService.CreatePasswordHashString(request.Password),
                Role = request.Role,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                IsActive = true,
                AccountStatus = "Active"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            var token = CreateToken(user);

            return Ok(new AuthResponseDto 
            { 
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Role = user.Role,
                IsNewUser = true
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

       
                 if (!PasswordService.VerifyPasswordHashString(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Wrong password." });
            }

            var token = CreateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Role = user.Role,
                IsNewUser = false
            });
        }

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponseDto>> GoogleLogin(GoogleLoginDto request)
        {
            try
            {

                var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(
                    request.IdToken,
                    new Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _configuration["Google:ClientId"] }
                    });

                bool isNewUser = false;


                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    isNewUser = true;

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
                        AccountStatus = "Active",
                        Role = "Student" // Mặc định Google login là Student, có thể đổi sau
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                else
                {

                    if (string.IsNullOrEmpty(user.AvatarUrl) && !string.IsNullOrEmpty(payload.Picture))
                    {
                        user.AvatarUrl = payload.Picture;
                        await _context.SaveChangesAsync();
                    }
                }


                var token = CreateToken(user);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Email = user.Email,
                    FullName = user.FullName,
                    AvatarUrl = user.AvatarUrl,
                    Role = user.Role,
                    IsNewUser = isNewUser
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
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
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

    }
}
