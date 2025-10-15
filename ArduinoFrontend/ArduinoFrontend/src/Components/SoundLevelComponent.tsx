export default function SoundLevelComponent({
  soundLevel,
}: {
  soundLevel: any;
}) {
  return (
    <div className="col-span-2 bg-blue-500 text-white p-6 text-center rounded-2xl">
      <h1 className="text-3xl font-bold">Loudness</h1>
      <p className="text-lg">{soundLevel}</p>
    </div>
  );
}
