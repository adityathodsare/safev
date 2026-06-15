"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_BASE_URL } from "@/lib/config";

/* ─────────────────────────────────────────────────
   CONFIG & THEME
───────────────────────────────────────────────── */
const API = API_BASE_URL.replace(/\/$/, "");
const POLL_MS = 4000;
const GALLERY_LIMIT = 80;

const T = {
  page: "page-container relative min-h-screen",
  textPrimary: "text-theme",
  textSecondary: "text-theme-secondary",
  textMuted: "text-slate-400 dark:text-white/40",
  glass: "glass-card",
  border: "border border-slate-200 dark:border-white/10",
  bgElevated: "bg-white dark:bg-card-dark",
};

const VAR = {
  textPrimary: "var(--theme-text-primary)",
  textSecondary: "var(--theme-text-secondary)",
  textMuted: "var(--theme-text-muted)",
  border: "var(--theme-border)",
  borderSubtle: "var(--theme-border-subtle)",
  bg: "var(--theme-bg-page)",
  bgElevated: "var(--theme-bg-elevated)",
  card: "var(--theme-glass)",
};

const STS = {
  danger: {
    hex: "#f43f5e",
    glow: "rgba(244,63,94,0.32)",
    muted: "rgba(244,63,94,0.09)",
    label: "Overload",
  },
  warn: {
    hex: "#f59e0b",
    glow: "rgba(245,158,11,0.32)",
    muted: "rgba(245,158,11,0.09)",
    label: "Alert",
  },
  ok: {
    hex: "#10b981",
    glow: "rgba(16,185,129,0.32)",
    muted: "rgba(16,185,129,0.09)",
    label: "Normal",
  },
  unknown: {
    hex: "#475569",
    glow: "rgba(71,85,105,0.2)",
    muted: "rgba(71,85,105,0.06)",
    label: "—",
  },
};
const st = (s) => STS[s] || STS.unknown;

function cabinStatus(det) {
  if (!det) return "unknown";
  if (det.overloaded) return "danger";
  if (det.alert) return "warn";
  return "ok";
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

function normalizeCapture(item, idx) {
  return {
    id: item.filename || `cap-${idx}`,
    image_url: item.detected_url,
    passenger_count: item.passenger_count ?? 0,
    overloaded: item.overloaded ?? false,
    alert: item.alert ?? false,
    timestamp: item.timestamp,
    source: item.source,
    filename: item.filename,
    sequence_number: idx + 1,
  };
}

/* ─────────────────────────────────────────────────
   REUSABLES
───────────────────────────────────────────────── */
function StatusBadge({ status, size = "md" }) {
  const s = st(status);
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
      className={`${T.glass} rounded-[10px] px-3.5 py-3 cursor-default transition-all duration-200`}
      style={{
        borderColor: hov ? accent + "44" : undefined,
        boxShadow: hov ? `0 0 16px ${accent}18` : "none",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[15px]">{icon}</span>
        <span className={`text-[9px] uppercase tracking-widest ${T.textMuted}`}>
          {label}
        </span>
      </div>
      <div
        className="text-[21px] font-bold font-mono leading-none"
        style={{ color: accent }}
      >
        {value}
      </div>
      {sub && <div className={`text-[9px] mt-1 ${T.textMuted}`}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className={`text-sm font-bold tracking-wide flex items-center gap-2 ${T.textPrimary}`}
      >
        <span className="w-[3px] h-3.5 rounded-sm bg-gradient-to-b from-purple-500 to-purple-500/30 inline-block" />
        {children}
      </h2>
      {action}
    </div>
  );
}

function CabinIndicator({ status }) {
  const active = status;
  const s = st(active);
  const levels = ["ok", "warn", "danger"];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        background: VAR.bg,
        borderRadius: 14,
        padding: "16px 12px",
        border: `1px solid ${s.hex}33`,
        alignItems: "center",
        boxShadow: `0 0 24px ${s.glow}`,
        flexShrink: 0,
      }}
    >
      {levels.map((c) => (
        <div
          key={c}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: active === c ? STS[c].hex : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${active === c ? STS[c].hex : "rgba(255,255,255,0.07)"}`,
            boxShadow:
              active === c
                ? `0 0 16px ${STS[c].glow},0 0 5px ${STS[c].hex}`
                : "none",
            transition: "all 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

function LiveImage({ url, alt = "Frame" }) {
  const [err, setErr] = useState(false);
  if (!url || err) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: 320,
          background: VAR.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: VAR.textMuted,
          fontSize: 13,
        }}
      >
        {err ? "Image unavailable" : "No image yet"}
      </div>
    );
  }
  return (
    <img
      src={`${API}${url}?t=${Date.now()}`}
      alt={alt}
      onError={() => setErr(true)}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        objectFit: "cover",
        display: "block",
      }}
    />
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
  const status = cabinStatus(det);
  const s = st(status);
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
            background: VAR.bgElevated,
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
              borderBottom: `1px solid ${VAR.borderSubtle}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusBadge status={status} />
              {det && (
                <span style={{ color: VAR.textSecondary, fontSize: 12 }}>
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
              background: VAR.bg,
            }}
          />
          {det && (
            <div
              style={{
                padding: "10px 18px",
                display: "flex",
                gap: 18,
                borderTop: `1px solid ${VAR.borderSubtle}`,
              }}
            >
              {[
                ["👤", det.passenger_count ?? 0, "Passengers"],
                ["📡", det.source ?? "—", "Source"],
                ["⚡", det.overloaded ? "Yes" : "No", "Overload"],
              ].map(([ic, v, lb]) => (
                <div key={lb} style={{ fontSize: 12, color: VAR.textSecondary }}>
                  {ic}{" "}
                  <span style={{ color: VAR.textPrimary, fontWeight: 600 }}>{v}</span>{" "}
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
   SECTION 1 — LATEST
───────────────────────────────────────────────── */
function LatestSection({ det, onOpenGallery }) {
  const [imgHov, setImgHov] = useState(false);
  const [modal, setModal] = useState(false);
  if (!det) return null;
  const status = cabinStatus(det);
  const s = st(status);
  const imgUrl = `${API}${det.detected_url}?t=${Date.now()}`;
  const download = () => {
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `safev-cabin-${det.sequence_number || "latest"}.jpg`;
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
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.22)",
              color: "#a78bfa",
              transition: "all 0.2s",
            }}
          >
            Gallery →
          </button>
        }
      >
        Cabin Monitor — Live
      </SectionTitle>

      <div
        className={`${T.glass} grid grid-cols-[1.65fr_1fr] gap-3.5 rounded-[14px] overflow-hidden`}
        style={{
          border: `1px solid ${s.hex}2a`,
          boxShadow: `0 0 40px ${s.glow}`,
        }}
      >
        <div
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
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
              color: VAR.textSecondary,
              letterSpacing: "0.1em",
            }}
          >
            LIVE FRAME
          </div>
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 3 }}>
            <StatusBadge status={status} />
          </div>
          <LiveImage url={det.detected_url} />
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

        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            borderLeft: `1px solid ${VAR.borderSubtle}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <CabinIndicator status={status} />
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: VAR.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Cabin Status
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
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: VAR.textPrimary,
                  fontFamily: "'DM Mono',monospace",
                  marginTop: 3,
                  lineHeight: 1,
                }}
              >
                {det.passenger_count ?? 0}
                <span
                  style={{
                    fontSize: 12,
                    color: VAR.textMuted,
                    fontWeight: 400,
                    marginLeft: 3,
                  }}
                >
                  pax
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <MetricCard
              icon="👤"
              label="Passengers"
              value={det.passenger_count ?? 0}
              accent="#a78bfa"
            />
            <MetricCard
              icon="📡"
              label="Source"
              value={det.source ?? "—"}
              accent="#60a5fa"
            />
            <MetricCard
              icon="⚡"
              label="Overload"
              value={det.overloaded ? "YES" : "NO"}
              accent={det.overloaded ? "#f43f5e" : "#10b981"}
            />
            <MetricCard
              icon="🎯"
              label="Frame"
              value={`#${det.sequence_number || "—"}`}
              accent="#f59e0b"
            />
          </div>

          <div
            style={{
              background: VAR.bg,
              borderRadius: 7,
              padding: "9px 13px",
              border: `1px solid ${VAR.borderSubtle}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: VAR.textMuted,
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
                color: VAR.textPrimary,
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {dtFmt(det.timestamp)}
            </div>
          </div>

          <button
            onClick={download}
            style={{
              marginTop: "auto",
              padding: "9px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#a78bfa",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.15)";
              e.currentTarget.style.boxShadow = "0 0 14px rgba(139,92,246,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.08)";
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
   SECTION 2 — GALLERY
───────────────────────────────────────────────── */
function GallerySection({ history, visible, onClose }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(
    () =>
      filter === "all"
        ? history
        : history.filter((d) => cabinStatus(d) === filter),
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
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-xl font-bold ${T.textPrimary}`}>
              Capture Gallery
            </h2>
            <p className={`${T.textMuted} text-xs mt-0.5`}>
              {history.length} total frames
            </p>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["all", "ok", "warn", "danger"].map((f) => {
                const s = st(f === "all" ? "unknown" : f);
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
                      border: `1px solid ${filter === f ? (f === "all" ? "rgba(255,255,255,0.2)" : s.hex + "55") : VAR.border}`,
                      background:
                        filter === f
                          ? f === "all"
                            ? "rgba(255,255,255,0.05)"
                            : s.muted
                          : "transparent",
                      color:
                        filter === f
                          ? f === "all"
                            ? VAR.textPrimary
                            : s.hex
                          : VAR.textSecondary,
                      transition: "all 0.15s",
                    }}
                  >
                    {f === "all" ? "all" : s.label.toLowerCase()}
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
          {filtered.map((d) => {
            const status = cabinStatus(d);
            const s = st(status);
            return (
              <GalleryThumb
                key={d.id}
                det={d}
                s={s}
                onClick={() =>
                  setModal({
                    src: `${API}${d.image_url}`,
                    det: d,
                  })
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
            a.download = `safev-cabin-${modal.det.sequence_number}.jpg`;
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
        border: `1.5px solid ${hov ? s.hex + "77" : VAR.borderSubtle}`,
        transform: hov ? "scale(1.04)" : "scale(1)",
        boxShadow: hov ? `0 0 16px ${s.glow}` : "none",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        background: VAR.bgElevated,
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
        onError={(e) => {
          e.target.style.opacity = "0.2";
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
        <div style={{ fontSize: 10, fontWeight: 600, color: VAR.textPrimary }}>
          #{det.sequence_number}
        </div>
        <div style={{ fontSize: 9, color: VAR.textSecondary, marginTop: 1 }}>
          {tFmt(det.timestamp)}
        </div>
        {hov && (
          <div
            style={{
              display: "flex",
              gap: 7,
              fontSize: 9,
              color: VAR.textSecondary,
              marginTop: 2,
            }}
          >
            <span>👤{det.passenger_count ?? 0}</span>
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
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 3 — TIMELINE
───────────────────────────────────────────────── */
function TimelineSection({ history }) {
  const [hov, setHov] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [modal, setModal] = useState(null);
  const ref = useRef(null);
  const items = useMemo(() => [...history].reverse(), [history]);
  if (!items.length) return null;
  const det = hov !== null ? items[hov] : null;
  const status = det ? cabinStatus(det) : "unknown";
  const s = st(status);

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Cabin Timeline</SectionTitle>
      <div
        style={{
          background: VAR.card,
          border: `1px solid ${VAR.border}`,
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
              background: VAR.borderSubtle,
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
              const c = cabinStatus(d);
              const s2 = st(c);
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
                        color: VAR.textMuted,
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
              className="absolute z-[100] w-[180px] pointer-events-none animate-fade-in-up"
              style={{
                left: Math.min(
                  Math.max(pos.x - 88, 0),
                  (ref.current?.offsetWidth || 400) - 185,
                ),
                top: pos.y - 195,
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
                      style={{ color: VAR.textMuted, fontSize: 9, marginLeft: "auto" }}
                    >
                      #{det.sequence_number}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 9,
                      fontSize: 10,
                      color: VAR.textSecondary,
                    }}
                  >
                    <span>👤{det.passenger_count ?? 0}</span>
                  </div>
                  <div
                    style={{
                      color: VAR.textMuted,
                      fontSize: 9,
                      marginTop: 3,
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    {tFmt(det.timestamp)}
                  </div>
                </div>
              </div>
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
          {["ok", "warn", "danger"].map((c) => (
            <div
              key={c}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: STS[c].hex,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: VAR.textMuted,
                  textTransform: "capitalize",
                }}
              >
                {STS[c].label}
              </span>
            </div>
          ))}
          <span style={{ fontSize: 9, color: VAR.textMuted }}>
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
            a.download = `safev-cabin-${modal.det.sequence_number}.jpg`;
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
  const status = cabinStatus(frame);
  const s = st(status);

  const CB = {
    width: 34,
    height: 34,
    borderRadius: 7,
    fontSize: 12,
    cursor: "pointer",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${VAR.border}`,
    color: VAR.textSecondary,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Cabin Time-Lapse</SectionTitle>
      <div
        style={{
          background: VAR.card,
          border: `1px solid ${VAR.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", background: VAR.bg }}>
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
            <StatusBadge status={status} />
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 5,
                fontSize: 10,
                background: "rgba(0,0,0,0.65)",
                color: VAR.textSecondary,
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
              color: VAR.textSecondary,
              backdropFilter: "blur(8px)",
              fontFamily: "'DM Mono',monospace",
            }}
          >
            {tFmt(frame.timestamp)}
          </div>
          {playing && (
            <div className="absolute bottom-2.5 left-2.5 w-[7px] h-[7px] rounded-full bg-purple-500 animate-pulse" />
          )}
        </div>

        <div
          style={{ padding: "13px 18px", borderTop: `1px solid ${VAR.borderSubtle}` }}
        >
          <div
            onClick={seek}
            style={{
              height: 3,
              background: VAR.border,
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
              <span style={{ fontSize: 10, color: VAR.textMuted }}>Speed</span>
              {[1, 2, 4, 8].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontSize: 10,
                    cursor: "pointer",
                    border: `1px solid ${speed === sp ? s.hex + "55" : VAR.border}`,
                    background: speed === sp ? s.muted : "transparent",
                    color: speed === sp ? s.hex : VAR.textSecondary,
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
                color: VAR.textMuted,
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
            const c = cabinStatus(f);
            const fs = st(c);
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
  const totalPax = history.reduce((a, d) => a + (d.passenger_count || 0), 0);
  return (
    <section className="mb-6">
      <SectionTitle>Session Statistics</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        <MetricCard
          icon="📸"
          label="Total Captures"
          value={stats.total_captures ?? 0}
          accent="#60a5fa"
          sub="All time"
        />
        <MetricCard
          icon="👤"
          label="Avg Passengers"
          value={stats.avg_passengers ?? "—"}
          accent="#a78bfa"
          sub="Per capture"
        />
        <MetricCard
          icon="📈"
          label="Peak Passengers"
          value={stats.max_passengers_seen ?? 0}
          accent="#f59e0b"
          sub="Max seen"
        />
        <MetricCard
          icon="⚡"
          label="Overload Events"
          value={stats.overload_events ?? 0}
          accent="#f43f5e"
        />
        <MetricCard
          icon="🔄"
          label="Passengers Seen"
          value={totalPax}
          accent="#10b981"
          sub="Cumulative"
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 6 — OCCUPANCY ANALYSIS
───────────────────────────────────────────────── */
function OccupancyAnalysis({ history }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [hovIdx, setHovIdx] = useState(null);
  const frames = useMemo(() => [...history].reverse(), [history]);
  const paxData = useMemo(
    () => frames.map((d) => d.passenger_count || 0),
    [frames],
  );
  const peakPax = useMemo(() => Math.max(...paxData, 0), [paxData]);
  const avgPax = useMemo(
    () =>
      paxData.length
        ? (paxData.reduce((a, v) => a + v, 0) / paxData.length).toFixed(1)
        : 0,
    [paxData],
  );
  const alertCount = useMemo(
    () => frames.filter((d) => d.alert).length,
    [frames],
  );
  const overloadCount = useMemo(
    () => frames.filter((d) => d.overloaded).length,
    [frames],
  );

  function drawWaveform() {
    const canvas = canvasRef.current;
    if (!canvas || !paxData.length) return;
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
    const max = Math.max(...paxData, 1);
    const n = paxData.length;
    const colorTop = "#a78bfa";
    const xOf = (i) => PAD.left + (i / Math.max(n - 1, 1)) * cW;
    const yOf = (v) => PAD.top + cH - (v / max) * cH;

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

    if (n < 2) return;

    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grad.addColorStop(0, "rgba(167,139,250,0.35)");
    grad.addColorStop(1, "rgba(167,139,250,0)");

    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(paxData[0]));
    for (let i = 1; i < n - 1; i++) {
      const xc = (xOf(i) + xOf(i + 1)) / 2;
      const yc = (yOf(paxData[i]) + yOf(paxData[i + 1])) / 2;
      ctx.quadraticCurveTo(xOf(i), yOf(paxData[i]), xc, yc);
    }
    ctx.lineTo(xOf(n - 1), yOf(paxData[n - 1]));
    ctx.lineTo(xOf(n - 1), PAD.top + cH);
    ctx.lineTo(xOf(0), PAD.top + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(paxData[0]));
    for (let i = 1; i < n - 1; i++) {
      const xc = (xOf(i) + xOf(i + 1)) / 2;
      const yc = (yOf(paxData[i]) + yOf(paxData[i + 1])) / 2;
      ctx.quadraticCurveTo(xOf(i), yOf(paxData[i]), xc, yc);
    }
    ctx.lineTo(xOf(n - 1), yOf(paxData[n - 1]));
    ctx.strokeStyle = colorTop;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = colorTop;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (hovIdx !== null && hovIdx < n) {
      const x = xOf(hovIdx);
      const y = yOf(paxData[hovIdx]);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + cH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = colorTop;
      ctx.shadowColor = colorTop;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  useEffect(() => {
    drawWaveform();
  }, [paxData, hovIdx]);

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
  const hovFrame = hovIdx !== null ? frames[hovIdx] : null;
  const hovStatus = hovFrame ? cabinStatus(hovFrame) : "unknown";
  const hovSig = st(hovStatus);

  return (
    <section style={{ marginBottom: 24 }}>
      <SectionTitle>Occupancy Analysis</SectionTitle>
      <div
        style={{
          background: VAR.card,
          border: `1px solid ${VAR.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: `1px solid ${VAR.borderSubtle}`,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: VAR.textSecondary,
              fontWeight: 500,
            }}
          >
            Passenger count over time
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["Peak", peakPax, "#a78bfa"],
              ["Avg", avgPax, "#a78bfa"],
              ["Alerts", alertCount, "#f59e0b"],
              ["Overload", overloadCount, "#f43f5e"],
            ].map(([lb, v, c]) => (
              <div
                key={lb}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: 5,
                  background: VAR.bg,
                  border: `1px solid ${c}22`,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: VAR.textMuted,
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

        <div style={{ padding: "16px 18px 0" }}>
          <div
            ref={wrapRef}
            style={{ position: "relative", height: 160, cursor: "crosshair" }}
            onMouseMove={handleMouse}
            onMouseLeave={() => setHovIdx(null)}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px",
              borderTop: `1px solid ${VAR.borderSubtle}`,
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
                      color: VAR.textPrimary,
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    Frame #{hovFrame.sequence_number}
                  </span>
                  <span style={{ fontSize: 11, color: VAR.textSecondary }}>
                    {dtFmt(hovFrame.timestamp)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 11, color: VAR.textSecondary }}>
                    👤{" "}
                    <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                      {hovFrame.passenger_count ?? 0}
                    </span>
                  </span>
                  <span style={{ fontSize: 11, color: hovSig.hex, fontWeight: 600 }}>
                    {hovSig.label}
                  </span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: 10, color: VAR.textMuted }}>
                Hover over the waveform to inspect a frame
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "10px 18px 14px",
            borderTop: `1px solid ${VAR.borderSubtle}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: VAR.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 7,
            }}
          >
            Status timeline — each bar = one frame
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
              const c = cabinStatus(d);
              const s2 = st(c);
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
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────── */
export default function InternalCameraPage() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [gallery, setGallery] = useState(false);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async () => {
    try {
      const [lr, gr, sr] = await Promise.all([
        fetch(`${API}/latest`, { signal: AbortSignal.timeout(3000) }),
        fetch(`${API}/captures/list?limit=${GALLERY_LIMIT}`),
        fetch(`${API}/analysis/stats`),
      ]);
      if (!lr.ok) throw new Error(`HTTP ${lr.status}`);
      const [ld, gd, sd] = await Promise.all([
        lr.json(),
        gr.ok ? gr.json() : { captures: [] },
        sr.ok ? sr.json() : null,
      ]);
      setLatest({
        ...ld,
        sequence_number: ld.sequence_number || (gd.captures?.length || 0),
      });
      setHistory((gd.captures || []).map(normalizeCapture));
      setStats(sd);
      setError(null);
    } catch (e) {
      setError(e.message || "Cannot reach backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (!live) return;
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [live, load]);

  const latStatus = latest ? cabinStatus(latest) : "unknown";
  const latSig = st(latStatus);

  if (loading) {
    return (
      <div
        className={`${T.page} flex items-center justify-center flex-col gap-[18px]`}
      >
        <div className="text-[44px] animate-spin">👁️</div>
        <div
          className={`${T.textMuted} font-mono text-xs tracking-[0.22em]`}
        >
          LOADING CABIN MONITOR...
        </div>
      </div>
    );
  }

  return (
    <div className={T.page}>
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-[background] duration-[1400ms]"
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% -5%, ${latSig.hex}06 0%, transparent 65%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${VAR.borderSubtle} 1px,transparent 1px),linear-gradient(90deg,${VAR.borderSubtle} 1px,transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      <GallerySection
        history={history}
        visible={gallery}
        onClose={() => setGallery(false)}
      />

      <div className="relative z-[1] max-w-[1180px] mx-auto px-5 pb-[52px]">
        <nav className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-white/10 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="absolute -inset-[5px] rounded-xl animate-pulse"
                style={{
                  background: `radial-gradient(circle,${latSig.glow} 0%,transparent 70%)`,
                }}
              />
              <div
                className={`relative w-[38px] h-[38px] rounded-[9px] ${T.bgElevated} flex items-center justify-center text-lg`}
                style={{ border: `1px solid ${latSig.hex}33` }}
              >
                👁️
              </div>
            </div>
            <div>
              <div className="font-extrabold text-[17px] tracking-tight leading-none">
                SafeV{" "}
                <span
                  className="transition-colors duration-[900ms]"
                  style={{ color: latSig.hex }}
                >
                  Cabin Monitor
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className={`w-[5px] h-[5px] rounded-full animate-pulse ${error ? "bg-rose-500" : "bg-emerald-500"}`}
                />
                <span className={`text-[10px] tracking-wide ${T.textMuted}`}>
                  {error ? "OFFLINE" : "Internal AI Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <div
              className={`text-xs font-mono ${T.textMuted} ${T.bgElevated} ${T.border} px-3 py-1.5 rounded-[7px] tracking-wide`}
            >
              {clock.toLocaleTimeString([])}
            </div>
            <button
              onClick={() => setLive((v) => !v)}
              className={`px-3.5 py-1.5 rounded-[7px] text-[11px] font-medium cursor-pointer transition-all duration-200 ${T.bgElevated}`}
              style={{
                border: `1px solid ${live ? "rgba(139,92,246,0.35)" : "var(--theme-border)"}`,
                background: live ? "rgba(139,92,246,0.07)" : undefined,
                color: live ? "#a78bfa" : "var(--theme-text-secondary)",
              }}
            >
              {live ? "● Live" : "○ Paused"}
            </button>
            <button
              onClick={load}
              className={`px-3.5 py-1.5 rounded-[7px] text-[11px] cursor-pointer transition-all duration-200 ${T.bgElevated} ${T.textSecondary} ${T.border}`}
            >
              ↻ Refresh
            </button>
          </div>
        </nav>

        {error && (
          <div className="flex gap-2 items-center bg-rose-500/5 border border-rose-500/20 rounded-[9px] px-3.5 py-2.5 mb-[18px] animate-fade-in-up">
            <span className="text-rose-500">⚠</span>
            <span className="text-rose-300/70 text-xs flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="bg-transparent border-none text-rose-500 cursor-pointer text-sm"
            >
              ×
            </button>
          </div>
        )}

        {latest?.detected_url ? (
          <LatestSection
            det={latest}
            onOpenGallery={() => setGallery(true)}
          />
        ) : (
          <div className={`text-center py-[70px] ${T.textMuted}`}>
            <div className="text-[50px] mb-3 opacity-30">👁️</div>
            <div className={`text-sm font-medium ${T.textPrimary}`}>
              No captures yet
            </div>
            <div className="text-xs mt-1.5">
              Waiting for ESP32-CAM frames
            </div>
          </div>
        )}

        <StatsSection stats={stats} history={history} />

        {history.length > 0 && (
          <>
            <TimelineSection history={history} />
            <TimeLapseSection history={history} />
            <OccupancyAnalysis history={history} />
          </>
        )}
      </div>
    </div>
  );
}
