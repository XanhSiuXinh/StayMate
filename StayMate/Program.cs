using Microsoft.EntityFrameworkCore;
using StayMate.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Register custom services
builder.Services.AddScoped<StayMate.Interfaces.ICompatibilityService, StayMate.Services.CompatibilityService>();
builder.Services.AddScoped<StayMate.Services.INotificationService, StayMate.Services.NotificationService>();
builder.Services.AddScoped<StayMate.Services.PaymentService.IPaymentService, StayMate.Services.PaymentService.VnPayService>();

// Database context
builder.Services.AddDbContext<StayMateDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("StayMateContext")));

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value!)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Student", policy => policy.RequireRole("Student"));
    options.AddPolicy("Landlord", policy => policy.RequireRole("Landlord"));
});

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Enable CORS
app.UseCors("AllowReactApp");

// Enable static files
app.UseStaticFiles();

// Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapControllers();
app.MapHub<StayMate.Hubs.ChatHub>("/chathub");
app.MapHub<StayMate.Hubs.NotificationHub>("/notificationhub");

app.Run();
