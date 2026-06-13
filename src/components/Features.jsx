"use client";

import { useState } from "react";

const FEATURE_COLORS = {
  customizable: {
    accent: "#ec4899",
    grad: "linear-gradient(135deg,#db2777,#f43f5e)",
  },
  smooth: {
    accent: "#a855f7",
    grad: "linear-gradient(135deg,#7c3aed,#ec4899)",
  },
  live: { accent: "#22d3ee", grad: "linear-gradient(135deg,#0891b2,#0ea5e9)" },
  alcohol: {
    accent: "#f97316",
    grad: "linear-gradient(135deg,#ea580c,#f59e0b)",
  },
  temperature: {
    accent: "#f43f5e",
    grad: "linear-gradient(135deg,#dc2626,#f97316)",
  },
  speed: { accent: "#22c55e", grad: "linear-gradient(135deg,#16a34a,#0d9488)" },
  accident: {
    accent: "#ef4444",
    grad: "linear-gradient(135deg,#dc2626,#b91c1c)",
  },
  ucod: { accent: "#818cf8", grad: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  camera: {
    accent: "#38bdf8",
    grad: "linear-gradient(135deg,#0ea5e9,#6366f1)",
  },
  alerts: {
    accent: "#f59e0b",
    grad: "linear-gradient(135deg,#d97706,#ea580c)",
  },
  path: { accent: "#10b981", grad: "linear-gradient(135deg,#059669,#0d9488)" },
  uptime: {
    accent: "#22d3ee",
    grad: "linear-gradient(135deg,#0891b2,#4f46e5)",
  },
};

export default function Features() {
  const [hovered, setHovered] = useState(null);

  const coreFeatures = [
    {
      id: "customizable",
      title: "Customizable UI",
      icon: "🎨",
      description: "Tailored dashboard as per client requirements",
      details: [
        "White-label solution for businesses",
        "Custom branding & color schemes",
        "Role-based access control",
        "Personalized dashboard layouts",
        "Custom report generation",
      ],
    },
    {
      id: "smooth",
      title: "Smooth UI Experience",
      icon: "✨",
      description: "Intuitive and responsive interface",
      details: [
        "Real-time data visualization",
        "Smooth animations & transitions",
        "Mobile-responsive design",
        "One-click access to all features",
        "User-friendly navigation",
      ],
    },
    {
      id: "live",
      title: "Live Monitoring",
      icon: "📡",
      description: "Real-time vehicle telemetry",
      details: [
        "Live G-Force readings",
        "Real-time impact detection",
        "Instant tilt angle monitoring",
        "Live speed tracking",
        "Continuous sensor data stream",
      ],
    },
    {
      id: "alcohol",
      title: "Alcohol Approval System",
      icon: "🍺",
      description: "Vehicle starts only after alcohol approval",
      details: [
        "Breathalyzer integration",
        "Engine lock until approval",
        "Driver identification system",
        "Automatic alcohol detection",
        "Compliance logging",
      ],
    },
    {
      id: "temperature",
      title: "Temperature Monitoring",
      icon: "🌡️",
      description: "Real-time temperature tracking",
      details: [
        "Engine temperature monitoring",
        "Cabin temperature control",
        "Overheat alerts",
        "Cooling system status",
        "Temperature trend analysis",
      ],
    },
    {
      id: "speed",
      title: "Speed Monitoring",
      icon: "⏱️",
      description: "Continuous speed tracking",
      details: [
        "Real-time speed display",
        "Speed limit alerts",
        "Overspeed notifications",
        "Speed history tracking",
        "Average speed analysis",
      ],
    },
    {
      id: "accident",
      title: "Accident Detection",
      icon: "🚨",
      description: "Instant crash detection & alerts",
      details: [
        "Impact force measurement",
        "Automatic emergency alerts",
        "Crash severity analysis",
        "GPS location sharing",
        "Emergency contact notification",
      ],
    },
    {
      id: "ucod",
      title: "UCOD Access System",
      icon: "🔑",
      description: "Secure access for authorized users",
      details: [
        "Unique device code per vehicle",
        "Owner access to all data",
        "Share access with family/fleet",
        "Anyone with UCOD can view live stream",
        "Multiple user permissions",
      ],
    },
    {
      id: "camera",
      title: "Live Camera Streaming",
      icon: "📹",
      description: "Dual camera real-time feed",
      details: [
        "External traffic camera",
        "Internal driver camera",
        "HD live streaming",
        "Cloud recording",
        "Anyone with UCOD can view",
      ],
    },
    {
      id: "alerts",
      title: "Email & Telegram Alerts",
      icon: "📧",
      description: "Instant notifications",
      details: [
        "Email alerts for critical events",
        "Telegram bot integration",
        "Push notifications",
        "SMS alerts",
        "Custom alert preferences",
      ],
    },
    {
      id: "path",
      title: "24/7 Path Monitoring",
      icon: "📍",
      description: "Complete journey history",
      details: [
        "24-hour route history",
        "Complete path playback",
        "Stop detection & duration",
        "Distance traveled tracking",
        "Route efficiency analysis",
      ],
    },
    {
      id: "uptime",
      title: "High Availability",
      icon: "⚡",
      description: "Enterprise-grade reliability",
      details: [
        "99.9% platform uptime",
        "Low latency data transmission",
        "Real-time updates",
        "Redundant infrastructure",
        "24/7 monitoring",
      ],
    },
  ];

  const highlights = [
    { icon: "🎯", label: "Real-time Alerts" },
    { icon: "📹", label: "Live Camera Stream" },
    { icon: "📍", label: "24/7 Path Tracking" },
    { icon: "⚡", label: "99.9% Uptime" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 relative bg-theme">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-semibold tracking-wide text-theme-secondary mb-6">
            Enterprise Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-theme mb-4">
            Everything You Need
          </h2>
          <p className="text-sm sm:text-base text-theme-secondary max-w-xl mx-auto leading-relaxed">
            Comprehensive vehicle safety and monitoring platform with
            enterprise-grade features built for every road scenario.
          </p>
        </div>

        {/* Live status bar */}
        <div className="glass-card flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 mb-12 border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-500 dark:text-emerald-400">
              LIVE SYSTEM ACTIVE
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-theme-secondary">
            <span>
              Uptime:{" "}
              <strong className="font-semibold text-cyan-600 dark:text-cyan-400">
                99.9%
              </strong>
            </span>
            <span>
              Latency:{" "}
              <strong className="font-semibold text-cyan-600 dark:text-cyan-400">
                &lt;100ms
              </strong>
            </span>
            <span>
              Accuracy:{" "}
              <strong className="font-semibold text-cyan-600 dark:text-cyan-400">
                High Precision
              </strong>
            </span>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-11">
          {coreFeatures.map((feature) => {
            const theme = FEATURE_COLORS[feature.id];
            const isHovered = hovered === feature.id;

            return (
              <div
                key={feature.id}
                className="glass-card relative overflow-hidden p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: isHovered ? `${theme.accent}55` : undefined,
                }}
                onMouseEnter={() => setHovered(feature.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ background: theme.grad }}
                />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border transition-transform duration-300"
                  style={{
                    borderColor: `${theme.accent}33`,
                    backgroundColor: `${theme.accent}12`,
                    transform: isHovered ? "scale(1.05) rotate(-2deg)" : undefined,
                  }}
                >
                  {feature.icon}
                </div>

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-base font-semibold text-theme">
                    {feature.title}
                  </h3>
                  <div className="flex gap-1 pt-1 shrink-0">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{
                          backgroundColor: theme.accent,
                          animationDelay: `${i * 300}ms`,
                          opacity: isHovered ? 1 : 0.35,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-theme-secondary mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.details.slice(0, 4).map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-theme"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{
                          backgroundColor: `${theme.accent}20`,
                          color: theme.accent,
                        }}
                      >
                        ✓
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left transition-transform duration-300 ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ background: theme.grad }}
                />
              </div>
            );
          })}
        </div>

        {/* UCOD banner */}
        <div className="text-center mb-11">
          <div className="inline-flex items-center gap-3 sm:gap-4 glass-card rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-indigo-400/30 dark:border-indigo-500/30">
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              🔑
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-theme">
                UCOD Access System
              </p>
              <p className="text-xs sm:text-sm text-theme-secondary mt-0.5">
                Owner or anyone with UCOD can view live stream, camera feeds
                &amp; vehicle data
              </p>
            </div>
          </div>
        </div>

        {/* Highlights row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="glass-card text-center px-4 py-5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-2xl mb-2" aria-hidden="true">
                {h.icon}
              </div>
              <p className="text-xs sm:text-sm font-medium text-theme-secondary">
                {h.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
