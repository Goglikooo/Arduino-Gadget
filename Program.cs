using ArduinoBackend.Data;
using ArduinoBackend.Models;
using Microsoft.EntityFrameworkCore;
using ArduinoBackend;

var builder = WebApplication.CreateBuilder(args);

// --- Add EF Core SQLite ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=sensors.db"));

// --- Add CORS for React frontend ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
         policy => policy
             .SetIsOriginAllowed(origin => origin.StartsWith("http://localhost"))
             .AllowCredentials()
             .AllowAnyHeader()
             .AllowAnyMethod());
});

// --- Add SignalR ---




builder.Services.AddSignalR();

// --- Add SerialPort background service (after SignalR) ---
builder.Services.AddHostedService<SerialPortListenerService>();

var app = builder.Build();



// --- Use CORS BEFORE SignalR & endpoints ---
app.UseCors("AllowReactApp");

//app.UseHttpsRedirection();

// --- Minimal API endpoints ---
app.MapGet("/api/sensors", async (AppDbContext db) =>
{
    return await db.SensorRecords.OrderByDescending(x => x.Timestamp).ToListAsync();
});

app.MapGet("/api/sensors/latest", async (AppDbContext db) =>
{
    return await db.SensorRecords.OrderByDescending(x => x.Timestamp).FirstOrDefaultAsync();
});

// --- Map SignalR hub ---
app.MapHub<SensorHub>("/sensorhub");

app.Run();
