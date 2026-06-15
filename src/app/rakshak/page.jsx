"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

export default function RakshakPage() {
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  const handleNavigation = (path) => {
    navigateWithLoader(router, path);
  };

  const monitoringCards = [
    {
      id: 1,
      title: "Locate My Vehicle",
      subtitle: "Real-Time GPS Tracking",
      icon: "📍",
      route: "/track",
      gradient: "from-blue-500 to-cyan-500",
      description: "Track your vehicle location with precision GPS monitoring",
    },
    {
      id: 2,
      title: "External Camera",
      subtitle: "Traffic Management",
      icon: "🎥",
      route: "/external-camera",
      gradient: "from-orange-500 to-red-500",
      description: "Monitor road conditions and surrounding traffic",
    },
    {
      id: 3,
      title: "Internal Camera",
      subtitle: "Driver Monitoring System",
      icon: "👁️",
      route: "/internal-camera",
      gradient: "from-purple-500 to-pink-500",
      description: "AI-powered driver behavior and safety analysis",
    },
  ];

  return (
    <div className="page-container relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-10 right-10 animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-theme-secondary text-sm font-medium">
              System Active
            </span>
          </div>
          <h1 className="section-heading">RAKSHAK</h1>
          <p className="text-theme-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Comprehensive Vehicle Monitoring & Security Suite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {monitoringCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleNavigation(card.route)}
              className={`group glass-card p-6 sm:p-8 text-left min-h-[280px] flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 border-t-2 border-transparent hover:border-blue-500/50`}
            >
              <div>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {card.title}
                </h3>
                <p className="text-theme-secondary text-sm font-medium mb-2">
                  {card.subtitle}
                </p>
                <p className="text-theme-secondary text-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-theme-secondary text-sm mt-4 group-hover:text-blue-500 transition-colors">
                <span className="font-medium">Access Now</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="glass-card p-6 sm:p-8 mt-12">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "24/7", label: "Live Monitoring", color: "text-blue-500" },
              { value: "AI", label: "Powered Analytics", color: "text-purple-500" },
              { value: "HD", label: "Video Quality", color: "text-orange-500" },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs sm:text-sm text-theme-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
