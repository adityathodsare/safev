"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

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

const PATH_GAP_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

const PATH_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#22c55e", // Green
  "#a855f7", // Purple
  "#f97316", // Orange
  "#06b6d4", // Cyan
  "#eab308", // Yellow
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#8b5cf6", // Violet
];

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculatePathDistance = (points: LocationData[]): number => {
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += calculateDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return totalDistance;
};

const getPathColor = (pathIndex: number): string => {
  return PATH_COLORS[pathIndex % PATH_COLORS.length];
};

const segmentLocationHistory = (history: LocationData[]): TrackingPath[] => {
  // 1. Filter out invalid lat/lng points
  const validPoints = history.filter(
    (loc) =>
      loc &&
      typeof loc.latitude === "number" &&
      typeof loc.longitude === "number" &&
      !isNaN(loc.latitude) &&
      !isNaN(loc.longitude) &&
      (loc.latitude !== 0 || loc.longitude !== 0)
  );

  if (validPoints.length === 0) return [];

  // 2. Sort chronologically (oldest to newest)
  const sorted = [...validPoints].sort((a, b) => a.timestamp - b.timestamp);

  const rawPaths: {
    points: LocationData[];
    stopDurationBeforeMs: number | null;
  }[] = [];

  let currentPoints: LocationData[] = [sorted[0]];
  let currentGapBefore: number | null = null;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const gap = curr.timestamp - prev.timestamp;

    if (gap >= PATH_GAP_THRESHOLD_MS) {
      // Time gap >= 15 min: close current path and start next path
      rawPaths.push({
        points: currentPoints,
        stopDurationBeforeMs: currentGapBefore,
      });
      currentPoints = [curr];
      currentGapBefore = gap;
    } else {
      currentPoints.push(curr);
    }
  }

  // Push final path
  if (currentPoints.length > 0) {
    rawPaths.push({
      points: currentPoints,
      stopDurationBeforeMs: currentGapBefore,
    });
  }

  // 3. Construct TrackingPath items
  return rawPaths.map((raw, index) => {
    const startLoc = raw.points[0];
    const endLoc = raw.points[raw.points.length - 1];
    const startTime = startLoc.timestamp;
    const endTime = endLoc.timestamp;
    const durationMs = Math.max(0, endTime - startTime);
    const distanceKm = calculatePathDistance(raw.points);

    return {
      id: index + 1,
      points: raw.points,
      startTime,
      endTime,
      durationMs,
      distanceKm,
      startLocation: startLoc,
      endLocation: endLoc,
      stopDurationBeforeMs: raw.stopDurationBeforeMs,
    };
  });
};

const formatDuration = (ms: number): string => {
  if (ms <= 0) return "0 min";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remMin = minutes % 60;
    return `${hours} hr${hours > 1 ? "s" : ""}${remMin > 0 ? ` ${remMin} min` : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }
  return `${seconds} sec`;
};

interface ThingSpeakData {
  channel: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: Array<{
    created_at: string;
    entry_id: number;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
  }>;
}

export default function RakshakGPSTracker() {
  const { theme } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<any>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [trackingMode, setTrackingMode] = useState<"live" | "history">("live");
  const [thingSpeakData, setThingSpeakData] = useState<ThingSpeakData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Multi-path segmentation state
  const [trackingPaths, setTrackingPaths] = useState<TrackingPath[]>([]);
  const [visiblePathIds, setVisiblePathIds] = useState<Set<number>>(new Set());
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  // ThingSpeak configuration
  const THINGSPEAK_CHANNEL_ID = "3178336";
  const THINGSPEAK_READ_API_KEY = "IUXBXZHM4D3JY2G2";

  useEffect(() => {
    const loadMap = () => {
      if (typeof window !== "undefined") {
        // Load Leaflet CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(cssLink);

        // Load Leaflet JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          setMapLoaded(true);
          initMap();
        };
        document.body.appendChild(script);
      }
    };

    const initMap = () => {
      if (mapRef.current && (window as any).L) {
        const L = (window as any).L;

        // Create map with dark theme
        const map = L.map(mapRef.current, {
          zoomControl: true,
        }).setView([20.5937, 78.9629], 5); // India center

        // Theme-aware tile layer
        const tileUrl =
          theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

        const tileLayer = L.tileLayer(tileUrl, {
          attribution:
            theme === "dark"
              ? "© OpenStreetMap © CARTO"
              : "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        tileLayerRef.current = tileLayer;

        // Store map reference
        (mapRef.current as any).leafletMap = map;
      }
    };

    loadMap();

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution:
        theme === "dark"
          ? "© OpenStreetMap © CARTO"
          : "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
  }, [theme, mapLoaded]);

  // Fetch data from ThingSpeak
  const fetchThingSpeakData = async (mode: "live" | "history" = "live") => {
    setIsLoading(true);
    setError("");

    try {
      let url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}`;

      if (mode === "live") {
        url += "&results=1"; // Get only the latest entry
      } else {
        url += "&results=100"; // Get more points for history
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ThingSpeakData = await response.json();
      setThingSpeakData(data);

      if (data.feeds && data.feeds.length > 0) {
        // Sort feeds by timestamp in ascending order (oldest to newest)
        const sortedFeeds = [...data.feeds].sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });

        const historyData: LocationData[] = sortedFeeds.map((feed) => ({
          latitude: parseFloat(feed.field1),
          longitude: parseFloat(feed.field2),
          accuracy: 10,
          speed: feed.field3 ? parseFloat(feed.field3) : null,
          heading: null,
          timestamp: new Date(feed.created_at).getTime(),
        }));

        const latestLocation = historyData[historyData.length - 1];
        setLocation(latestLocation);
        setLocationHistory(historyData);

        if (mode === "history" && historyData.length > 0) {
          const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
          const recentHistory = historyData.filter(
            (loc) => loc.timestamp >= twentyFourHoursAgo
          );

          const paths = segmentLocationHistory(recentHistory);
          setTrackingPaths(paths);
          const allIds = new Set(paths.map((p) => p.id));
          setVisiblePathIds(allIds);
          setSelectedPathId(null);
        } else {
          setTrackingPaths([]);
          setVisiblePathIds(new Set());
          setSelectedPathId(null);
        }

        updateVehicleMarker(latestLocation, mode);
      } else {
        setError("No GPS data available from ThingSpeak");
      }
    } catch (err) {
      console.error("Error fetching ThingSpeak data:", err);
      setError(
        `Failed to fetch GPS data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicleMarker = (
    latestLocation: LocationData,
    mode: "live" | "history"
  ) => {
    if (
      mapRef.current &&
      (mapRef.current as any).leafletMap &&
      (window as any).L
    ) {
      const L = (window as any).L;
      const map = (mapRef.current as any).leafletMap;

      if ((mapRef.current as any).currentMarker) {
        map.removeLayer((mapRef.current as any).currentMarker);
      }

      const vehicleIcon = L.divIcon({
        className: "vehicle-marker",
        html: `
          <div style="
            position: relative;
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <div style="
              font-size: 18px;
              color: white;
              font-weight: bold;
            ">🚙</div>
            <div style="
              position: absolute;
              bottom: -5px;
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 10px solid #1d4ed8;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6); }
              50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.8); }
              100% { transform: scale(1); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6); }
            }
          </style>
        `,
        iconSize: [42, 52],
        iconAnchor: [21, 52],
      });

      const vehicleMarker = L.marker(
        [latestLocation.latitude, latestLocation.longitude],
        {
          icon: vehicleIcon,
          zIndexOffset: 1000,
        }
      ).addTo(map);

      const vehiclePopupContent = `
        <div style="color: #1f2937; background: white; padding: 12px; border-radius: 8px; font-size: 13px; border: 2px solid #3b82f6; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
            <strong style="color: #111827; font-size: 14px;">📍 Current Vehicle Location</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <span style="color: #6b7280; font-size: 11px;">Latitude</span>
              <div style="color: #1f2937; font-family: monospace; font-weight: 600;">${latestLocation.latitude.toFixed(
        6
      )}</div>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 11px;">Longitude</span>
              <div style="color: #1f2937; font-family: monospace; font-weight: 600;">${latestLocation.longitude.toFixed(
        6
      )}</div>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 11px;">Speed</span>
              <div style="color: #dc2626; font-weight: 700;">${latestLocation.speed?.toFixed(1) || "0.0"
        } km/h</div>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 11px;">Time</span>
              <div style="color: #1f2937; font-size: 11px; font-weight: 500;">${formatTime(
          latestLocation.timestamp
        )}</div>
            </div>
          </div>
        </div>
      `;
      vehicleMarker.bindPopup(vehiclePopupContent);
      (mapRef.current as any).currentMarker = vehicleMarker;

      if (mode === "live") {
        map.setView(
          [latestLocation.latitude, latestLocation.longitude],
          18
        );
      }
    }
  };

  const renderTrackingPaths = (
    paths: TrackingPath[],
    visibleIds: Set<number>,
    selectedId: number | null
  ) => {
    if (
      !mapRef.current ||
      !(mapRef.current as any).leafletMap ||
      !(window as any).L
    )
      return;
    const L = (window as any).L;
    const map = (mapRef.current as any).leafletMap;

    // Clear existing path layers
    if ((mapRef.current as any).pathLayers) {
      (mapRef.current as any).pathLayers.forEach((layer: any) => {
        map.removeLayer(layer);
      });
    }
    (mapRef.current as any).pathLayers = [];

    if (trackingMode !== "history" || paths.length === 0) return;

    const visibleBoundsCoords: [number, number][] = [];

    paths.forEach((path, index) => {
      if (!visibleIds.has(path.id)) return;

      const pathColor = getPathColor(path.id - 1);
      const isSelected = selectedId === path.id;

      // Collect points for map bounds
      path.points.forEach((pt) => {
        visibleBoundsCoords.push([pt.latitude, pt.longitude]);
      });

      // 1. Draw Polyline (if path has > 1 points)
      if (path.points.length > 1) {
        const coords = path.points.map((p) => [p.latitude, p.longitude]);
        const polyline = L.polyline(coords, {
          color: pathColor,
          weight: isSelected ? 6 : 4,
          opacity: isSelected ? 1.0 : 0.85,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        const polylinePopup = `
          <div style="color: #1f2937; background: white; padding: 12px; border-radius: 8px; font-size: 12px; border: 2px solid ${pathColor}; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <strong style="color: ${pathColor}; font-size: 14px;">🛣️ Path ${path.id}</strong>
              <span style="font-size: 10px; background: ${pathColor}22; color: ${pathColor}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">ROUTE</span>
            </div>
            <div style="display: grid; gap: 4px;">
              <div><span style="color: #6b7280;">Distance:</span> <strong style="color: #1f2937;">${path.distanceKm.toFixed(2)} km</strong></div>
              <div><span style="color: #6b7280;">Duration:</span> ${formatDuration(path.durationMs)}</div>
              <div><span style="color: #6b7280;">Time:</span> ${formatTime(path.startTime)} → ${formatTime(path.endTime)}</div>
              <div><span style="color: #6b7280;">GPS Points:</span> ${path.points.length}</div>
            </div>
          </div>
        `;
        polyline.bindPopup(polylinePopup);

        (mapRef.current as any).pathLayers.push(polyline);
      }

      // 2. Start Marker (🟢 Path X Start)
      const startIcon = L.divIcon({
        className: `path-start-marker-${path.id}`,
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #22c55e, #15803d);
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(34, 197, 94, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            color: white;
            cursor: pointer;
          ">
            P${path.id}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const startMarker = L.marker(
        [path.startLocation.latitude, path.startLocation.longitude],
        {
          icon: startIcon,
          zIndexOffset: 600,
        }
      ).addTo(map);

      const startPopupContent = `
        <div style="color: #1f2937; background: white; padding: 12px; border-radius: 8px; font-size: 12px; border: 2px solid #22c55e; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="font-size: 16px;">🟢</span>
            <strong style="color: #15803d; font-size: 14px;">Path ${path.id} Start</strong>
          </div>
          <div style="display: grid; gap: 4px;">
            <div><span style="color: #6b7280;">Time:</span> <strong>${formatTime(path.startTime)}</strong></div>
            <div><span style="color: #6b7280;">Date:</span> ${formatDate(path.startTime)}</div>
            <div><span style="color: #6b7280;">Coordinates:</span> <span style="font-family: monospace; font-size: 11px;">${path.startLocation.latitude.toFixed(6)}, ${path.startLocation.longitude.toFixed(6)}</span></div>
            ${path.startLocation.speed !== null ? `<div><span style="color: #6b7280;">Speed:</span> ${path.startLocation.speed.toFixed(1)} km/h</div>` : ""}
          </div>
        </div>
      `;
      startMarker.bindPopup(startPopupContent);

      (mapRef.current as any).pathLayers.push(startMarker);

      // 3. End Marker (🔴 Path X End) - if path has > 1 points
      if (path.points.length > 1) {
        const endIcon = L.divIcon({
          className: `path-end-marker-${path.id}`,
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #ef4444, #b91c1c);
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 10px rgba(239, 68, 68, 0.7);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 800;
              color: white;
              cursor: pointer;
            ">
              P${path.id}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const endMarker = L.marker(
          [path.endLocation.latitude, path.endLocation.longitude],
          {
            icon: endIcon,
            zIndexOffset: 600,
          }
        ).addTo(map);

        const endPopupContent = `
          <div style="color: #1f2937; background: white; padding: 12px; border-radius: 8px; font-size: 12px; border: 2px solid #ef4444; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
              <span style="font-size: 16px;">🔴</span>
              <strong style="color: #b91c1c; font-size: 14px;">Path ${path.id} End</strong>
            </div>
            <div style="display: grid; gap: 4px;">
              <div><span style="color: #6b7280;">Time:</span> <strong>${formatTime(path.endTime)}</strong></div>
              <div><span style="color: #6b7280;">Traveled Distance:</span> <strong style="color: #3b82f6;">${path.distanceKm.toFixed(2)} km</strong></div>
              <div><span style="color: #6b7280;">Duration:</span> ${formatDuration(path.durationMs)}</div>
              <div><span style="color: #6b7280;">Coordinates:</span> <span style="font-family: monospace; font-size: 11px;">${path.endLocation.latitude.toFixed(6)}, ${path.endLocation.longitude.toFixed(6)}</span></div>
            </div>
          </div>
        `;
        endMarker.bindPopup(endPopupContent);

        (mapRef.current as any).pathLayers.push(endMarker);
      }

      // 4. Stop Marker (Tracking Gap) before this path
      if (index > 0 && path.stopDurationBeforeMs !== null) {
        const prevPath = paths[index - 1];
        if (visibleIds.has(prevPath.id) || visibleIds.has(path.id)) {
          const stopIcon = L.divIcon({
            className: `stop-marker-${index}`,
            html: `
              <div style="
                position: relative;
                width: 34px;
                height: 34px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 3px 12px rgba(245, 158, 11, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                color: white;
                cursor: pointer;
              ">
                ⏱️
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          const stopMarker = L.marker(
            [prevPath.endLocation.latitude, prevPath.endLocation.longitude],
            {
              icon: stopIcon,
              zIndexOffset: 700,
            }
          ).addTo(map);

          const stopPopupContent = `
            <div style="color: #1f2937; background: white; padding: 12px; border-radius: 8px; font-size: 12px; border: 2px solid #f59e0b; min-width: 220px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                <span style="font-size: 16px;">🛑</span>
                <strong style="color: #d97706; font-size: 14px;">Stop / Tracking Gap ${index}</strong>
              </div>
              <div style="display: grid; gap: 5px;">
                <div><span style="color: #6b7280;">Stopped / Gap for:</span> <strong style="color: #d97706; font-size: 13px;">${formatDuration(path.stopDurationBeforeMs)}</strong></div>
                <div><span style="color: #6b7280;">From:</span> ${formatTime(prevPath.endTime)} (${formatDate(prevPath.endTime)})</div>
                <div><span style="color: #6b7280;">Until:</span> ${formatTime(path.startTime)} (${formatDate(path.startTime)})</div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px;">
                  <span>Previous: <strong style="color: ${getPathColor(prevPath.id - 1)};">Path ${prevPath.id}</strong></span>
                  <span>Next: <strong style="color: ${pathColor};">Path ${path.id}</strong></span>
                </div>
              </div>
            </div>
          `;
          stopMarker.bindPopup(stopPopupContent);

          (mapRef.current as any).pathLayers.push(stopMarker);
        }
      }
    });

    // Fit map bounds to visible path coordinates
    if (visibleBoundsCoords.length > 0) {
      const bounds = L.latLngBounds(visibleBoundsCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      renderTrackingPaths(trackingPaths, visiblePathIds, selectedPathId);
    }
  }, [trackingMode, trackingPaths, visiblePathIds, selectedPathId, mapLoaded]);

  const focusOnPath = (path: TrackingPath) => {
    setSelectedPathId(path.id);
    if (!visiblePathIds.has(path.id)) {
      setVisiblePathIds((prev) => new Set([...prev, path.id]));
    }
    if (
      mapRef.current &&
      (mapRef.current as any).leafletMap &&
      (window as any).L
    ) {
      const L = (window as any).L;
      const map = (mapRef.current as any).leafletMap;
      const coords: [number, number][] = path.points.map((p) => [
        p.latitude,
        p.longitude,
      ]);
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const togglePathVisibility = (pathId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisiblePathIds((prev) => {
      const next = new Set(prev);
      if (next.has(pathId)) {
        next.delete(pathId);
      } else {
        next.add(pathId);
      }
      return next;
    });
  };

  const showAllPaths = () => {
    setVisiblePathIds(new Set(trackingPaths.map((p) => p.id)));
  };

  const hideAllPaths = () => {
    setVisiblePathIds(new Set());
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Less than 1 minute
      return "Just now";
    } else if (diff < 3600000) {
      // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diff < 86400000) {
      // Less than 24 hours
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  const startTracking = (mode: "live" | "history") => {
    setIsTracking(true);
    setTrackingMode(mode);
    setError("");
    fetchThingSpeakData(mode);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resetMap = () => {
    if (mapRef.current && (mapRef.current as any).leafletMap) {
      const map = (mapRef.current as any).leafletMap;
      map.setView([20.5937, 78.9629], 5);

      // Clear all markers
      if ((mapRef.current as any).markerLayers) {
        (mapRef.current as any).markerLayers.forEach((layer: any) => {
          map.removeLayer(layer);
        });
        (mapRef.current as any).markerLayers = [];
      }

      if ((mapRef.current as any).currentMarker) {
        map.removeLayer((mapRef.current as any).currentMarker);
        (mapRef.current as any).currentMarker = null;
      }

      if ((mapRef.current as any).pathPolyline) {
        map.removeLayer((mapRef.current as any).pathPolyline);
        (mapRef.current as any).pathPolyline = null;
      }

      if ((mapRef.current as any).pathLayers) {
        (mapRef.current as any).pathLayers.forEach((layer: any) => {
          map.removeLayer(layer);
        });
        (mapRef.current as any).pathLayers = [];
      }
    }
    setLocation(null);
    setError("");
    setLocationHistory([]);
    setThingSpeakData(null);
    setTrackingPaths([]);
    setVisiblePathIds(new Set());
    setSelectedPathId(null);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="page-container relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent relative">
                  RAKSHAK GPS
                </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${isTracking ? "bg-green-400 animate-pulse" : "bg-slate-600"
                    }`}
                ></span>
                <span className="text-theme text-sm font-medium">
                  {isTracking
                    ? `ACTIVE - ${trackingMode === "live"
                      ? "LIVE TRACKING"
                      : "24H HISTORY"
                    }`
                    : "STANDBY"}
                </span>
              </div>
            </div>
            <p className="text-theme-secondary text-lg sm:text-xl max-w-2xl">
              Real-time Vehicle Monitoring System with NEO-6M GPS & ThingSpeak
              Integration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Map Section - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-200/50 dark:border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-theme flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl">🗺️</div>
                      {trackingMode === "live"
                        ? "Live Vehicle Tracking"
                        : "24-Hour Travel History"}
                    </h2>
                    <p className="text-theme-secondary text-sm mt-1">
                      {trackingMode === "live"
                        ? "Monitoring current vehicle position in real-time"
                        : "Viewing complete travel route from the past 24 hours"}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {!isTracking ? (
                      <>
                        <button
                          onClick={() => startTracking("live")}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                        >
                          <span className="text-lg">📍</span>
                          <div className="text-left">
                            <div className="font-bold">Live Tracking</div>
                            <div className="text-xs opacity-80">
                              Current Position
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => startTracking("history")}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105"
                        >
                          <span className="text-lg">🕒</span>
                          <div className="text-left">
                            <div className="font-bold">24h History</div>
                            <div className="text-xs opacity-80">
                              Travel Route
                            </div>
                          </div>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={stopTracking}
                        className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 shadow-lg border border-slate-600 hover:scale-105"
                      >
                        <span className="text-lg">⏹️</span>
                        <div className="text-left">
                          <div className="font-bold">Stop Tracking</div>
                          <div className="text-xs opacity-80">
                            Pause monitoring
                          </div>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={resetMap}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border border-slate-700 hover:scale-105"
                    >
                      <span className="text-lg">🔄</span>
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-b-2xl bg-slate-100 dark:bg-card-dark"
                />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-theme/80 backdrop-blur-sm rounded-b-2xl">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-theme text-lg font-semibold">
                        Loading Map...
                      </p>
                      <p className="text-theme-secondary text-sm">
                        Initializing GPS tracking system
                      </p>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-theme/80 backdrop-blur-sm rounded-b-2xl">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                      <p className="text-theme text-lg font-semibold">
                        Fetching GPS Data
                      </p>
                      <p className="text-theme-secondary text-sm">
                        Connecting to ThingSpeak...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border-t border-red-500/30 backdrop-blur-sm">
                  <p className="text-red-300 text-sm flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <span className="flex-1">{error}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel - Takes 1 column on desktop */}
          <div className="space-y-6 sm:space-y-8">
            {/* Current Location Card */}
            <div className="glass-card p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-theme mb-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">📍</div>
                Current Vehicle Location
              </h3>

              {location ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        Latitude
                      </p>
                      <p className="text-lg font-mono font-bold text-blue-400">
                        {location.latitude.toFixed(6)}
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        Longitude
                      </p>
                      <p className="text-lg font-mono font-bold text-blue-400">
                        {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        GPS Accuracy
                      </p>
                      <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        ±{location.accuracy.toFixed(0)} meters
                      </p>
                    </div>

                    {location.speed !== null && (
                      <div className="glass-card rounded-xl p-4">
                        <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                          Speed
                        </p>
                        <p className="text-lg font-bold text-red-400 flex items-center gap-2">
                          <span className="text-base">🚀</span>
                          {location.speed.toFixed(1)} km/h
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                      Last Update
                    </p>
                    <p className="text-sm font-semibold text-theme">
                      {formatTime(location.timestamp)}
                    </p>
                    <p className="text-xs text-theme-secondary">
                      {formatDate(location.timestamp)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                    <p className="text-xs text-blue-300 mb-2 uppercase tracking-wide">
                      Data Points Collected
                    </p>
                    <p className="text-2xl font-bold text-theme text-center">
                      {locationHistory.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🚙</div>
                  <p className="text-theme-secondary text-sm">
                    Start tracking to view live vehicle location
                  </p>
                </div>
              )}
            </div>

            {/* ThingSpeak Data Card */}
            {thingSpeakData && (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl border border-green-500/20 p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-theme mb-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl">📡</div>
                  ThingSpeak Data Source
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                      Channel Name
                    </p>
                    <p className="text-sm font-semibold text-theme">
                      {thingSpeakData.channel.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        Total Entries
                      </p>
                      <p className="text-lg font-bold text-green-400">
                        {thingSpeakData.feeds.length}
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        Tracking Mode
                      </p>
                      <p className="text-sm font-semibold text-cyan-400">
                        {trackingMode === "live"
                          ? "Live Tracking"
                          : "24h History"}
                      </p>
                    </div>
                  </div>
                  {trackingMode === "history" && locationHistory.length > 0 && (
                    <div className="glass-card rounded-xl p-4">
                      <p className="text-xs text-theme-secondary mb-2 uppercase tracking-wide">
                        Time Range
                      </p>
                      <p className="text-sm font-semibold text-theme">
                        {formatDate(locationHistory[0].timestamp)} to{" "}
                        {formatDate(
                          locationHistory[locationHistory.length - 1].timestamp
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Journey Paths Section - Render when trackingMode === "history" */}
            {trackingMode === "history" && trackingPaths.length > 0 && (
              <div className="glass-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/50 dark:border-white/10">
                  <h3 className="text-lg font-bold text-theme flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">🛣️</div>
                    Journey Paths
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={showAllPaths}
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-semibold rounded-lg transition-colors border border-blue-500/30 cursor-pointer"
                    >
                      Show All
                    </button>
                    <button
                      onClick={hideAllPaths}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
                    >
                      Hide All
                    </button>
                  </div>
                </div>

                {/* Journey Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-3 text-center rounded-xl border border-blue-500/20">
                    <p className="text-[10px] text-theme-secondary uppercase tracking-wider">
                      Total Paths
                    </p>
                    <p className="text-lg font-bold text-blue-400">
                      {trackingPaths.length}
                    </p>
                  </div>
                  <div className="glass-card p-3 text-center rounded-xl border border-amber-500/20">
                    <p className="text-[10px] text-theme-secondary uppercase tracking-wider">
                      Total Stops
                    </p>
                    <p className="text-lg font-bold text-amber-400">
                      {Math.max(0, trackingPaths.length - 1)}
                    </p>
                  </div>
                  <div className="glass-card p-3 text-center rounded-xl border border-green-500/20">
                    <p className="text-[10px] text-theme-secondary uppercase tracking-wider">
                      Total Distance
                    </p>
                    <p className="text-lg font-bold text-green-400">
                      {trackingPaths
                        .reduce((sum, p) => sum + p.distanceKm, 0)
                        .toFixed(1)}{" "}
                      km
                    </p>
                  </div>
                </div>

                {/* Path Cards List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {trackingPaths.map((path, idx) => {
                    const isVisible = visiblePathIds.has(path.id);
                    const isSelected = selectedPathId === path.id;
                    const color = getPathColor(idx);

                    return (
                      <div
                        key={path.id}
                        onClick={() => focusOnPath(path)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                            ? "bg-slate-800/90 border-blue-500 shadow-lg ring-1 ring-blue-500"
                            : "bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/50"
                          }`}
                        style={{
                          borderLeftWidth: "5px",
                          borderLeftColor: color,
                        }}
                      >
                        {/* Header row: Checkbox, Path Title, Color badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) =>
                                togglePathVisibility(path.id, e as any)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 bg-slate-700 border-slate-600 cursor-pointer"
                            />
                            <span className="font-bold text-sm text-theme flex items-center gap-2">
                              Path {path.id}
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{ backgroundColor: color }}
                              ></span>
                            </span>
                          </div>
                          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                            {path.distanceKm.toFixed(2)} km
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-theme-secondary mt-3">
                          <div>
                            <span className="block text-[10px] text-slate-400">
                              Time Window
                            </span>
                            <span className="font-medium text-theme">
                              {formatTime(path.startTime)} →{" "}
                              {formatTime(path.endTime)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400">
                              Duration
                            </span>
                            <span className="font-medium text-theme">
                              {formatDuration(path.durationMs)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400">
                              GPS Points
                            </span>
                            <span className="font-medium text-theme">
                              {path.points.length} points
                            </span>
                          </div>
                          {path.stopDurationBeforeMs !== null && (
                            <div>
                              <span className="block text-[10px] text-slate-400">
                                Gap Before
                              </span>
                              <span className="font-medium text-amber-400">
                                ⏱️ {formatDuration(path.stopDurationBeforeMs)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map Legend */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-theme mb-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">🎯</div>
                Map Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-theme text-sm">🚙</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-theme">
                      Current Vehicle
                    </p>
                    <p className="text-xs text-theme-secondary">
                      Live position marker
                    </p>
                  </div>
                </div>

                {trackingMode === "history" && trackingPaths.length > 0 ? (
                  <>
                    {trackingPaths.map((path, idx) => (
                      <div
                        key={path.id}
                        className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
                      >
                        <div
                          className="w-7 h-3 rounded-full border border-white/50 shadow-sm"
                          style={{ backgroundColor: getPathColor(idx) }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-theme flex items-center justify-between">
                            <span>Path {path.id}</span>
                            <span className="text-[11px] text-blue-400 font-mono">
                              {path.distanceKm.toFixed(2)} km
                            </span>
                          </p>
                          <p className="text-[10px] text-theme-secondary truncate">
                            {formatTime(path.startTime)} - {formatTime(path.endTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-7 h-7 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center text-xs">
                        ⏱️
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-theme">
                          Stop / Tracking Gap
                        </p>
                        <p className="text-xs text-theme-secondary">
                          15+ minute break between paths
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  trackingMode === "history" && (
                    <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-theme">
                          Travel Path
                        </p>
                        <p className="text-xs text-theme-secondary">
                          Route taken
                        </p>
                      </div>
                    </div>
                  )
                )}

                <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-theme">
                      Active Tracking
                    </p>
                    <p className="text-xs text-theme-secondary">
                      Real-time data streaming
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <p className="text-theme-secondary text-sm">
              🛡️ Secure Tracking • 📡 NEO-6M GPS • 🌐 ThingSpeak Cloud • 🚙
              Real-time Monitoring
            </p>
            <p className="text-theme-secondary text-xs">
              Rakshak GPS Tracking System v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
