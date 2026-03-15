"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────────────
   CONFIG & THEME
───────────────────────────────────────────────── */
const API = "http://localhost:8000";
const REFRESH_MS = 20000;

// Darker palette
const BG = "#020509";
const BG2 = "#050a12";
const BG3 = "#080f1a";
const CARD = "rgba(255,255,255,0.025)";
const BORDER = "rgba(255,255,255,0.055)";
const BORDER2 = "rgba(255,255,255,0.035)";
const TEXT1 = "rgba(255,255,255,0.82)";
const TEXT2 = "rgba(255,255,255,0.35)";
const TEXT3 = "rgba(255,255,255,0.16)";

const SIG = {
  red: {
    hex: "#f43f5e",
    glow: "rgba(244,63,94,0.32)",
    muted: "rgba(244,63,94,0.09)",
    label: "Red",
  },
  yellow: {
    hex: "#f59e0b",
    glow: "rgba(245,158,11,0.32)",
    muted: "rgba(245,158,11,0.09)",
    label: "Yellow",
  },
  green: {
    hex: "#10b981",
    glow: "rgba(16,185,129,0.32)",
    muted: "rgba(16,185,129,0.09)",
    label: "Green",
  },
  unknown: {
    hex: "#475569",
    glow: "rgba(71,85,105,0.2)",
    muted: "rgba(71,85,105,0.06)",
    label: "—",
  },
};
const sig = (c) => SIG[c] || SIG.unknown;

function domColor(det) {
  if (!det) return "unknown";
  const k = {
    red: det.red_count ?? 0,
    yellow: det.yellow_count ?? 0,
    green: det.green_count ?? 0,
  };
  const tot = k.red + k.yellow + k.green;
  if (!tot) return det.traffic_light_color || "unknown";
  return Object.entries(k).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

const tFmt = (ts) =>
  ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
const dtFmt = (ts) =>
  ts
    ? new Date(ts).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/* ─────────────────────────────────────────────────
   REUSABLES
───────────────────────────────────────────────── */
function SignalBadge({ color, size = "md" }) {
  const s = sig(color);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: size === "lg" ? "10px 18px" : "4px 11px",
        borderRadius: 20,
        fontSize: size === "lg" ? 14 : 10,
        fontWeight: 600,
        background: s.muted,
        border: `1px solid ${s.hex}44`,
        color: s.hex,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        boxShadow: `0 0 10px ${s.glow}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.hex,
          boxShadow: `0 0 5px ${s.glow}`,
          display: "inline-block",
        }}
      />
      {s.label}
    </span>
  );
}

function MetricCard({ icon, label, value, accent = "#10b981", sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.04)" : CARD,
        border: `1px solid ${hov ? accent + "44" : BORDER}`,
        borderRadius: 10,
        padding: "12px 14px",
        transition: "all 0.2s",
        boxShadow: hov ? `0 0 16px ${accent}18` : "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 7,
        }}
      >
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span
          style={{
            fontSize: 9,
            color: TEXT3,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 700,
          color: accent,
          fontFamily: "'DM Mono',monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: TEXT3, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: TEXT1,
          fontFamily: "'Syne',sans-serif",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: "linear-gradient(180deg,#10b981,#10b98155)",
            display: "inline-block",
          }}
        />
        {children}
      </h2>
      {action}
    </div>
  );
}

function TrafficLight({ color }) {
  const s = sig(color);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        background: BG,
        borderRadius: 14,
        padding: "16px 12px",
        border: `1px solid ${s.hex}33`,
        alignItems: "center",
        boxShadow: `0 0 24px ${s.glow}`,
        flexShrink: 0,
      }}
    >
      {["red", "yellow", "green"].map((c) => (
        <div
          key={c}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: color === c ? SIG[c].hex : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${color === c ? SIG[c].hex : "rgba(255,255,255,0.07)"}`,
            boxShadow:
              color === c
                ? `0 0 16px ${SIG[c].glow},0 0 5px ${SIG[c].hex}`
                : "none",
            transition: "all 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────── */
function Modal({ src, det, onClose, onDownload }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  if (!src) return null;
  const color = domColor(det);
  const s = sig(color);
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.94)",
        backdropFilter: "blur(22px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 880, width: "100%" }}>
        <div
          style={{
            background: BG3,
            border: `1px solid ${s.hex}44`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: `0 0 60px ${s.glow}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: `1px solid ${BORDER2}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SignalBadge color={color} />
              {det && (
                <span style={{ color: TEXT2, fontSize: 12 }}>
                  #{det.sequence_number} · {dtFmt(det.timestamp)}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button
                onClick={onDownload}
                style={{
                  padding: "5px 13px",
                  borderRadius: 6,
                  fontSize: 11,
                  cursor: "pointer",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#10b981",
                }}
              >
                ⬇ Download
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "5px 11px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#f43f5e",
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <img
            src={src}
            alt=""
            style={{
              width: "100%",
              display: "block",
              maxHeight: "70vh",
              objectFit: "contain",
              background: BG,
            }}
          />
          {det && (
            <div
              style={{
                padding: "10px 18px",
                display: "flex",
                gap: 18,
                borderTop: `1px solid ${BORDER2}`,
              }}
            >
              {[
                ["👤", det.person_count ?? 0, "People"],
                ["🚗", det.vehicle_count ?? 0, "Vehicles"],
                ["📦", det.detection_count ?? 0, "Objects"],
              ].map(([ic, v, lb]) => (
                <div key={lb} style={{ fontSize: 12, color: TEXT2 }}>
                  {ic}{" "}
                  <span style={{ color: TEXT1, fontWeight: 600 }}>{v}</span>{" "}
                  {lb}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 1 — LATEST DETECTION
───────────────────────────────────────────────── */
function LatestSection({ det, onOpenGallery }) {
  const [imgHov, setImgHov] = useState(false);
  const [modal, setModal] = useState(false);
  if (!det) return null;
  const color = domColor(det);
  const s = sig(color);
  const imgUrl = `${API}${det.image_url}`;
  const download = () => {
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `safev-${det.sequence_number}.jpg`;
    a.click();
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle
        action={
          <button
            onClick={onOpenGallery}
            style={{
              padding: "5px 14px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.22)",
              color: "#10b981",
              transition: "all 0.2s",
            }}
          >
            Gallery →
          </button>
        }
      >
        Latest Detection
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.65fr 1fr",
          gap: 14,
          background: CARD,
          border: `1px solid ${s.hex}2a`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: `0 0 40px ${s.glow}`,
        }}
      >
        {/* Image side */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => setModal(true)}
          onMouseEnter={() => setImgHov(true)}
          onMouseLeave={() => setImgHov(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 3,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              padding: "3px 9px",
              borderRadius: 5,
              fontSize: 10,
              fontWeight: 600,
              color: TEXT2,
              letterSpacing: "0.1em",
            }}
          >
            LIVE FRAME
          </div>
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 3 }}>
            <SignalBadge color={color} />
          </div>
          <img
            src={imgUrl}
            alt="Latest"
            style={{
              width: "100%",
              height: "100%",
              minHeight: 320,
              objectFit: "cover",
              display: "block",
              transform: imgHov ? "scale(1.025)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
            onError={(e) => (e.target.style.opacity = "0.2")}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: imgHov ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            {imgHov && (
              <span
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  background: "rgba(0,0,0,0.55)",
                  padding: "6px 14px",
                  borderRadius: 6,
                }}
              >
                Click to zoom
              </span>
            )}
          </div>
          {[
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ].map(([r, c], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                zIndex: 2,
                top: r === 0 ? 8 : "auto",
                bottom: r === 1 ? 8 : "auto",
                left: c === 0 ? 8 : "auto",
                right: c === 1 ? 8 : "auto",
                borderTop: r === 0 ? `1.5px solid ${s.hex}88` : "none",
                borderBottom: r === 1 ? `1.5px solid ${s.hex}88` : "none",
                borderLeft: c === 0 ? `1.5px solid ${s.hex}88` : "none",
                borderRight: c === 1 ? `1.5px solid ${s.hex}88` : "none",
              }}
            />
          ))}
        </div>

        {/* Right panel */}
        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            borderLeft: `1px solid ${BORDER2}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TrafficLight color={color} />
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: TEXT3,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Signal
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.hex,
                  fontFamily: "'Syne',sans-serif",
                  textShadow: `0 0 14px ${s.glow}`,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
              {det.traffic_light_countdown && (
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: TEXT1,
                    fontFamily: "'DM Mono',monospace",
                    marginTop: 3,
                    lineHeight: 1,
                  }}
                >
                  {String(det.traffic_light_countdown).padStart(2, "0")}
                  <span
                    style={{
                      fontSize: 12,
                      color: TEXT3,
                      fontWeight: 400,
                      marginLeft: 3,
                    }}
                  >
                    sec
                  </span>
                </div>
              )}
              {det.traffic_light_confidence && (
                <div
                  style={{
                    fontSize: 9,
                    color: TEXT3,
                    marginTop: 4,
                    textTransform: "capitalize",
                  }}
                >
                  conf: {det.traffic_light_confidence}
                </div>
              )}
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}
          >
            <MetricCard
              icon="👤"
              label="People"
              value={det.person_count ?? 0}
              accent="#60a5fa"
            />
            <MetricCard
              icon="🚗"
              label="Vehicles"
              value={det.vehicle_count ?? 0}
              accent="#10b981"
            />
            <MetricCard
              icon="📦"
              label="Objects"
              value={det.detection_count ?? 0}
              accent="#a78bfa"
            />
            <MetricCard
              icon="🎯"
              label="Frame"
              value={`#${det.sequence_number}`}
              accent="#f59e0b"
            />
          </div>

          <div
            style={{
              background: BG,
              borderRadius: 7,
              padding: "9px 13px",
              border: `1px solid ${BORDER2}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: TEXT3,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 3,
              }}
            >
              Captured
            </div>
            <div
              style={{
                fontSize: 12,
                color: TEXT1,
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {dtFmt(det.timestamp)}
            </div>
          </div>

          {det.objects?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: TEXT3,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Objects
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {det.objects.map((o, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "2px 9px",
                      borderRadius: 4,
                      fontSize: 10,
                      background: "rgba(255,255,255,0.03)",
                      color: TEXT2,
                      border: `1px solid ${BORDER2}`,
                    }}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={download}
            style={{
              marginTop: "auto",
              padding: "9px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#10b981",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(16,185,129,0.15)";
              e.currentTarget.style.boxShadow = "0 0 14px rgba(16,185,129,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(16,185,129,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ⬇ Download Image
          </button>
        </div>
      </div>
      {modal && (
        <Modal
          src={imgUrl}
          det={det}
          onClose={() => setModal(false)}
          onDownload={download}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 2 — GALLERY (overlay)
───────────────────────────────────────────────── */
function GallerySection({ history, visible, onClose }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(
    () =>
      filter === "all"
        ? history
        : history.filter((d) => domColor(d) === filter),
    [history, filter],
  );
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8000,
        background: "rgba(0,0,0,0.96)",
        backdropFilter: "blur(18px)",
        overflowY: "auto",
        padding: "22px 26px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "'Syne',sans-serif",
                color: TEXT1,
              }}
            >
              Detection Gallery
            </h2>
            <p style={{ color: TEXT3, fontSize: 12, marginTop: 2 }}>
              {history.length} total frames
            </p>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["all", "red", "yellow", "green"].map((f) => {
                const s = sig(f === "all" ? "unknown" : f);
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 11,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      border: `1px solid ${filter === f ? (f === "all" ? "rgba(255,255,255,0.2)" : s.hex + "55") : BORDER}`,
                      background:
                        filter === f
                          ? f === "all"
                            ? "rgba(255,255,255,0.05)"
                            : s.muted
                          : "transparent",
                      color:
                        filter === f ? (f === "all" ? TEXT1 : s.hex) : TEXT2,
                      transition: "all 0.15s",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <button
              onClick={onClose}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 12,
                cursor: "pointer",
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.22)",
                color: "#f43f5e",
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
            gap: 9,
          }}
        >
          {filtered.map((d, i) => {
            const color = domColor(d);
            const s = sig(color);
            return (
              <GalleryThumb
                key={d.id}
                det={d}
                s={s}
                onClick={() =>
                  setModal({ src: `${API}${d.image_url}`, det: d })
                }
              />
            );
          })}
        </div>
      </div>
      {modal && (
        <Modal
          src={modal.src}
          det={modal.det}
          onClose={() => setModal(null)}
          onDownload={() => {
            const a = document.createElement("a");
            a.href = modal.src;
            a.download = `safev-${modal.det.sequence_number}.jpg`;
            a.click();
          }}
        />
      )}
    </div>
  );
}
function GalleryThumb({ det, s, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        border: `1.5px solid ${hov ? s.hex + "77" : BORDER2}`,
        transform: hov ? "scale(1.04)" : "scale(1)",
        boxShadow: hov ? `0 0 16px ${s.glow}` : "none",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        background: BG3,
      }}
    >
      <img
        src={`${API}${det.image_url}`}
        alt=""
        style={{
          width: "100%",
          aspectRatio: "4/3",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hov
            ? "linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 50%)"
            : "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 60%)",
          transition: "background 0.2s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 8,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT1 }}>
          #{det.sequence_number}
        </div>
        <div style={{ fontSize: 9, color: TEXT2, marginTop: 1 }}>
          {tFmt(det.timestamp)}
        </div>
        {hov && (
          <div
            style={{
              display: "flex",
              gap: 7,
              fontSize: 9,
              color: TEXT2,
              marginTop: 2,
            }}
          >
            <span>👤{det.person_count ?? 0}</span>
            <span>🚗{det.vehicle_count ?? 0}</span>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: s.hex,
          boxShadow: `0 0 7px ${s.glow}`,
        }}
      />
      {hov && (
        <div style={{ position: "absolute", top: 6, left: 6 }}>
          <span
            style={{
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 4,
              background: "rgba(0,0,0,0.65)",
              color: s.hex,
              border: `1px solid ${s.hex}44`,
            }}
          >
            {s.label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 3 — DOT TIMELINE
───────────────────────────────────────────────── */
function TimelineSection({ history }) {
  const [hov, setHov] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [modal, setModal] = useState(null);
  const ref = useRef(null);
  const items = useMemo(() => [...history].reverse(), [history]);
  if (!items.length) return null;
  const det = hov !== null ? items[hov] : null;
  const color = det ? domColor(det) : "unknown";
  const s = sig(color);

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Detection Timeline</SectionTitle>
      <div
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "24px 18px 18px",
        }}
      >
        <div ref={ref} style={{ position: "relative", paddingBottom: 4 }}>
          <div
            style={{
              position: "absolute",
              top: 9,
              left: 0,
              right: 0,
              height: 1,
              background: BORDER2,
              borderRadius: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              paddingBottom: 22,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.07) transparent",
            }}
          >
            {items.map((d, i) => {
              const c = domColor(d);
              const s2 = sig(c);
              const isH = hov === i;
              return (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: "1 0 30px",
                    minWidth: 30,
                    cursor: "pointer",
                  }}
                  onMouseMove={(e) => {
                    setHov(i);
                    const r = ref.current?.getBoundingClientRect();
                    setPos({
                      x: e.clientX - (r?.left || 0),
                      y: e.clientY - (r?.top || 0),
                    });
                  }}
                  onMouseLeave={() => setHov(null)}
                  onClick={() =>
                    setModal({ src: `${API}${d.image_url}`, det: d })
                  }
                >
                  <div
                    style={{
                      width: isH ? 17 : 9,
                      height: isH ? 17 : 9,
                      borderRadius: "50%",
                      background: isH ? s2.hex : s2.hex + "55",
                      border: `1.5px solid ${s2.hex}`,
                      boxShadow: isH ? `0 0 12px ${s2.glow}` : "none",
                      transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                      flexShrink: 0,
                      zIndex: isH ? 5 : 1,
                    }}
                  />
                  {i % 5 === 0 && (
                    <div
                      style={{
                        fontSize: 8,
                        color: TEXT3,
                        marginTop: 5,
                        fontFamily: "'DM Mono',monospace",
                      }}
                    >
                      #{d.sequence_number}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {hov !== null && det && (
            <div
              style={{
                position: "absolute",
                left: Math.min(
                  Math.max(pos.x - 88, 0),
                  (ref.current?.offsetWidth || 400) - 185,
                ),
                top: pos.y - 195,
                width: 180,
                zIndex: 100,
                pointerEvents: "none",
                animation: "fadeUp 0.14s ease",
              }}
            >
              <div
                style={{
                  background: "rgba(4,8,16,0.97)",
                  border: `1px solid ${s.hex}44`,
                  borderRadius: 9,
                  overflow: "hidden",
                  boxShadow: `0 14px 40px rgba(0,0,0,0.9),0 0 18px ${s.glow}`,
                  backdropFilter: "blur(16px)",
                }}
              >
                <img
                  src={`${API}${det.image_url}`}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "16/10",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: "8px 11px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: s.hex,
                        boxShadow: `0 0 5px ${s.glow}`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{ color: s.hex, fontSize: 11, fontWeight: 600 }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{ color: TEXT3, fontSize: 9, marginLeft: "auto" }}
                    >
                      #{det.sequence_number}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 9,
                      fontSize: 10,
                      color: TEXT2,
                    }}
                  >
                    <span>👤{det.person_count ?? 0}</span>
                    <span>🚗{det.vehicle_count ?? 0}</span>
                    {det.traffic_light_countdown && (
                      <span style={{ color: s.hex }}>
                        ⏱{det.traffic_light_countdown}s
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: TEXT3,
                      fontSize: 9,
                      marginTop: 3,
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    {tFmt(det.timestamp)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `5px solid ${s.hex}44`,
                }}
              />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          {["red", "yellow", "green"].map((c) => (
            <div
              key={c}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: SIG[c].hex,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: TEXT3,
                  textTransform: "capitalize",
                }}
              >
                {SIG[c].label}
              </span>
            </div>
          ))}
          <span style={{ fontSize: 9, color: TEXT3 }}>
            · Click dot to inspect
          </span>
        </div>
      </div>
      {modal && (
        <Modal
          src={modal.src}
          det={modal.det}
          onClose={() => setModal(null)}
          onDownload={() => {
            const a = document.createElement("a");
            a.href = modal.src;
            a.download = `safev-${modal.det.sequence_number}.jpg`;
            a.click();
          }}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 4 — TIME-LAPSE
───────────────────────────────────────────────── */
function TimeLapseSection({ history }) {
  const frames = useMemo(() => [...history].reverse(), [history]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const iRef = useRef(null);

  const stop = useCallback(() => {
    clearInterval(iRef.current);
    setPlaying(false);
  }, []);
  const play = useCallback(() => {
    if (!frames.length) return;
    setPlaying(true);
    iRef.current = setInterval(() => {
      setFrameIdx((i) => {
        const n = i + 1;
        if (n >= frames.length) {
          stop();
          return 0;
        }
        setProgress((n / (frames.length - 1)) * 100);
        return n;
      });
    }, 1000 / speed);
  }, [frames.length, speed, stop]);

  useEffect(() => {
    if (playing) {
      stop();
      play();
    }
  }, [speed]);
  useEffect(() => () => clearInterval(iRef.current), []);

  const toggle = () => (playing ? stop() : play());
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = (e.clientX - r.left) / r.width;
    const i = Math.round(p * (frames.length - 1));
    setFrameIdx(Math.max(0, Math.min(i, frames.length - 1)));
    setProgress(p * 100);
  };

  if (!frames.length) return null;
  const frame = frames[frameIdx] || frames[0];
  const color = domColor(frame);
  const s = sig(color);

  const CB = {
    width: 34,
    height: 34,
    borderRadius: 7,
    fontSize: 12,
    cursor: "pointer",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${BORDER}`,
    color: TEXT2,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Traffic Time-Lapse</SectionTitle>
      <div
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", background: BG }}>
          <img
            src={`${API}${frame.image_url}`}
            alt=""
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "contain",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              gap: 7,
            }}
          >
            <SignalBadge color={color} />
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 5,
                fontSize: 10,
                background: "rgba(0,0,0,0.65)",
                color: TEXT2,
                backdropFilter: "blur(8px)",
              }}
            >
              Frame {frameIdx + 1}/{frames.length}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "3px 9px",
              borderRadius: 5,
              fontSize: 10,
              background: "rgba(0,0,0,0.65)",
              color: TEXT2,
              backdropFilter: "blur(8px)",
              fontFamily: "'DM Mono',monospace",
            }}
          >
            {tFmt(frame.timestamp)}
          </div>
          {[
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ].map(([r, c], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                top: r === 0 ? 7 : "auto",
                bottom: r === 1 ? 7 : "auto",
                left: c === 0 ? 7 : "auto",
                right: c === 1 ? 7 : "auto",
                borderTop: r === 0 ? `1.5px solid ${s.hex}66` : "none",
                borderBottom: r === 1 ? `1.5px solid ${s.hex}66` : "none",
                borderLeft: c === 0 ? `1.5px solid ${s.hex}66` : "none",
                borderRight: c === 1 ? `1.5px solid ${s.hex}66` : "none",
              }}
            />
          ))}
          {playing && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#f43f5e",
                animation: "pulse 1s ease infinite",
              }}
            />
          )}
        </div>

        <div
          style={{ padding: "13px 18px", borderTop: `1px solid ${BORDER2}` }}
        >
          <div
            onClick={seek}
            style={{
              height: 3,
              background: BORDER,
              borderRadius: 2,
              marginBottom: 12,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progress}%`,
                background: s.hex,
                borderRadius: 2,
                boxShadow: `0 0 5px ${s.glow}`,
                transition: "width 0.1s",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: `${progress}%`,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: s.hex,
                boxShadow: `0 0 7px ${s.glow}`,
                marginLeft: -5,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setFrameIdx((i) => Math.max(0, i - 1))}
                style={CB}
              >
                ◀
              </button>
              <button
                onClick={toggle}
                style={{
                  ...CB,
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg,${s.hex}cc,${s.hex}88)`,
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  boxShadow: `0 0 14px ${s.glow}`,
                }}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button
                onClick={() =>
                  setFrameIdx((i) => Math.min(frames.length - 1, i + 1))
                }
                style={CB}
              >
                ▶
              </button>
              <button
                onClick={() => {
                  stop();
                  setFrameIdx(0);
                  setProgress(0);
                }}
                style={CB}
              >
                ⏹
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10, color: TEXT3 }}>Speed</span>
              {[1, 2, 4, 8].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontSize: 10,
                    cursor: "pointer",
                    border: `1px solid ${speed === sp ? s.hex + "55" : BORDER}`,
                    background: speed === sp ? s.muted : "transparent",
                    color: speed === sp ? s.hex : TEXT2,
                    transition: "all 0.15s",
                  }}
                >
                  {sp}×
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: 10,
                color: TEXT3,
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {frameIdx + 1}/{frames.length}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "0 18px 13px",
            display: "flex",
            gap: 4,
            overflowX: "auto",
            scrollbarWidth: "thin",
          }}
        >
          {frames.map((f, i) => {
            const c = domColor(f);
            const fs = sig(c);
            const iC = i === frameIdx;
            return (
              <div
                key={f.id}
                onClick={() => {
                  setFrameIdx(i);
                  setProgress((i / (frames.length - 1)) * 100);
                }}
                style={{
                  flexShrink: 0,
                  width: 52,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: `1.5px solid ${iC ? fs.hex : "transparent"}`,
                  opacity: iC ? 1 : 0.4,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: iC ? `0 0 7px ${fs.glow}` : "none",
                }}
              >
                <img
                  src={`${API}${f.image_url}`}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 5 — STATS
───────────────────────────────────────────────── */
function StatsSection({ stats, history }) {
  if (!stats) return null;
  const totalPeople = history.reduce((a, d) => a + (d.person_count || 0), 0);
  const totalVehicles = history.reduce((a, d) => a + (d.vehicle_count || 0), 0);
  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Session Statistics</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 9,
        }}
      >
        <MetricCard
          icon="📸"
          label="Total Frames"
          value={stats.total_detections}
          accent="#60a5fa"
          sub="All time"
        />
        <MetricCard
          icon="👤"
          label="People Seen"
          value={totalPeople}
          accent="#a78bfa"
          sub="Cumulative"
        />
        <MetricCard
          icon="🚗"
          label="Vehicles"
          value={totalVehicles}
          accent="#10b981"
          sub="Cumulative"
        />
        <MetricCard
          icon="🔴"
          label="Red Lights"
          value={stats.red_lights}
          accent="#f43f5e"
        />
        <MetricCard
          icon="🟡"
          label="Yellow Lights"
          value={stats.yellow_lights}
          accent="#f59e0b"
        />
        <MetricCard
          icon="🟢"
          label="Green Lights"
          value={stats.green_lights}
          accent="#10b981"
        />
        <MetricCard
          icon="🎯"
          label="With Signal"
          value={stats.detections_with_traffic_light || 0}
          accent="#a78bfa"
        />
        <MetricCard
          icon="⏱"
          label="Countdowns"
          value={stats.countdown_detected || 0}
          accent="#60a5fa"
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 6 — WAVEFORM TRAFFIC ANALYSIS
───────────────────────────────────────────────── */
function WaveformAnalysis({ history }) {
  const canvasVehicle = useRef(null);
  const canvasPeople = useRef(null);
  const canvasSignal = useRef(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [hovIdx, setHovIdx] = useState(null);
  const wrapRef = useRef(null);

  // Chronological order (oldest → newest)
  const frames = useMemo(() => [...history].reverse(), [history]);

  // Build data series
  const vehicleData = useMemo(
    () => frames.map((d) => d.vehicle_count || 0),
    [frames],
  );
  const peopleData = useMemo(
    () => frames.map((d) => d.person_count || 0),
    [frames],
  );
  const signalData = useMemo(
    () =>
      frames.map((d) => {
        const c = domColor(d);
        return c === "red" ? 3 : c === "yellow" ? 2 : c === "green" ? 1 : 0;
      }),
    [frames],
  );
  const combinedData = useMemo(
    () => frames.map((d) => (d.vehicle_count || 0) + (d.person_count || 0)),
    [frames],
  );

  // Peak stats
  const peakVehicles = useMemo(
    () => Math.max(...vehicleData, 0),
    [vehicleData],
  );
  const peakPeople = useMemo(() => Math.max(...peopleData, 0), [peopleData]);
  const avgVehicles = useMemo(
    () =>
      vehicleData.length
        ? (vehicleData.reduce((a, v) => a + v, 0) / vehicleData.length).toFixed(
            1,
          )
        : 0,
    [vehicleData],
  );
  const avgPeople = useMemo(
    () =>
      peopleData.length
        ? (peopleData.reduce((a, v) => a + v, 0) / peopleData.length).toFixed(1)
        : 0,
    [peopleData],
  );
  const redCount = useMemo(
    () => signalData.filter((v) => v === 3).length,
    [signalData],
  );
  const greenCount = useMemo(
    () => signalData.filter((v) => v === 1).length,
    [signalData],
  );

  // Draw helpers
  function drawWaveform(canvas, data, colorTop, colorBot, label, unit = "") {
    if (!canvas || !data.length) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const PAD = { top: 28, right: 20, bottom: 30, left: 44 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const max = Math.max(...data, 1);
    const n = data.length;

    const xOf = (i) => PAD.left + (i / Math.max(n - 1, 1)) * cW;
    const yOf = (v) => PAD.top + cH - (v / max) * cH;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach((r) => {
      const y = PAD.top + cH - r * cH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + cW, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = `9px 'DM Mono', monospace`;
      ctx.textAlign = "right";
      ctx.fillText(Math.round(max * r), PAD.left - 6, y + 3);
    });

    // Vertical grid / x labels (every 5th)
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.font = `8px 'DM Mono', monospace`;
    data.forEach((_, i) => {
      if (i % Math.max(1, Math.floor(n / 8)) === 0) {
        const x = xOf(i);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.moveTo(x, PAD.top);
        ctx.lineTo(x, PAD.top + cH);
        ctx.stroke();
        ctx.fillText(`#${frames[i]?.sequence_number || i}`, x, H - 6);
      }
    });

    if (n < 2) return;

    // Fill gradient
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grad.addColorStop(
      0,
      colorTop.replace(")", ",0.35)").replace("rgb", "rgba"),
    );
    grad.addColorStop(1, colorTop.replace(")", ",0)").replace("rgb", "rgba"));

    // Smooth path (catmull-rom like)
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0]));
    for (let i = 1; i < n - 1; i++) {
      const xc = (xOf(i) + xOf(i + 1)) / 2;
      const yc = (yOf(data[i]) + yOf(data[i + 1])) / 2;
      ctx.quadraticCurveTo(xOf(i), yOf(data[i]), xc, yc);
    }
    ctx.lineTo(xOf(n - 1), yOf(data[n - 1]));
    ctx.lineTo(xOf(n - 1), PAD.top + cH);
    ctx.lineTo(xOf(0), PAD.top + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0]));
    for (let i = 1; i < n - 1; i++) {
      const xc = (xOf(i) + xOf(i + 1)) / 2,
        yc = (yOf(data[i]) + yOf(data[i + 1])) / 2;
      ctx.quadraticCurveTo(xOf(i), yOf(data[i]), xc, yc);
    }
    ctx.lineTo(xOf(n - 1), yOf(data[n - 1]));
    ctx.strokeStyle = colorTop;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.shadowColor = colorTop;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots on data points
    data.forEach((v, i) => {
      if (n <= 30 || i % Math.max(1, Math.floor(n / 20)) === 0) {
        ctx.beginPath();
        ctx.arc(xOf(i), yOf(v), 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colorTop;
        ctx.shadowColor = colorTop;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Hover crosshair
    if (hovIdx !== null && hovIdx < n) {
      const x = xOf(hovIdx);
      const y = yOf(data[hovIdx]);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + cH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + cW, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = colorTop;
      ctx.shadowColor = colorTop;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Tooltip
      const val = data[hovIdx];
      const tip = `${val}${unit}`;
      ctx.font = "bold 11px 'DM Mono', monospace";
      const tw = ctx.measureText(tip).width + 14;
      let tx = x + 8;
      if (tx + tw > W - PAD.right) tx = x - tw - 8;
      ctx.fillStyle = "rgba(8,15,26,0.9)";
      roundRect(ctx, tx, y - 14, tw, 22, 4);
      ctx.fillStyle = colorTop;
      ctx.textAlign = "left";
      ctx.fillText(tip, tx + 7, y + 2);
    }
  }

  function drawSignalWaveform(canvas) {
    if (!canvas || !signalData.length) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    const PAD = { top: 16, right: 20, bottom: 28, left: 44 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const n = signalData.length;
    const COLORS = ["#475569", "#10b981", "#f59e0b", "#f43f5e"];
    const LABELS = ["—", "Green", "Yellow", "Red"];
    const barW = Math.max(1, cW / n - 1.5);

    // Y axis labels
    [0, 1, 2, 3].forEach((v) => {
      const y = PAD.top + cH - (v / 3) * cH;
      ctx.fillStyle = COLORS[v];
      ctx.font = `8px 'DM Mono', monospace`;
      ctx.textAlign = "right";
      ctx.fillText(LABELS[v], PAD.left - 5, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + cW, y);
      ctx.stroke();
    });

    // Bars
    signalData.forEach((v, i) => {
      if (v === 0) return;
      const x = PAD.left + (i / Math.max(n - 1, 1)) * cW - barW / 2;
      const barH = (v / 3) * cH;
      const y = PAD.top + cH - barH;
      ctx.fillStyle = COLORS[v] + "bb";
      ctx.shadowColor = COLORS[v];
      ctx.shadowBlur = 4;
      roundRect(ctx, x, y, barW, barH, 2);
      ctx.shadowBlur = 0;
    });

    // Hover
    if (hovIdx !== null && hovIdx < n) {
      const x = PAD.left + (hovIdx / Math.max(n - 1, 1)) * cW;
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + cH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  }

  useEffect(() => {
    if (activeTab === "vehicles")
      drawWaveform(
        canvasVehicle.current,
        vehicleData,
        "#10b981",
        "#10b981",
        "Vehicles",
      );
    if (activeTab === "people")
      drawWaveform(
        canvasPeople.current,
        peopleData,
        "#60a5fa",
        "#60a5fa",
        "People",
      );
    if (activeTab === "combined")
      drawWaveform(
        canvasVehicle.current,
        combinedData,
        "#a78bfa",
        "#a78bfa",
        "Total",
      );
    if (activeTab === "signal") drawSignalWaveform(canvasSignal.current);
  }, [activeTab, vehicleData, peopleData, signalData, combinedData, hovIdx]);

  // Mouse position → frame index
  const handleMouse = (e) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const PAD_LEFT = 44;
    const PAD_RIGHT = 20;
    const cW = r.width - PAD_LEFT - PAD_RIGHT;
    const x = e.clientX - r.left - PAD_LEFT;
    const pct = Math.max(0, Math.min(1, x / cW));
    const idx = Math.round(pct * (frames.length - 1));
    setHovIdx(idx);
  };

  if (!frames.length) return null;

  const tabs = [
    { key: "vehicles", label: "Vehicles", color: "#10b981" },
    { key: "people", label: "Pedestrians", color: "#60a5fa" },
    { key: "combined", label: "Combined", color: "#a78bfa" },
    { key: "signal", label: "Signal", color: "#f43f5e" },
  ];

  const hovFrame = hovIdx !== null ? frames[hovIdx] : null;
  const hovColor = hovFrame ? domColor(hovFrame) : "unknown";
  const hovSig = sig(hovColor);

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Traffic Waveform Analysis</SectionTitle>

      <div
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Tabs + summary bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: `1px solid ${BORDER2}`,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "5px 13px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: `1px solid ${activeTab === t.key ? t.color + "55" : BORDER}`,
                  background:
                    activeTab === t.key ? t.color + "10" : "transparent",
                  color: activeTab === t.key ? t.color : TEXT2,
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick summary pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["Peak Vehicles", peakVehicles, "#10b981"],
              ["Avg Vehicles", avgVehicles, "#10b981"],
              ["Peak People", peakPeople, "#60a5fa"],
              ["Avg People", avgPeople, "#60a5fa"],
              ["Red Frames", redCount, "#f43f5e"],
              ["Green Frames", greenCount, "#10b981"],
            ].map(([lb, v, c]) => (
              <div
                key={lb}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: 5,
                  background: BG,
                  border: `1px solid ${c}22`,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: TEXT3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {lb}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c,
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div style={{ padding: "16px 18px 0" }}>
          <div
            ref={wrapRef}
            style={{ position: "relative", height: 180, cursor: "crosshair" }}
            onMouseMove={handleMouse}
            onMouseLeave={() => setHovIdx(null)}
          >
            {(activeTab === "vehicles" ||
              activeTab === "people" ||
              activeTab === "combined") && (
              <canvas
                ref={canvasVehicle}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            )}
            {activeTab === "signal" && (
              <canvas
                ref={canvasSignal}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            )}
            {activeTab === "people" && (
              <canvas
                ref={canvasPeople}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                }}
              />
            )}
          </div>

          {/* Hover info bar */}
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px",
              borderTop: `1px solid ${BORDER2}`,
              marginTop: 8,
            }}
          >
            {hovFrame ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: hovSig.hex,
                      boxShadow: `0 0 6px ${hovSig.glow}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: TEXT1,
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    Frame #{hovFrame.sequence_number}
                  </span>
                  <span style={{ fontSize: 11, color: TEXT2 }}>
                    {dtFmt(hovFrame.timestamp)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    ["👤", hovFrame.person_count ?? 0, "#60a5fa"],
                    ["🚗", hovFrame.vehicle_count ?? 0, "#10b981"],
                    ["🚦", hovSig.label, hovSig.hex],
                  ].map(([ic, v, c]) => (
                    <span key={ic} style={{ fontSize: 11, color: TEXT2 }}>
                      {ic}{" "}
                      <span style={{ color: c, fontWeight: 600 }}>{v}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <span style={{ fontSize: 10, color: TEXT3 }}>
                Hover over the waveform to inspect a frame
              </span>
            )}
          </div>
        </div>

        {/* Mini bar strip — signal distribution per frame */}
        <div
          style={{
            padding: "10px 18px 14px",
            borderTop: `1px solid ${BORDER2}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: TEXT3,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 7,
            }}
          >
            Signal timeline — each bar = one frame
          </div>
          <div
            style={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-end",
              height: 32,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {frames.map((d, i) => {
              const c = domColor(d);
              const s2 = sig(c);
              const isH = hovIdx === i;
              return (
                <div
                  key={d.id}
                  title={`#${d.sequence_number}: ${s2.label}`}
                  style={{
                    flex: "1 0 4px",
                    minWidth: 4,
                    maxWidth: 10,
                    height: isH ? 32 : 20,
                    background: isH ? s2.hex : s2.hex + "77",
                    borderRadius: "2px 2px 0 0",
                    boxShadow: isH ? `0 0 8px ${s2.glow}` : "none",
                    transition: "height 0.15s, background 0.15s",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => setHovIdx(i)}
                  onMouseLeave={() => setHovIdx(null)}
                />
              );
            })}
          </div>
        </div>

        {/* 24h hourly heatmap */}
        <div
          style={{
            padding: "10px 18px 16px",
            borderTop: `1px solid ${BORDER2}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: TEXT3,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Hourly activity heatmap
          </div>
          {(() => {
            const hourly = Array.from({ length: 24 }, (_, h) => ({
              h,
              total: 0,
              red: 0,
              green: 0,
              yellow: 0,
            }));
            frames.forEach((d) => {
              const h = new Date(d.timestamp).getHours();
              hourly[h].total++;
              const c = domColor(d);
              if (c in hourly[h]) hourly[h][c]++;
            });
            const maxH = Math.max(...hourly.map((h) => h.total), 1);
            return (
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 40,
                }}
              >
                {hourly.map((h) => {
                  const pct = h.total / maxH;
                  const domC =
                    h.red >= h.green && h.red >= h.yellow
                      ? "red"
                      : h.green >= h.yellow
                        ? "green"
                        : "yellow";
                  const hs = h.total > 0 ? sig(domC) : sig("unknown");
                  return (
                    <div
                      key={h.h}
                      title={`${h.h}:00 — ${h.total} detections`}
                      style={{
                        flex: 1,
                        height: `${Math.max(pct * 100, 6)}%`,
                        minHeight: 3,
                        background: h.total > 0 ? hs.hex : BORDER,
                        borderRadius: "2px 2px 0 0",
                        opacity: h.total > 0 ? 0.45 + pct * 0.55 : 0.2,
                        transition: "all 0.2s",
                        cursor: "default",
                        boxShadow:
                          h.total > 0 && pct > 0.5
                            ? `0 0 6px ${hs.glow}`
                            : "none",
                      }}
                    />
                  );
                })}
              </div>
            );
          })()}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            {["0", "6", "12", "18", "23"].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 8,
                  color: TEXT3,
                  fontFamily: "'DM Mono',monospace",
                }}
              >
                {h}:00
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────── */
export default function SafeVDashboard() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(true);
  const [gallery, setGallery] = useState(false);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async () => {
    try {
      const [lr, hr, sr] = await Promise.all([
        fetch(`${API}/latest`),
        fetch(`${API}/history?limit=80`),
        fetch(`${API}/stats`),
      ]);
      const [ld, hd, sd] = await Promise.all([lr.json(), hr.json(), sr.json()]);
      if (!ld.message) setLatest(ld);
      setHistory(hd.detections || []);
      setStats(sd);
      setError(null);
    } catch {
      setError("Cannot reach backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (!live) return;
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [live, load]);

  const capture = async () => {
    setBusy(true);
    try {
      await fetch(`${API}/webcam/capture`);
      await load();
    } catch {
      setError("Capture failed");
    } finally {
      setBusy(false);
    }
  };

  const latColor = latest ? domColor(latest) : "unknown";
  const latSig = sig(latColor);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ fontSize: 44, animation: "spin 2s linear infinite" }}>
          🚦
        </div>
        <div
          style={{
            color: TEXT3,
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            letterSpacing: "0.22em",
          }}
        >
          LOADING SAFEV...
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        button{font-family:inherit;}
      `}</style>

      {/* Ambient bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse 75% 45% at 50% -5%, ${latSig.color}06 0%, transparent 65%)`,
          transition: "background 1.4s ease",
        }}
      />
      {/* Grid texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(${BORDER2} 1px,transparent 1px),linear-gradient(90deg,${BORDER2} 1px,transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.4,
        }}
      />

      <GallerySection
        history={history}
        visible={gallery}
        onClose={() => setGallery(false)}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 20px 52px",
        }}
      >
        {/* NAV */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0 20px",
            borderBottom: `1px solid ${BORDER2}`,
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: 12,
                  background: `radial-gradient(circle,${latSig.glow} 0%,transparent 70%)`,
                  animation: "pulse 2.5s ease infinite",
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: BG3,
                  border: `1px solid ${latSig.hex}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🚦
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                }}
              >
                SafeV{" "}
                <span style={{ color: latSig.hex, transition: "color 0.9s" }}>
                  Traffic Monitor
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: error ? "#f43f5e" : "#10b981",
                    animation: "blink 2s ease infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: TEXT3,
                    letterSpacing: "0.07em",
                  }}
                >
                  {error ? "OFFLINE" : "AI Detection Active"}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: TEXT3,
                fontFamily: "'DM Mono',monospace",
                background: BG3,
                border: `1px solid ${BORDER}`,
                padding: "5px 12px",
                borderRadius: 7,
                letterSpacing: "0.05em",
              }}
            >
              {clock.toLocaleTimeString([])}
            </div>
            <button
              onClick={() => setLive((v) => !v)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                border: `1px solid ${live ? "rgba(16,185,129,0.35)" : BORDER}`,
                background: live ? "rgba(16,185,129,0.07)" : BG3,
                color: live ? "#10b981" : TEXT2,
                transition: "all 0.2s",
              }}
            >
              {live ? "● Live" : "○ Paused"}
            </button>
            <button
              onClick={load}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 11,
                cursor: "pointer",
                background: BG3,
                border: `1px solid ${BORDER}`,
                color: TEXT2,
                transition: "all 0.2s",
              }}
            >
              ↻ Refresh
            </button>
            <button
              onClick={capture}
              disabled={busy}
              style={{
                padding: "6px 16px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 600,
                cursor: busy ? "default" : "pointer",
                background: busy
                  ? BG3
                  : `linear-gradient(135deg,${latSig.hex}cc,${latSig.hex}88)`,
                color: busy ? TEXT2 : "#fff",
                border: "none",
                boxShadow: busy ? "none" : `0 0 16px ${latSig.glow}`,
                transition: "all 0.25s",
                opacity: busy ? 0.55 : 1,
              }}
            >
              {busy ? "Capturing…" : "📸 Capture"}
            </button>
          </div>
        </nav>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex",
              gap: 9,
              alignItems: "center",
              background: "rgba(244,63,94,0.05)",
              border: "1px solid rgba(244,63,94,0.18)",
              borderRadius: 9,
              padding: "10px 14px",
              marginBottom: 18,
              animation: "fadeUp 0.3s ease",
            }}
          >
            <span style={{ color: "#f43f5e" }}>⚠</span>
            <span
              style={{ color: "rgba(255,150,150,0.7)", fontSize: 12, flex: 1 }}
            >
              {error}
            </span>
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "#f43f5e",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Sections */}
        {latest ? (
          <LatestSection det={latest} onOpenGallery={() => setGallery(true)} />
        ) : (
          <div style={{ textAlign: "center", padding: "70px 0", color: TEXT3 }}>
            <div style={{ fontSize: 50, marginBottom: 12, opacity: 0.3 }}>
              🚦
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              No detections yet
            </div>
            <div style={{ fontSize: 12, marginTop: 5 }}>
              Press Capture to begin
            </div>
          </div>
        )}

        <StatsSection stats={stats} history={history} />

        {history.length > 0 && (
          <>
            <TimelineSection history={history} />
            <TimeLapseSection history={history} />
            <WaveformAnalysis history={history} />
          </>
        )}
      </div>
    </div>
  );
}
