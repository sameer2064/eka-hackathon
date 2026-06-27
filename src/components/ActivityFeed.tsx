export default function ActivityFeed() {

  const activities = [

    "New booking received",
    "Provider became premium",
    "Customer left review",
    "Provider verified",
    "AI score updated",
    "New provider joined",

  ];

  return (

    <div className="glass rounded-[32px] p-8">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-2xl font-semibold">
          Live Activity
        </h2>

        <div className="flex items-center gap-2 text-green-400 text-sm">

          <div className="status-online" />

          Live

        </div>

      </div>

      <div className="space-y-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="bg-black rounded-2xl p-5 border border-zinc-900 hover:border-red-500/30 transition"
          >

            <div className="flex items-center justify-between">

              <p className="text-zinc-200">
                {activity}
              </p>

              <p className="text-zinc-500 text-sm">
                just now
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}