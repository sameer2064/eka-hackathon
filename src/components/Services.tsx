const services = [
  "Electrician",
  "Plumber",
  "CCTV Installer",
  "AC Repair",
  "Cleaner",
  "Painter",
  "Carpenter",
  "Appliance Repair",
];

export default function Services() {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Popular Services
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Instantly connect with verified professionals across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {services.map((service) => (
            <div
              key={service}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-red-500/40 hover:bg-red-500/5 transition cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl mb-6">
                🔧
              </div>

              <h3 className="text-xl font-semibold">
                {service}
              </h3>

              <p className="text-gray-400 text-sm mt-3">
                Verified professionals available nearby.
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}