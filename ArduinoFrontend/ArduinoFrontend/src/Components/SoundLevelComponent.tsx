import { useEffect, useState } from "react";

interface SoundLevelProps {
  soundLevel: number;
}

export default function SoundLevelComponent({ soundLevel }: SoundLevelProps) {
  // Display value for smooth updates
  const [displayLevel, setDisplayLevel] = useState(soundLevel);

  // Update displayLevel immediately whenever new soundLevel arrives
  useEffect(() => {
    setDisplayLevel(soundLevel);
  }, [soundLevel]);

  // Inverted scale: quiet ≈ 900 → 0%, loud ≈ 100 → 100%
  const normalized = Math.min(Math.max(displayLevel, 100), 900);
  const inverted = 1 - (normalized - 100) / (900 - 100);
  const level = Math.round(inverted * 100);

  // Smooth UV color gradient (green → yellow → red)
  const getColor = (value: number) => {
    const red = Math.floor((value / 100) * 255);
    const green = Math.floor(255 - (value / 100) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="col-span-2 relative bg-blue-500 text-white p-6 text-center rounded-2xl min-h-[250px]">
      {/* Top content */}
      <h1 className="text-3xl font-bold mb-2">Loudness</h1>
      <p className="text-lg mb-4">{displayLevel}</p>

      <div className="w-full h-5 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-5 transition-[width,background-color] duration-100 ease-linear"
          style={{
            width: `${level}%`,
            backgroundColor: getColor(level),
          }}
        ></div>
      </div>

      <div className="flex justify-between text-sm mt-1 opacity-80">
        <span>Quiet</span>
        <span>Loud</span>
      </div>

      {/* Centered message */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-6xl font-bold text-red-200  p-4 rounded-xl">
          {soundLevel > 800
            ? "Sound level is within the acceptable range."
            : "Warning: Too loud!"}
        </div>
      </div>
    </div>
  );
}
