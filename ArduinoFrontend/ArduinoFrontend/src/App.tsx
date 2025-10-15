import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import WeatherComponent from "./Components/WeatherComponent";
import HumidityComponent from "./Components/Humidity";
import SoundLevelComponent from "./Components/SoundLevelComponent";

interface SensorData {
  temperature: number;
  humidity: number;
  soundLevel: number;
}

function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    soundLevel: 0,
  });

  useEffect(() => {
    // Connect to SignalR Hub
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5222/sensorhub", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("✅ Connected to SignalR hub"))
      .catch((err) => console.error(err));

    // Listen for live sensor data
    connection.on("ReceiveSensorData", (data: SensorData) => {
      setSensorData(data); // Update state immediately for real-time dashboard
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-100">
      <SoundLevelComponent soundLevel={sensorData.soundLevel} />
      <WeatherComponent temperature={sensorData.temperature} />
      <HumidityComponent humidity={sensorData.humidity} />
    </div>
  );
}

export default App;
