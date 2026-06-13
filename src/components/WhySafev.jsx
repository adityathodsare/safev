"use client";
import { useState, useEffect } from "react";

const ACCENT_LINES = [
  { x: 8, y: 12, w: 48, rot: 30, color: "#f97316" },
  { x: 85, y: 8, w: 36, rot: -20, color: "#22d3ee" },
  { x: 92, y: 35, w: 28, rot: 45, color: "#a855f7" },
  { x: 5, y: 55, w: 40, rot: -35, color: "#ec4899" },
  { x: 78, y: 60, w: 32, rot: 15, color: "#22c55e" },
  { x: 15, y: 80, w: 44, rot: 55, color: "#f59e0b" },
  { x: 88, y: 82, w: 30, rot: -50, color: "#3b82f6" },
  { x: 50, y: 5, w: 26, rot: 10, color: "#e11d48" },
  { x: 60, y: 92, w: 38, rot: -25, color: "#06b6d4" },
  { x: 3, y: 30, w: 22, rot: 70, color: "#84cc16" },
  { x: 95, y: 55, w: 20, rot: -60, color: "#f97316" },
  { x: 40, y: 88, w: 34, rot: 40, color: "#8b5cf6" },
];

export default function WhySafev() {
  const [activeTab, setActiveTab] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useCases = [
    {
      id: "school",
      title: "School Buses",
      emoji: "🚌",
      who: "School Admins & Parents",
      tagline: "Every child, accounted for.",
      why: "Parents need peace of mind, schools need accountability. SafeV bridges both with live tracking and instant boarding alerts.",
      accentColor: "#38bdf8",
      btnGradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
      features: [
        { icon: "📍", text: "Real-time bus tracking for parents" },
        { icon: "🔔", text: "Student boarding/alighting alerts" },
        { icon: "🗺️", text: "Route optimization for multiple trips" },
        { icon: "⚡", text: "Speed monitoring & geofencing" },
        { icon: "🆘", text: "Emergency button for drivers" },
      ],
    },
    {
      id: "travel",
      title: "Tours & Travels",
      emoji: "🚐",
      who: "Travel Companies & Tour Operators",
      tagline: "Your brand. Our safety tech.",
      why: "Stand out in a crowded market with a white-label SafeV dashboard under your own brand — customers see live tracking, you see peace of mind.",
      accentColor: "#a855f7",
      btnGradient: "linear-gradient(135deg,#7c3aed,#ec4899)",
      customizable: true,
      features: [
        { icon: "🎨", text: "Custom branded dashboard" },
        { icon: "📡", text: "Live vehicle tracking for customers" },
        { icon: "🛑", text: "Stop & route management" },
        { icon: "📊", text: "Driver behavior analytics" },
        { icon: "📋", text: "Automated trip reports" },
      ],
    },
    {
      id: "corporate",
      title: "Corporate Transport",
      emoji: "🚎",
      who: "HR & Operations Teams",
      tagline: "Get employees home safe, on time.",
      why: "Reduce liability, improve punctuality and give HR real-time visibility into every employee transport shift.",
      accentColor: "#22c55e",
      btnGradient: "linear-gradient(135deg,#16a34a,#0d9488)",
      features: [
        { icon: "👤", text: "Employee pickup/drop tracking" },
        { icon: "⏰", text: "Real-time ETA notifications" },
        { icon: "💺", text: "Capacity management" },
        { icon: "🔄", text: "Shift-based route planning" },
        { icon: "✅", text: "Safety compliance monitoring" },
      ],
    },
    {
      id: "public",
      title: "Public Transport",
      emoji: "🚍",
      who: "City Authorities & Transport Agencies",
      tagline: "Smarter cities move smarter.",
      why: "Modernize public transit with live arrivals, crowd management, and predictive maintenance — all in one dashboard.",
      accentColor: "#f97316",
      btnGradient: "linear-gradient(135deg,#ea580c,#dc2626)",
      features: [
        { icon: "🕐", text: "Live arrival predictions" },
        { icon: "👥", text: "Crowd density monitoring" },
        { icon: "🔧", text: "Maintenance alerts" },
        { icon: "📈", text: "Route efficiency analytics" },
        { icon: "🔢", text: "Passenger counting system" },
      ],
    },
    {
      id: "logistics",
      title: "Logistics & Fleet",
      emoji: "🚛",
      who: "Fleet Managers & Logistics Companies",
      tagline: "Deliver more. Spend less.",
      why: "Cut fuel costs, prevent cargo theft, and score every driver so your fleet runs at peak efficiency every single day.",
      accentColor: "#818cf8",
      btnGradient: "linear-gradient(135deg,#4f46e5,#2563eb)",
      features: [
        { icon: "📦", text: "Real-time cargo tracking" },
        { icon: "🗺️", text: "Delivery route optimization" },
        { icon: "⛽", text: "Fuel efficiency monitoring" },
        { icon: "🏆", text: "Driver performance scoring" },
        { icon: "🔩", text: "Maintenance scheduling" },
      ],
    },
    {
      id: "personal",
      title: "Personal Vehicles",
      emoji: "🚙",
      who: "Families & Individual Car Owners",
      tagline: "Protect what matters most.",
      why: "Know where your loved ones are, detect drunk driving before it happens, and respond instantly to any emergency.",
      accentColor: "#22d3ee",
      btnGradient: "linear-gradient(135deg,#0891b2,#7c3aed)",
      features: [
        { icon: "📍", text: "Real-time GPS tracking" },
        { icon: "🍺", text: "Alcohol detection system" },
        { icon: "🔄", text: "Rollover protection" },
        { icon: "🆘", text: "Accident alerts to contacts" },
        { icon: "🧠", text: "Driving behavior insights" },
      ],
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime", color: "#22d3ee" },
    { value: "<2s", label: "Alert Delay", color: "#a855f7" },
    { value: "24/7", label: "Monitoring", color: "#22c55e" },
    { value: "1000+", label: "Devices", color: "#f97316" },
  ];

  const activeCase = useCases.find((c) => c.id === activeTab);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[700px] h-[500px] bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-3xl left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl -left-24 top-[20%]" />
      </div>

      {/* Floating accent dashes */}
      {mounted &&
        ACCENT_LINES.map((d, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-sm opacity-40 dark:opacity-90 animate-bounce"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.w,
              height: 4,
              background: d.color,
              transform: `rotate(${d.rot}deg)`,
              animationDuration: `${3.5 + (i % 3) * 0.9}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6">
            <span className="text-sm font-semibold text-theme">
              🛡️ IoT-Powered Vehicle Safety
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-theme leading-tight mb-4">
            Who Can Use SafeV?
            <br />
            <span className="text-theme-secondary">
              Find Your Use Case.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-theme-secondary mb-10">
            Real-time accident detection <span className="mx-2 opacity-40">•</span>
            GPS tracking <span className="mx-2 opacity-40">•</span>
            Alcohol monitoring <span className="mx-2 opacity-40">•</span>
            Emergency alerts
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 justify-center">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-card px-6 py-4 text-center min-w-[110px] hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-theme-secondary font-medium mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-2">
            Select your vehicle type
          </p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-theme">
            Built for every kind of journey
          </h3>
        </div>

        {/* Use case cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {useCases.map((uc) => {
            const isActive = activeTab === uc.id;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setActiveTab(isActive ? null : uc.id)}
                className={`group glass-card p-5 sm:p-6 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                  isActive ? "shadow-xl scale-[1.01]" : ""
                }`}
                style={{
                  borderColor: isActive ? uc.accentColor : undefined,
                  boxShadow: isActive
                    ? `0 0 0 1px ${uc.accentColor}, 0 16px 40px rgba(0,0,0,0.25)`
                    : undefined,
                }}
              >
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{ backgroundColor: uc.accentColor }}
                />

                <span className="text-4xl block mb-3">{uc.emoji}</span>

                {uc.customizable && (
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 mb-2">
                    ✨ White-label
                  </span>
                )}

                <div className="text-base font-extrabold text-theme mb-1">
                  {uc.title}
                </div>
                <div className="text-xs text-theme-secondary font-medium mb-2">
                  👤 {uc.who}
                </div>
                <div className="text-sm text-theme-secondary italic leading-relaxed mb-3">
                  &ldquo;{uc.tagline}&rdquo;
                </div>

                <span
                  className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border transition-all duration-200 group-hover:text-black"
                  style={{
                    borderColor: uc.accentColor,
                    color: isActive ? "#000" : uc.accentColor,
                    backgroundColor: isActive ? uc.accentColor : "transparent",
                  }}
                >
                  {isActive ? "▲ Close" : "Learn more →"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion detail panel */}
        {activeCase && (
          <div
            key={activeCase.id}
            className="glass-card overflow-hidden mb-12 animate-fade-in-up shadow-2xl"
          >
            <div
              className="h-1"
              style={{ background: activeCase.btnGradient }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left panel */}
              <div className="p-6 sm:p-8 md:border-r border-slate-200 dark:border-white/10">
                <span className="text-6xl block mb-4 animate-bounce [animation-duration:2.5s]">
                  {activeCase.emoji}
                </span>
                <h4
                  className="text-2xl sm:text-3xl font-black tracking-tight mb-1"
                  style={{ color: activeCase.accentColor }}
                >
                  {activeCase.title}
                </h4>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-theme-secondary mt-3 mb-1">
                  Built for
                </p>
                <p className="text-sm text-theme mb-5">
                  {activeCase.who}
                </p>
                <div
                  className="border-l-[3px] pl-4 py-3 rounded-r-xl bg-slate-50/80 dark:bg-white/[0.03]"
                  style={{ borderColor: activeCase.accentColor }}
                >
                  <p
                    className="text-[10px] font-extrabold tracking-[0.2em] uppercase mb-2"
                    style={{ color: activeCase.accentColor }}
                  >
                    Why SafeV?
                  </p>
                  <p className="text-sm leading-relaxed text-theme-secondary">
                    {activeCase.why}
                  </p>
                </div>
              </div>

              {/* Right panel — features */}
              <div className="p-6 sm:p-8">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-theme-secondary mb-4">
                  Key Features
                </p>
                <div className="space-y-2">
                  {activeCase.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 glass-card rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-lg shrink-0">
                        {f.icon}
                      </div>
                      <span className="text-sm text-theme">
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="border-t border-slate-200 dark:border-white/10 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <div>
                  <p className="text-xs font-bold text-emerald-500 tracking-wider">
                    LIVE MONITORING
                  </p>
                  <p className="text-[11px] text-theme-secondary">
                    Active 24/7 for {activeCase.title}
                  </p>
                </div>
              </div>

              <div className="flex items-end gap-1">
                {[10, 16, 12, 20, 14, 18, 10, 22].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-sm animate-pulse"
                    style={{
                      height: h,
                      backgroundColor: activeCase.accentColor,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="text-sm font-semibold px-5 py-2 rounded-lg border border-slate-200 dark:border-white/15 text-theme-secondary hover:bg-slate-100 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-all duration-200"
              >
                Close ✕
              </button>
            </div>
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />
      </div>
    </section>
  );
}
