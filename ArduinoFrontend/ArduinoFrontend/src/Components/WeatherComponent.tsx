export default function WeatherComponent({
  temperature,
}: {
  temperature: number;
}) {
  // Optional: dynamic background fill based on temperature
  // For example, normalize between 0°C and 50°C
  const tempPercent = Math.min(100, Math.max(0, (temperature / 50) * 100));

  return (
    <div className="relative border-4 border-green-700 rounded-2xl overflow-hidden p-4 flex flex-col">
      {/* Dynamic background fill */}
      <div
        className="absolute bottom-0 left-0 w-full bg-green-500 transition-all duration-500"
        style={{ height: `${tempPercent}%`, opacity: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Heading at the top center */}
        <h2 className="text-xl font-semibold text-center">Temperature</h2>

        {/* Spacer to push value to center */}
        <div className="flex-grow flex items-center justify-center">
          <p className="text-8xl font-bold">{temperature}°C</p>
        </div>
      </div>
    </div>
  );
}
