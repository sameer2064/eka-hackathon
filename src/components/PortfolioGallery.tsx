export default function PortfolioGallery() {

  const images = [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  ];

  return (

    <div className="grid md:grid-cols-3 gap-6">

      {images.map((img, index) => (

        <div
          key={index}
          className="overflow-hidden rounded-[32px] h-72 bg-zinc-900"
        >

          <img
            src={img}
            className="w-full h-full object-cover hover:scale-110 transition duration-700"
          />

        </div>

      ))}

    </div>
  );
}