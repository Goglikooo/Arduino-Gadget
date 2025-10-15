namespace ArduinoBackend.Models
{
    public class SensorRecord
    {
        public int Id { get; set; }
        public int Humidity { get; set; }
        public int Temperature { get; set; }
        public int SoundLevel { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
