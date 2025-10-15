export default function HumidityComponent({ humidity }: { humidity: any }) {
  return (
    <div className="relative border-4 border-green-700 bg-gray-200 rounded-2xl overflow-hidden p-4 flex flex-col">
      <div
        className="absolute bottom-0 left-0 w-full bg-red-500"
        style={{ height: `${humidity}%` }}
      />
      <div className="relative z-10 text-black flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-center">Humidity</h2>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-4xl font-bold">{humidity}%</p>
        </div>
      </div>
    </div>
  );
}
