"use client";
import { useState } from "react";

const steps = [
  {
    id: 1,
    label: "Find UCOD",
    title: "Locate Your UCOD",
    desc: "Your UCOD (Unique Code) is the gateway to your SafeV device. Find this 6-character alphanumeric code printed on the back of your device and on the product box.",
    detail:
      "Format: 6 characters — alphanumeric (e.g. SAFEV1, TRK002, MTR003). This code is unique to your specific hardware kit.",
    tip: "Take a photo of the UCOD label before installing the device in your vehicle for easy reference later.",
    visual: "ucod",
    accent: "#7C3AED",
  },
  {
    id: 2,
    label: "Connect Kit",
    title: "Connect to Your Vehicle",
    desc: "Plug the SafeV hardware kit into your vehicle using the included cable. The device supports both USB-C and Micro-USB connections and powers on automatically.",
    detail:
      "Compatible: OBD-II port or USB power (2010+ vehicles). Blue LED = powered on. Blinking LED = transmitting data.",
    tip: "Make sure the cable is fully seated. A secure connection means reliable real-time data.",
    visual: "connect",
    accent: "#0D9488",
  },
  {
    id: 3,
    label: "Cameras",
    title: "Activate Cameras",
    desc: "Once powered, the internal driver-monitoring camera and external traffic camera auto-activate. A green indicator confirms both feeds are live and streaming.",
    detail:
      "External: Road & traffic monitoring (HD wide-angle). Internal: AI driver behavior analysis. Both stream to your dashboard in real-time.",
    tip: "Position the device on the dashboard for the best field of view — clear road ahead and driver visibility.",
    visual: "cameras",
    accent: "#EA580C",
  },
  {
    id: 4,
    label: "Enter UCOD",
    title: "Enter Your UCOD",
    desc: "Click the 'Track Device' button on the SafeV app or website, enter your UCOD, and your live vehicle dashboard activates instantly.",
    detail:
      "Access unlocked: Real-time GPS tracking, alcohol detection alerts, rollover monitoring, 24-hour history, and live camera feeds.",
    tip: "Bookmark the tracking page with your UCOD pre-filled for instant future access.",
    visual: "track",
    accent: "#7C3AED",
  },
  {
    id: 5,
    label: "Monitor",
    title: "Monitor All Systems",
    desc: "Your full SafeV dashboard is now live — all three safety modules are active, GPS is tracking, and alerts are enabled. You're fully protected.",
    detail:
      "G-Force ±2g · Impact ±5m/s² · Tilt ±45° · Alcohol threshold 2300 ppm · GPS precision to 3 metres · 24h route history.",
    tip: "Enable browser or app notifications for instant critical alerts — even when the tab is in the background.",
    visual: "dashboard",
    accent: "#0D9488",
  },
];

// ── Visuals ──────────────────────────────────────────────────────────────────

function UcodVisual() {
  return (
    <div className="w-full text-center">
      <div className="border-[1.5px] border-dashed border-amber-400/40 dark:border-amber-400/40 rounded-2xl p-6 bg-amber-400/5 dark:bg-amber-400/5 mb-4">
        <div className="text-[11px] font-mono text-theme-secondary tracking-[0.15em] uppercase mb-2.5">
          Device UCOD
        </div>
        <div className="inline-block bg-amber-400/15 border border-amber-400/30 rounded-md px-2.5 py-0.5 text-[10px] text-amber-500 dark:text-amber-400 font-mono mb-3.5">
          UNIQUE IDENTIFIER
        </div>
        <div className="text-4xl font-extrabold text-amber-500 dark:text-amber-400 font-mono tracking-[0.18em] animate-ucod-glow">
          SAFEV1
        </div>
        <div className="text-[11px] text-theme-secondary mt-3">
          📍 Printed on the back of your device &amp; box
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {["TRK002", "MTR003", "SAFEV1"].map((c) => (
          <span
            key={c}
            className="font-mono text-[11px] text-theme-secondary bg-slate-100 dark:bg-white/5 rounded px-2 py-0.5 border border-slate-200 dark:border-white/10"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 font-mono">
        Example UCODs — yours will be unique
      </div>
    </div>
  );
}

function ConnectVisual() {
  return (
    <div className="w-full text-center">
      <div className="relative w-[130px] h-[82px] bg-gradient-to-br from-slate-700 to-slate-900 dark:from-[#1a2235] dark:to-[#0f1420] rounded-xl border-[1.5px] border-slate-300/30 dark:border-white/12 mx-auto mb-2 flex items-center justify-center shadow-xl">
        <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-teal-600 shadow-[0_0_12px_rgba(13,148,136,0.9)] animate-pulse" />
        <div className="text-[10px] font-mono text-theme-secondary tracking-wider">
          SAFEV KIT
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] bg-amber-400/15 border border-amber-400/30 text-amber-500 dark:text-amber-400 px-2 py-0.5 rounded whitespace-nowrap">
          SAFEV1
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-6">
        {[
          { label: "USB-C", delay: "0s" },
          { label: "Micro-USB", delay: "0.4s" },
        ].map(({ label, delay }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="w-0.5 h-[22px] bg-gradient-to-b from-teal-600 to-transparent rounded-sm animate-cable-pulse"
              style={{ animationDelay: delay }}
            />
            <div className="w-[30px] h-[15px] rounded border-[1.5px] border-slate-300/30 dark:border-white/15 bg-slate-100 dark:bg-white/5" />
            <div className="text-[10px] font-mono text-theme-secondary">
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          {
            label: "POWER LED",
            sub: "Solid blue = on",
            color: "#7C3AED",
            bg: "rgba(124,58,237,0.08)",
          },
          {
            label: "DATA LED",
            sub: "Blinks = active",
            color: "#0D9488",
            bg: "rgba(13,148,136,0.08)",
          },
        ].map(({ label, sub, color, bg }) => (
          <div
            key={label}
            className="rounded-lg p-2 text-center"
            style={{
              background: bg,
              border: `1px solid ${color}33`,
            }}
          >
            <div
              className="text-[9px] font-mono tracking-wider"
              style={{ color }}
            >
              {label}
            </div>
            <div className="text-[9px] text-theme-secondary mt-0.5">
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CamerasVisual() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { title: "External", sub: "Traffic Monitor", delay: "0s" },
          { title: "Internal", sub: "Driver Monitor", delay: "0.6s" },
        ].map(({ title, sub, delay }) => (
          <div
            key={title}
            className="glass-card rounded-xl p-4 text-center"
          >
            <div className="w-[42px] h-8 rounded-md bg-slate-800 dark:bg-[#0f1420] border border-slate-200 dark:border-white/10 mx-auto mb-2 flex items-center justify-center">
              <div className="w-[11px] h-[11px] rounded-full bg-slate-900 dark:bg-[#0a0f1a] border-[1.5px] border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="text-xs font-bold text-text-primary-light dark:text-slate-200">
              {title}
            </div>
            <div className="text-[10px] text-theme-secondary mt-0.5">
              {sub}
            </div>
            <div className="text-[10px] font-mono text-green-500 mt-1.5">
              ● LIVE
            </div>
            <div className="h-0.5 bg-green-500/10 rounded mt-2 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded animate-scan-bar"
                style={{ animationDelay: delay }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-500/5 border border-green-500/15 rounded-[10px] px-3.5 py-2.5 text-center">
        <div className="text-[11px] text-green-500 font-mono tracking-wider">
          AI MONITORING ACTIVE
        </div>
        <div className="text-[10px] text-theme-secondary mt-0.5">
          Real-time HD streaming enabled
        </div>
      </div>
    </div>
  );
}

function TrackVisual() {
  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-600/15 border border-violet-600/30 mb-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </div>
        <div className="text-[11px] text-theme-secondary font-mono tracking-wider">
          TRACK DEVICE
        </div>
      </div>
      <div className="bg-slate-100/80 dark:bg-black/40 border border-violet-600/20 rounded-2xl p-5">
        <div className="text-[10px] font-mono text-theme-secondary uppercase tracking-widest mb-2">
          Device UCOD
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value="SAFEV1"
            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[10px] px-3.5 py-2.5 text-violet-500 dark:text-violet-400 font-mono text-base font-bold tracking-[0.15em] outline-none"
          />
          <button
            type="button"
            className="bg-gradient-to-br from-violet-600 to-violet-800 border-none rounded-[10px] px-4 py-2.5 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            Track →
          </button>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-ping" />
          UCOD found on back of device
        </div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const metrics = [
    { icon: "⚗️", val: "0.0", key: "Alcohol ppm", status: "NORMAL" },
    { icon: "📡", val: "0.98g", key: "G-Force", status: "SAFE" },
    { icon: "🌡", val: "25°C", key: "Temp", status: "NORMAL" },
    { icon: "📐", val: "−4.6°", key: "Tilt Angle", status: "STABLE" },
    { icon: "🔥", val: "0", key: "Fire Status", status: "CLEAR" },
    { icon: "⚙️", val: "ON", key: "Engine", status: "ALLOWED" },
  ];
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        {metrics.map(({ icon, val, key, status }) => (
          <div
            key={key}
            className="glass-card rounded-[10px] px-1.5 py-2.5 text-center"
          >
            <div className="text-[15px] mb-0.5">{icon}</div>
            <div className="font-mono text-xs font-bold text-text-primary-light dark:text-slate-100">
              {val}
            </div>
            <div className="text-[9px] text-theme-secondary mt-px">
              {key}
            </div>
            <div className="text-[9px] text-green-500 mt-0.5">{status}</div>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-[10px] px-3 py-2.5 flex items-center gap-2.5">
        <div className="relative w-2.5 h-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-teal-600 animate-ping opacity-75" />
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-teal-600" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-mono text-theme-secondary uppercase tracking-wider">
            GPS Location
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking active
          </div>
        </div>
        <div className="text-[9px] font-mono text-green-500 bg-green-500/10 border border-green-500/20 rounded px-1.5 py-0.5">
          LIVE
        </div>
      </div>
    </div>
  );
}

function StepVisual({ visual }) {
  if (visual === "ucod") return <UcodVisual />;
  if (visual === "connect") return <ConnectVisual />;
  if (visual === "cameras") return <CamerasVisual />;
  if (visual === "track") return <TrackVisual />;
  if (visual === "dashboard") return <DashboardVisual />;
  return null;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HowToUseGuide() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (i) => {
    setCurrent(i);
    setAnimKey((k) => k + 1);
  };
  const prev = () => current > 0 && goTo(current - 1);
  const next = () => current < steps.length - 1 && goTo(current + 1);

  const s = steps[current];
  const pct = Math.round(((current + 1) / steps.length) * 100);

  return (
    <section className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-14">
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs sm:text-sm font-semibold text-text-primary-light dark:text-text-secondary-dark">
            IoT-Powered Vehicle Safety
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold text-text-primary-light dark:text-white leading-tight tracking-tight mb-3.5">
          How to Use{" "}
          <span className="bg-gradient-to-br from-violet-600 to-teal-600 bg-clip-text text-transparent">
            SAFEV
          </span>
        </h2>

        <p className="text-sm sm:text-base text-theme-secondary max-w-lg mx-auto leading-relaxed">
          Real-time accident detection • GPS tracking • Alcohol monitoring •
          Emergency alerts
        </p>
      </div>

      {/* Step Navigator */}
      <div className="flex justify-center items-start mb-8 sm:mb-9">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            {i > 0 && (
              <div
                className={`w-11 h-0.5 -mt-5 transition-colors duration-400 ${
                  i > current ? "bg-slate-200 dark:bg-white/8" : ""
                }`}
                style={
                  i <= current
                    ? {
                        background: `linear-gradient(90deg, ${steps[i - 1].accent}, ${step.accent})`,
                      }
                    : undefined
                }
              />
            )}
            <button
              type="button"
              onClick={() => goTo(i)}
              className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 px-0.5 transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-300"
                style={{
                  border:
                    i === current
                      ? `2px solid ${step.accent}`
                      : i < current
                        ? "2px solid rgba(148,163,184,0.4)"
                        : "2px solid rgba(148,163,184,0.15)",
                  color:
                    i === current
                      ? step.accent
                      : i < current
                        ? "#94a3b8"
                        : "#64748b",
                  background:
                    i === current
                      ? `${step.accent}18`
                      : "rgba(148,163,184,0.08)",
                  boxShadow:
                    i === current ? `0 0 18px ${step.accent}44` : "none",
                }}
              >
                {i < current ? "✓" : String(i + 1).padStart(2, "0")}
              </div>
              <div
                className={`hidden sm:block text-[10px] font-semibold text-center max-w-[60px] leading-snug transition-colors duration-300 ${
                  i === current
                    ? "text-text-primary-light dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {step.label}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Step Card */}
      <div
        key={animKey}
        className="glass-card grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center rounded-[20px] p-7 sm:p-9 relative overflow-hidden animate-fade-in-up shadow-2xl"
        style={{
          borderTop: `2px solid ${s.accent}`,
          boxShadow: `0 0 60px ${s.accent}18`,
        }}
      >
        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${s.accent}12 0%, transparent 70%)`,
          }}
        />

        {/* Visual pane */}
        <div className="relative bg-slate-100/60 dark:bg-black/45 border border-slate-200 dark:border-white/7 rounded-2xl p-7 min-h-[270px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${s.accent}0a 0%, transparent 65%)`,
            }}
          />
          <StepVisual visual={s.visual} />
        </div>

        {/* Text pane */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <div
              className="text-[10px] font-mono tracking-[0.12em] font-bold"
              style={{ color: s.accent }}
            >
              STEP {String(s.id).padStart(2, "0")}
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: `${s.accent}30` }}
            />
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-text-primary-light dark:text-white leading-tight tracking-tight mb-3.5">
            {s.title}
          </h3>

          <p className="text-sm text-theme-secondary leading-relaxed mb-5">
            {s.desc}
          </p>

          {/* Detail box */}
          <div
            className="glass-card rounded-r-[10px] rounded-l-none border-l-2 px-4 py-3 mb-3.5"
            style={{ borderLeftColor: s.accent }}
          >
            <div
              className="text-[9px] font-mono uppercase tracking-[0.12em] mb-1.5 font-bold"
              style={{ color: s.accent }}
            >
              Details
            </div>
            <div className="text-xs text-theme-secondary leading-relaxed">
              {s.detail}
            </div>
          </div>

          {/* Tip */}
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-[10px] px-3.5 py-2.5 text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-5">
            <span className="text-amber-500 dark:text-amber-400 font-bold">
              💡 Tip:{" "}
            </span>
            {s.tip}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-600 font-mono mb-1.5">
              <span>Setup progress</span>
              <span style={{ color: s.accent }}>
                {current + 1} / {steps.length}
              </span>
            </div>
            <div className="h-1 bg-slate-200 dark:bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, #7C3AED, ${s.accent})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="glass-card px-6 py-3 text-sm font-bold text-theme-secondary rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-slate-100 dark:enabled:hover:bg-white/10 enabled:hover:text-text-primary-light dark:enabled:hover:text-slate-300"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={next}
          disabled={current === steps.length - 1}
          className="px-7 py-3 text-sm font-bold text-white rounded-xl transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${s.accent}ee, ${s.accent}99)`,
          }}
        >
          Next →
        </button>
      </div>

      {/* Quick Start Strip */}
      <div className="glass-card mt-8 sm:mt-9 rounded-2xl px-6 sm:px-7 py-5 sm:py-6 flex items-center justify-between gap-5 flex-wrap">
        <div>
          <div className="text-[15px] font-extrabold text-text-primary-light dark:text-white mb-0.5">
            Quick Reference
          </div>
          <div className="text-xs text-theme-secondary">
            Five steps, under 5 minutes
          </div>
        </div>

        <div className="hidden md:flex gap-1.5 items-center">
          {["UCOD", "Connect", "Camera", "Track", "Monitor"].map(
            (label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-slate-300 dark:text-slate-700 text-[13px]">
                    →
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-theme-secondary font-mono">
                  <div
                    className="w-[22px] h-[22px] rounded-full glass-card flex items-center justify-center text-[10px] font-extrabold"
                    style={{ color: steps[i].accent }}
                  >
                    {i + 1}
                  </div>
                  {label}
                </div>
              </div>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => goTo(0)}
          className="bg-gradient-to-br from-teal-600 to-teal-800 border-none rounded-xl px-6 py-3 text-white text-sm font-bold cursor-pointer whitespace-nowrap transition-all duration-200 hover:brightness-110 hover:-translate-y-px flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Start Setup
        </button>
      </div>
    </section>
  );
}
