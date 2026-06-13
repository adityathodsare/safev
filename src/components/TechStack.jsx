"use client";
import { useEffect, useState, Fragment } from "react";

const DASH_LINES = [
  { x: 4, y: 7, w: 44, rot: 28, color: "#f97316" },
  { x: 88, y: 5, w: 36, rot: -18, color: "#22d3ee" },
  { x: 93, y: 38, w: 28, rot: 48, color: "#a855f7" },
  { x: 3, y: 55, w: 40, rot: -33, color: "#ec4899" },
  { x: 80, y: 62, w: 32, rot: 14, color: "#22c55e" },
  { x: 12, y: 80, w: 46, rot: 58, color: "#f59e0b" },
  { x: 89, y: 82, w: 26, rot: -52, color: "#3b82f6" },
  { x: 46, y: 3, w: 22, rot: 12, color: "#e11d48" },
  { x: 1, y: 30, w: 18, rot: 72, color: "#84cc16" },
  { x: 96, y: 52, w: 20, rot: -62, color: "#f97316" },
];

/* ─── SVG Logos ─── */
const L = {
  Nextjs: () => (
    <svg viewBox="0 0 180 180" width="32" height="32">
      <mask id="nxm">
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <g mask="url(#nxm)">
        <circle cx="90" cy="90" r="90" fill="#000" />
        <path
          d="M149.508 157.52L69.142 54H54v71.97h11.978V69.004L141.406 164.673a90.62 90.62 0 008.102-7.153z"
          fill="white"
        />
        <rect x="115" y="54" width="12" height="72" fill="white" />
      </g>
    </svg>
  ),
  Tailwind: () => (
    <svg viewBox="0 0 54 33" width="44" height="27">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0C19.8 0 15.3 3.6 13.5 10.8c2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#38BDF8"
      />
    </svg>
  ),
  React: () => (
    <svg viewBox="-11.5 -10.232 23 20.463" width="36" height="36">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  Spring: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <circle cx="25" cy="25" r="25" fill="#6DB33F" />
      <path
        d="M15 25c0-5.523 4.477-10 10-10s10 4.477 10 10a10 10 0 01-10 10c-2.5 0-4.5-1-6-2.5"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="15" cy="32.5" r="2.5" fill="white" />
    </svg>
  ),
  FastAPI: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <circle cx="25" cy="25" r="25" fill="#009688" />
      <polygon points="22,12 22,26 16,26 28,38 28,24 34,24" fill="white" />
    </svg>
  ),
  SMTP: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#f59e0b" />
      <rect
        x="8"
        y="14"
        width="34"
        height="22"
        rx="3"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
      <polyline
        points="8,14 25,28 42,14"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Ollama: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#1a1a2e" />
      <rect
        x="4"
        y="4"
        width="42"
        height="42"
        rx="9"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="26" r="6" fill="#f59e0b" />
      <circle cx="32" cy="26" r="6" fill="#f59e0b" />
      <circle cx="18" cy="26" r="2.5" fill="#1a1a2e" />
      <circle cx="32" cy="26" r="2.5" fill="#1a1a2e" />
    </svg>
  ),
  YOLO: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#0a0a0a" />
      <rect
        x="3"
        y="3"
        width="44"
        height="44"
        rx="10"
        fill="none"
        stroke="#00FFCC"
        strokeWidth="2"
      />
      <rect
        x="8"
        y="18"
        width="10"
        height="14"
        rx="2"
        fill="none"
        stroke="#00FFCC"
        strokeWidth="1.5"
      />
      <rect
        x="21"
        y="14"
        width="10"
        height="22"
        rx="2"
        fill="none"
        stroke="#00FFCC"
        strokeWidth="1.5"
      />
      <rect
        x="34"
        y="20"
        width="8"
        height="10"
        rx="2"
        fill="none"
        stroke="#00FFCC"
        strokeWidth="1.5"
      />
    </svg>
  ),
  TFLite: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#FF6F00" />
      <polygon
        points="25,7 40,16 40,34 25,43 10,34 10,16"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
      <line x1="25" y1="7" x2="25" y2="43" stroke="white" strokeWidth="2" />
      <line
        x1="10"
        y1="25"
        x2="40"
        y2="25"
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="3,3"
      />
    </svg>
  ),
  EdgeImpulse: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#1e1b4b" />
      <rect
        x="4"
        y="4"
        width="42"
        height="42"
        rx="9"
        fill="none"
        stroke="#818cf8"
        strokeWidth="1.5"
      />
      <polyline
        points="8,32 16,20 24,26 32,14 42,22"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  OpenCV: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#111" />
      <circle cx="17" cy="25" r="8" fill="#E53935" />
      <circle cx="33" cy="17" r="8" fill="#43A047" />
      <circle cx="33" cy="33" r="8" fill="#1E88E5" />
    </svg>
  ),
  ThingSpeak: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#00979C" />
      <polyline
        points="5,38 13,24 19,30 27,16 33,26 41,10 47,18"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Docker: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#2496ED" />
      <g fill="white">
        <rect x="6" y="22" width="7" height="6" rx="1" />
        <rect x="15" y="22" width="7" height="6" rx="1" />
        <rect x="24" y="22" width="7" height="6" rx="1" />
        <rect x="15" y="14" width="7" height="6" rx="1" />
        <rect x="24" y="14" width="7" height="6" rx="1" />
        <rect x="33" y="22" width="7" height="6" rx="1" />
      </g>
      <path
        d="M44 26c-1-3-4-4-7-3-1-3-4-5-8-4H10c-1 5 1 9 5 11h22c3 0 6-2 7-4z"
        fill="white"
        opacity="0.22"
      />
    </svg>
  ),
  Vercel: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#000" />
      <polygon points="25,10 43,40 7,40" fill="white" />
    </svg>
  ),
  Zeabur: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#6e40c9" />
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="24"
        fontWeight="900"
        fill="white"
      >
        Z
      </text>
    </svg>
  ),
  ESP32: () => (
    <svg viewBox="0 0 60 40" width="52" height="34">
      <rect x="8" y="4" width="44" height="32" rx="3" fill="#c0392b" />
      <rect x="12" y="8" width="36" height="24" rx="2" fill="#922b21" />
      {[0, 8, 16].map((y) => (
        <rect
          key={y}
          x="4"
          y={10 + y}
          width="5"
          height="3"
          rx="1"
          fill="#f1948a"
        />
      ))}
      {[0, 8, 16].map((y) => (
        <rect
          key={y + 3}
          x="51"
          y={10 + y}
          width="5"
          height="3"
          rx="1"
          fill="#f1948a"
        />
      ))}
      <rect x="22" y="16" width="16" height="8" rx="1" fill="#1a1a2e" />
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="7"
        fontWeight="800"
        fill="white"
      >
        ESP32
      </text>
    </svg>
  ),
  ESPCam: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#6d28d9" />
      <rect x="8" y="14" width="34" height="22" rx="4" fill="#4c1d95" />
      <circle cx="25" cy="25" r="7" fill="#ddd6fe" />
      <circle cx="25" cy="25" r="4" fill="#4c1d95" />
      <circle cx="25" cy="25" r="1.8" fill="#c4b5fd" />
      <rect x="36" y="16" width="6" height="4" rx="1" fill="#7c3aed" />
    </svg>
  ),
  GPS: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#166534" />
      <circle
        cx="25"
        cy="20"
        r="9"
        fill="none"
        stroke="#86efac"
        strokeWidth="2"
      />
      <circle cx="25" cy="20" r="3.5" fill="#86efac" />
      <line
        x1="25"
        y1="6"
        x2="25"
        y2="11"
        stroke="#86efac"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="25"
        y1="29"
        x2="25"
        y2="34"
        stroke="#86efac"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="20"
        x2="16"
        y2="20"
        stroke="#86efac"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="20"
        x2="39"
        y2="20"
        stroke="#86efac"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M25 32 L21 44 L25 40 L29 44 Z" fill="#86efac" />
    </svg>
  ),
  Sensors: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#7c2d12" />
      <circle
        cx="25"
        cy="25"
        r="13"
        fill="none"
        stroke="#fb923c"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <circle
        cx="25"
        cy="25"
        r="7"
        fill="none"
        stroke="#fb923c"
        strokeWidth="2"
      />
      <circle cx="25" cy="25" r="2.5" fill="#fb923c" />
      <line
        x1="25"
        y1="5"
        x2="25"
        y2="12"
        stroke="#fb923c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="25"
        y1="38"
        x2="25"
        y2="45"
        stroke="#fb923c"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  KiCad: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#1e3a8a" />
      <text
        x="50%"
        y="46%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill="white"
      >
        Ki
      </text>
      <rect x="8" y="36" width="34" height="3" rx="1.5" fill="#93c5fd" />
      <rect x="8" y="11" width="4" height="4" rx="1" fill="#93c5fd" />
      <rect x="16" y="11" width="4" height="4" rx="1" fill="#93c5fd" />
      <rect x="38" y="11" width="4" height="4" rx="1" fill="#93c5fd" />
    </svg>
  ),
  VSCode: () => (
    <svg viewBox="0 0 100 100" width="36" height="36">
      <mask id="vsm">
        <rect width="100" height="100" fill="white" />
      </mask>
      <rect width="100" height="100" rx="18" fill="#007ACC" />
      <path d="M70 22L42 50L70 78L85 70V30L70 22Z" fill="white" />
      <path d="M30 65L15 52L30 39L42 50L30 65Z" fill="white" />
    </svg>
  ),
  Cursor: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#0a0a0a" />
      <rect
        x="7"
        y="7"
        width="36"
        height="36"
        rx="7"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      <polygon
        points="17,15 17,35 25,28 30,37 33,35.5 28,26 36,26"
        fill="white"
      />
    </svg>
  ),
  IntelliJ: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <defs>
        <linearGradient id="ijg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FE2857" />
          <stop offset="100%" stopColor="#FC801D" />
        </linearGradient>
      </defs>
      <rect width="50" height="50" rx="12" fill="url(#ijg)" />
      <rect x="9" y="34" width="16" height="3" rx="1.5" fill="white" />
      <text
        x="50%"
        y="44%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill="white"
      >
        IJ
      </text>
    </svg>
  ),
  Arduino: () => (
    <svg viewBox="0 0 50 50" width="36" height="36">
      <rect width="50" height="50" rx="12" fill="#00979D" />
      <path
        d="M8 25c0-4.5 3.5-8 8-8h6m12 0h6c4.5 0 8 3.5 8 8s-3.5 8-8 8h-6m-12 0H16c-4.5 0-8-3.5-8-8z"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="25"
        x2="29"
        y2="25"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="20"
        x2="35"
        y2="30"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const SECTIONS = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.06)",
    border: "rgba(34,211,238,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    techs: [
      { name: "Next.js", Logo: L.Nextjs, bg: "#0a0a0a", desc: "App framework" },
      {
        name: "Tailwind CSS",
        Logo: L.Tailwind,
        bg: "#0f172a",
        desc: "Styling",
      },
      { name: "React", Logo: L.React, bg: "#0d1b2a", desc: "UI library" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.06)",
    border: "rgba(168,85,247,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    techs: [
      {
        name: "Spring Boot",
        Logo: L.Spring,
        bg: "#0a1a0a",
        desc: "Java API server",
      },
      { name: "FastAPI", Logo: L.FastAPI, bg: "#0a1e1b", desc: "Python API" },
      {
        name: "SMTP Email Library",
        Logo: L.SMTP,
        bg: "#1a130a",
        desc: "Email alerts",
      },
    ],
  },
  {
    id: "ai",
    label: "AI & Detection",
    color: "#f97316",
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    techs: [
      { name: "Ollama", Logo: L.Ollama, bg: "#10101e", desc: "Local LLM" },
      { name: "YOLO", Logo: L.YOLO, bg: "#0a0a0a", desc: "Object detection" },
      {
        name: "TensorFlow Lite",
        Logo: L.TFLite,
        bg: "#1a0d00",
        desc: "Edge ML",
      },
      {
        name: "Edge Impulse",
        Logo: L.EdgeImpulse,
        bg: "#0e0c1e",
        desc: "Embedded ML",
      },
      {
        name: "OpenCV",
        Logo: L.OpenCV,
        bg: "#0a0a0a",
        desc: "Computer vision",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Deployment",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    techs: [
      {
        name: "ThingSpeak",
        Logo: L.ThingSpeak,
        bg: "#001a1b",
        desc: "IoT cloud",
      },
      {
        name: "Docker",
        Logo: L.Docker,
        bg: "#021422",
        desc: "Containerization",
      },
      {
        name: "Vercel",
        Logo: L.Vercel,
        bg: "#0a0a0a",
        desc: "Frontend deploy",
      },
      { name: "Zeabur", Logo: L.Zeabur, bg: "#12062a", desc: "Backend deploy" },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    techs: [
      { name: "ESP32", Logo: L.ESP32, bg: "#1e0505", desc: "Main MCU" },
      {
        name: "ESP32-CAM",
        Logo: L.ESPCam,
        bg: "#150520",
        desc: "Camera module",
      },
      { name: "NEO-6M GPS", Logo: L.GPS, bg: "#051405", desc: "GPS tracking" },
      {
        name: "Sensors Suite",
        Logo: L.Sensors,
        bg: "#1e0c00",
        desc: "IoT sensors",
      },
    ],
  },
  {
    id: "tools",
    label: "PCB & Dev Tools",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.06)",
    border: "rgba(129,140,248,0.2)",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    techs: [
      { name: "KiCad", Logo: L.KiCad, bg: "#080e2e", desc: "PCB design" },
      { name: "VS Code", Logo: L.VSCode, bg: "#001020", desc: "Code editor" },
      { name: "Cursor", Logo: L.Cursor, bg: "#0a0a0a", desc: "AI editor" },
      {
        name: "IntelliJ IDEA",
        Logo: L.IntelliJ,
        bg: "#1a0505",
        desc: "Java IDE",
      },
      {
        name: "Arduino IDE",
        Logo: L.Arduino,
        bg: "#001a1a",
        desc: "Firmware IDE",
      },
    ],
  },
];

const ARCH = [
  {
    Logo: L.ESP32,
    label: "ESP32",
    sub: "Hardware Layer",
    color: "#f59e0b",
    connLabel: "sensors",
  },
  {
    Logo: L.ThingSpeak,
    label: "ThingSpeak",
    sub: "IoT Cloud",
    color: "#22c55e",
    connLabel: "stream",
  },
  {
    Logo: L.FastAPI,
    label: "FastAPI+YOLO",
    sub: "AI Processing",
    color: "#f97316",
    connLabel: "insight",
  },
  {
    Logo: L.Spring,
    label: "Spring Boot",
    sub: "API Backend",
    color: "#a855f7",
    connLabel: "data",
  },
  {
    Logo: L.Nextjs,
    label: "Next.js",
    sub: "Dashboard",
    color: "#22d3ee",
    connLabel: "",
  },
];

export default function TechStack() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = SECTIONS.reduce((a, s) => a + s.techs.length, 0);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-theme text-theme transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[600px] bg-purple-600/10 dark:bg-purple-600/30 rounded-full blur-3xl left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/15 rounded-full blur-3xl -right-28 bottom-0" />
      </div>

      {/* Floating accent dashes */}
      {mounted &&
        DASH_LINES.map((d, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-sm opacity-40 dark:opacity-80 animate-bounce"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.w,
              height: 4,
              background: d.color,
              transform: `rotate(${d.rot}deg)`,
              animationDuration: `${3.5 + (i % 3) * 0.9}s`,
              animationDelay: `${i * 0.28}s`,
            }}
          />
        ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-5">
            <span className="text-xs sm:text-sm font-semibold text-theme-secondary tracking-wide">
              🛠️ Technology Stack
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black tracking-tight leading-tight mb-3.5">
            <span className="bg-gradient-to-br from-text-primary-light via-cyan-300 to-sky-400 dark:from-white dark:via-cyan-200 dark:to-sky-400 bg-clip-text text-transparent">
              Modern Tech Architecture
            </span>
          </h2>

          <p className="text-sm sm:text-base text-theme-secondary max-w-lg mx-auto leading-relaxed">
            Every tool powering SafeV — from ESP32 firmware to AI detection to
            cloud dashboard.
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center mt-7 mb-14 sm:mb-16">
            {[
              { dot: "#22d3ee", text: `${SECTIONS.length} Categories` },
              { dot: "#22c55e", text: `${total} Technologies` },
              { dot: "#f97316", text: "Full-stack IoT" },
              { dot: "#a855f7", text: "Edge AI Ready" },
            ].map((p) => (
              <div
                key={p.text}
                className="glass-card flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-theme-secondary"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: p.dot,
                    boxShadow: `0 0 6px ${p.dot}`,
                  }}
                />
                {p.text}
              </div>
            ))}
          </div>
        </div>

        {/* All Sections */}
        {SECTIONS.map((sec) => (
          <div className="mb-8 sm:mb-9" key={sec.id}>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: sec.bg,
                  border: `1px solid ${sec.border}`,
                  color: sec.color,
                }}
              >
                {sec.icon}
              </div>
              <div
                className="text-xs sm:text-sm font-extrabold tracking-widest uppercase"
                style={{ color: sec.color }}
              >
                {sec.label}
              </div>
              <div
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide"
                style={{
                  background: sec.bg,
                  border: `1px solid ${sec.border}`,
                  color: sec.color,
                }}
              >
                {sec.techs.length} tools
              </div>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/6" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5">
              {sec.techs.map((tech) => (
                <div
                  key={tech.name}
                  className="group glass-card relative overflow-hidden p-4 sm:p-[18px_14px_14px] flex flex-col items-start gap-2.5 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    borderColor: `${sec.color}22`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                    style={{ backgroundColor: sec.color }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-black/5 dark:bg-black/40"
                    style={{ backgroundColor: `${tech.bg}88` }}
                  >
                    <tech.Logo />
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold tracking-tight text-theme leading-tight">
                      {tech.name}
                    </div>
                    <div className="text-[11px] font-medium text-theme-secondary mt-0.5">
                      {tech.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Architecture Flow */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 mt-12 sm:mt-14">
          <div className="text-lg sm:text-xl font-extrabold tracking-tight text-center text-theme mb-1.5">
            System Architecture Flow
          </div>
          <div className="text-xs sm:text-sm text-theme-secondary text-center mb-8 sm:mb-9">
            How data travels from sensor to screen
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 max-[700px]:gap-2">
            {ARCH.map((step, i) => (
              <Fragment key={step.label}>
                <div className="group flex flex-col items-center gap-2 px-3 py-2.5">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      borderColor: `${step.color}44`,
                      backgroundColor: `${step.color}08`,
                    }}
                  >
                    <step.Logo />
                  </div>
                  <div className="text-xs font-extrabold text-theme text-center">
                    {step.label}
                  </div>
                  <div className="text-[10px] text-theme-secondary text-center max-w-[80px] leading-snug">
                    {step.sub}
                  </div>
                </div>
                {i < ARCH.length - 1 && (
                  <div className="hidden sm:flex flex-col items-center gap-0.5 px-1">
                    <div className="text-base text-slate-400 dark:text-white/20 animate-arch-arrow">
                      →
                    </div>
                    <div className="text-[9px] text-slate-400 dark:text-white/20 uppercase tracking-wider">
                      {step.connLabel}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
