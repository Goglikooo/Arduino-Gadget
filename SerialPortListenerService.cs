using ArduinoBackend;
using ArduinoBackend.Data;
using ArduinoBackend.Models;
using Microsoft.AspNetCore.SignalR;
using System.IO.Ports;

public class SerialPortListenerService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly IHubContext<SensorHub> _hubContext;

    public SerialPortListenerService(IServiceProvider services, IHubContext<SensorHub> hubContext)
    {
        _services = services;
        _hubContext = hubContext;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(async () =>
        {
            using var port = new SerialPort("COM3", 9600)
            {
                NewLine = "\n",
                DtrEnable = true,
                RtsEnable = true
            };
            port.Open();
            Console.WriteLine("✅ Connected to Arduino");

            var dbBuffer = new List<SensorRecord>();
            DateTime lastSave = DateTime.Now;

            while (!stoppingToken.IsCancellationRequested)
            {
                if (port.BytesToRead > 0)
                {
                    string line = port.ReadLine().Trim();
                    if (!line.StartsWith("DATA:")) continue;

                    var parts = line.Substring(5).Split(',');
                    if (parts.Length != 3) continue;

                    if (int.TryParse(parts[0], out int h) &&
                        int.TryParse(parts[1], out int t) &&
                        int.TryParse(parts[2], out int s))
                    {
                        var record = new SensorRecord { Humidity = h, Temperature = t, SoundLevel = s };

                        // 1️⃣ Send live to all dashboard clients via SignalR
                        await _hubContext.Clients.All.SendAsync("ReceiveSensorData", record);

                        // 2️⃣ Optional: save to DB asynchronously in batches every 10 records or 10s
                        dbBuffer.Add(record);
                        if (dbBuffer.Count >= 10 || (DateTime.Now - lastSave).TotalSeconds > 10)
                        {
                            using var scope = _services.CreateScope();
                            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                            db.SensorRecords.AddRange(dbBuffer);
                            await db.SaveChangesAsync();
                            dbBuffer.Clear();
                            lastSave = DateTime.Now;
                        }
                    }
                }
                else
                {
                    await Task.Delay(50); // Small delay to avoid CPU hog
                }
            }
        });
    }
}
