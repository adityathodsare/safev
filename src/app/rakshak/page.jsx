"use client";
import React from "react";

export default function RakshakPage() {
  const handleNavigation = (path) => {
    // Replace with your actual navigation logic
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };

  const monitoringCards = [
    {
      id: 1,
      title: "Locate My Vehicle",
      subtitle: "Real-Time GPS Tracking",
      icon: "📍",
      route: "/track",
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "blue-500/50",
      bgGlow: "blue-500/10",
      description: "Track your vehicle location with precision GPS monitoring",
    },
    {
      id: 2,
      title: "External Camera",
      subtitle: "Traffic Management",
      icon: "🎥",
      route: "/external-camera",
      gradient: "from-orange-500 to-red-500",
      shadowColor: "orange-500/50",
      bgGlow: "orange-500/10",
      description: "Monitor road conditions and surrounding traffic",
    },
    {
      id: 3,
      title: "Internal Camera",
      subtitle: "Driver Monitoring System",
      icon: "👁️",
      route: "/internal-camera",
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "purple-500/50",
      bgGlow: "purple-500/10",
      description: "AI-powered driver behavior and safety analysis",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-orange-500/5 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50 mb-4">
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-gray-400 text-xs sm:text-sm font-medium">
                System Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-3">
              RAKSHAK
            </h1>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Comprehensive Vehicle Monitoring & Security Suite
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <span className="text-gray-500 text-xs sm:text-sm">
                Advanced Protection
              </span>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Monitoring Cards Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {monitoringCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleNavigation(card.route)}
                className={`relative group overflow-hidden rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br ${card.gradient} cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${card.shadowColor}`}
              >
                {/* Card Background */}
                <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full min-h-[280px] sm:min-h-[320px] flex flex-col justify-between overflow-hidden">
                  {/* Background Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${card.bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="text-6xl sm:text-7xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {card.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-3 mb-4">
                      <h3
                        className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                      >
                        {card.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm font-medium">
                        {card.subtitle}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div
                    className={`absolute -bottom-6 -right-6 text-8xl sm:text-9xl font-black opacity-5 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}
                  >
                    {String(card.id).padStart(2, "0")}
                  </div>

                  {/* Arrow Indicator */}
                  <div className="relative z-10 mt-auto flex items-center gap-2 text-gray-500 text-sm group-hover:text-gray-300 transition-colors">
                    <span className="font-medium">Access Now</span>
                    <svg
                      className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Live Monitoring
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                  AI
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Powered Analytics
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                  HD
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Video Quality
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-600 text-xs sm:text-sm">
            © 2025 Rakshak Security Systems • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
