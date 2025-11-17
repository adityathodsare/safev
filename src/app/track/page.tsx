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

export default function RakshakGPSTracker() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>("");
  const [watchId, setWatchId] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);

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
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("GPS not supported by this browser");
      return;
    }

    setIsTracking(true);
    setError("");
    setLocationHistory([]);

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords;
      const locationData: LocationData = {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        timestamp: Date.now(),
      };

      setLocation(locationData);
      setLocationHistory((prev) => [...prev, locationData].slice(-50)); // Keep last 50 points

      // Update map
      if (
        mapRef.current &&
        (mapRef.current as any).leafletMap &&
        (window as any).L
      ) {
        const L = (window as any).L;
        const map = (mapRef.current as any).leafletMap;

        // Remove old marker
        if ((mapRef.current as any).currentMarker) {
          map.removeLayer((mapRef.current as any).currentMarker);
        }

        // Remove old path
        if ((mapRef.current as any).pathPolyline) {
          map.removeLayer((mapRef.current as any).pathPolyline);
        }

        // Create custom vehicle icon
        const vehicleIcon = L.divIcon({
          className: "custom-vehicle-marker",
          html: `
            <div style="
              position: relative;
              width: 40px;
              height: 40px;
              transform: rotate(${heading || 0}deg);
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 32px;
                filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
              ">🚗</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        // Add new marker with vehicle icon
        const marker = L.marker([latitude, longitude], {
          icon: vehicleIcon,
        }).addTo(map);

        const popupContent = `
          <div style="color: #1f2937; background: #ffffff; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e5e7eb;">
            <strong style="color: #111827;">📍 Current Location</strong><br/>
            <span style="color: #3b82f6;">Lat:</span> ${latitude.toFixed(
              6
            )}<br/>
            <span style="color: #3b82f6;">Lng:</span> ${longitude.toFixed(
              6
            )}<br/>
            ${
              speed !== null
                ? `<span style="color: #3b82f6;">Speed:</span> ${(
                    speed * 3.6
                  ).toFixed(1)} km/h`
                : ""
            }
          </div>
        `;
        marker.bindPopup(popupContent);

        // Store marker reference
        (mapRef.current as any).currentMarker = marker;

        // Draw path if we have history
        if (locationHistory.length > 1) {
          const pathCoords = [...locationHistory, locationData].map((loc) => [
            loc.latitude,
            loc.longitude,
          ]);
          const polyline = L.polyline(pathCoords, {
            color: "#3b82f6",
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1,
          }).addTo(map);
          (mapRef.current as any).pathPolyline = polyline;
        }

        // Center map
        map.setView(
          [latitude, longitude],
          map.getZoom() < 15 ? 15 : map.getZoom()
        );
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      setError(`GPS Error: ${error.message}`);
      setIsTracking(false);
    };

    const id = navigator.geolocation.watchPosition(success, errorCallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const resetMap = () => {
    if (mapRef.current && (mapRef.current as any).leafletMap) {
      const map = (mapRef.current as any).leafletMap;
      map.setView([20.5937, 78.9629], 5);

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
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  RAKSHAK
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isTracking ? "bg-green-400 animate-pulse" : "bg-gray-600"
                    }`}
                  ></span>
                  <span className="text-gray-400 text-xs sm:text-sm font-medium">
                    {isTracking ? "Tracking Active" : "Standby"}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Live Location Tracking System
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Map Section - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-800/50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-200 flex items-center gap-2">
                    🗺️ Live Map View
                  </h2>
                  <div className="flex gap-2">
                    {!isTracking ? (
                      <button
                        onClick={startTracking}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                      >
                        <span>📍</span>
                        <span className="hidden sm:inline">Start Tracking</span>
                        <span className="sm:hidden">Start</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopTracking}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/20"
                      >
                        <span>⏹️</span>
                        <span className="hidden sm:inline">Stop Tracking</span>
                        <span className="sm:hidden">Stop</span>
                      </button>
                    )}
                    <button
                      onClick={resetMap}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-gray-700"
                    >
                      <span>🔄</span>
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
                  style={{ background: "#f9fafb" }}
                />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-gray-400 text-sm">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border-t border-red-500/20">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel - Takes 1 column on desktop */}
          <div className="space-y-4 sm:space-y-6">
            {/* Location Data Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                📊 Location Data
              </h3>

              {location ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Latitude</p>
                      <p className="text-sm font-mono text-blue-400">
                        {location.latitude.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Longitude</p>
                      <p className="text-sm font-mono text-blue-400">
                        {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                    <p className="text-sm font-semibold text-green-400">
                      ±{location.accuracy.toFixed(0)}m
                    </p>
                  </div>

                  {location.speed !== null && location.speed > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Speed</p>
                      <p className="text-sm font-semibold text-cyan-400">
                        {(location.speed * 3.6).toFixed(1)} km/h
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Last Update</p>
                    <p className="text-sm text-gray-300">
                      {formatTime(location.timestamp)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-400 mb-1">
                      Tracking Points
                    </p>
                    <p className="text-lg font-bold text-blue-400">
                      {locationHistory.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚗</div>
                  <p className="text-gray-500 text-sm">
                    Start tracking to view location data
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                ⚡ Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">GPS Status</span>
                  <span
                    className={`text-sm font-semibold ${
                      isTracking ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    {isTracking ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Map Theme</span>
                  <span className="text-sm font-semibold text-gray-300">
                    Dark Mode
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Update Rate</span>
                  <span className="text-sm font-semibold text-gray-300">
                    Real-time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            🔒 Secure • 🌐 Real-time • 📱 Mobile Optimized
          </p>
        </div>
      </div>
    </div>
  );
}
