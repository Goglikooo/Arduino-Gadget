import { useEffect, useState } from "react";
import axios from "axios";
import WeatherComponent from "./Components/WeatherComponent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState([]);

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
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Arduino Sensor Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Metric label="Temperature" value={data[0]?.temperature} unit="°C" />
        <Metric label="Humidity" value={data[0]?.humidity} unit="%" />
        <Metric label="Sound Level" value={data[0]?.soundLevel} unit="" />
      </div>

      <LineChart width={800} height={400} data={data.reverse()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        <Line type="monotone" dataKey="humidity" stroke="#387908" />
        <Line type="monotone" dataKey="soundLevel" stroke="#0088FE" />
      </LineChart>
    </div>
  );
}

const Metric = ({ label, value, unit }) => (
  <div className="bg-gray-100 p-4 rounded-xl text-center shadow">
    <h2 className="text-lg font-semibold">{label}</h2>
    <p className="text-3xl font-bold">
      {value ?? "–"} {unit}
    </p>
  </div>
);

export default App;
