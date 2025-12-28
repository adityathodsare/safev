"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

// Importing React Icons
import { FaCarCrash } from "react-icons/fa";
import { WiThermometer } from "react-icons/wi";
import { GiGasMask, GiBeerBottle } from "react-icons/gi";
import { MdMinorCrash } from "react-icons/md";

const projectFeatures = [
  {
    title: "Accident Detection & Alert System",
    description:
      "Our advanced system uses high-precision gyroscope and accelerometer sensors to detect accidents instantly. When a crash is detected, SAFEV automatically sends immediate alerts via Telegram and email to emergency contacts, family members, and nearby hospitals. This ensures rapid emergency response and helps save lives by notifying the right people in real time, even if the driver is unconscious.",
    content: (
      <div className="flex flex-col justify-center items-center h-full text-purple-500 relative">
        <div className="absolute inset-0 bg-purple-500/5 rounded-2xl blur-3xl" />
        <FaCarCrash size={100} className="animate-pulse relative z-10" />
        <p className="text-sm text-purple-400 mt-4 font-semibold">
          Real-time Detection
        </p>
      </div>
    ),
  },
  {
    title: "Real-time Temperature Monitoring",
    description:
      "The system continuously monitors the vehicle's internal temperature using DHT sensors to prevent overheating risks and potential fire hazards. If the temperature exceeds safe thresholds (above 60°C), the system triggers immediate alerts to inform the driver, vehicle owner, and emergency services. This feature is especially critical for preventing battery fires in electric vehicles and engine overheating in conventional vehicles.",
    content: (
      <div className="flex flex-col justify-center items-center h-full text-red-500 relative">
        <div className="absolute inset-0 bg-red-500/5 rounded-2xl blur-3xl" />
        <WiThermometer size={100} className="animate-bounce relative z-10" />
        <p className="text-sm text-red-400 mt-4 font-semibold">
          Temperature Safety
        </p>
      </div>
    ),
  },
  {
    title: "Driver Alcohol Detection",
    description:
      "Our integrated MQ-3 alcohol sensor detects alcohol levels in the driver's breath before starting the vehicle. If alcohol is detected above the legal limit (BAC > 0.05%), the vehicle's ignition system is automatically disabled, preventing drunk driving. An immediate alert is sent to registered emergency contacts with GPS location. This feature significantly reduces alcohol-related accidents and promotes responsible driving.",
    content: (
      <div className="flex flex-col justify-center items-center h-full text-yellow-500 relative">
        <div className="absolute inset-0 bg-yellow-500/5 rounded-2xl blur-3xl" />
        <GiBeerBottle size={100} className="animate-pulse relative z-10" />
        <p className="text-sm text-yellow-400 mt-4 font-semibold">
          Prevent Drunk Driving
        </p>
      </div>
    ),
  },
  {
    title: "Gas Leak Detection & Safety Alerts",
    description:
      "Gas leaks inside the vehicle are detected using highly sensitive MQ-2 and MQ-5 sensors that monitor for LPG, CNG, and other combustible gases. If a leak is identified, the system immediately sends alerts via Telegram, email, and SMS to ensure quick action and prevent potential explosions or fire hazards. The system can also trigger automatic ventilation or engine shutdown for maximum safety.",
    content: (
      <div className="flex flex-col justify-center items-center h-full text-red-500 relative">
        <div className="absolute inset-0 bg-red-500/5 rounded-2xl blur-3xl" />
        <GiGasMask size={100} className="animate-pulse relative z-10" />
        <p className="text-sm text-red-400 mt-4 font-semibold">
          Gas Safety Monitor
        </p>
      </div>
    ),
  },
  {
    title: "Crash Impact Analysis",
    description:
      "The system uses advanced MPU-6050 gyroscopic and acceleration sensors to analyze crash impact data in real-time. It measures the severity of collisions by detecting sudden changes in velocity, orientation, and G-forces. Based on impact severity (minor, moderate, or severe), different emergency protocols are activated. Emergency contacts and nearby hospitals are notified instantly with precise GPS coordinates, crash severity details, and vehicle information for necessary medical intervention.",
    content: (
      <div className="flex flex-col justify-center items-center h-full text-red-500 relative">
        <div className="absolute inset-0 bg-red-500/5 rounded-2xl blur-3xl" />
        <MdMinorCrash size={100} className="animate-bounce relative z-10" />
        <p className="text-sm text-red-400 mt-4 font-semibold">
          Impact Analysis
        </p>
      </div>
    ),
  },
];

function WhyChooseUs() {
  return (
    <div className="bg-black py-16">
      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <svg
            className="w-4 h-4 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm text-purple-300 font-medium">
            Core Features
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Why Choose{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            SAFEV
          </span>
          ?
        </h2>

        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Advanced IoT sensors and AI-powered monitoring system that protects
          lives through intelligent vehicle safety technology
        </p>
      </div>

      <StickyScroll content={projectFeatures} />
    </div>
  );
}

export default WhyChooseUs;
