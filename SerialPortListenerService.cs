using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using ArduinoBackend.Data;
using ArduinoBackend.Models;
using System.IO.Ports;

namespace ArduinoBackend
{
    public class SerialPortListenerService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly string _portName = "COM3"; // <-- Change if needed
        private readonly int _baudRate = 9600;
        private readonly List<SensorRecord> buffer = new();
        private (int H, int T, int S)? lastRecord = null; // For duplicate filtering

        public SerialPortListenerService(IServiceProvider services)
        {
            _services = services;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(() =>
            {
                SerialPort? port = null;

                // --- Try to connect to COM3 until successful ---
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        port = new SerialPort(_portName, _baudRate)
                        {
                            NewLine = "\n",
                            ReadTimeout = 2000,
                            DtrEnable = true,
                            RtsEnable = true
                        };

                        port.Open();
                        Console.WriteLine($"✅ Connected to Arduino on {_portName}");
                        Thread.Sleep(3000); // Give Arduino time to reset
                        break;
                    }
                    catch (UnauthorizedAccessException)
                    {
                        Console.WriteLine($"⚠️  Access denied to {_portName}. Close Arduino IDE or Serial Monitor.");
                        Thread.Sleep(2000);
                    }
                    catch (Exception)
                    {
                        Console.WriteLine($"Waiting for {_portName}...");
                        Thread.Sleep(2000);
                    }
                }

                if (port == null)
                {
                    Console.WriteLine("❌ Could not open serial port.");
                    return;
                }

                DateTime lastSave = DateTime.Now;

                // --- Main reading loop ---
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        if (port.BytesToRead > 0)
                        {
                            string line = port.ReadLine().Trim();
                            Console.WriteLine($"📥 Received raw: {line}");

                            if (!line.StartsWith("DATA:")) continue;

                            var parts = line.Substring(5).Split(',');
                            if (parts.Length != 3) continue;

                            if (int.TryParse(parts[0], out int h) &&
                                int.TryParse(parts[1], out int t) &&
                                int.TryParse(parts[2], out int s))
                            {
                                // Skip duplicates
                                if (lastRecord == (h, t, s))
                                    continue;

                                lastRecord = (h, t, s);

                                var record = new SensorRecord
                                {
                                    Humidity = h,
                                    Temperature = t,
                                    SoundLevel = s
                                };

                                buffer.Add(record);
                                Console.WriteLine($"🟢 Queued: H={h}, T={t}, S={s}");

                                // Flush every 100 records or every 10 seconds
                                if (buffer.Count >= 100 ||
                                    (DateTime.Now - lastSave).TotalSeconds > 10)
                                {
                                    using var scope = _services.CreateScope();
                                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                                    db.SensorRecords.AddRange(buffer);
                                    db.SaveChanges();

                                    Console.WriteLine($"💾 Saved {buffer.Count} records to DB");
                                    buffer.Clear();
                                    lastSave = DateTime.Now;
                                }
                            }
                        }
                        else
                        {
                            Console.WriteLine("...waiting for data...");
                            Thread.Sleep(1000);
                        }
                    }
                    catch (TimeoutException)
                    {
                        // Ignore timeout, Arduino just not sending
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Serial error: {ex.Message}");
                    }
                }

                // --- Cleanup on shutdown ---
                try
                {
                    port.Close();
                    port.Dispose();
                    Console.WriteLine("🔌 Serial port closed cleanly.");
                }
                catch { }
            }, stoppingToken);
        }
    }
}
