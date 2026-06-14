/*
 * SAFEVDashboard.jsx
 * ──────────────────
 * Single-file, self-contained SAFEV passenger monitor dashboard.
 * Handles: live detection feed, stats, gallery, dark/light toggle.
 *
 * Drop into your Next.js project as:
 *   src/app/rakshak/internal/page.jsx   (or wherever you need it)
 *
 * Backend expected at process.env.NEXT_PUBLIC_API_URL or localhost:8080
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const API =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8080";

const POLL_MS = 4000; // how often to fetch /latest
const GALLERY_LIMIT = 40;

// ── Tiny hook: theme ──────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("safev-theme");
    if (saved) setDark(saved === "dark");
  }, []);
  const toggle = () =>
    setDark((d) => {
      localStorage.setItem("safev-theme", !d ? "dark" : "light");
      return !d;
    });
  return { dark, toggle };
}

// ── Tiny hook: API polling ────────────────────────────────────────────────────
function useLatest() {
  const [data, setData] = useState(null);
  const [online, setOnline] = useState(false);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch(`${API}/latest`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setData(j);
      setOnline(true);
      setError(null);
    } catch (e) {
      setOnline(false);
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, POLL_MS);
    return () => clearInterval(id);
  }, [fetch_]);

  return { data, online, error, refresh: fetch_ };
}

// ── Tiny hook: gallery ────────────────────────────────────────────────────────
function useGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/captures/list?limit=${GALLERY_LIMIT}`);
      if (!r.ok) throw new Error();
      const j = await r.json();
      setItems(j.captures || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, load };
}

// ── Tiny hook: stats ──────────────────────────────────────────────────────────
function useStats() {
  const [stats, setStats] = useState(null);
  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/analysis/stats`);
      if (r.ok) setStats(await r.json());
    } catch {}
  }, []);
  return { stats, load };
}

// ── Upload hook ───────────────────────────────────────────────────────────────
function useUpload() {
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const upload = async (file) => {
    setUploading(true);
    setErr(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`${API}/detect`, { method: "POST", body: fd });
      if (!r.ok) throw new Error(`Server error ${r.status}`);
      setResult(await r.json());
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  return { result, uploading, err, upload };
}

// ── Colour tokens (inline, no Tailwind required) ──────────────────────────────
const T = {
  dark: {
    bg: "#000000",
    card: "#090d16",
    cardHover: "#0e1420",
    border: "rgba(255,255,255,0.07)",
    text: "#f1f5f9",
    muted: "#64748b",
    accent: "#3b82f6",
    accentG: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    danger: "#ef4444",
    warn: "#f59e0b",
    ok: "#10b981",
    overlay: "rgba(0,0,0,0.72)",
  },
  light: {
    bg: "#f1f5f9",
    card: "#ffffff",
    cardHover: "#f8fafc",
    border: "rgba(15,23,42,0.08)",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    accentG: "linear-gradient(135deg,#2563eb,#7c3aed)",
    danger: "#dc2626",
    warn: "#d97706",
    ok: "#059669",
    overlay: "rgba(255,255,255,0.72)",
  },
};

// ── Small reusable components ─────────────────────────────────────────────────

function Card({ children, style, onClick, hover, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hover ? t.cardHover : t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(16px)",
        transition: "all 0.25s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ label, color, t }) {
  return (
    <span
      style={{
        background: color + "22",
        border: `1px solid ${color}55`,
        color,
        borderRadius: 99,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function Pill({ ok, t }) {
  const color = ok ? t.ok : t.danger;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: color + "18",
        border: `1px solid ${color}44`,
        color,
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
          display: "inline-block",
          animation: ok ? "none" : "blink 1s infinite",
        }}
      />
      {ok ? "OK" : "ALERT"}
    </span>
  );
}

function StatBox({ label, value, sub, accent, t }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: t.muted,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: accent || t.text,
          lineHeight: 1.1,
        }}
      >
        {value ?? "—"}
      </span>
      {sub && <span style={{ fontSize: 12, color: t.muted }}>{sub}</span>}
    </div>
  );
}

function PersonCard({ p, idx, t }) {
  const beltOk = p.seatbelt_worn;
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${beltOk ? t.ok + "44" : t.danger + "55"}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: t.accentG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {idx + 1}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
            Passenger {idx + 1}
          </div>
          <div style={{ fontSize: 11, color: t.muted }}>
            Conf: {(p.confidence * 100).toFixed(0)}% · Belt score:{" "}
            {p.seatbelt_score}
          </div>
        </div>
      </div>
      <Badge
        label={beltOk ? "Belt ✓" : "No Belt"}
        color={beltOk ? t.ok : t.danger}
        t={t}
      />
    </div>
  );
}

function LiveFeedImage({ url, t }) {
  const [err, setErr] = useState(false);
  if (!url)
    return (
      <div
        style={{
          height: 260,
          borderRadius: 12,
          background: t.bg,
          border: `1px dashed ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.muted,
          fontSize: 13,
        }}
      >
        No image yet
      </div>
    );
  if (err)
    return (
      <div
        style={{
          height: 260,
          borderRadius: 12,
          background: t.bg,
          border: `1px dashed ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.muted,
          fontSize: 13,
        }}
      >
        Image unavailable
      </div>
    );
  return (
    <img
      src={`${API}${url}?t=${Date.now()}`}
      onError={() => setErr(true)}
      alt="Latest detected frame"
      style={{
        width: "100%",
        borderRadius: 12,
        border: `1px solid ${t.border}`,
        display: "block",
        objectFit: "contain",
        maxHeight: 340,
        background: "#000",
      }}
    />
  );
}

// ── Tab components ────────────────────────────────────────────────────────────

function LiveTab({ t }) {
  const { data, online, error, refresh } = useLatest();
  const count = data?.passenger_count ?? 0;
  const overload = data?.overloaded ?? false;
  const noBelt = data?.seatbelt_warnings ?? 0;
  const alert = data?.alert ?? false;
  const persons = data?.persons ?? [];
  const ts = data?.timestamp
    ? new Date(data.timestamp).toLocaleTimeString()
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: online ? t.ok : t.danger,
              boxShadow: online ? `0 0 8px ${t.ok}` : "none",
              display: "inline-block",
              animation: online ? "pulse 2s infinite" : "none",
            }}
          />
          <span style={{ fontSize: 13, color: t.muted }}>
            {online
              ? `Live · updated ${ts || "…"}`
              : `Offline${error ? ` — ${error}` : ""}`}
          </span>
        </div>
        <button
          onClick={refresh}
          style={{
            background: "transparent",
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "5px 14px",
            color: t.text,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Alert banner */}
      {alert && (
        <div
          style={{
            background: t.danger + "18",
            border: `1px solid ${t.danger}55`,
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: t.danger,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 20 }}>⚠</span>
          {overload && `Vehicle overloaded (${count} passengers). `}
          {noBelt > 0 &&
            `${noBelt} passenger${noBelt > 1 ? "s" : ""} not wearing seatbelt.`}
        </div>
      )}

      {/* Stat row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 12,
        }}
      >
        <StatBox
          label="Passengers"
          value={count}
          sub={overload ? "OVERLOADED" : "OK"}
          accent={overload ? t.danger : t.ok}
          t={t}
        />
        <StatBox
          label="No Seatbelt"
          value={noBelt}
          sub="persons detected"
          accent={noBelt > 0 ? t.danger : t.ok}
          t={t}
        />
        <StatBox label="Status" value={<Pill ok={!alert} t={t} />} t={t} />
        <StatBox
          label="Source"
          value={data?.source ?? "—"}
          sub="camera mode"
          t={t}
        />
      </div>

      {/* Image + persons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)",
          gap: 16,
        }}
      >
        <Card t={t} style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: t.muted,
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Annotated Frame
          </div>
          <LiveFeedImage url={data?.detected_url} t={t} />
        </Card>

        <Card
          t={t}
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: t.muted,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Persons Detected
          </div>
          {persons.length === 0 ? (
            <div style={{ color: t.muted, fontSize: 13, marginTop: 8 }}>
              No persons detected
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                overflowY: "auto",
                maxHeight: 320,
              }}
            >
              {persons.map((p, i) => (
                <PersonCard key={i} p={p} idx={i} t={t} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function UploadTab({ t }) {
  const { result, uploading, err, upload } = useUpload();
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    upload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${t.accent}55`,
          borderRadius: 16,
          padding: "40px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: t.accent + "08",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
        <div style={{ color: t.text, fontWeight: 600, marginBottom: 4 }}>
          Drop an image or click to select
        </div>
        <div style={{ color: t.muted, fontSize: 13 }}>
          Supports JPEG, PNG — runs detection via /detect endpoint
        </div>
      </div>

      {uploading && (
        <div style={{ textAlign: "center", color: t.accent, fontWeight: 600 }}>
          Analysing image…
        </div>
      )}

      {err && (
        <div
          style={{
            background: t.danger + "18",
            border: `1px solid ${t.danger}44`,
            borderRadius: 12,
            padding: "12px 16px",
            color: t.danger,
            fontSize: 13,
          }}
        >
          {err}
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Card t={t} style={{ padding: 14 }}>
            <div
              style={{
                fontSize: 11,
                color: t.muted,
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 10,
                letterSpacing: "0.08em",
              }}
            >
              Original
            </div>
            {preview && (
              <img
                src={preview}
                alt="upload"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  objectFit: "contain",
                  maxHeight: 260,
                  background: "#000",
                }}
              />
            )}
          </Card>
          <Card t={t} style={{ padding: 14 }}>
            <div
              style={{
                fontSize: 11,
                color: t.muted,
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 10,
                letterSpacing: "0.08em",
              }}
            >
              Annotated
            </div>
            <LiveFeedImage url={result.detected_url} t={t} />
          </Card>

          <Card t={t} style={{ gridColumn: "1/-1", padding: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
                gap: 12,
              }}
            >
              <StatBox
                label="Passengers"
                value={result.passenger_count}
                accent={result.overloaded ? t.danger : t.ok}
                t={t}
              />
              <StatBox
                label="No Seatbelt"
                value={result.seatbelt_warnings}
                accent={result.seatbelt_warnings > 0 ? t.danger : t.ok}
                t={t}
              />
              <StatBox
                label="Overloaded"
                value={result.overloaded ? "YES" : "NO"}
                accent={result.overloaded ? t.danger : t.ok}
                t={t}
              />
              <StatBox
                label="Alert"
                value={<Pill ok={!result.alert} t={t} />}
                t={t}
              />
            </div>
            {result.persons?.length > 0 && (
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {result.persons.map((p, i) => (
                  <PersonCard key={i} p={p} idx={i} t={t} />
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function GalleryTab({ t }) {
  const { items, loading, load } = useGallery();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: t.muted, fontSize: 13 }}>
          {items.length} captures
        </span>
        <button
          onClick={load}
          style={{
            background: "transparent",
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "5px 14px",
            color: t.text,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ↻ Reload
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: t.muted, padding: 40 }}>
          Loading…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: t.muted,
            padding: 60,
            fontSize: 14,
          }}
        >
          No captures yet — waiting for ESP32-CAM frames
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 12,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            style={{
              background: t.card,
              border: `1px solid ${item.alert ? t.danger + "55" : t.border}`,
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.15s",
            }}
          >
            <img
              src={`${API}${item.detected_url}`}
              alt={item.filename}
              style={{
                width: "100%",
                height: 130,
                objectFit: "cover",
                display: "block",
                background: "#000",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div style={{ padding: "8px 10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
                  {item.passenger_count} pax
                </span>
                {item.alert && <Badge label="Alert" color={t.danger} t={t} />}
              </div>
              <div style={{ fontSize: 11, color: t.muted }}>
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleString()
                  : item.filename}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: t.card,
              borderRadius: 18,
              maxWidth: 820,
              width: "100%",
              padding: 20,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>
                {selected.passenger_count} passenger
                {selected.passenger_count !== 1 ? "s" : ""} detected
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.muted,
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <img
              src={`${API}${selected.detected_url}`}
              alt="detail"
              style={{
                width: "100%",
                borderRadius: 12,
                objectFit: "contain",
                maxHeight: 420,
                background: "#000",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 10,
                marginTop: 14,
              }}
            >
              <StatBox
                label="Passengers"
                value={selected.passenger_count}
                accent={selected.overloaded ? t.danger : t.ok}
                t={t}
              />
              <StatBox
                label="No Seatbelt"
                value={selected.seatbelt_warnings}
                accent={selected.seatbelt_warnings > 0 ? t.danger : t.ok}
                t={t}
              />
              <StatBox
                label="Overloaded"
                value={selected.overloaded ? "YES" : "NO"}
                accent={selected.overloaded ? t.danger : t.ok}
                t={t}
              />
              <StatBox label="Source" value={selected.source} t={t} />
            </div>
            {selected.persons?.length > 0 && (
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {selected.persons.map((p, i) => (
                  <PersonCard key={i} p={p} idx={i} t={t} />
                ))}
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: 11, color: t.muted }}>
              {selected.timestamp
                ? new Date(selected.timestamp).toLocaleString()
                : selected.filename}
              {" · "}
              {selected.filename}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsTab({ t }) {
  const { stats, load } = useStats();
  useEffect(() => {
    load();
  }, [load]);

  if (!stats)
    return (
      <div style={{ textAlign: "center", color: t.muted, padding: 60 }}>
        Loading stats…
      </div>
    );

  const rows = [
    { label: "Total Captures", value: stats.total_captures },
    { label: "Avg Passengers / Capture", value: stats.avg_passengers },
    { label: "Peak Passengers Seen", value: stats.max_passengers_seen },
    {
      label: "Overload Events",
      value: stats.overload_events,
      accent: stats.overload_events > 0 ? t.danger : t.ok,
    },
    {
      label: "Seatbelt Warning Events",
      value: stats.seatbelt_warning_events,
      accent: stats.seatbelt_warning_events > 0 ? t.warn : t.ok,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: t.muted, fontSize: 12 }}>
          Generated{" "}
          {stats.generated_at
            ? new Date(stats.generated_at).toLocaleString()
            : "—"}
        </span>
        <button
          onClick={load}
          style={{
            background: "transparent",
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: "5px 14px",
            color: t.text,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
        }}
      >
        {rows.map((r, i) => (
          <StatBox
            key={i}
            label={r.label}
            value={r.value}
            accent={r.accent}
            t={t}
          />
        ))}
      </div>

      {/* Safety score */}
      {stats.total_captures > 0 &&
        (() => {
          const safe = Math.max(
            0,
            100 -
              Math.round(
                ((stats.overload_events + stats.seatbelt_warning_events) /
                  stats.total_captures) *
                  100,
              ),
          );
          const color = safe > 80 ? t.ok : safe > 50 ? t.warn : t.danger;
          return (
            <Card t={t} style={{ marginTop: 4 }}>
              <div
                style={{
                  fontSize: 11,
                  color: t.muted,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Safety Score
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color,
                    textShadow: `0 0 20px ${color}66`,
                  }}
                >
                  {safe}%
                </div>
                <div>
                  <div
                    style={{ color: t.text, fontWeight: 600, marginBottom: 2 }}
                  >
                    {safe > 80
                      ? "Good standing"
                      : safe > 50
                        ? "Needs attention"
                        : "Critical issues"}
                  </div>
                  <div style={{ color: t.muted, fontSize: 13 }}>
                    Based on {stats.total_captures} captures
                  </div>
                </div>
              </div>
              {/* Bar */}
              <div
                style={{
                  marginTop: 14,
                  height: 8,
                  borderRadius: 99,
                  background: t.border,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 99,
                    width: `${safe}%`,
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </Card>
          );
        })()}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function SAFEVDashboard() {
  const { dark, toggle } = useTheme();
  const t = dark ? T.dark : T.light;
  const [tab, setTab] = useState("live");

  const tabs = [
    { id: "live", label: "⚡ Live Feed" },
    { id: "upload", label: "📤 Upload" },
    { id: "gallery", label: "🖼 Gallery" },
    { id: "stats", label: "📊 Stats" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.text,
        fontFamily: "'Inter', 'Geist Sans', system-ui, sans-serif",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${t.border}`,
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: dark ? "rgba(0,0,0,0.8)" : "rgba(241,245,249,0.85)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: t.accentG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🛡
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                SAFEV
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: t.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Passenger Monitor
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: t.muted, marginRight: 4 }}>
              {API}
            </span>
            <button
              onClick={toggle}
              title="Toggle theme"
              style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 15,
                color: t.text,
              }}
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          borderBottom: `1px solid ${t.border}`,
          background: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: 0,
          }}
        >
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === tb.id ? t.accent : "transparent"}`,
                color: tab === tb.id ? t.accent : t.muted,
                padding: "14px 18px",
                fontSize: 13,
                fontWeight: tab === tb.id ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "live" && <LiveTab t={t} />}
        {tab === "upload" && <UploadTab t={t} />}
        {tab === "gallery" && <GalleryTab t={t} />}
        {tab === "stats" && <StatsTab t={t} />}
      </div>
    </div>
  );
}
