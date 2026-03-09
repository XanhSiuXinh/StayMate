using Microsoft.EntityFrameworkCore;
using StayMate.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddScoped<StayMate.Interfaces.ICompatibilityService, StayMate.Services.CompatibilityService>();
builder.Services.AddScoped<StayMate.Services.INotificationService, StayMate.Services.NotificationService>();


builder.Services.AddDbContext<StayMateDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("StayMateContext")));


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


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{

    app.UseHttpsRedirection();
}


app.UseCors("AllowReactApp");


app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();
app.MapHub<StayMate.Hubs.ChatHub>("/chathub");
app.MapHub<StayMate.Hubs.NotificationHub>("/notificationhub");

app.Run();
