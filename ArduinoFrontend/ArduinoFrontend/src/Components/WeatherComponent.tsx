export default function WeatherComponent({
  temperature,
}: {
  temperature: any;
}) {
  return (
    <div className="bg-green-500 text-white p-4 text-center rounded-2xl">
      <h2 className="text-xl font-semibold">Temperature</h2>
      <p>{temperature}</p>
    </div>
  );
}
