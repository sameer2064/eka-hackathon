export default function Testimonials() {

  const testimonials = [
    {
      name: "Aayush",
      role: "Business Owner",
      text: "The best service marketplace experience in Nepal.",
    },
    {
      name: "Prerana",
      role: "Home Owner",
      text: "Premium UI and highly trusted professionals.",
    },
    {
      name: "Sanjog",
      role: "Customer",
      text: "AI recommendations are shockingly accurate.",
    },
  ];

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-14">

        <p className="uppercase tracking-[0.3em] text-red-500 font-bold mb-5">
          CUSTOMER EXPERIENCE
        </p>

        <h2 className="heading-lg">
          Trusted by Nepal.
        </h2>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {testimonials.map((item) => (

          <div
            key={item.name}
            className="glass-heavy rounded-[36px] p-8 hover:-translate-y-2 transition duration-500"
          >

            <div className="flex items-center gap-5 mb-6">

              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-2xl font-black">

                {item.name.charAt(0)}

              </div>

              <div>

                <h3 className="text-2xl font-black">
                  {item.name}
                </h3>

                <p className="text-zinc-500">
                  {item.role}
                </p>

              </div>

            </div>

            <p className="text-zinc-300 text-lg leading-relaxed">

              {item.text}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}