"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";
import UcodGuard from "@/components/auth/UcodGuard";

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
      title: "Driver Monitoring",
      subtitle: "Internal AI Camera",
      icon: "👤",
      route: "/internal-camera",
      gradient: "from-purple-500 to-pink-500",
      description: "AI-powered internal camera for driver alertness and behavior",
    },
    {
      id: 3,
      title: "Traffic Camera",
      subtitle: "External Road Feed",
      icon: "🚗",
      route: "/external-camera",
      gradient: "from-orange-500 to-amber-500",
      description: "Live external camera feed for road conditions and traffic safety",
    },
  ];

  return (
    <UcodGuard>
      <div className="page-container flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-0 left-0 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative z-10 text-center mb-8 sm:mb-12">
          <h1 className="section-heading text-3xl sm:text-4xl md:text-5xl mb-3">
            RAKSHAK
          </h1>
          <p className="text-theme-secondary text-base sm:text-lg max-w-md mx-auto mb-4">
            Safety Monitoring &amp; Surveillance Kit
          </p>
          <div className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {monitoringCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleNavigation(card.route)}
              className="glass-card p-6 sm:p-8 text-center hover:scale-[1.03] transition-all duration-300 group cursor-pointer flex flex-col items-center justify-between min-h-[300px] border border-white/10 hover:border-white/20"
            >
              <div className="w-full flex flex-col items-center">
                <div className="text-5xl sm:text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-theme mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-emerald-400 mb-3 font-mono">
                  {card.subtitle}
                </p>
                <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>
              <div className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-medium text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}>
                <span>Access Module</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-5xl glass-card p-6 sm:p-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
    </UcodGuard>
  );
}
