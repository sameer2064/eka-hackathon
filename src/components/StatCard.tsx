export default function StatCard({
  title,
  value,
  color,
}: any) {

  return (

    <div className="glass rounded-[28px] p-7 card-hover relative overflow-hidden">

      <div
        className={`absolute top-0 left-0 w-full h-1 ${color}`}
      />

      <p className="text-zinc-500 text-sm mb-4">
        {title}
      </p>

      <h2 className="text-5xl font-semibold tracking-tight">
        {value}
      </h2>

    </div>
  );
}