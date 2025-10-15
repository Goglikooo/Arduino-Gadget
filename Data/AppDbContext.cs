using ArduinoBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ArduinoBackend.Data
{
    public class AppDbContext: DbContext
    {
        public DbSet<SensorRecord> SensorRecords => Set<SensorRecord>();

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}
