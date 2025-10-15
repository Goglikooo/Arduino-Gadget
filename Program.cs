using ArduinoBackend.Data;
using ArduinoBackend.Models;
using Microsoft.EntityFrameworkCore;
using ArduinoBackend;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=sensors.db"));

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Add SerialPort background service
builder.Services.AddHostedService<SerialPortListenerService>();

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();

// --- Minimal API endpoints ---
app.MapGet("/api/sensors", async (AppDbContext db) =>
{
    return await db.SensorRecords.OrderByDescending(x => x.Timestamp).ToListAsync();
});

app.MapGet("/api/sensors/latest", async (AppDbContext db) =>
{
    return await db.SensorRecords.OrderByDescending(x => x.Timestamp).FirstOrDefaultAsync();
});

app.Run();
