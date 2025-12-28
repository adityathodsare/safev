"use client";

import React from "react";
import {
  FaMapMarkerAlt,
  FaCamera,
  FaWineBottle,
  FaUsers,
  FaWeightHanging,
  FaShieldAlt,
  FaCarCrash,
  FaMobileAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Live GPS Tracking",
    description:
      "Real-time vehicle location monitoring with interactive maps for safety and optimized routing.",
    badge: "Navigation",
    color:
      "border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:shadow-[0_0_30px_-4px_rgba(16,185,129,0.8)]",
  },
  {
    icon: <FaCamera />,
    title: "Driver Monitoring",
    description:
      "AI-powered camera system detects driver fatigue and distraction in real-time.",
    badge: "AI Vision",
    color:
      "border-cyan-400/30 hover:border-cyan-400 text-cyan-400 hover:shadow-[0_0_30px_-4px_rgba(34,211,238,0.8)]",
  },
  {
    icon: <FaWineBottle />,
    title: "Alcohol Detection",
    description:
      "Breath analysis system prevents ignition if alcohol levels exceed safety limits.",
    badge: "Safety",
    color:
      "border-rose-500/30 hover:border-rose-500 text-rose-400 hover:shadow-[0_0_30px_-4px_rgba(244,63,94,0.8)]",
  },
  {
    icon: <FaUsers />,
    title: "Passenger Count",
    description:
      "Smart sensors ensure compliance with maximum seating capacity regulations.",
    badge: "Compliance",
    color:
      "border-amber-400/30 hover:border-amber-400 text-amber-400 hover:shadow-[0_0_30px_-4px_rgba(234,179,8,0.8)]",
  },
  {
    icon: <FaWeightHanging />,
    title: "Load Monitoring",
    description:
      "Precision weight sensors prevent dangerous overload conditions.",
    badge: "Smart Sensors",
    color:
      "border-purple-500/30 hover:border-purple-500 text-purple-400 hover:shadow-[0_0_30px_-4px_rgba(168,85,247,0.8)]",
  },
  {
    icon: <FaShieldAlt />,
    title: "Collision Prevention",
    description:
      "Advanced radar system warns of potential impacts with automatic braking.",
    badge: "Active Safety",
    color:
      "border-blue-500/30 hover:border-blue-500 text-blue-400 hover:shadow-[0_0_30px_-4px_rgba(59,130,246,0.8)]",
  },
  {
    icon: <FaCarCrash />,
    title: "Emergency Response",
    description:
      "Automatic crash detection with instant emergency services notification.",
    badge: "Critical Alert",
    color:
      "border-red-500/30 hover:border-red-500 text-red-400 hover:shadow-[0_0_30px_-4px_rgba(239,68,68,0.8)]",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Application",
    description:
      "User-friendly mobile app to monitor vehicle health, location, and emergency alerts on the go.",
    badge: "Mobile App",
    color:
      "border-yellow-400/30 hover:border-yellow-400 text-yellow-300 hover:shadow-[0_0_30px_-4px_rgba(251,191,36,0.8)]",
  },
];

export default function UpcomingFeatures() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
            Coming Soon
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Features
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Advanced safety and intelligence upgrades coming soon to SAFEV.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative bg-[#0b0b0b] p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${feature.color}`}
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-400">
                {feature.badge}
              </span>

              {/* Icon */}
              <div className="mb-5 text-4xl">{feature.icon}</div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500 flex justify-between">
                <span>In Development</span>
                <span>SAFEV</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Want to stay updated on new features?
          </p>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all hover:scale-105">
            Subscribe to Updates
          </button>
        </div>
      </div>
    </section>
  );
}
