"use client";
import { useState, useEffect } from "react";

const DASH_LINES = [
  { x: 4, y: 8, w: 44, rot: 28, color: "#f97316" },
  { x: 88, y: 5, w: 36, rot: -18, color: "#22d3ee" },
  { x: 93, y: 38, w: 28, rot: 48, color: "#a855f7" },
  { x: 3, y: 55, w: 40, rot: -33, color: "#ec4899" },
  { x: 80, y: 62, w: 32, rot: 14, color: "#22c55e" },
  { x: 12, y: 80, w: 46, rot: 58, color: "#f59e0b" },
  { x: 89, y: 82, w: 26, rot: -52, color: "#3b82f6" },
  { x: 46, y: 3, w: 22, rot: 12, color: "#e11d48" },
  { x: 60, y: 94, w: 34, rot: -22, color: "#06b6d4" },
  { x: 1, y: 30, w: 18, rot: 72, color: "#84cc16" },
  { x: 96, y: 52, w: 20, rot: -62, color: "#f97316" },
  { x: 36, y: 88, w: 30, rot: 42, color: "#8b5cf6" },
];

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .fv-root *, .fv-root *::before, .fv-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fv-root {
          font-family: 'Inter', sans-serif;
          background: #000;
          color: #fff;
          position: relative;
          overflow: hidden;
          padding: 88px 20px 100px;
        }

        /* Dash lines */
        .fv-dash {
          position: absolute; pointer-events: none; border-radius: 3px; opacity: .85;
          animation: fvDash var(--dur, 4s) ease-in-out infinite var(--del, 0s);
        }
        @keyframes fvDash {
          0%, 100% { transform: translateY(0) rotate(var(--rot)); }
          50%       { transform: translateY(-9px) rotate(var(--rot)); }
        }

        /* Glow */
        .fv-glow {
          position: absolute; pointer-events: none;
          width: 700px; height: 500px;
          background: radial-gradient(ellipse at center, rgba(120,40,200,0.38) 0%, rgba(60,20,120,0.2) 45%, transparent 70%);
          left: 50%; top: 40%; transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        .fv-wrap { max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }

        /* Badge */
        .fv-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px; padding: 7px 18px; margin-bottom: 22px;
          font-size: 12px; font-weight: 600; color: #e2e8f0; letter-spacing: .3px;
        }

        /* Heading */
        .fv-title {
          font-size: clamp(30px, 5.5vw, 58px);
          font-weight: 900; letter-spacing: -2px; line-height: 1.07; margin-bottom: 14px;
        }
        .fv-title-grad {
          background: linear-gradient(135deg, #fff 0%, #94e8ff 50%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .fv-sub { font-size: 15px; color: rgba(255,255,255,0.42); max-width: 480px; margin: 0 auto 48px; line-height: 1.7; }

        /* Status bar */
        .fv-status {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(34,211,238,0.2);
          border-radius: 14px; padding: 16px 24px; margin-bottom: 48px;
        }
        .fv-status-left { display: flex; align-items: center; gap: 10px; }
        .fv-live-dot { width: 9px; height: 9px; border-radius: 50%; background: #4ade80; position: relative; }
        .fv-live-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #4ade80; animation: fvRing 1.5s ease-in-out infinite; }
        @keyframes fvRing { 0%{opacity:1;transform:scale(1);} 100%{opacity:0;transform:scale(2.2);} }
        .fv-live-label { font-size: 12px; font-weight: 700; color: #4ade80; letter-spacing: 1px; }
        .fv-status-right { display: flex; gap: 28px; flex-wrap: wrap; }
        .fv-stat-item { font-size: 13px; color: rgba(255,255,255,0.45); }
        .fv-stat-item strong { color: #22d3ee; font-weight: 700; margin-left: 4px; }

        /* Grid */
        .fv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 44px;
        }
        @media (max-width: 900px) { .fv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .fv-grid { grid-template-columns: 1fr; } }

        /* Card */
        .fv-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px 22px;
          position: relative; overflow: hidden;
          transition: transform .25s ease, border-color .25s ease, background .25s ease;
          cursor: default;
          animation: fvCardIn .5s ease both;
        }
        @keyframes fvCardIn { from{opacity:0;transform:scale(.94);} to{opacity:1;transform:scale(1);} }
        .fv-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.06);
        }

        /* Top accent bar */
        .fv-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          border-radius: 20px 20px 0 0; opacity: 0;
          transition: opacity .3s ease;
        }
        .fv-card:hover .fv-card-bar { opacity: 1; }

        /* Icon */
        .fv-icon-wrap {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 14px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          transition: transform .3s;
        }
        .fv-card:hover .fv-icon-wrap { transform: scale(1.08) rotate(-3deg); }

        .fv-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
        .fv-card-title { font-size: 16px; font-weight: 800; letter-spacing: -.3px; flex: 1; }
        .fv-dots { display: flex; gap: 3px; padding-top: 4px; }
        .fv-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ac, #22d3ee); animation: fvBlink 2s ease-in-out infinite; }
        .fv-dot:nth-child(2){animation-delay:.3s;} .fv-dot:nth-child(3){animation-delay:.6s;}
        @keyframes fvBlink { 0%,100%{opacity:.3;} 50%{opacity:1;} }

        .fv-card-desc { font-size: 12.5px; color: rgba(255,255,255,0.42); margin-bottom: 14px; line-height: 1.55; }

        /* Detail list */
        .fv-detail-item {
          display: flex; align-items: center; gap: 9px;
          font-size: 13px; color: rgba(255,255,255,0.65); margin-bottom: 7px;
        }
        .fv-check { width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 9px; font-weight: 900; }

        /* Bottom accent line on hover */
        .fv-card-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          border-radius: 0 0 20px 20px; transform: scaleX(0); transform-origin: left;
          transition: transform .4s ease;
        }
        .fv-card:hover .fv-card-line { transform: scaleX(1); }

        /* UCOD banner */
        .fv-ucod {
          display: inline-flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(129,140,248,0.3);
          border-radius: 100px; padding: 14px 26px; margin-bottom: 44px;
        }
        .fv-ucod-icon { font-size: 22px; }
        .fv-ucod-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .fv-ucod-sub { font-size: 12px; color: rgba(255,255,255,0.42); }

        /* Highlights row */
        .fv-hl-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        @media (max-width: 700px) { .fv-hl-row { grid-template-columns: repeat(2,1fr); } }

        .fv-hl-card {
          text-align: center; padding: 20px 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; transition: background .25s, border-color .25s, transform .25s;
        }
        .fv-hl-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); }
        .fv-hl-icon { font-size: 26px; margin-bottom: 10px; }
        .fv-hl-label { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 500; }

        @media (max-width: 480px) {
          .fv-status-right { gap: 16px; }
          .fv-ucod { border-radius: 16px; padding: 14px 18px; }
        }
      `}</style>

      <div className="fv-root">
        {/* Purple glow */}
        <div className="fv-glow" />
        {/* Second glow */}
        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: "15%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(30,80,200,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating dashes */}
        {mounted &&
          DASH_LINES.map((d, i) => (
            <div
              key={i}
              className="fv-dash"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.w,
                height: 4,
                background: d.color,
                "--rot": `${d.rot}deg`,
                "--dur": `${3.5 + (i % 3) * 0.9}s`,
                "--del": `${i * 0.28}s`,
                transform: `rotate(${d.rot}deg)`,
              }}
            />
          ))}

        <div className="fv-wrap">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div className="fv-badge">⚡ Enterprise Features</div>
            <h2 className="fv-title">
              <span className="fv-title-grad">Everything You Need</span>
            </h2>
            <p className="fv-sub">
              Comprehensive vehicle safety and monitoring platform with
              enterprise-grade features built for every road scenario.
            </p>
          </div>

          {/* Live status bar */}
          <div className="fv-status">
            <div className="fv-status-left">
              <div className="fv-live-dot" />
              <span className="fv-live-label">LIVE SYSTEM ACTIVE</span>
            </div>
            <div className="fv-status-right">
              <div className="fv-stat-item">
                Uptime: <strong>99.9%</strong>
              </div>
              <div className="fv-stat-item">
                Latency: <strong>&lt;100ms</strong>
              </div>
              <div className="fv-stat-item">
                Accuracy: <strong>High Precision</strong>
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="fv-grid">
            {coreFeatures.map((feature, idx) => {
              const theme = FEATURE_COLORS[feature.id];
              return (
                <div
                  key={feature.id}
                  className="fv-card"
                  style={{
                    "--ac": theme.accent,
                    animationDelay: `${idx * 55}ms`,
                    borderColor:
                      hovered === feature.id ? theme.accent + "55" : undefined,
                  }}
                  onMouseEnter={() => setHovered(feature.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Top bar */}
                  <div
                    className="fv-card-bar"
                    style={{ background: theme.grad }}
                  />

                  {/* Icon */}
                  <div
                    className="fv-icon-wrap"
                    style={{
                      borderColor: theme.accent + "33",
                      background: theme.accent + "12",
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Title row */}
                  <div className="fv-card-head">
                    <div className="fv-card-title">{feature.title}</div>
                    <div className="fv-dots">
                      <div
                        className="fv-dot"
                        style={{ "--ac": theme.accent }}
                      />
                      <div
                        className="fv-dot"
                        style={{ "--ac": theme.accent }}
                      />
                      <div
                        className="fv-dot"
                        style={{ "--ac": theme.accent }}
                      />
                    </div>
                  </div>

                  <div className="fv-card-desc">{feature.description}</div>

                  {/* Detail list */}
                  <div>
                    {feature.details.slice(0, 4).map((detail, i) => (
                      <div className="fv-detail-item" key={i}>
                        <div
                          className="fv-check"
                          style={{
                            background: theme.accent + "20",
                            color: theme.accent,
                          }}
                        >
                          ✓
                        </div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom line */}
                  <div
                    className="fv-card-line"
                    style={{ background: theme.grad }}
                  />
                </div>
              );
            })}
          </div>

          {/* UCOD banner */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="fv-ucod">
              <span className="fv-ucod-icon">🔑</span>
              <div style={{ textAlign: "left" }}>
                <div className="fv-ucod-title">UCOD Access System</div>
                <div className="fv-ucod-sub">
                  Owner or anyone with UCOD can view live stream, camera feeds
                  &amp; vehicle data
                </div>
              </div>
            </div>
          </div>

          {/* Highlights row */}
          <div className="fv-hl-row">
            {highlights.map((h) => (
              <div className="fv-hl-card" key={h.label}>
                <div className="fv-hl-icon">{h.icon}</div>
                <div className="fv-hl-label">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
