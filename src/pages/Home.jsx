import { useEffect, useState } from "react";

const slides = [
  {
    title: "Explore the Highlands",
    subtitle: "Discover breathtaking mountain landscapes at every turn",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Sunsets by the Sea",
    subtitle: "A peaceful ocean retreat with glowing skies",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Beach Paradise",
    subtitle: "Relax on golden sands and soak in breathtaking ocean views",
    image:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300">
            plan smarter, travel farther
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-xl">
            {slides[activeIndex].subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
