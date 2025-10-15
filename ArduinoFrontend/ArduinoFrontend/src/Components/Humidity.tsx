export default function HumidityComponent({ humidity }: { humidity: any }) {
  return (
    <div className="bg-red-500 text-white p-4 text-center rounded-2xl">
      <h2 className="text-xl font-semibold">Humidity</h2>
      <p>{humidity}</p>
    </div>
  );
}
