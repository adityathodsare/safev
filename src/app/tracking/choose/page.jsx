"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

const modules = [
  {
    emoji: "🍺",
    title: "MADAKSH",
    subtitle: "Alcohol Detection",
    route: "/alcoholtrack",
    accent: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-500",
  },
  {
    emoji: "🚨",
    title: "P.R.O.T.E.K",
    subtitle: "Proactive Rollover Observer & Tracking Emergency Kit",
    route: "/accidenttrack",
    accent: "from-pink-500 to-purple-600",
    textColor: "text-pink-500",
  },
  {
    emoji: "🛡️",
    title: "RAKSHAK",
    subtitle: "Safety Monitoring",
    route: "/rakshak",
    accent: "from-emerald-500 to-green-600",
    textColor: "text-emerald-500",
  },
];

export default function Page() {
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  const handleNavigation = (path) => {
    navigateWithLoader(router, path);
  };

  return (
    <div className="page-container flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-0 left-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 text-center mb-8 sm:mb-12">
        <h1 className="section-heading text-3xl sm:text-4xl md:text-5xl mb-3">
          Vehicle Safety Control
        </h1>
        <div className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
        {modules.map((mod) => (
          <button
            key={mod.route}
            onClick={() => handleNavigation(mod.route)}
            className="glass-card p-6 sm:p-8 text-center hover:scale-[1.02] transition-all duration-300 group min-h-[160px] flex flex-col items-center justify-center"
          >
            <div className="text-4xl sm:text-5xl mb-4">{mod.emoji}</div>
            <span className={`text-xl sm:text-2xl font-bold mb-2 ${mod.textColor}`}>{mod.title}</span>
            <span className="text-theme-secondary text-sm">{mod.subtitle}</span>
            <div className={`mt-4 h-0.5 w-0 group-hover:w-16 bg-gradient-to-r ${mod.accent} transition-all duration-300 rounded-full`} />
          </button>
        ))}
      </div>

      <div className="relative z-10 mt-8 sm:mt-12 text-center">
        <p className="text-theme-secondary text-xs sm:text-sm flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Real-time IoT monitoring system
        </p>
      </div>
    </div>
  );
}
