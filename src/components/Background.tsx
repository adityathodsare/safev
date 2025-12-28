"use client";
import { BackgroundLines } from "@/components/ui/background-lines";
import { FlipWords } from "@/components/ui/flip-words";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

function Background() {
  const words = ["SAFEV", "Secure", "Shielded", "Systematic"];
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8 min-h-screen">
        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          {/* HEADER SECTION */}
          <div className="space-y-4 sm:space-y-6">
            {/* ✅ ONLY ONE H1 FOR SEO */}
            <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-100 to-neutral-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans py-2 sm:py-4 relative z-20 font-bold tracking-tight">
              SAFEV – Smart Accident Detection & Vehicle Safety System
            </h1>

            {/* Keyword reinforcement */}
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mx-auto font-normal text-neutral-200 relative z-20">
              <FlipWords words={words} />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 md:gap-6 relative z-30">
            {/* Buy Now */}
            <div className="w-full">
              <button
                onClick={() => navigateWithLoader(router, "/buy")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 ease-out border border-blue-400/30 hover:border-blue-300/50 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Buy Now
                </span>
              </button>
            </div>

            {/* Track Data */}
            <div className="w-full">
              <button
                onClick={() => navigateWithLoader(router, "/tracking")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 ease-out border border-emerald-400/30 hover:border-emerald-300/50 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Track Data
                </span>
              </button>
            </div>

            {/* Working On */}
            <div className="w-full">
              <button
                onClick={() => navigateWithLoader(router, "/remaining")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 ease-out border border-amber-400/30 hover:border-amber-300/50 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Working On...
                </span>
              </button>
            </div>
          </div>

          {/* SEO DESCRIPTION */}
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed relative z-20 px-4 sm:px-0">
            SAFEV is an IoT-based smart vehicle safety system providing
            real-time accident detection, GPS tracking, alcohol detection, gas
            leak monitoring, and emergency alert notifications.
          </p>
        </div>
      </BackgroundLines>
    </div>
  );
}

export default Background;
