"use client";
import { useState, useEffect } from "react";
import photo from "../../public/img/Screenshot 2024-11-03 102710.png";

const FLOATING_NODES = [
  { x: 6, y: 10, size: 5, color: "#38bdf8", dur: 4.2, del: 0 },
  { x: 92, y: 8, size: 4, color: "#a855f7", dur: 3.8, del: 0.5 },
  { x: 88, y: 30, size: 6, color: "#22c55e", dur: 5.1, del: 1.0 },
  { x: 4, y: 50, size: 4, color: "#f97316", dur: 4.6, del: 0.3 },
  { x: 94, y: 65, size: 5, color: "#ec4899", dur: 3.5, del: 0.8 },
  { x: 10, y: 80, size: 3, color: "#22d3ee", dur: 4.9, del: 1.2 },
  { x: 85, y: 85, size: 4, color: "#f59e0b", dur: 4.1, del: 0.6 },
  { x: 50, y: 5, size: 3, color: "#818cf8", dur: 3.7, del: 0.9 },
];

const SKILLS = [
  { label: "Spring Boot", color: "#4ade80", icon: "🍃" },
  { label: "Java", color: "#f97316", icon: "☕" },
  { label: "React.js", color: "#38bdf8", icon: "⚛️" },
  { label: "Next.js", color: "#fff", icon: "▲" },
  { label: "MySQL", color: "#a855f7", icon: "🗄️" },
  { label: "REST APIs", color: "#ec4899", icon: "🔗" },
  { label: "IoT", color: "#22d3ee", icon: "📡" },
];

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-thodsare-475366289/",
    icon: "in",
    color: "#0ea5e9",
  },
  {
    label: "GitHub",
    href: "https://github.com/adityathodsare",
    icon: "gh",
    color: "#a855f7",
  },
  {
    label: "Email",
    href: "mailto:thodsareaditya@gmail.com",
    icon: "@",
    color: "#ec4899",
  },
];

const DETAILS = [
  { icon: "📍", label: "Location", value: "Pune / Pimpri-Chinchwad, India" },
  {
    icon: "🎓",
    label: "Education",
    value: "BE — Electronics & Telecom (2022–2026)",
  },
  { icon: "📱", label: "Phone", value: "+91 8263878470" },
  { icon: "✉️", label: "Email", value: "thodsareaditya@gmail.com" },
];

export default function CreatorSection() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("thodsareaditya@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="creator" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[900px] h-[600px] bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[500px] h-[500px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl -left-48 top-[10%]" />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -right-36 bottom-[10%]" />
      </div>

      {/* Floating nodes */}
      {mounted &&
        FLOATING_NODES.map((n, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full animate-bounce opacity-50 dark:opacity-70"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.size,
              height: n.size,
              background: n.color,
              boxShadow: `0 0 ${n.size * 4}px ${n.color}`,
              animationDuration: `${n.dur}s`,
              animationDelay: `${n.del}s`,
            }}
          />
        ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-theme-secondary uppercase">
              Developer Profile
            </span>
          </div>

          <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-2">
            About the Creator
          </p>
          <h2 className="section-heading">
            Meet <span className="bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Aditya</span>
          </h2>
        </div>

        {/* 2-column layout — stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,320px)_1fr] gap-6 lg:gap-7 items-start">
          {/* Left — Photo card */}
          <div className="glass-card overflow-hidden lg:sticky lg:top-7 rounded-2xl">
            <div className="relative w-full aspect-[4/5] overflow-hidden group">
              <img
                src={photo.src}
                alt="Aditya Thodsare"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-400 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5">
                <p className="text-lg font-extrabold text-white tracking-tight">
                  Aditya Thodsare
                </p>
                <p className="text-[10px] text-white/50 tracking-[0.15em] uppercase mt-0.5">
                  Full Stack Dev · IoT
                </p>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-sky-400 via-purple-500 to-orange-500" />

            <div className="flex gap-2 p-4 flex-wrap">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[76px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[11px] font-bold text-theme-secondary hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 hover:text-black"
                  style={{ "--link-color": l.color }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = l.color;
                    e.currentTarget.style.borderColor = l.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-black shrink-0"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.icon}
                  </span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* About card */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-3">
                Who Am I
              </p>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-theme mb-2">
                <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
                  Aditya
                </span>{" "}
                Thodsare
              </h3>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-semibold mb-4">
                ⚡ Full Stack Developer · IoT Enthusiast
              </span>
              <p className="text-sm leading-relaxed text-theme-secondary border-l-2 border-sky-500/30 pl-4">
                I&apos;m a passionate Full Stack Developer with expertise in
                building modern web applications. I craft efficient,
                user-centric solutions that bridge the gap between technology
                and business needs — with a deep passion for creating
                meaningful digital experiences using Spring Boot, React, and
                cutting-edge IoT innovation.
              </p>
            </div>

            {/* Personal details card */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-3">
                Personal Details
              </p>
              <div className="space-y-1">
                {DETAILS.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg border-b border-slate-100 dark:border-white/[0.04] last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-base shrink-0">
                      {d.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider uppercase text-theme-secondary mb-0.5">
                        {d.label}
                      </p>
                      <p className="text-sm font-semibold text-theme">
                        {d.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills card */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-sm font-bold text-theme transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default"
                    style={{
                      "--skill-color": s.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = s.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.icon} {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Developed by bar */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-theme-secondary mb-0.5">
                  Developed By
                </p>
                <p className="text-base font-extrabold tracking-tight text-theme">
                  <span className="text-sky-400">Aditya</span> Thodsare
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`ml-auto shrink-0 text-[10px] font-bold tracking-wider px-3.5 py-2 rounded-lg border transition-all duration-200 ${
                  copied
                    ? "text-emerald-500 border-emerald-500/40"
                    : "text-theme-secondary border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                {copied ? "✓ COPIED" : "COPY EMAIL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
