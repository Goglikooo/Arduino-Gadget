import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import WeatherComponent from "./Components/WeatherComponent";
import HumidityComponent from "./Components/Humidity";
import SoundLevelComponent from "./Components/SoundLevelComponent";

function App() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5222/api/sensors");
      setData(res.data.slice(0, 50)); // last 50 entries
    };
    fetchData();

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-100">
      <SoundLevelComponent soundLevel={data[0]?.soundLevel} />
      <WeatherComponent temperature={data[0]?.temperature} />
      <HumidityComponent humidity={data[0]?.humidity} />
    </div>

    // <div className="p-6 font-sans">
    //   <h1 className="text-2xl font-bold mb-4">Arduino Sensor Dashboard</h1>

    //   <LineChart width={800} height={400} data={data.reverse()}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="timestamp" />
    //     <YAxis />
    //     <Tooltip />
    //     <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
    //     <Line type="monotone" dataKey="humidity" stroke="#387908" />
    //     <Line type="monotone" dataKey="soundLevel" stroke="#0088FE" />
    //   </LineChart>
    // </div>
  );
}

const Metric = ({ label, value, unit }: any) => (
  <div className="bg-gray-100 p-4 rounded-xl text-center shadow">
    <h2 className="text-lg font-semibold">{label}</h2>
    <p className="text-3xl font-bold">
      {value ?? "–"} {unit}
    </p>
  </div>
);

export default App;
