"use client";
import React from "react";

export default function Page() {
  const handleNavigation = (path) => {
    // Simulated navigation - replace with your actual navigation logic
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-mono relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
      </div>

      {/* Title with enhanced gradient */}
      <div className="relative z-10 text-center mb-8 sm:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          VEHICLE SAFETY CONTROL
        </h1>
        <div className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl px-2">
        {/* Alcohol Tracking Button - Neon Blue */}
        <button
          onClick={() => handleNavigation("/alcoholtrack")}
          className="relative group overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 to-blue-600 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
        >
          <div className="relative bg-gray-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl group-hover:bg-gray-800/90 transition-all duration-300 h-full">
            <div className="flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
              <div className="mb-4 text-cyan-400 text-4xl sm:text-5xl">🍺</div>
              <span className="text-cyan-400 text-xl sm:text-2xl font-bold mb-2 text-center">
                MADAKSH
              </span>
              <span className="text-gray-300 text-sm sm:text-base text-center">
                Alcohol Detection
              </span>
              <div className="absolute -bottom-4 -right-4 text-7xl sm:text-8xl opacity-5 text-cyan-400 font-black">
                01
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        </button>

        {/* Accident Tracking Button - Neon Pink */}
        <button
          onClick={() => handleNavigation("/accidenttrack")}
          className="relative group overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-pink-500 to-purple-600 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
        >
          <div className="relative bg-gray-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl group-hover:bg-gray-800/90 transition-all duration-300 h-full">
            <div className="flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
              <div className="mb-4 text-pink-400 text-4xl sm:text-5xl">🚨</div>
              <span className="text-pink-400 text-xl sm:text-2xl font-bold mb-2 text-center">
                P.R.O.T.E.K
              </span>
              <span className="text-gray-300 text-sm sm:text-base text-center">
                Proactive Rollover Observer & Tracking Emergency Kit
              </span>
              <div className="absolute -bottom-4 -right-4 text-7xl sm:text-8xl opacity-5 text-pink-400 font-black">
                02
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        </button>

        {/* Rakshak Button - Neon Green/Emerald */}
        <button
          onClick={() => handleNavigation("/rakshak")}
          className="relative group overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 to-green-600 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 sm:col-span-2 lg:col-span-1"
        >
          <div className="relative bg-gray-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl group-hover:bg-gray-800/90 transition-all duration-300 h-full">
            <div className="flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]">
              <div className="mb-4 text-emerald-400 text-4xl sm:text-5xl">
                🛡️
              </div>
              <span className="text-emerald-400 text-xl sm:text-2xl font-bold mb-2 text-center">
                RAKSHAK
              </span>
              <span className="text-gray-300 text-sm sm:text-base text-center">
                Safety Monitoring
              </span>
              <div className="absolute -bottom-4 -right-4 text-7xl sm:text-8xl opacity-5 text-emerald-400 font-black">
                03
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </div>
        </button>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 mt-8 sm:mt-12 lg:mt-16 text-center">
        <p className="text-gray-400 text-xs sm:text-sm mb-2 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Real-time IoT monitoring system
        </p>
        <p className="text-gray-600 text-xs">
          Powered by Advanced Sensors & AI
        </p>
      </div>
    </div>
  );
}
