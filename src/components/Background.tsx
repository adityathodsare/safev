"use client";
import Image from "next/image";
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
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10">
          {/* HEADER SECTION */}
          <div className="space-y-4 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card mb-4">
              <Image
                src="/logo.png"
                alt="SAFEV Logo"
                width={22}
                height={22}
                className="h-5 w-auto object-contain"
              />
              <span className="text-sm text-theme-secondary font-medium">
                IoT-Powered Vehicle Safety
              </span>
            </div>

            {/* ✅ ONLY ONE H1 FOR SEO */}
            <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-slate-900 to-slate-600 dark:from-neutral-100 dark:to-neutral-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans py-2 sm:py-4 relative z-20 font-bold tracking-tight leading-tight animate-fade-in">
              SAFEV – Smart Accident Detection & Vehicle Safety System
            </h1>

            {/* Keyword reinforcement with enhanced styling */}
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mx-auto font-normal text-theme relative z-20">
              <FlipWords words={words} />
            </div>

            {/* Enhanced subtitle */}
            <p className="text-theme-secondary text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed relative z-20 px-4 animate-fade-in">
              Real-time accident detection • GPS tracking • Alcohol monitoring •
              Emergency alerts
            </p>
          </div>

          {/* BUTTONS - Enhanced with better spacing and effects */}
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 md:gap-6 relative z-30">
            {/* Buy Now - Enhanced */}
            <div className="w-full animate-fade-in-up">
              <button
                onClick={() => navigateWithLoader(router, "/buy")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 ease-out border border-blue-400/30 hover:border-blue-300/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

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
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>

            {/* Track Data - Enhanced */}
            <div className="w-full animate-fade-in-up">
              <button
                onClick={() => navigateWithLoader(router, "/tracking")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300 ease-out border border-emerald-400/30 hover:border-emerald-300/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Track Data
                </span>
              </button>
            </div>

            {/* Prototype - High-Tech Animated Button */}
            <div className="w-full animate-fade-in-up">
              <button
                onClick={() => navigateWithLoader(router, "/prototype")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:via-pink-700 hover:to-amber-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-out border border-purple-400/40 hover:border-pink-300/60 backdrop-blur-sm overflow-hidden cursor-pointer"
              >
                {/* Pulse Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:rotate-45 group-hover:scale-110 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m16-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                  Prototype
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* SEO DESCRIPTION - Enhanced */}
          <div className="text-theme-secondary text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed relative z-20 px-4 sm:px-0 animate-fade-in">
            <p className="mb-4">
              <strong className="text-theme">SAFEV</strong> is an
              IoT-based smart vehicle safety system providing real-time accident
              detection, GPS tracking, alcohol detection, gas leak monitoring,
              and emergency alert notifications.
            </p>

            {/* Trust indicators */}
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
}

export default Background;
