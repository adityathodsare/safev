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
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        style={{
          border: "1.5px dashed rgba(251,191,36,0.4)",
          borderRadius: 16,
          padding: 24,
          background: "rgba(251,191,36,0.04)",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            color: "#64748b",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Device UCOD
        </div>
        <div
          style={{
            display: "inline-block",
            background: "rgba(251,191,36,0.15)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 10,
            color: "#fbbf24",
            fontFamily: "monospace",
            marginBottom: 14,
          }}
        >
          UNIQUE IDENTIFIER
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#fbbf24",
            fontFamily: "monospace",
            letterSpacing: "0.18em",
            animation: "safev-ucod-glow 3s ease-in-out infinite",
          }}
        >
          SAFEV1
        </div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 12 }}>
          📍 Printed on the back of your device &amp; box
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {["TRK002", "MTR003", "SAFEV1"].map((c) => (
          <span
            key={c}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#64748b",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 4,
              padding: "3px 8px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#334155",
          marginTop: 8,
          fontFamily: "monospace",
        }}
      >
        Example UCODs — yours will be unique
      </div>
    </div>
  );
}

function ConnectVisual() {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        style={{
          width: 130,
          height: 82,
          background: "linear-gradient(135deg, #1a2235, #0f1420)",
          borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,0.12)",
          margin: "0 auto 8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#0D9488",
            boxShadow: "0 0 12px rgba(13,148,136,0.9)",
            position: "absolute",
            top: 8,
            right: 10,
            animation: "safev-blink 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#475569",
            letterSpacing: "0.08em",
          }}
        >
          SAFEV KIT
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            background: "rgba(251,191,36,0.15)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24",
            padding: "3px 8px",
            borderRadius: 4,
            position: "absolute",
            bottom: -13,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          SAFEV1
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        {[
          { label: "USB-C", delay: "0s" },
          { label: "Micro-USB", delay: "0.4s" },
        ].map(({ label, delay }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 3,
                height: 22,
                background: "linear-gradient(to bottom, #0D9488, transparent)",
                borderRadius: 2,
                animation: `safev-cable 1.2s ease-in-out ${delay} infinite`,
              }}
            />
            <div
              style={{
                width: 30,
                height: 15,
                borderRadius: 3,
                border: "1.5px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#64748b",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 18,
        }}
      >
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
            style={{
              background: bg,
              border: `1px solid ${color}33`,
              borderRadius: 8,
              padding: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color,
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>
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
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {[
          { title: "External", sub: "Traffic Monitor", delay: "0s" },
          { title: "Internal", sub: "Driver Monitor", delay: "0.6s" },
        ].map(({ title, sub, delay }) => (
          <div
            key={title}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 42,
                height: 32,
                borderRadius: 6,
                background: "#0f1420",
                border: "1px solid rgba(255,255,255,0.1)",
                margin: "0 auto 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#0a0f1a",
                  border: "1.5px solid #22c55e",
                  boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 700 }}>
              {title}
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
              {sub}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#22c55e",
                marginTop: 6,
              }}
            >
              ● LIVE
            </div>
            <div
              style={{
                height: 2,
                background: "rgba(34,197,94,0.12)",
                borderRadius: 2,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: 2,
                  animation: `safev-scan 2s ease-in-out ${delay} infinite`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(34,197,94,0.05)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 10,
          padding: "10px 14px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#22c55e",
            fontFamily: "monospace",
            letterSpacing: "0.06em",
          }}
        >
          AI MONITORING ACTIVE
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>
          Real-time HD streaming enabled
        </div>
      </div>
    </div>
  );
}

function TrackVisual() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            marginBottom: 8,
          }}
        >
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
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          TRACK DEVICE
        </div>
      </div>
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Device UCOD
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            readOnly
            value="SAFEV1"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#a78bfa",
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.15em",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Track →
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#334155",
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7C3AED",
              animation: "safev-ping 1.2s ease-in-out infinite",
            }}
          />
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
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {metrics.map(({ icon, val, key, status }) => (
          <div
            key={key}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: "10px 6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 15, marginBottom: 3 }}>{icon}</div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              {val}
            </div>
            <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>
              {key}
            </div>
            <div style={{ fontSize: 9, color: "#22c55e", marginTop: 2 }}>
              {status}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#0D9488",
            flexShrink: 0,
            animation: "safev-map-ping 1.5s ease-out infinite",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            GPS Location
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            Real-time tracking active
          </div>
        </div>
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "#22c55e",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
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
    <>
      <style>{`
        @keyframes safev-ucod-glow {
          0%,100%{text-shadow:0 0 16px rgba(251,191,36,0.3)}
          50%{text-shadow:0 0 36px rgba(251,191,36,0.6)}
        }
        @keyframes safev-blink {
          0%,100%{opacity:1} 50%{opacity:0.15}
        }
        @keyframes safev-cable {
          0%,100%{opacity:0.3;transform:scaleY(0.8)} 50%{opacity:1;transform:scaleY(1)}
        }
        @keyframes safev-scan {
          0%{width:0;opacity:0.8} 60%{width:100%;opacity:1} 100%{width:100%;opacity:0}
        }
        @keyframes safev-ping {
          0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.3}
        }
        @keyframes safev-map-ping {
          0%{box-shadow:0 0 0 0 rgba(13,148,136,0.6)}
          70%{box-shadow:0 0 0 10px rgba(13,148,136,0)}
          100%{box-shadow:0 0 0 0 rgba(13,148,136,0)}
        }
        @keyframes safev-fade-up {
          from{opacity:0;transform:translateY(14px)}
          to{opacity:1;transform:translateY(0)}
        }
        .safev-card-anim { animation: safev-fade-up 0.35s ease both; }
        .safev-prev-btn:hover:not(:disabled) { background: rgba(255,255,255,0.07) !important; color: #cbd5e1 !important; }
        .safev-next-btn:hover:not(:disabled) { filter: brightness(1.15); }
        .safev-cta-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .safev-step-btn { transition: transform 0.15s; }
        .safev-step-btn:hover { transform: translateY(-2px); }

        @media (max-width: 640px) {
          .safev-card-grid { grid-template-columns: 1fr !important; }
          .safev-step-label { display: none !important; }
          .safev-quick-steps { display: none !important; }
        }
      `}</style>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "72px 24px 80px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          {/* Badge — identical style to homepage IoT badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 100,
              padding: "7px 18px",
              fontSize: 12,
              color: "#cbd5e1",
              marginBottom: 20,
              backdropFilter: "blur(8px)",
            }}
          >
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
            <span style={{ fontWeight: 600 }}>IoT-Powered Vehicle Safety</span>
          </div>

          {/* Big bold white title — matching homepage H1 weight */}
          <h2
            style={{
              fontSize: "clamp(32px, 5.5vw, 54px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: 14,
            }}
          >
            How to Use{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #0D9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SAFEV
            </span>
          </h2>

          {/* Subtitle — matching homepage tagline style */}
          <p
            style={{
              fontSize: 15,
              color: "#94a3b8",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            Real-time accident detection • GPS tracking • Alcohol monitoring •
            Emergency alerts
          </p>
        </div>

        {/* ── Step Navigator ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 0,
            marginBottom: 36,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              {i > 0 && (
                <div
                  style={{
                    width: 44,
                    height: 2,
                    marginTop: -20,
                    background:
                      i <= current
                        ? `linear-gradient(90deg, ${steps[i - 1].accent}, ${step.accent})`
                        : "rgba(255,255,255,0.08)",
                    transition: "background 0.4s",
                  }}
                />
              )}
              <button
                className="safev-step-btn"
                onClick={() => goTo(i)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: "0 2px",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border:
                      i === current
                        ? `2px solid ${step.accent}`
                        : i < current
                          ? "2px solid rgba(255,255,255,0.2)"
                          : "2px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color:
                      i === current
                        ? step.accent
                        : i < current
                          ? "#94a3b8"
                          : "#334155",
                    background:
                      i === current
                        ? `${step.accent}18`
                        : "rgba(255,255,255,0.03)",
                    boxShadow:
                      i === current ? `0 0 18px ${step.accent}44` : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {i < current ? "✓" : String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="safev-step-label"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: i === current ? "#cbd5e1" : "#334155",
                    textAlign: "center",
                    maxWidth: 60,
                    lineHeight: 1.3,
                    transition: "color 0.3s",
                  }}
                >
                  {step.label}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* ── Step Card ── */}
        <div
          key={animKey}
          className="safev-card-anim safev-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "center",
            background: "rgba(6, 10, 20, 0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: `2px solid ${s.accent}`,
            borderRadius: 20,
            padding: "36px 36px",
            backdropFilter: "blur(16px)",
            boxShadow: `0 0 60px ${s.accent}18`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 300,
              height: 300,
              background: `radial-gradient(circle, ${s.accent}12 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Visual pane */}
          <div
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: 28,
              minHeight: 270,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${s.accent}0a 0%, transparent 65%)`,
                pointerEvents: "none",
              }}
            />
            <StepVisual visual={s.visual} />
          </div>

          {/* Text pane */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: s.accent,
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                }}
              >
                STEP {String(s.id).padStart(2, "0")}
              </div>
              <div
                style={{ flex: 1, height: 1, background: `${s.accent}30` }}
              />
            </div>

            {/* Title — bold like homepage */}
            <h3
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              {s.title}
            </h3>

            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                lineHeight: 1.72,
                marginBottom: 20,
                fontWeight: 400,
              }}
            >
              {s.desc}
            </p>

            {/* Detail box */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `2px solid ${s.accent}`,
                borderRadius: "0 10px 10px 0",
                padding: "12px 16px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: s.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Details
              </div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>
                {s.detail}
              </div>
            </div>

            {/* Tip */}
            <div
              style={{
                background: "rgba(251,191,36,0.04)",
                border: "1px solid rgba(251,191,36,0.15)",
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: 12,
                color: "#78716c",
                lineHeight: 1.65,
                marginBottom: 22,
              }}
            >
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                💡 Tip:{" "}
              </span>
              {s.tip}
            </div>

            {/* Progress */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#334155",
                  fontFamily: "monospace",
                  marginBottom: 7,
                }}
              >
                <span>Setup progress</span>
                <span style={{ color: s.accent }}>
                  {current + 1} / {steps.length}
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, #7C3AED, ${s.accent})`,
                    borderRadius: 100,
                    transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Nav Buttons — styled like homepage CTA buttons ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <button
            className="safev-prev-btn"
            onClick={prev}
            disabled={current === 0}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "12px 24px",
              color: "#64748b",
              fontSize: 14,
              fontWeight: 700,
              cursor: current === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: current === 0 ? 0.3 : 1,
            }}
          >
            ← Previous
          </button>

          <button
            className="safev-next-btn"
            onClick={next}
            disabled={current === steps.length - 1}
            style={{
              background: `linear-gradient(135deg, ${s.accent}ee, ${s.accent}99)`,
              border: "none",
              borderRadius: 12,
              padding: "12px 28px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: current === steps.length - 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: current === steps.length - 1 ? 0.35 : 1,
            }}
          >
            Next →
          </button>
        </div>

        {/* ── Quick Start Strip ── */}
        <div
          style={{
            marginTop: 36,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "22px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            backdropFilter: "blur(8px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: 3,
              }}
            >
              Quick Reference
            </div>
            <div style={{ fontSize: 12, color: "#475569" }}>
              Five steps, under 5 minutes
            </div>
          </div>

          <div
            className="safev-quick-steps"
            style={{ display: "flex", gap: 6, alignItems: "center" }}
          >
            {["UCOD", "Connect", "Camera", "Track", "Monitor"].map(
              (label, i) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {i > 0 && (
                    <span style={{ color: "#1e293b", fontSize: 13 }}>→</span>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color: "#475569",
                      fontFamily: "monospace",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: steps[i].accent,
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </div>
                    {label}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* CTA — teal gradient matching homepage "Track Data" button */}
          <button
            className="safev-cta-btn"
            onClick={() => goTo(0)}
            style={{
              background: "linear-gradient(135deg, #0D9488, #0f766e)",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
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
    </>
  );
}
