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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-sm animate-fade-in mb-4">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm text-blue-300 font-medium">
                IoT-Powered Vehicle Safety
              </span>
            </div>

            {/* ✅ ONLY ONE H1 FOR SEO */}
            <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-100 to-neutral-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans py-2 sm:py-4 relative z-20 font-bold tracking-tight leading-tight animate-fade-in-up">
              SAFEV – Smart Accident Detection & Vehicle Safety System
            </h1>

            {/* Keyword reinforcement with enhanced styling */}
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mx-auto font-normal text-neutral-200 relative z-20">
              <FlipWords words={words} />
            </div>

            {/* Enhanced subtitle */}
            <p
              className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed relative z-20 px-4 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Real-time accident detection • GPS tracking • Alcohol monitoring •
              Emergency alerts
            </p>
          </div>

          {/* BUTTONS - Enhanced with better spacing and effects */}
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 md:gap-6 relative z-30">
            {/* Buy Now - Enhanced */}
            <div
              className="w-full animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
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
            <div
              className="w-full animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
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

            {/* Working On - Enhanced */}
            <div
              className="w-full animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <button
                onClick={() => navigateWithLoader(router, "/remaining")}
                className="group relative w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 ease-out border border-amber-400/30 hover:border-amber-300/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Working On...
                </span>
              </button>
            </div>
          </div>

          {/* SEO DESCRIPTION - Enhanced */}
          <div
            className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed relative z-20 px-4 sm:px-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="mb-4">
              <strong className="text-neutral-300">SAFEV</strong> is an
              IoT-based smart vehicle safety system providing real-time accident
              detection, GPS tracking, alcohol detection, gas leak monitoring,
              and emergency alert notifications.
            </p>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-lg p-3 border border-neutral-800 hover:border-blue-500/50 transition-all">
                <div className="text-2xl font-bold text-blue-400">99.9%</div>
                <div className="text-xs text-neutral-500">Accuracy</div>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-lg p-3 border border-neutral-800 hover:border-emerald-500/50 transition-all">
                <div className="text-2xl font-bold text-emerald-400">
                  &lt;2s
                </div>
                <div className="text-xs text-neutral-500">Response</div>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-lg p-3 border border-neutral-800 hover:border-purple-500/50 transition-all">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-xs text-neutral-500">Monitoring</div>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-lg p-3 border border-neutral-800 hover:border-amber-500/50 transition-all">
                <div className="text-2xl font-bold text-amber-400">IoT</div>
                <div className="text-xs text-neutral-500">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundLines>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Background;
