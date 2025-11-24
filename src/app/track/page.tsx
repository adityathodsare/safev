"use client";

import { useEffect, useState, useRef } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

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
  const mapRef = useRef<HTMLDivElement>(null);
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

        // Light theme tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        // Store map reference
        (mapRef.current as any).leafletMap = map;
      }
    };

    loadMap();

    return () => {
      // Cleanup if needed
    };
  }, []);

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
        const historyData: LocationData[] = data.feeds.map((feed) => ({
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
        updateMapWithData(latestLocation, historyData, mode);
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

  const updateMapWithData = (
    latestLocation: LocationData,
    history: LocationData[],
    mode: "live" | "history"
  ) => {
    if (
      mapRef.current &&
      (mapRef.current as any).leafletMap &&
      (window as any).L
    ) {
      const L = (window as any).L;
      const map = (mapRef.current as any).leafletMap;

      // Clear existing layers
      if ((mapRef.current as any).markerLayers) {
        (mapRef.current as any).markerLayers.forEach((layer: any) => {
          map.removeLayer(layer);
        });
      }
      (mapRef.current as any).markerLayers = [];

      if ((mapRef.current as any).currentMarker) {
        map.removeLayer((mapRef.current as any).currentMarker);
      }

      if ((mapRef.current as any).pathPolyline) {
        map.removeLayer((mapRef.current as any).pathPolyline);
      }

      // Create professional vehicle icon for latest location
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

      // Add vehicle marker for latest location
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
            <strong style="color: #111827; font-size: 14px;">📍 Live Vehicle Location</strong>
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
              <div style="color: #dc2626; font-weight: 700;">${
                latestLocation.speed?.toFixed(1) || "0.0"
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
      (mapRef.current as any).markerLayers.push(vehicleMarker);

      if (mode === "history" && history.length > 1) {
        // Add expressive red dot markers for historical positions (excluding the latest one)
        history.slice(0, -1).forEach((loc, index) => {
          // Calculate color intensity based on recency (newer = brighter red)
          const recency = index / (history.length - 1);
          const intensity = Math.floor(200 + 55 * recency);
          const size = 8 + 4 * recency; // 8px to 12px based on recency

          const dotIcon = L.divIcon({
            className: "history-dot",
            html: `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, #dc2626, #b91c1c);
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(220, 38, 38, 0.6);
                cursor: pointer;
                transition: all 0.3s ease;
              "></div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          const dotMarker = L.marker([loc.latitude, loc.longitude], {
            icon: dotIcon,
          }).addTo(map);

          const dotPopupContent = `
            <div style="color: #1f2937; background: white; padding: 10px; border-radius: 6px; font-size: 12px; border: 1px solid #e5e7eb; min-width: 180px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <div style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%;"></div>
                <strong style="color: #111827; font-size: 13px;">📍 Historical Position</strong>
              </div>
              <div style="display: grid; gap: 4px;">
                <div>
                  <span style="color: #6b7280;">Latitude: </span>
                  <span style="color: #1f2937; font-family: monospace;">${loc.latitude.toFixed(
                    6
                  )}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Longitude: </span>
                  <span style="color: #1f2937; font-family: monospace;">${loc.longitude.toFixed(
                    6
                  )}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Speed: </span>
                  <span style="color: #dc2626; font-weight: 600;">${
                    loc.speed?.toFixed(1) || "0.0"
                  } km/h</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Time: </span>
                  <span style="color: #1f2937;">${formatTime(
                    loc.timestamp
                  )}</span>
                </div>
                <div>
                  <span style="color: #6b7280;">Date: </span>
                  <span style="color: #1f2937;">${formatDate(
                    loc.timestamp
                  )}</span>
                </div>
              </div>
            </div>
          `;
          dotMarker.bindPopup(dotPopupContent);
          (mapRef.current as any).markerLayers.push(dotMarker);
        });
      }

      // Center map on latest location with appropriate zoom
      map.setView(
        [latestLocation.latitude, latestLocation.longitude],
        mode === "live" ? 18 : 16
      );
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
    }
    setLocation(null);
    setError("");
    setLocationHistory([]);
    setThingSpeakData(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
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
                  className={`inline-block w-3 h-3 rounded-full ${
                    isTracking ? "bg-green-400 animate-pulse" : "bg-slate-600"
                  }`}
                ></span>
                <span className="text-slate-300 text-sm font-medium">
                  {isTracking
                    ? `ACTIVE - ${
                        trackingMode === "live"
                          ? "LIVE TRACKING"
                          : "24H HISTORY"
                      }`
                    : "STANDBY"}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl">
              Real-time Vehicle Monitoring System with NEO-6M GPS & ThingSpeak
              Integration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Map Section - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl">🗺️</div>
                      {trackingMode === "live"
                        ? "Live Vehicle Tracking"
                        : "24-Hour Travel History"}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
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
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border border-slate-700 hover:scale-105"
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
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-b-2xl"
                  style={{ background: "#f8fafc" }}
                />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-b-2xl">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-slate-300 text-lg font-semibold">
                        Loading Map...
                      </p>
                      <p className="text-slate-500 text-sm">
                        Initializing GPS tracking system
                      </p>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-b-2xl">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                      <p className="text-slate-300 text-lg font-semibold">
                        Fetching GPS Data
                      </p>
                      <p className="text-slate-500 text-sm">
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
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">📍</div>
                Current Vehicle Location
              </h3>

              {location ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                        Latitude
                      </p>
                      <p className="text-lg font-mono font-bold text-blue-400">
                        {location.latitude.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                        Longitude
                      </p>
                      <p className="text-lg font-mono font-bold text-blue-400">
                        {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                        GPS Accuracy
                      </p>
                      <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        ±{location.accuracy.toFixed(0)} meters
                      </p>
                    </div>

                    {location.speed !== null && (
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
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
                    <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                      Last Update
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {formatTime(location.timestamp)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(location.timestamp)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                    <p className="text-xs text-blue-300 mb-2 uppercase tracking-wide">
                      Data Points Collected
                    </p>
                    <p className="text-2xl font-bold text-white text-center">
                      {locationHistory.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🚙</div>
                  <p className="text-slate-400 text-sm">
                    Start tracking to view live vehicle location
                  </p>
                </div>
              )}
            </div>

            {/* ThingSpeak Data Card */}
            {thingSpeakData && (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl border border-green-500/20 p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl">📡</div>
                  ThingSpeak Data Source
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                      Channel Name
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {thingSpeakData.channel.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                        Total Entries
                      </p>
                      <p className="text-lg font-bold text-green-400">
                        {thingSpeakData.feeds.length}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                        Tracking Mode
                      </p>
                      <p className="text-sm font-semibold text-cyan-400">
                        {trackingMode === "live"
                          ? "Live Tracking"
                          : "24h History"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Legend */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">🎯</div>
                Map Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-white text-sm">🚙</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Current Vehicle
                    </p>
                    <p className="text-xs text-slate-400">
                      Live position with animation
                    </p>
                  </div>
                </div>
                {trackingMode === "history" && (
                  <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow"></div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Historical Positions
                      </p>
                      <p className="text-xs text-slate-400">
                        Past 24-hour travel points
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Active Tracking
                    </p>
                    <p className="text-xs text-slate-400">
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
            <p className="text-slate-600 text-sm">
              🛡️ Secure Tracking • 📡 NEO-6M GPS • 🌐 ThingSpeak Cloud • 🚙
              Real-time Monitoring
            </p>
            <p className="text-slate-700 text-xs">
              Rakshak GPS Tracking System v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
