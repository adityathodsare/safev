"use client";

import { useInView } from "react-intersection-observer";
import { Carousel } from "../../components/ui/carousel";
import UcodGuard from "@/components/auth/UcodGuard";

export default function CarouselDemo() {
  const slideData = [
    {
      title: "Responsive and well-managed UI support with own website",
      src: "/img/img1.jpg",
    },
    {
      title: "Accurate and calculatable readings",
      src: "/img/img2.jpg",
    },
    {
      title: "Simple circuitry and easy to build",
      src: "/img/img3.jpg",
    },
    {
      title:
        "Enhances user experience and gives alerts via Telegram, emails, and website",
      src: "/img/img4.jpg",
    },
  ];

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <UcodGuard>
      <div className="relative w-full min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* 🚀 Hero Section with Carousel */}
      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 md:px-10">
        <Carousel slides={slideData} />
      </div>

      {/* 🎥 Video Section */}
      <div className="w-full flex flex-col items-center justify-center px-4 py-20 bg-black">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 uppercase tracking-widest bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,0,255,0.7)]">
          Watch How It Works
        </h2>

        <div
          ref={ref}
          className="w-full max-w-4xl mx-auto relative rounded-2xl overflow-hidden border-4 border-pink-500 shadow-[0_0_25px_#ff00ff] transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_40px_#00f0ff]"
          style={{
            boxShadow: "0 0 20px #ff00ff, 0 0 40px #9400ff, 0 0 60px #00f0ff",
          }}
        >
          <div className="relative w-full pt-[56.25%]">
            {" "}
            {/* 16:9 Aspect Ratio */}
            {inView && (
              <iframe
                src="https://www.youtube.com/embed/9gR1c8AmzTk?si=RrnOkhwgBYE3sD8f"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                style={{ border: "none" }}
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  </UcodGuard>
);
}
