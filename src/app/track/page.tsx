"use client";

import UcodGuard from "@/components/auth/UcodGuard";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { AIPlace, AIAssistantResponse } from "@/app/api/ai-assistant/route";
import {
  Bot,
  MapPin,
  Clock,
  Square,
  RotateCcw,
  Map as MapIcon,
  Activity,
  Gauge,
  Radio,
  Hospital,
  ShieldAlert,
  Flame,
  Pill,
  Stethoscope,
  Ambulance,
  Fuel,
  Wrench,
  Utensils,
  Hotel,
  Navigation,
  Send,
  X,
  ExternalLink,
  Layers,
  ShieldCheck,
  Star,
  RefreshCw,
  AlertCircle,
  Phone,
  ChevronRight,
  Signal,
  Locate,
  Play,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

interface TrackingPath {
  id: number;
  points: LocationData[];
  startTime: number;
  endTime: number;
  durationMs: number;
  distanceKm: number;
  startLocation: LocationData;
  endLocation: LocationData;
  stopDurationBeforeMs: number | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const PATH_GAP_THRESHOLD_MS = 15 * 60 * 1000;

const PATH_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#8b5cf6",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const calculateDistance = (
  lat1: number, lon1: number, lat2: number, lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculatePathDistance = (points: LocationData[]): number => {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(
      points[i - 1].latitude, points[i - 1].longitude,
      points[i].latitude, points[i].longitude
    );
  }
  return total;
};

const getPathColor = (idx: number) => PATH_COLORS[idx % PATH_COLORS.length];

const segmentLocationHistory = (history: LocationData[]): TrackingPath[] => {
  const valid = history.filter(
    (loc) =>
      loc &&
      typeof loc.latitude === "number" &&
      typeof loc.longitude === "number" &&
      !isNaN(loc.latitude) &&
      !isNaN(loc.longitude) &&
      (loc.latitude !== 0 || loc.longitude !== 0)
  );
  if (valid.length === 0) return [];

  const sorted = [...valid].sort((a, b) => a.timestamp - b.timestamp);
  const rawPaths: { points: LocationData[]; stopBefore: number | null }[] = [];
  let current: LocationData[] = [sorted[0]];
  let gapBefore: number | null = null;

  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].timestamp - sorted[i - 1].timestamp;
    if (gap >= PATH_GAP_THRESHOLD_MS) {
      rawPaths.push({ points: current, stopBefore: gapBefore });
      current = [sorted[i]];
      gapBefore = gap;
    } else {
      current.push(sorted[i]);
    }
  }
  if (current.length > 0) rawPaths.push({ points: current, stopBefore: gapBefore });

  return rawPaths.map((raw, i) => {
    const s = raw.points[0];
    const e = raw.points[raw.points.length - 1];
    return {
      id: i + 1,
      points: raw.points,
      startTime: s.timestamp,
      endTime: e.timestamp,
      durationMs: Math.max(0, e.timestamp - s.timestamp),
      distanceKm: calculatePathDistance(raw.points),
      startLocation: s,
      endLocation: e,
      stopDurationBeforeMs: raw.stopBefore,
    };
  });
};

const formatDuration = (ms: number): string => {
  if (ms <= 0) return "0 min";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const rem = minutes % 60;
    return `${hours}h${rem > 0 ? ` ${rem}m` : ""}`;
  }
  if (minutes > 0) return `${minutes}m`;
  return `${Math.floor(ms / 1000)}s`;
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const getTimeAgo = (ts: number): string => {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

// ─── Category config ───────────────────────────────────────────────────────────

// SVG icon strings for Leaflet map markers (no React, pure inline SVG)
const CATEGORY_SVG: Record<string, string> = {
  hospital:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  police:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  fire:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>`,
  pharmacy:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  clinic:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  fuel:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 012-2h6a2 2 0 012 2v16"/><path d="M3 22h10M13 8h2a2 2 0 012 2v3a2 2 0 002 2h0a2 2 0 002-2V9.83a2 2 0 00-.59-1.42L17 4"/></svg>`,
  restaurant:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
  hotel:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2h20v20H2z"/><path d="M12 2v20M2 12h20"/></svg>`,
  repair:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  default:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

const getCategoryTheme = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("hospital") || c.includes("emergency")) return { bg: "#dc2626", label: "Hospital", iconKey: "hospital" };
  if (c.includes("police"))   return { bg: "#2563eb", label: "Police",   iconKey: "police" };
  if (c.includes("fire"))     return { bg: "#d97706", label: "Fire Stn", iconKey: "fire" };
  if (c.includes("pharmacy")) return { bg: "#059669", label: "Pharmacy", iconKey: "pharmacy" };
  if (c.includes("clinic"))   return { bg: "#0d9488", label: "Clinic",   iconKey: "clinic" };
  if (c.includes("fuel") || c.includes("gas")) return { bg: "#4f46e5", label: "Fuel",   iconKey: "fuel" };
  if (c.includes("restaurant") || c.includes("food")) return { bg: "#db2777", label: "Food",   iconKey: "restaurant" };
  if (c.includes("hotel") || c.includes("stay"))      return { bg: "#7c3aed", label: "Hotel",  iconKey: "hotel" };
  if (c.includes("repair") || c.includes("mechanic")) return { bg: "#475569", label: "Repair", iconKey: "repair" };
  return { bg: "#0284c7", label: "Place", iconKey: "default" };
};

// ─── ThingSpeak types ──────────────────────────────────────────────────────────

interface ThingSpeakData {
  channel: {
    id: number; name: string; latitude: string; longitude: string;
    field1: string; field2: string; field3: string; field4: string;
    created_at: string; updated_at: string; last_entry_id: number;
  };
  feeds: Array<{
    created_at: string; entry_id: number;
    field1: string; field2: string; field3: string; field4: string;
  }>;
}

// ─── Component ─────────────────────────────────────────────────────────────────

function RakshakGPSTracker() {
  const { theme } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [trackingMode, setTrackingMode] = useState<"live" | "history">("live");
  const [thingSpeakData, setThingSpeakData] = useState<ThingSpeakData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Paths
  const [trackingPaths, setTrackingPaths] = useState<TrackingPath[]>([]);
  const [visiblePathIds, setVisiblePathIds] = useState<Set<number>>(new Set());
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  // AI
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [aiPlaces, setAIPlaces] = useState<AIPlace[]>([]);
  const [aiActiveRoute, setAIActiveRoute] = useState<{
    destinationName: string; distanceKm: number; durationMins: number;
  } | null>(null);
  const [aiMessages, setAIMessages] = useState<Array<{
    id: string; sender: "user" | "ai"; text: string; places?: AIPlace[]; timestamp: number;
  }>>([{
    id: "welcome", sender: "ai",
    text: "I am your RAKSHAK Location-Aware AI Copilot. I use your live vehicle GPS coordinates to find nearby emergency hospitals, police stations, fuel stations, food, and lodging strictly within a 5–7 km radius.",
    timestamp: Date.now(),
  }]);

  const THINGSPEAK_CHANNEL_ID = "3178336";
  const THINGSPEAK_READ_API_KEY = "IUXBXZHM4D3JY2G2";

  // ── Map init ─────────────────────────────────────────────────────────────────

  const safeFitBounds = (map: any, L: any, coords: any[], padding = [50, 50]) => {
    if (!map || !L || !Array.isArray(coords) || coords.length === 0) return;
    const validCoords = coords.filter((c) => {
      if (!Array.isArray(c) || c.length < 2) return false;
      const lat = Number(c[0]);
      const lng = Number(c[1]);
      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        isFinite(lat) &&
        isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });
    if (validCoords.length === 0) return;
    try {
      const bounds = L.latLngBounds(validCoords);
      if (bounds && (typeof bounds.isValid !== "function" || bounds.isValid())) {
        map.fitBounds(bounds, { padding });
      }
    } catch (e) {
      console.warn("safeFitBounds warning:", e);
    }
  };

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(cssLink);
    }

    const initMap = () => {
      if (!mapRef.current || !(window as any).L) return;
      const L = (window as any).L;

      if ((mapRef.current as any).leafletMap) {
        try {
          (mapRef.current as any).leafletMap.remove();
        } catch (e) {}
        (mapRef.current as any).leafletMap = null;
      }
      if ((mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }

      try {
        const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
        const tileUrl = theme === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        const tileLayer = L.tileLayer(tileUrl, {
          attribution: theme === "dark" ? "© CARTO" : "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);
        tileLayerRef.current = tileLayer;
        (mapRef.current as any).leafletMap = map;
        (mapRef.current as any).pathLayers = [];
        (mapRef.current as any).aiPlaceLayers = [];
        (mapRef.current as any).aiRouteLayer = null;
        setMapLoaded(true);
      } catch (err) {
        console.warn("Leaflet init error:", err);
      }
    };

    if ((window as any).L) {
      initMap();
    } else {
      let script = document.querySelector('script[src*="leaflet.js"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.body.appendChild(script);
      }
      script.addEventListener("load", initMap);
    }

    return () => {
      if (mapRef.current) {
        if ((mapRef.current as any).leafletMap) {
          try {
            (mapRef.current as any).leafletMap.remove();
          } catch (e) {}
          (mapRef.current as any).leafletMap = null;
        }
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }
      }
    };
  }, []);

  // ── Theme tile swap ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !(mapRef.current as any).leafletMap || !tileLayerRef.current) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;
    map.removeLayer(tileLayerRef.current);
    const tileUrl = theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: theme === "dark" ? "© CARTO" : "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
  }, [theme, mapLoaded]);

  // ── Scroll chat to bottom ─────────────────────────────────────────────────────

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAILoading]);

  // ── ThingSpeak fetch ──────────────────────────────────────────────────────────

  const fetchThingSpeakData = useCallback(async (mode: "live" | "history") => {
    setIsLoading(true);
    setError("");
    try {
      const results = mode === "live" ? 1 : 100;
      const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=${results}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ThingSpeakData = await res.json();
      setThingSpeakData(data);

      if (!data.feeds?.length) {
        setError("No GPS data available from ThingSpeak.");
        return;
      }

      const sorted = [...data.feeds].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const historyData: LocationData[] = sorted.map((f) => ({
        latitude: parseFloat(f.field1),
        longitude: parseFloat(f.field2),
        accuracy: 10,
        speed: f.field3 ? parseFloat(f.field3) : null,
        heading: null,
        timestamp: new Date(f.created_at).getTime(),
      }));

      const latest = historyData[historyData.length - 1];
      setLocation(latest);
      setLocationHistory(historyData);

      if (mode === "history") {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        const paths = segmentLocationHistory(historyData.filter((l) => l.timestamp >= cutoff));
        setTrackingPaths(paths);
        setVisiblePathIds(new Set(paths.map((p) => p.id)));
        setSelectedPathId(null);
      } else {
        setTrackingPaths([]);
        setVisiblePathIds(new Set());
        setSelectedPathId(null);
      }

      updateVehicleMarker(latest, mode);
    } catch (err) {
      setError(`Failed to fetch GPS: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Polling interval ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isTracking) return;
    const iv = setInterval(() => fetchThingSpeakData(trackingMode), 20000);
    return () => clearInterval(iv);
  }, [isTracking, trackingMode, fetchThingSpeakData]);

  // ── Vehicle marker ────────────────────────────────────────────────────────────

  const updateVehicleMarker = (loc: LocationData, mode: "live" | "history") => {
    if (!mapRef.current || !(mapRef.current as any).leafletMap || !(window as any).L) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;
    if ((mapRef.current as any).currentMarker) map.removeLayer((mapRef.current as any).currentMarker);

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:44px;height:44px;background:linear-gradient(135deg,#0284c7,#0369a1);border:3px solid #fff;border-radius:50%;box-shadow:0 4px 20px rgba(2,132,199,0.7);display:flex;align-items:center;justify-content:center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
      </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const marker = L.marker([loc.latitude, loc.longitude], { icon, zIndexOffset: 1000 }).addTo(map);
    marker.bindPopup(`
      <div style="padding:14px;border-radius:12px;font-size:13px;border:2px solid #0284c7;min-width:220px;background:#fff;color:#0f172a;">
        <div style="font-weight:700;font-size:14px;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;background:#0284c7;border-radius:50%;display:inline-block;"></span>
          Vehicle GPS Telemetry
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;"><div style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;">Latitude</div><div style="font-family:monospace;font-weight:700;">${loc.latitude.toFixed(6)}</div></div>
          <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;"><div style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;">Longitude</div><div style="font-family:monospace;font-weight:700;">${loc.longitude.toFixed(6)}</div></div>
          <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;"><div style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;">Speed</div><div style="color:#0284c7;font-weight:800;">${loc.speed?.toFixed(1) ?? "0.0"} km/h</div></div>
          <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;"><div style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;">Time</div><div style="font-size:11px;font-weight:600;">${formatTime(loc.timestamp)}</div></div>
        </div>
      </div>`);

    (mapRef.current as any).currentMarker = marker;
    if (mode === "live") map.setView([loc.latitude, loc.longitude], 18);
  };

  // ── Path rendering ────────────────────────────────────────────────────────────

  const renderTrackingPaths = useCallback((
    paths: TrackingPath[], visibleIds: Set<number>, selectedId: number | null
  ) => {
    if (!mapRef.current || !(mapRef.current as any).leafletMap || !(window as any).L) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;

    ((mapRef.current as any).pathLayers || []).forEach((l: any) => map.removeLayer(l));
    (mapRef.current as any).pathLayers = [];

    if (trackingMode !== "history" || paths.length === 0) return;

    const boundsCoords: [number, number][] = [];

    paths.forEach((path) => {
      if (!visibleIds.has(path.id)) return;
      const color = getPathColor(path.id - 1);
      const selected = selectedId === path.id;
      const coords: [number, number][] = path.points.map((p) => [p.latitude, p.longitude]);
      coords.forEach((c) => boundsCoords.push(c));

      if (coords.length > 1) {
        const pl = L.polyline(coords, {
          color, weight: selected ? 7 : 5, opacity: selected ? 1 : 0.85,
          lineCap: "round", lineJoin: "round",
        }).addTo(map);
        pl.bindPopup(`
          <div style="padding:12px;border-radius:10px;font-size:12px;border:2px solid ${color};min-width:200px;background:#fff;color:#0f172a;">
            <div style="font-weight:700;color:${color};font-size:14px;margin-bottom:6px;">Path ${path.id}</div>
            <div style="display:grid;gap:4px;color:#334155;">
              <div><span style="color:#94a3b8;">Distance:</span> <b>${path.distanceKm.toFixed(2)} km</b></div>
              <div><span style="color:#94a3b8;">Duration:</span> ${formatDuration(path.durationMs)}</div>
              <div><span style="color:#94a3b8;">Period:</span> ${formatTime(path.startTime)} – ${formatTime(path.endTime)}</div>
            </div>
          </div>`);
        (mapRef.current as any).pathLayers.push(pl);
      }

      const makeLabel = (text: string, bg: string, shadow: string) => L.divIcon({
        className: "",
        html: `<div style="padding:4px 8px;background:${bg};border:2px solid #fff;border-radius:20px;box-shadow:0 2px 8px ${shadow};font-size:10px;font-weight:800;color:#fff;white-space:nowrap;">${text}</div>`,
        iconAnchor: [30, 14],
      });

      const sm = L.marker([path.startLocation.latitude, path.startLocation.longitude], {
        icon: makeLabel(`P${path.id} START`, "#16a34a", "rgba(22,163,74,0.5)"), zIndexOffset: 600,
      }).addTo(map);
      (mapRef.current as any).pathLayers.push(sm);

      const em = L.marker([path.endLocation.latitude, path.endLocation.longitude], {
        icon: makeLabel(`P${path.id} END`, "#dc2626", "rgba(220,38,38,0.5)"), zIndexOffset: 600,
      }).addTo(map);
      (mapRef.current as any).pathLayers.push(em);

      if (path.stopDurationBeforeMs && path.stopDurationBeforeMs >= PATH_GAP_THRESHOLD_MS) {
        const gm = L.marker([path.startLocation.latitude, path.startLocation.longitude], {
          icon: makeLabel(`STOP ${formatDuration(path.stopDurationBeforeMs)}`, "#d97706", "rgba(217,119,6,0.5)"),
          zIndexOffset: 700,
        }).addTo(map);
        (mapRef.current as any).pathLayers.push(gm);
      }
    });

    if (boundsCoords.length > 0) {
      safeFitBounds(map, L, boundsCoords, [40, 40]);
    }
  }, [trackingMode]);

  useEffect(() => {
    if (mapLoaded) renderTrackingPaths(trackingPaths, visiblePathIds, selectedPathId);
  }, [mapLoaded, trackingMode, trackingPaths, visiblePathIds, selectedPathId, renderTrackingPaths]);
  // ── Path controls ─────────────────────────────────────────────────────────────

  const focusOnPath = (path: TrackingPath) => {
    setSelectedPathId(path.id);
    if (!visiblePathIds.has(path.id)) setVisiblePathIds((p) => new Set([...p, path.id]));
    if (!mapRef.current || !(mapRef.current as any).leafletMap || !(window as any).L) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;
    const coords: [number, number][] = path.points.map((p) => [p.latitude, p.longitude]);
    if (coords.length > 0) safeFitBounds(map, L, coords, [50, 50]);
  };

  const togglePathVisibility = (pathId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisiblePathIds((prev) => {
      const next = new Set(prev);
      next.has(pathId) ? next.delete(pathId) : next.add(pathId);
      return next;
    });
  };

  // ── AI helpers ────────────────────────────────────────────────────────────────

  const getCategoryTheme = (cat: string): { bg: string; label: string; iconKey: string } => {
    const themes: Record<string, { bg: string; label: string; iconKey: string }> = {
      hospital: { bg: "#ef4444", label: "Hospital", iconKey: "hospital" },
      police: { bg: "#3b82f6", label: "Police", iconKey: "police" },
      fire: { bg: "#f59e0b", label: "Fire Stn", iconKey: "fire" },
      pharmacy: { bg: "#10b981", label: "Pharmacy", iconKey: "pharmacy" },
      clinic: { bg: "#14b8a6", label: "Clinic", iconKey: "clinic" },
      fuel: { bg: "#6366f1", label: "Fuel", iconKey: "fuel" },
      repair: { bg: "#64748b", label: "Repair", iconKey: "repair" },
      restaurant: { bg: "#ec4899", label: "Food", iconKey: "restaurant" },
      hotel: { bg: "#8b5cf6", label: "Hotel", iconKey: "hotel" },
      default: { bg: "#64748b", label: "Place", iconKey: "default" },
    };
    return themes[cat] || themes.default;
  };

  const getEffectiveLocation = (): { lat: number; lng: number } | null => {
    if (location && !isNaN(location.latitude) && !isNaN(location.longitude)) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return null;
  };

  const clearAIPlaceMarkers = () => {
    if (!mapRef.current || !(mapRef.current as any).leafletMap) return;
    const map = (mapRef.current as any).leafletMap;
    ((mapRef.current as any).aiPlaceLayers || []).forEach((l: any) => map.removeLayer(l));
    (mapRef.current as any).aiPlaceLayers = [];
  };

  const clearAIRouteLayer = () => {
    if (!mapRef.current || !(mapRef.current as any).leafletMap) return;
    const map = (mapRef.current as any).leafletMap;
    if ((mapRef.current as any).aiRouteLayer) {
      map.removeLayer((mapRef.current as any).aiRouteLayer);
      (mapRef.current as any).aiRouteLayer = null;
    }
    setAIActiveRoute(null);
  };

  const clearAllAILayers = () => {
    clearAIPlaceMarkers();
    clearAIRouteLayer();
    setAIPlaces([]);
  };

  const renderAIPlaceMarkers = (places: AIPlace[]) => {
    if (!mapRef.current || !(mapRef.current as any).leafletMap || !(window as any).L) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;
    clearAIPlaceMarkers();

    const coords: [number, number][] = [];
    places.forEach((place, idx) => {
      if (typeof place.latitude !== "number" || typeof place.longitude !== "number") return;
      coords.push([place.latitude, place.longitude]);
      const { bg, label, iconKey } = getCategoryTheme(place.category);
      const svgIcon = CATEGORY_SVG[iconKey] || CATEGORY_SVG.default;

      const isNearest = idx === 0;
      const markerLabel = isNearest ? `★ NEAREST (${place.distanceKm !== undefined ? place.distanceKm.toFixed(1) + "km" : label})` : label;
      const icon = L.divIcon({
        className: "custom-ai-place-marker",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="
              width:${isNearest ? "42px" : "36px"};height:${isNearest ? "42px" : "36px"};
              background:${isNearest ? "#dc2626" : bg};
              border:3px solid #ffffff;
              border-radius:50%;
              box-shadow:0 4px 16px rgba(0,0,0,0.35);
              display:flex;align-items:center;justify-content:center;
            ">${svgIcon}</div>
            <div style="
              padding:2px 7px;
              background:${isNearest ? "#dc2626" : bg};
              border:1.5px solid #ffffff;
              border-radius:20px;
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
              font-size:9px;font-weight:800;color:#fff;
              white-space:nowrap;letter-spacing:0.3px;
            ">${markerLabel}</div>
          </div>`,
        iconSize: [40, 56],
        iconAnchor: [20, 56],
      });

      const m = L.marker([place.latitude, place.longitude], { icon, zIndexOffset: isNearest ? 1000 : 800 }).addTo(map);
      m.bindPopup(`
        <div style="padding:14px;border-radius:12px;font-size:12px;border:2px solid ${isNearest ? "#dc2626" : bg};min-width:240px;background:#fff;color:#0f172a;box-shadow:0 10px 25px rgba(0,0,0,0.15);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:28px;height:28px;background:${bg};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${svgIcon}</div>
              <b style="font-size:13px;">${place.name}</b>
            </div>
            <span style="font-size:9px;background:${isNearest ? "#dc2626" : bg}18;color:${isNearest ? "#dc2626" : bg};border:1px solid ${bg}40;padding:2px 7px;border-radius:20px;font-weight:800;white-space:nowrap;">${isNearest ? "★ NEAREST" : label}</span>
          </div>
          <div style="display:grid;gap:5px;margin-bottom:12px;font-size:12px;">
            ${place.distanceKm !== undefined ? `<div><span style="color:#94a3b8;">Distance:</span> <b style="color:#0284c7;">${place.distanceKm.toFixed(1)} km</b></div>` : ""}
            ${place.rating ? `<div><span style="color:#94a3b8;">Rating:</span> <b style="color:#d97706;">★ ${place.rating}</b></div>` : ""}
            ${place.isOpen !== undefined ? `<div><span style="color:#94a3b8;">Status:</span> <b style="color:${place.isOpen ? "#16a34a" : "#dc2626"};">` + (place.isOpen ? "Open Now" : "Closed") + `</b></div>` : ""}
            ${place.address ? `<div><span style="color:#94a3b8;">Address:</span> <span style="color:#475569;">${place.address}</span></div>` : ""}
            ${place.phone ? `<div><span style="color:#94a3b8;">Phone:</span> <a href="tel:${place.phone}" style="color:#0284c7;font-weight:600;">${place.phone}</a></div>` : ""}
          </div>
          <div style="display:flex;gap:6px;">
            <button id="ai-route-btn-${idx}" style="flex:1;padding:8px;background:${bg};color:#fff;border:none;border-radius:8px;font-weight:700;font-size:11px;cursor:pointer;">Get Route</button>
            ${place.mapsUrl ? `<a href="${place.mapsUrl}" target="_blank" rel="noopener noreferrer" style="padding:8px 10px;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:8px;font-size:11px;text-decoration:none;font-weight:600;">Google Maps</a>` : ""}
          </div>
        </div>`);

      m.on("popupopen", () => {
        const btn = document.getElementById(`ai-route-btn-${idx}`);
        if (btn) btn.onclick = () => handleGetRoute(place);
      });

      (mapRef.current as any).aiPlaceLayers.push(m);
    });

    if (coords.length > 0) {
      safeFitBounds((mapRef.current as any).leafletMap, L, coords, [50, 50]);
    }
  };

  const handleGetRoute = async (place: AIPlace) => {
    const loc = getEffectiveLocation();
    if (!loc || typeof place.latitude !== "number" || typeof place.longitude !== "number") {
      setAIError("Cannot calculate route: missing coordinates."); return;
    }
    setIsAILoading(true);
    try {
      const res = await fetch("/api/ai-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originLat: loc.lat, originLng: loc.lng, destLat: place.latitude, destLng: place.longitude }),
      });
      if (!res.ok) throw new Error("Route calculation failed");
      const data = await res.json();

      clearAIRouteLayer();
      if (!mapRef.current || !(mapRef.current as any).leafletMap || !(window as any).L) return;
      const L = (window as any).L;
      const map = (mapRef.current as any).leafletMap;
      const pl = L.polyline(data.routeCoords, {
        color: "#0284c7", weight: 6, opacity: 0.9, lineCap: "round", dashArray: "8,12",
      }).addTo(map);
      (mapRef.current as any).aiRouteLayer = pl;
      safeFitBounds(map, L, data.routeCoords, [60, 60]);
      setAIActiveRoute({ destinationName: place.name, distanceKm: data.distanceKm, durationMins: data.durationMins });
    } catch (e) {
      setAIError("Failed to fetch route directions.");
    } finally {
      setIsAILoading(false);
    }
  };

  const executeAIQuery = async (lat: number, lng: number, query: string, category?: string) => {
    setIsAILoading(true);
    setAIError("");
    setAIMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: query, timestamp: Date.now() }]);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng, query, category }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "AI error"); }
      const data: AIAssistantResponse = await res.json();
      const rawPlaces = data.places || [];
      const sortedPlaces = [...rawPlaces].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      setAIPlaces(sortedPlaces);
      renderAIPlaceMarkers(sortedPlaces);

      // Auto-route to the absolute nearest place
      if (sortedPlaces.length > 0) {
        setTimeout(() => {
          handleGetRoute(sortedPlaces[0]);
        }, 300);
      }

      setAIMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(), sender: "ai",
        text: data.message || "Here are nearby services.",
        places: sortedPlaces, timestamp: Date.now(),
      }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI error";
      setAIError(msg);
      setAIMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: `Error: ${msg}`, timestamp: Date.now() }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleCategorySearch = (cat: string, prompt: string) => {
    const loc = getEffectiveLocation();
    if (!loc) { setAIError("Vehicle GPS unavailable. Start tracking first."); return; }
    executeAIQuery(loc.lat, loc.lng, prompt, cat);
  };

  // ── Tracking controls ─────────────────────────────────────────────────────────

  const startTracking = (mode: "live" | "history") => {
    setIsTracking(true);
    setTrackingMode(mode);
    setError("");
    fetchThingSpeakData(mode);
  };

  const stopTracking = () => setIsTracking(false);

  const switchMode = (mode: "live" | "history") => {
    if (trackingMode === mode) return;
    setTrackingMode(mode);
    fetchThingSpeakData(mode);
  };

  const resetAll = () => {
    stopTracking();
    if (mapRef.current && (mapRef.current as any).leafletMap) {
      const map = (mapRef.current as any).leafletMap;
      map.setView([20.5937, 78.9629], 5);
      if ((mapRef.current as any).currentMarker) { map.removeLayer((mapRef.current as any).currentMarker); (mapRef.current as any).currentMarker = null; }
      ((mapRef.current as any).pathLayers || []).forEach((l: any) => map.removeLayer(l));
      (mapRef.current as any).pathLayers = [];
    }
    setLocation(null); setError(""); setLocationHistory([]);
    setThingSpeakData(null); setTrackingPaths([]);
    setVisiblePathIds(new Set()); setSelectedPathId(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="page-container relative overflow-hidden min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/8 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-[400px] h-[400px] bg-indigo-600/5 dark:bg-indigo-600/8 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[450px] h-[450px] bg-cyan-600/5 dark:bg-cyan-600/8 rounded-full blur-3xl -bottom-20 -right-20" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 bg-clip-text text-transparent">
                RAKSHAK GPS
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">Vehicle Telemetry & Location-Aware AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isTracking ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              <span className="text-slate-700 dark:text-slate-200 text-xs font-semibold">
                {isTracking ? (trackingMode === "live" ? "Live GPS" : "24H History") : "Standby"}
              </span>
            </div>
            {/* Mode toggle — visible when tracking */}
            {isTracking && (
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <button
                  onClick={() => switchMode("live")}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${trackingMode === "live" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  <Signal className="w-3.5 h-3.5" /> Live
                </button>
                <button
                  onClick={() => switchMode("history")}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${trackingMode === "history" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  <Clock className="w-3.5 h-3.5" /> 24H
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Main Grid ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Map */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">

              {/* Map toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                    <MapIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {trackingMode === "live" ? "Live Telemetry Map" : "24-Hour Journey Segments"}
                    </h2>
                    <p className="text-slate-500 text-[11px]">
                      {trackingMode === "live" ? "NEO-6M satellite stream" : "Paths separated by stops ≥15 min"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {!isTracking ? (
                    <>
                      <button
                        onClick={() => startTracking("live")}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Live Tracking
                      </button>
                      <button
                        onClick={() => startTracking("history")}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" /> 24h History
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={stopTracking}
                      className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" /> Stop
                    </button>
                  )}
                  <button
                    onClick={resetAll}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>

              {/* Map canvas */}
              <div className="relative">
                <div ref={mapRef} className="w-full h-[420px] sm:h-[500px] lg:h-[580px] bg-slate-100 dark:bg-slate-950" />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950/95 gap-3">
                    <div className="w-10 h-10 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Initializing Map…</p>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing ThingSpeak…</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status + Paths */}
          <div className="space-y-5">

            {/* Vehicle Status Card */}
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Vehicle Status
                </h3>
                {location && (
                  <span className="text-[11px] text-slate-500 font-mono">{getTimeAgo(location.timestamp)}</span>
                )}
              </div>

              {location ? (
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { icon: <Locate className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />, label: "Latitude", value: location.latitude.toFixed(6), mono: true, color: "text-slate-900 dark:text-slate-100" },
                    { icon: <Locate className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />, label: "Longitude", value: location.longitude.toFixed(6), mono: true, color: "text-slate-900 dark:text-slate-100" },
                    { icon: <Gauge className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />, label: "Speed", value: `${location.speed?.toFixed(1) ?? "0.0"} km/h`, color: "text-blue-600 dark:text-blue-400" },
                    { icon: <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, label: "Accuracy", value: `±${location.accuracy}m`, color: "text-emerald-600 dark:text-emerald-400" },
                  ].map(({ icon, label, value, mono, color }) => (
                    <div key={label} className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <div className="text-slate-500 font-medium flex items-center gap-1.5">{icon}{label}</div>
                      <div className={`font-bold text-sm ${color} ${mono ? "font-mono" : ""}`}>{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">No active GPS stream</p>
                  <p className="text-slate-400 dark:text-slate-600 text-[11px]">Click Live Tracking or 24h History to start</p>
                </div>
              )}

              {/* Last update row */}
              {location && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Last fix</span>
                  <span className="font-mono">{formatTime(location.timestamp)} · {formatDate(location.timestamp)}</span>
                </div>
              )}
            </div>

            {/* Journey Paths (History mode) */}
            {trackingMode === "history" && trackingPaths.length > 0 && (
              <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Journey Paths
                    <span className="ml-1 text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded-full font-bold">
                      {trackingPaths.length}
                    </span>
                  </h3>
                  <div className="flex gap-1.5">
                    <button onClick={() => setVisiblePathIds(new Set(trackingPaths.map((p) => p.id)))}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-200 dark:border-blue-500/20 cursor-pointer">All</button>
                    <button onClick={() => setVisiblePathIds(new Set())}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">None</button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {trackingPaths.map((path, idx) => (
                    <div
                      key={path.id}
                      onClick={() => focusOnPath(path)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedPathId === path.id
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => togglePathVisibility(path.id, e)}
                            className="cursor-pointer flex-shrink-0"
                          >
                            <div className={`w-3 h-3 rounded-full border-2 ${visiblePathIds.has(path.id) ? "" : "opacity-30"}`}
                              style={{ backgroundColor: getPathColor(idx), borderColor: getPathColor(idx) }} />
                          </button>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">Path {path.id}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {formatTime(path.startTime)} – {formatTime(path.endTime)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-0.5">
                          <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{path.distanceKm.toFixed(2)} km</div>
                          <div className="text-[10px] text-slate-500">{formatDuration(path.durationMs)}</div>
                        </div>
                      </div>
                      {path.stopDurationBeforeMs && path.stopDurationBeforeMs >= PATH_GAP_THRESHOLD_MS && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          Stopped {formatDuration(path.stopDurationBeforeMs)} before this path
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 text-center">
          <p className="text-slate-500 text-[11px]">
            RAKSHAK v2.0 · ThingSpeak Cloud · Leaflet OSM · Gemini AI
          </p>
        </div>
      </div>

      {/* ── Floating AI Button ────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsAIOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full shadow-2xl shadow-blue-600/40 border border-white/15 hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        <Bot className="w-5 h-5" />
        <span className="text-xs font-semibold tracking-widest uppercase">AI Copilot</span>
        {aiPlaces.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold border-2 border-slate-950">
            {aiPlaces.length}
          </span>
        )}
      </button>

      {/* ── AI Assistant Drawer ───────────────────────────────────────────────── */}
      {isAIOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[480px] max-h-[84vh] bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">

          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80">
            <div className="w-9 h-9 bg-blue-500/15 rounded-xl border border-blue-500/25 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                RAKSHAK AI Copilot
                <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Location-Aware Emergency & Driver Assistant (5–7 km Radius)</div>
            </div>
            <button
              onClick={() => setIsAIOpen(false)}
              className="w-7 h-7 flex-shrink-0 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Location indicator */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>{location ? "Vehicle GPS" : "GPS Status"}</span>
            </div>
            {(() => {
              const loc = getEffectiveLocation();
              return loc ? (
                <span className="font-mono text-slate-500 dark:text-slate-400">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>
              ) : (
                <span className="text-red-500 dark:text-red-400 font-medium">Unavailable — Start Tracking</span>
              );
            })()}
          </div>

          {/* Active Route Banner */}
          {aiActiveRoute && (
            <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/50 border-b border-blue-200 dark:border-blue-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold">{aiActiveRoute.destinationName}</span>
                <span className="text-slate-500 dark:text-slate-400">· {aiActiveRoute.distanceKm} km · ~{aiActiveRoute.durationMins} min</span>
              </div>
              <button onClick={clearAIRouteLayer} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white text-[10px] font-bold cursor-pointer">Clear</button>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Quick-action categories */}
            <div className="space-y-3">
              {/* Emergency */}
              <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 p-3 space-y-2">
                <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3" /> Emergency Services
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { cat: "hospital", label: "Hospital", icon: <Hospital className="w-4 h-4" />, cls: "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-300 dark:border-red-500/25 text-red-700 dark:text-red-200", iconCls: "text-red-500 dark:text-red-400" },
                    { cat: "police", label: "Police", icon: <ShieldAlert className="w-4 h-4" />, cls: "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-300 dark:border-blue-500/25 text-blue-700 dark:text-blue-200", iconCls: "text-blue-500 dark:text-blue-400" },
                    { cat: "fire", label: "Fire Stn", icon: <Flame className="w-4 h-4" />, cls: "bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 border-amber-300 dark:border-amber-500/25 text-amber-700 dark:text-amber-200", iconCls: "text-amber-500 dark:text-amber-400" },
                    { cat: "pharmacy", label: "Pharmacy", icon: <Pill className="w-4 h-4" />, cls: "bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-200", iconCls: "text-emerald-500 dark:text-emerald-400" },
                    { cat: "clinic", label: "Clinic", icon: <Stethoscope className="w-4 h-4" />, cls: "bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 border-teal-300 dark:border-teal-500/25 text-teal-700 dark:text-teal-200", iconCls: "text-teal-500 dark:text-teal-400" },
                    { cat: "emergency", label: "All SOS", icon: <Ambulance className="w-4 h-4" />, cls: "bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 border-rose-300 dark:border-rose-500/25 text-rose-700 dark:text-rose-200", iconCls: "text-rose-500 dark:text-rose-400" },
                  ].map(({ cat, label, icon, cls, iconCls }) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySearch(cat, `Find nearby ${label.toLowerCase()}`)}
                      className={`p-2 flex flex-col items-center gap-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${cls}`}
                    >
                      <span className={iconCls}>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel & Services */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cat: "fuel", label: "Fuel Stations", icon: <Fuel className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> },
                  { cat: "repair", label: "Car Repair", icon: <Wrench className="w-4 h-4 text-slate-500 dark:text-slate-400" /> },
                  { cat: "restaurant", label: "Restaurants", icon: <Utensils className="w-4 h-4 text-pink-500 dark:text-pink-400" /> },
                  { cat: "hotel", label: "Hotels", icon: <Hotel className="w-4 h-4 text-violet-500 dark:text-violet-400" /> },
                ].map(({ cat, label, icon }) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySearch(cat, `Find nearby ${label.toLowerCase()}`)}
                    className="p-2.5 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Error */}
            {aiError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-xl text-red-600 dark:text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Active places count */}
            {aiPlaces.length > 0 && (
              <div className="flex items-center justify-between text-xs px-0.5">
                <span className="text-slate-500 dark:text-slate-400">{aiPlaces.length} locations plotted on map</span>
                <button onClick={clearAllAILayers} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer">Clear All</button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="space-y-3">
              {aiMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>

                  {/* Bubble */}
                  <div className={`max-w-[88%] rounded-2xl text-xs space-y-3 ${msg.sender === "user"
                      ? "bg-blue-600 text-white px-4 py-2.5 rounded-br-sm"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-bl-sm"
                    }`}>
                    <p className="leading-relaxed">{msg.text}</p>

                    {/* Place cards */}
                    {msg.places && msg.places.length > 0 && (
                      <div className="space-y-2 mt-1 pt-2 border-t border-slate-300/60 dark:border-slate-700/80">
                        {msg.places.map((place, pi) => {
                          const { bg, label, iconKey } = getCategoryTheme(place.category);
                          return (
                            <div key={pi} className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
                              {/* Card header */}
                              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: bg }}>
                                    <span style={{ display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: CATEGORY_SVG[iconKey] || CATEGORY_SVG.default }} />
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-[12px] truncate">{place.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                  {place.isOpen !== undefined && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${place.isOpen ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"}`}>
                                      {place.isOpen ? "OPEN" : "CLOSED"}
                                    </span>
                                  )}
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${bg}20`, color: bg }}>
                                    {label}
                                  </span>
                                </div>
                              </div>

                              {/* Card body */}
                              <div className="px-3 py-2.5 space-y-1.5 text-[11px]">
                                <div className="flex items-center justify-between">
                                  {place.distanceKm !== undefined && (
                                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{place.distanceKm.toFixed(1)} km away</span>
                                  )}
                                  {place.rating && (
                                    <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                                      <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400" /> {place.rating}
                                    </span>
                                  )}
                                </div>

                                {place.address && (
                                  <p className="text-slate-500 text-[10px] leading-relaxed">{place.address}</p>
                                )}

                                {place.phone && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                    <Phone className="w-3 h-3" />
                                    <a href={`tel:${place.phone}`} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-mono text-[10px]">{place.phone}</a>
                                  </div>
                                )}
                              </div>

                              {/* Card actions */}
                              <div className="flex border-t border-slate-100 dark:border-slate-800/80">
                                <button
                                  onClick={() => handleGetRoute(place)}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer border-r border-slate-100 dark:border-slate-800/80"
                                >
                                  <Navigation className="w-3 h-3" /> Get Route
                                </button>
                                {place.mapsUrl && (
                                  <a
                                    href={place.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Maps
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAILoading && (
                <div className="flex items-center gap-2.5 text-xs text-blue-600 dark:text-blue-400 p-3 bg-blue-50 dark:bg-slate-900/60 border border-blue-200 dark:border-slate-800 rounded-xl">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching nearby facilities via Google Maps…</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = aiQuery.trim();
                if (!q) return;
                setAIQuery("");
                const loc = getEffectiveLocation();
                if (loc) executeAIQuery(loc.lat, loc.lng, q);
                else setAIError("Vehicle GPS unavailable. Start tracking first.");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAIQuery(e.target.value)}
                placeholder="Ask about nearby places…"
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
              />
              <button
                type="submit"
                disabled={isAILoading || !aiQuery.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-center text-[10px] text-slate-500 dark:text-slate-600">
            In emergencies call 112 (Police) or 108 (Ambulance) directly
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <UcodGuard>
      <RakshakGPSTracker />
    </UcodGuard>
  );
}
