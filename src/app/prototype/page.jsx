"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer";
import {
  Cpu,
  Activity,
  Flame,
  MapPin,
  Radio,
  Send,
  Video,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function PrototypePage() {
  const videoRef = useRef(null);
  const { ref: observerRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  const hardwareSpecs = [
    {
      icon: Cpu,
      title: "ESP32 Microcontroller",
      spec: "Dual-Core 240MHz",
      description: "Handles fast sensor loop processing and secure Wi-Fi/GSM cloud telemetry dispatch.",
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    },
    {
      icon: Activity,
      title: "MPU6050 Accelerometer / Gyro",
      spec: "6-DOF Motion Sensor",
      description: "Measures tri-axial acceleration and rotational velocity to detect sudden impacts or vehicle rollovers.",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      icon: Flame,
      title: "MQ-3 & Gas Sensor",
      spec: "Substance Analysis",
      description: "Continuously checks cabin air for alcohol vapors and hazardous gas leaks prior to vehicle ignition.",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      icon: MapPin,
      title: "NEO-6M GPS Module",
      spec: "5Hz Location Mapping",
      description: "Captures precise latitude & longitude coordinates during crash events for rapid location sharing.",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Radio,
      title: "SIM800L GSM Unit",
      spec: "Quad-Band Cellular",
      description: "Ensures emergency SMS alerts and live call requests function even without local Wi-Fi connectivity.",
      color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
    },
    {
      icon: Send,
      title: "Cloud & Bot Gateway",
      spec: "<1s Incident Broadcast",
      description: "Triggers instant Telegram bot notifications and email dispatch to predefined emergency personnel.",
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
    },
  ];

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col bg-theme text-theme">
      {/* 🚀 Hero Section */}
      <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 px-4 max-w-7xl mx-auto w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-theme mb-6 shadow-sm">
          <Image
            src="/logo.png"
            alt="SAFEV Logo"
            width={22}
            height={22}
            className="h-5 w-auto object-contain"
          />
          <span className="text-xs sm:text-sm text-theme-secondary font-medium tracking-wide uppercase">
            Hardware Prototype Demonstration
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
          SAFEV IoT Hardware Prototype
        </h1>

        <p className="text-theme-secondary max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
          Explore the physical circuitry, sensor modules, dual-core processing unit, and cloud communication pathways powering SAFEV&apos;s real-time accident detection and driver safety system.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={scrollToVideo}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Video className="w-5 h-5" />
            <span>Watch Demonstration Video</span>
          </button>
          <a
            href="/tracking"
            className="px-6 py-3 rounded-xl glass-card border border-theme hover:bg-theme-muted transition-all font-semibold flex items-center gap-2 text-theme cursor-pointer"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Live Data Track</span>
          </a>
        </div>
      </section>

      {/* 🎥 Video Section ("Watch How It Works") */}
      <section
        ref={videoRef}
        className="py-12 px-4 max-w-5xl mx-auto w-full relative z-10"
      >
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 dark:bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold mb-3">
              <Video className="w-3.5 h-3.5" />
              <span>Video Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-theme mb-3">
              Watch How SAFEV Works in Action
            </h2>
            <p className="text-theme-secondary text-sm sm:text-base max-w-xl mx-auto">
              See live sensor detection, impact thresholds, and instant Telegram crisis dispatch demonstrated in real-time.
            </p>
          </div>

          <div
            ref={observerRef}
            className="w-full relative rounded-2xl overflow-hidden border border-slate-300 dark:border-white/15 shadow-2xl bg-black aspect-video"
          >
            {inView && (
              <iframe
                src="https://www.youtube.com/embed/9gR1c8AmzTk?si=RrnOkhwgBYE3sD8f"
                title="SAFEV Hardware Prototype Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl"
                style={{ border: "none" }}
              />
            )}
          </div>
        </div>
      </section>

      {/* 🛠 Hardware Specs & Architecture Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Hardware Components
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-theme mb-4">
            Under the Hood: Smart Sensor Architecture
          </h2>
          <p className="text-theme-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Every component in the SAFEV prototype is selected for low latency, industrial stability, and real-time emergency responsiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {hardwareSpecs.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-lg group relative overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-theme-muted text-theme-secondary font-semibold border border-theme inline-block mb-3">
                  {item.spec}
                </span>
                <h3 className="text-xl font-bold text-theme mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-theme-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 Footer Component */}
      <Footer />
    </div>
  );
}
