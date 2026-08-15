"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_BASE_URL } from "@/lib/config";
import {
  Camera,
  Users,
  Radio,
  Zap,
  Target,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Filter,
  Activity,
  TrendingUp,
  Maximize2,
  BarChart3,
  Monitor,
  Eye,
  SlidersHorizontal,
  Layers,
  Cpu,
  Check
} from "lucide-react";

/* ─────────────────────────────────────────────────
   CONFIG & THEME  (UNCHANGED LOGIC)
───────────────────────────────────────────────── */
const API = API_BASE_URL.replace(/\/$/, "");
const POLL_MS = 4000;
const GALLERY_LIMIT = 80;

const T = {
  page: "page-container relative min-h-screen bg-[#06080d] text-slate-100 selection:bg-purple-500/30",
  textPrimary: "text-slate-100",
  textSecondary: "text-slate-400",
  textMuted: "text-slate-500 font-mono",
  glass: "bg-[#0b0f19]/90 border border-white/10 backdrop-blur-xl",
  border: "border border-white/10",
  bgElevated: "bg-[#0d1322]",
};

const VAR = {
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.04)",
  bg: "#06080d",
  bgElevated: "#0d1322",
  card: "rgba(11,15,25,0.85)",
};

const STS = {
  danger: {
    hex: "#f43f5e",
    glow: "rgba(244,63,94,0.35)",
    muted: "rgba(244,63,94,0.12)",
    label: "Critical",
  },
  warn: {
    hex: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    muted: "rgba(245,158,11,0.12)",
    label: "Warning",
  },
  ok: {
    hex: "#10b981",
    glow: "rgba(16,185,129,0.35)",
    muted: "rgba(16,185,129,0.12)",
    label: "Normal",
  },
  unknown: {
    hex: "#64748b",
    glow: "rgba(100,116,139,0.2)",
    muted: "rgba(100,116,139,0.08)",
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
        second: "2-digit",
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
   REUSABLE UI COMPONENTS
───────────────────────────────────────────────── */
function StatusBadge({ status, size = "md" }) {
  const s = st(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono font-semibold tracking-wider uppercase rounded-full"
      style={{
        padding: size === "lg" ? "5px 12px" : "3px 9px",
        fontSize: size === "lg" ? "11px" : "9px",
        background: s.muted,
        border: `1px solid ${s.hex}44`,
        color: s.hex,
        boxShadow: `0 0 10px ${s.glow}`,
      }}
    >
      <span
        className="rounded-full inline-block animate-pulse"
        style={{
          width: size === "lg" ? 6 : 5,
          height: size === "lg" ? 6 : 5,
          background: s.hex,
        }}
      />
      {s.label}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, accent = "#10b981", sub, isPrimary = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative bg-[#0b0f19] rounded-xl p-3.5 transition-all duration-200 overflow-hidden"
      style={{
        border: `1px solid ${hov ? `${accent}55` : "rgba(255,255,255,0.08)"}`,
        boxShadow: hov ? `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${accent}15` : "none",
      }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full transition-all duration-200"
        style={{ background: hov ? accent : `${accent}66` }}
      />
      <div className="pl-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-semibold">
            {label}
          </span>
          {Icon && <Icon className="w-3.5 h-3.5 opacity-70" style={{ color: accent }} />}
        </div>
        <div
          className={`font-bold font-mono tracking-tight leading-none ${isPrimary ? "text-3xl" : "text-xl"}`}
          style={{ color: accent }}
        >
          {value}
        </div>
        {sub && <div className="text-[9px] mt-1.5 text-slate-500 font-mono">{sub}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ children, action, subtitle }) {
  return (
    <div className="flex items-end justify-between mb-3.5 flex-wrap gap-2">
      <div>
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-300 flex items-center gap-2 uppercase font-mono">
          <span className="w-1 h-3.5 bg-purple-500 rounded-full inline-block" />
          {children}
        </h2>
        {subtitle && (
          <p className="text-[10px] font-mono text-slate-500 mt-0.5 pl-3">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function CabinIndicator({ status }) {
  const s = st(status);
  return (
    <div
      className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 relative overflow-hidden"
      style={{
        background: s.muted,
        border: `1px solid ${s.hex}55`,
        boxShadow: `0 0 15px ${s.glow}`,
      }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full animate-pulse"
        style={{ background: s.hex }}
      />
    </div>
  );
}

function getFullImageUrl(url, baseUrl = API) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const cleanBase = (baseUrl || "").replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

function LiveImage({ url, alt = "Frame" }) {
  const [err, setErr] = useState(false);

  useEffect(() => {
    setErr(false);
  }, [url]);

  const fullUrl = getFullImageUrl(url, API);

  if (!url || !fullUrl || err) {
    return (
      <div className="w-full min-h-[360px] bg-[#06080d] flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/4 flex items-center justify-center">
          <Camera className="w-7 h-7 text-slate-600 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 tracking-[0.25em] uppercase">
          {err ? "Feed Unavailable" : "Awaiting Live Feed"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={fullUrl}
      alt={alt}
      onError={() => setErr(true)}
      className="w-full h-full min-h-[360px] max-h-[460px] object-cover block"
    />
  );
}

/* ─────────────────────────────────────────────────
   INSPECTION MODAL
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
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
    >
      <div className="max-w-4xl w-full">
        <div
          className="bg-[#0a0d16] rounded-2xl overflow-hidden border"
          style={{
            borderColor: `${s.hex}44`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 30px ${s.glow}`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#06080d]">
            <div className="flex items-center gap-3">
              <StatusBadge status={status} size="lg" />
              {det && (
                <span className="text-slate-300 font-mono text-xs font-semibold tracking-wide">
                  FRAME #{det.sequence_number || "—"} &nbsp;·&nbsp; {dtFmt(det.timestamp)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 transition-all font-mono"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Image Viewport */}
          <div className="bg-black flex items-center justify-center max-h-[70vh] overflow-hidden relative">
            <img
              src={getFullImageUrl(src, API)}
              alt="Frame View"
              className="max-w-full max-h-[70vh] object-contain block"
            />
          </div>

          {/* Metadata Footer */}
          {det && (
            <div className="px-5 py-3 flex items-center gap-6 border-t border-white/10 bg-[#06080d] flex-wrap text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Passengers:</span>
                <span className="text-white font-bold text-sm">{det.passenger_count ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                <span>Source:</span>
                <span className="text-white font-bold">{det.source ?? "ESP32-CAM"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Overload:</span>
                <span className={`font-bold ${det.overloaded ? "text-rose-400" : "text-emerald-400"}`}>
                  {det.overloaded ? "YES" : "NO"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 1 — LIVE DETECTION CONSOLE
───────────────────────────────────────────────── */
function LatestSection({ det, onOpenGallery }) {
  const [imgHov, setImgHov] = useState(false);
  const [modal, setModal] = useState(false);
  if (!det) return null;
  const status = cabinStatus(det);
  const s = st(status);
  const imgUrl = getFullImageUrl(det.detected_url, API);
  const download = () => {
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `safev-cabin-${det.sequence_number || "latest"}.jpg`;
    a.click();
  };

  return (
    <section className="mb-4">
      <SectionTitle
        subtitle="Real-time AI passenger count and cabin alert monitoring"
        action={
          <button
            onClick={onOpenGallery}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-medium cursor-pointer bg-white/5 border border-white/10 text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            <Filter className="w-3 h-3" /> Capture Explorer
            <span className="ml-0.5 text-slate-500">→</span>
          </button>
        }
      >
        Live Detection Console
      </SectionTitle>

      <div
        className="bg-[#0a0d16] grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${s.hex}33`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 20px ${s.glow}`,
        }}
      >
        {/* ── Camera Viewport ── */}
        <div
          className="relative overflow-hidden cursor-pointer group bg-black"
          onClick={() => setModal(true)}
          onMouseEnter={() => setImgHov(true)}
          onMouseLeave={() => setImgHov(false)}
        >
          {/* HUD: top-left */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-mono font-semibold tracking-widest text-slate-200 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE FRAME
          </div>
          {/* HUD: top-right */}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={status} size="lg" />
          </div>
          {/* HUD: bottom-left */}
          <div className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-400 border border-white/10">
            CAM-01 · ESP32-CAM
          </div>
          {/* HUD: bottom-right */}
          <div className="absolute bottom-3 right-3 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-200 font-semibold border border-white/10">
            FRAME #{det.sequence_number || "—"}
          </div>

          <LiveImage url={det.detected_url} />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 z-20 ${
              imgHov ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-semibold text-white bg-black/85 border border-white/20 px-4 py-2 rounded-lg shadow-2xl">
              <Maximize2 className="w-3.5 h-3.5 text-purple-400" /> View Full Frame
            </span>
          </div>

          {/* Target HUD Corner Brackets */}
          {[
            "top-2.5 left-2.5 border-t-2 border-l-2",
            "top-2.5 right-2.5 border-t-2 border-r-2",
            "bottom-2.5 left-2.5 border-b-2 border-l-2",
            "bottom-2.5 right-2.5 border-b-2 border-r-2",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 z-10 ${cls}`}
              style={{ borderColor: s.hex }}
            />
          ))}
        </div>

        {/* ── Detection Status Panel ── */}
        <div className="p-5 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0b0f1a]">

          {/* Current Signal Status Block */}
          <div>
            <div className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-purple-400" /> Current System Status
            </div>
            <div
              className="rounded-xl p-4 flex items-center gap-3.5"
              style={{
                background: `${s.hex}10`,
                border: `1px solid ${s.hex}33`,
              }}
            >
              <CabinIndicator status={status} />
              <div className="min-w-0 flex-1">
                <div
                  className="text-base font-bold uppercase font-mono tracking-wide leading-none mb-1"
                  style={{ color: s.hex }}
                >
                  {s.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-white leading-none">
                    {det.passenger_count ?? 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">passengers detected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Grid with Visual Hierarchy */}
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              icon={Users}
              label="Passengers"
              value={det.passenger_count ?? 0}
              accent="#a78bfa"
              isPrimary={true}
              sub="Primary count"
            />
            <MetricCard
              icon={Target}
              label="Frame #"
              value={`#${det.sequence_number || "—"}`}
              accent="#f59e0b"
              sub="Sequence ID"
            />
            <MetricCard
              icon={Zap}
              label="Overload"
              value={det.overloaded ? "YES" : "NO"}
              accent={det.overloaded ? "#f43f5e" : "#10b981"}
              sub="Cabin limit alert"
            />
            <MetricCard
              icon={Radio}
              label="Source"
              value={det.source ?? "ESP32"}
              accent="#60a5fa"
              sub="Camera origin"
            />
          </div>

          {/* Timestamp Row */}
          <div className="flex items-center justify-between bg-[#06080d] rounded-lg px-3 py-2.5 border border-white/8">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase tracking-widest font-mono">
              <Clock className="w-3 h-3 text-slate-400" /> Captured
            </div>
            <div className="text-[11px] text-slate-200 font-mono font-medium">
              {dtFmt(det.timestamp)}
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={download}
            className="w-full py-2.5 rounded-xl text-[11px] font-mono font-medium cursor-pointer bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" /> Download High-Res Frame
          </button>
        </div>
      </div>

      {modal && (
        <Modal
          src={imgUrl}
          det={det}
          onClose={() => setModal(null)}
          onDownload={download}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 2 — THIN STATUS STRIP
───────────────────────────────────────────────── */
function ThinStatusStrip({ det, live }) {
  if (!det) return null;
  const status = cabinStatus(det);
  const s = st(status);
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0a0d16] border border-white/8 rounded-xl text-[10px] font-mono text-slate-400 mb-6 flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200 uppercase">CAMERA ONLINE</span>
        </div>
        <span className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span className="text-purple-300">AI VISION SYSTEM ACTIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400 flex-wrap">
        <span>DEVICE: <strong className="text-slate-200 font-bold">CAM-01 (ESP32-CAM)</strong></span>
        <span>FRAME: <strong className="text-slate-200 font-bold">#{det.sequence_number || "—"}</strong></span>
        <span>STATUS: <strong style={{ color: s.hex }}>{s.label.toUpperCase()}</strong></span>
        <span>POLL: <strong className="text-slate-200">4s</strong></span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 3 — CAPTURE EXPLORER (GALLERY)
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
    <div className="fixed inset-0 z-[8000] bg-[#03050a]/98 backdrop-blur-2xl overflow-y-auto p-4 sm:p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" />
              Capture Explorer
            </h2>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              {history.length} inspection frames captured in active session
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-xl border border-white/10">
              {["all", "ok", "warn", "danger"].map((f) => {
                const s = st(f === "all" ? "unknown" : f);
                const isSel = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1 rounded-lg text-[10px] font-mono capitalize transition-all cursor-pointer font-semibold"
                    style={{
                      background: isSel
                        ? f === "all"
                          ? "rgba(255,255,255,0.12)"
                          : s.muted
                        : "transparent",
                      color: isSel
                        ? f === "all"
                          ? "#ffffff"
                          : s.hex
                        : "#64748b",
                      border: isSel
                        ? `1px solid ${f === "all" ? "rgba(255,255,255,0.2)" : s.hex + "55"}`
                        : "1px solid transparent",
                    }}
                  >
                    {f === "all" ? "ALL" : s.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono cursor-pointer bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-semibold"
            >
              <X className="w-3.5 h-3.5" /> Close Explorer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                    src: getFullImageUrl(d.image_url, API),
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
      className="rounded-xl overflow-hidden cursor-pointer relative bg-[#0b0f19] transition-all duration-200 border"
      style={{
        borderColor: hov ? `${s.hex}66` : "rgba(255,255,255,0.08)",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 8px 25px rgba(0,0,0,0.6), 0 0 10px ${s.glow}` : "none",
      }}
    >
      <div className="aspect-[4/3] w-full bg-black overflow-hidden relative">
        <img
          src={getFullImageUrl(det.image_url, API)}
          alt=""
          className="w-full h-full object-cover block transition-transform duration-300"
          style={{ transform: hov ? "scale(1.05)" : "scale(1)" }}
          onError={(e) => {
            e.target.style.opacity = "0.15";
          }}
        />
      </div>
      <div className="p-2.5 bg-[#080b12] border-t border-white/5 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white">
          <span>FRAME #{det.sequence_number}</span>
          <StatusBadge status={cabinStatus(det)} />
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>{tFmt(det.timestamp)}</span>
          <span className="text-purple-300 flex items-center gap-1 font-semibold">
            <Users className="w-2.5 h-2.5" /> {det.passenger_count ?? 0} pax
          </span>
        </div>
      </div>
      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-150 ${hov ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-[10px] font-mono font-semibold text-white bg-black/80 border border-white/20 px-2.5 py-1 rounded">
          VIEW FRAME →
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 4 — DETECTION TIMELINE
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
    <section className="mb-6">
      <SectionTitle subtitle="Chronological AI detection event stream">
        Detection Timeline
      </SectionTitle>
      <div className="bg-[#0a0d16] border border-white/10 rounded-2xl p-5 relative">
        <div ref={ref} className="relative pb-2">
          {/* Axis line */}
          <div className="absolute top-[10px] left-0 right-0 h-px bg-white/10 rounded-full" />

          <div className="flex overflow-x-auto pb-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {items.map((d, i) => {
              const c = cabinStatus(d);
              const s2 = st(c);
              const isH = hov === i;
              return (
                <div
                  key={d.id}
                  className="flex flex-col items-center flex-1 min-w-[28px] cursor-pointer"
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
                    setModal({ src: getFullImageUrl(d.image_url, API), det: d })
                  }
                >
                  <div
                    className="rounded-full transition-all duration-150 z-10"
                    style={{
                      width: isH ? 14 : 8,
                      height: isH ? 14 : 8,
                      background: isH ? s2.hex : `${s2.hex}55`,
                      border: `1.5px solid ${s2.hex}`,
                      boxShadow: isH ? `0 0 12px ${s2.glow}` : "none",
                    }}
                  />
                  {i % 5 === 0 && (
                    <div className="text-[8px] text-slate-500 mt-2 font-mono">
                      #{d.sequence_number}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Hover Tooltip Card */}
          {hov !== null && det && (
            <div
              className="absolute z-50 w-[200px] pointer-events-none"
              style={{
                left: Math.min(
                  Math.max(pos.x - 100, 0),
                  (ref.current?.offsetWidth || 400) - 205,
                ),
                top: pos.y - 215,
              }}
            >
              <div
                className="bg-[#06080d] rounded-xl overflow-hidden shadow-2xl"
                style={{
                  border: `1px solid ${s.hex}44`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 15px ${s.glow}`,
                }}
              >
                <img
                  src={getFullImageUrl(det.image_url, API)}
                  alt=""
                  className="w-full aspect-[16/10] object-cover block"
                />
                <div className="p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-[9px] font-mono text-slate-400 font-bold">
                      #{det.sequence_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-purple-300 font-bold">
                      <Users className="w-2.5 h-2.5" /> {det.passenger_count ?? 0} pax
                    </span>
                    <span className="text-slate-400">{tFmt(det.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 pt-3 border-t border-white/5 text-[9px] font-mono text-slate-400 flex-wrap">
          {["ok", "warn", "danger"].map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: STS[c].hex }}
              />
              <span className="font-semibold">{STS[c].label}</span>
            </div>
          ))}
          <span className="text-slate-600 ml-auto">Hover node to inspect · Click to view frame</span>
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
   SECTION 5 — TIME-LAPSE ANALYSIS
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

  return (
    <section className="mb-6">
      <SectionTitle subtitle="Sequential video inspection and frame playback player">
        Time-Lapse Analysis
      </SectionTitle>
      <div className="bg-[#0a0d16] border border-white/10 rounded-2xl overflow-hidden">

        {/* Viewport */}
        <div className="relative bg-black min-h-[380px] flex items-center justify-center">
          <img
            src={getFullImageUrl(frame.image_url, API)}
            alt=""
            className="w-full max-h-[440px] object-contain block"
          />
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <StatusBadge status={status} size="lg" />
            <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold bg-black/80 text-slate-200 border border-white/10">
              FRAME {frameIdx + 1} / {frames.length}
            </span>
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-300 bg-black/80 border border-white/10">
            {tFmt(frame.timestamp)}
          </div>
          {playing && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono font-bold bg-black/80 text-purple-400 px-2.5 py-1 rounded-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              PLAYING ({speed}x)
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#0b0f1a]">
          {/* Scrubber */}
          <div
            onClick={seek}
            className="h-1.5 bg-white/10 rounded-full mb-4 cursor-pointer relative overflow-visible"
          >
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-75"
              style={{ width: `${progress}%`, background: s.hex }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white transition-all duration-75 shadow-md"
              style={{
                left: `${progress}%`,
                background: s.hex,
                marginLeft: "-7px",
              }}
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFrameIdx((i) => Math.max(0, i - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Previous Frame"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={toggle}
                className="w-9 h-9 rounded-xl text-white font-bold flex items-center justify-center transition-all cursor-pointer"
                style={{
                  background: s.hex,
                  boxShadow: playing ? `0 0 15px ${s.glow}` : "none",
                }}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => setFrameIdx((i) => Math.min(frames.length - 1, i + 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Next Frame"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stop();
                  setFrameIdx(0);
                  setProgress(0);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Reset to Start"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-500 uppercase font-mono mr-1">Speed</span>
              {[1, 2, 4, 8].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  className="px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer font-semibold"
                  style={{
                    border: `1px solid ${speed === sp ? s.hex + "66" : "rgba(255,255,255,0.08)"}`,
                    background: speed === sp ? s.muted : "transparent",
                    color: speed === sp ? s.hex : "#64748b",
                  }}
                >
                  {sp}×
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-400 font-semibold">
              FRAME {frameIdx + 1} OF {frames.length}
            </div>
          </div>
        </div>

        {/* Filmstrip */}
        <div className="px-4 pb-4 pt-3 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
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
                className="flex-shrink-0 w-14 aspect-[4/3] rounded-md overflow-hidden cursor-pointer transition-all border"
                style={{
                  borderColor: iC ? fs.hex : "transparent",
                  opacity: iC ? 1 : 0.35,
                  boxShadow: iC ? `0 0 10px ${fs.glow}` : "none",
                }}
              >
                <img
                  src={getFullImageUrl(f.image_url, API)}
                  alt=""
                  className="w-full h-full object-cover block"
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
   SECTION 6 — SESSION OVERVIEW & STATUS SUMMARY
───────────────────────────────────────────────── */
function StatsSection({ stats, history }) {
  if (!stats) return null;
  const totalPax = history.reduce((a, d) => a + (d.passenger_count || 0), 0);

  const statusCounts = useMemo(() => {
    const counts = { ok: 0, warn: 0, danger: 0 };
    history.forEach((d) => {
      const s = cabinStatus(d);
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [history]);

  return (
    <section className="mb-6">
      <SectionTitle subtitle="Cumulative session statistics and alert metrics">
        Session Overview
      </SectionTitle>

      {/* Main Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-3">
        <MetricCard
          icon={Camera}
          label="Total Captures"
          value={stats.total_captures ?? 0}
          accent="#60a5fa"
          sub="Session frames"
        />
        <MetricCard
          icon={Users}
          label="Avg Passengers"
          value={stats.avg_passengers ?? "—"}
          accent="#a78bfa"
          sub="Per frame average"
        />
        <MetricCard
          icon={TrendingUp}
          label="Peak Passengers"
          value={stats.max_passengers_seen ?? 0}
          accent="#f59e0b"
          sub="Maximum in cabin"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Overload Events"
          value={stats.overload_events ?? 0}
          accent="#f43f5e"
          sub="Cabin overload alerts"
        />
        <MetricCard
          icon={Activity}
          label="Total Counted"
          value={totalPax}
          accent="#10b981"
          sub="Cumulative passengers"
        />
      </div>

      {/* Session Status Breakdown Summary */}
      <div className="grid grid-cols-3 gap-2 bg-[#0a0d16] border border-white/8 rounded-xl p-2.5">
        {[
          ["ok", "Normal Frames", statusCounts.ok],
          ["warn", "Warning Alerts", statusCounts.warn],
          ["danger", "Critical Overloads", statusCounts.danger],
        ].map(([key, label, count]) => {
          const s = st(key);
          return (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-2 rounded-lg border font-mono"
              style={{
                background: s.muted,
                borderColor: `${s.hex}33`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: s.hex }}
                />
                <span className="text-[10px] font-semibold text-slate-300 uppercase">
                  {label}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: s.hex }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   SECTION 7 — OCCUPANCY ANALYSIS (ANALYTICS)
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

    const PAD = { top: 24, right: 20, bottom: 28, left: 40 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const max = Math.max(...paxData, 1);
    const n = paxData.length;
    const colorTop = "#a78bfa";
    const xOf = (i) => PAD.left + (i / Math.max(n - 1, 1)) * cW;
    const yOf = (v) => PAD.top + cH - (v / max) * cH;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach((r) => {
      const y = PAD.top + cH - r * cH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + cW, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = `9px monospace`;
      ctx.textAlign = "right";
      ctx.fillText(Math.round(max * r), PAD.left - 6, y + 3);
    });

    if (n < 2) return;

    // Area Gradient
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grad.addColorStop(0, "rgba(167,139,250,0.35)");
    grad.addColorStop(1, "rgba(167,139,250,0.02)");

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

    // Line Stroke
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(paxData[0]));
    for (let i = 1; i < n - 1; i++) {
      const xc = (xOf(i) + xOf(i + 1)) / 2;
      const yc = (yOf(paxData[i]) + yOf(paxData[i + 1])) / 2;
      ctx.quadraticCurveTo(xOf(i), yOf(paxData[i]), xc, yc);
    }
    ctx.lineTo(xOf(n - 1), yOf(paxData[n - 1]));
    ctx.strokeStyle = colorTop;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = colorTop;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Hover Line & Point
    if (hovIdx !== null && hovIdx < n) {
      const x = xOf(hovIdx);
      const y = yOf(paxData[hovIdx]);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + cH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = colorTop;
      ctx.shadowColor = colorTop;
      ctx.shadowBlur = 14;
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
    const PAD_LEFT = 40;
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
    <section className="mb-6">
      <SectionTitle subtitle="Historical passenger occupancy trends over time">
        Analytics & Occupancy Waveform
      </SectionTitle>
      <div className="bg-[#0a0d16] border border-white/10 rounded-2xl overflow-hidden">

        {/* Header metrics */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 flex-wrap gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
            PASSENGER COUNT OVER TIME
          </span>
          <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
            {[
              ["Peak", peakPax, "#a78bfa"],
              ["Avg", avgPax, "#a78bfa"],
              ["Alerts", alertCount, "#f59e0b"],
              ["Overload", overloadCount, "#f43f5e"],
            ].map(([lb, v, c]) => (
              <div
                key={lb}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/4 border"
                style={{ borderColor: `${c}33` }}
              >
                <span className="text-slate-400 uppercase text-[8px] font-bold">{lb}</span>
                <span className="font-bold text-xs" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-4 pt-3">
          <div
            ref={wrapRef}
            className="relative h-52 cursor-crosshair"
            onMouseMove={handleMouse}
            onMouseLeave={() => setHovIdx(null)}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Hover Tooltip Bar */}
          <div className="h-9 flex items-center justify-between px-2 border-t border-white/8 mt-2 font-mono text-[10px]">
            {hovFrame ? (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                    style={{ background: hovSig.hex }}
                  />
                  <span className="text-white font-bold">FRAME #{hovFrame.sequence_number}</span>
                  <span className="text-slate-400">{dtFmt(hovFrame.timestamp)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-300 font-bold">
                    <Users className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                    {hovFrame.passenger_count ?? 0} passengers
                  </span>
                  <StatusBadge status={cabinStatus(hovFrame)} />
                </div>
              </>
            ) : (
              <span className="text-[9px] text-slate-500 italic">
                Hover over waveform graph to inspect exact frame telemetry
              </span>
            )}
          </div>
        </div>

        {/* Status Event Strip */}
        <div className="px-4 pb-4 pt-2.5 border-t border-white/10 bg-[#0b0f19]/60">
          <div className="text-[8px] uppercase tracking-widest text-slate-500 font-mono mb-2 font-semibold">
            Status timeline — each vertical bar represents one detection frame
          </div>
          <div className="flex items-end gap-0.5 h-7 overflow-x-auto">
            {frames.map((d, i) => {
              const c = cabinStatus(d);
              const s2 = st(c);
              const isH = hovIdx === i;
              return (
                <div
                  key={d.id}
                  title={`#${d.sequence_number}: ${s2.label}`}
                  className="flex-1 min-w-[4px] max-w-[10px] rounded-t-sm transition-all cursor-pointer flex-shrink-0"
                  style={{
                    height: isH ? "26px" : "16px",
                    background: isH ? s2.hex : `${s2.hex}80`,
                    boxShadow: isH ? `0 0 8px ${s2.glow}` : "none",
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
   MAIN DASHBOARD APPLICATION
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

  /* ── Loading Screen ── */
  if (loading) {
    return (
      <div className={`${T.page} flex items-center justify-center flex-col gap-4 min-h-screen`}>
        <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center shadow-2xl">
          <Camera className="w-7 h-7 text-purple-400 animate-pulse" />
        </div>
        <div className="text-slate-400 font-mono text-[10px] tracking-[0.25em] uppercase flex items-center gap-2 font-semibold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
          Initializing AI Operations Console
        </div>
      </div>
    );
  }

  return (
    <div className={T.page}>
      {/* Status-reactive Ambient Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% 0%, ${latSig.hex}08 0%, transparent 65%)`,
        }}
      />

      {/* Grid Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <GallerySection
        history={history}
        visible={gallery}
        onClose={() => setGallery(false)}
      />

      {/* ── Main Monitoring Dashboard Shell ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12">

        {/* ── Level 2: Monitoring System Header ── */}
        <header className="bg-[#0b0f19]/90 border border-white/10 backdrop-blur-xl rounded-2xl px-5 py-4 mb-4 shadow-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">

            {/* LEFT: System Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono leading-none flex items-center gap-2">
                  SAFE-V Traffic Monitor
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${error ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`}
                  />
                  <span className={`text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase ${error ? "text-rose-400" : "text-emerald-400"}`}>
                    {error ? "SYSTEM OFFLINE" : "AI SYSTEM ONLINE"}
                  </span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    CAM-01 (ESP32-CAM)
                  </span>
                </div>
              </div>
            </div>

            {/* CENTER: Hardware Telemetry Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/3 border border-white/8 font-mono text-[11px] text-slate-300">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>ESP32-CAM · VISION MON</span>
              <span className="text-slate-700">·</span>
              <span className={`text-[10px] font-bold tracking-widest ${live ? "text-emerald-400" : "text-slate-500"}`}>
                {live ? "LIVE STREAM" : "STREAM PAUSED"}
              </span>
            </div>

            {/* RIGHT: System Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-white/4 border border-white/10 px-3 py-1.5 rounded-lg tabular-nums">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {clock.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setLive((v) => !v)}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-medium cursor-pointer transition-all flex items-center gap-1.5"
                style={{
                  border: `1px solid ${live ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                  background: live ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                  color: live ? "#c084fc" : "#64748b",
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-purple-400 animate-pulse" : "bg-slate-600"}`} />
                {live ? "● Live" : "○ Paused"}
              </button>
              <button
                onClick={load}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono cursor-pointer transition-all bg-white/4 border border-white/10 text-slate-200 hover:text-white hover:bg-white/8 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> ↻ Refresh
              </button>
            </div>

          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between bg-[#0a0d16] border border-rose-500/30 rounded-xl px-4 py-2.5 mb-5 text-[11px] font-mono text-rose-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
              <span>Backend unavailable &mdash; {error}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 cursor-pointer transition-all text-[10px] font-semibold"
              >
                Retry Connection
              </button>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Live Feed or Offline State */}
        {latest?.detected_url ? (
          <>
            <LatestSection
              det={latest}
              onOpenGallery={() => setGallery(true)}
            />
            <ThinStatusStrip det={latest} live={live} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0a0d16] border border-white/10 rounded-2xl mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center mb-4">
              <Camera className="w-7 h-7 text-slate-600 animate-pulse" />
            </div>
            <div className="text-sm font-mono font-bold text-slate-300 tracking-wider">
              CAMERA OFFLINE
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
              Awaiting ESP32-CAM frames
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
      </main>
    </div>
  );
}
