"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [latestDetection, setLatestDetection] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const timelineRef = useRef(null);
  const animationRef = useRef(null);
  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [latestRes, historyRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/latest`),
        fetch(`${API_BASE}/history?limit=30`),
        fetch(`${API_BASE}/stats`),
      ]);

      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      if (!latestData.message) setLatestDetection(latestData);
      setHistory(historyData.detections || []);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const triggerCapture = async () => {
    setIsCapturing(true);
    try {
      await fetch(`${API_BASE}/webcam/capture`);
      await fetchData();
    } catch (err) {
      setError("Capture failed");
    } finally {
      setIsCapturing(false);
    }
  };

  // Timeline hover animation
  const handleTimelineHover = (startIndex) => {
    let frame = 0;
    const animate = () => {
      setHoveredIndex(startIndex + (Math.floor(frame / 10) % history.length));
      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleTimelineLeave = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setHoveredIndex(null);
  };

  const getTrafficLightColor = (color) => {
    switch (color?.toLowerCase()) {
      case "red":
        return "from-rose-500 to-rose-600 shadow-rose-500/20";
      case "yellow":
        return "from-amber-500 to-amber-600 shadow-amber-500/20";
      case "green":
        return "from-emerald-500 to-emerald-600 shadow-emerald-500/20";
      default:
        return "from-gray-500 to-gray-600 shadow-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-400 mt-6 text-center font-medium">
            Loading SafeV System
          </p>
          <p className="text-slate-600 text-sm text-center mt-2">
            Establishing secure connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-3xl">🚦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                SafeV Traffic Intelligence
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-green-500"} animate-pulse`}
                ></div>
                <p className="text-sm text-slate-500">
                  {error ? "Connection Error" : "Real-time Monitoring Active"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={triggerCapture}
            disabled={isCapturing}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              {isCapturing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <span>📸</span>
                  <span>Manual Capture</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-transform duration-300"></div>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: "Total Detections",
                value: stats.total_detections,
                icon: "📊",
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "Traffic Lights",
                value: stats.traffic_lights_detected,
                icon: "🚦",
                color: "from-purple-500 to-purple-600",
              },
              {
                label: "Red Lights",
                value: stats.red_lights,
                icon: "🔴",
                color: "from-red-500 to-red-600",
              },
              {
                label: "People Count",
                value: stats.total_people,
                icon: "👥",
                color: "from-green-500 to-green-600",
              },
              {
                label: "Vehicle Count",
                value: stats.total_vehicles,
                icon: "🚗",
                color: "from-amber-500 to-amber-600",
              },
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-xs text-slate-500">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Latest Detection */}
        {latestDetection && (
          <div className="group relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>
                      Live Detection #{latestDetection.sequence_number}
                    </span>
                  </h2>
                  <span className="text-sm text-slate-500">
                    {new Date(latestDetection.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="relative group/image">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                    <img
                      src={`${API_BASE}${latestDetection.image_url || `/detections/${latestDetection.sequence_number}.jpg`}`}
                      alt={`Detection ${latestDetection.sequence_number}`}
                      className="relative w-full rounded-xl cursor-pointer border border-slate-700"
                      onClick={() =>
                        setSelectedImage(latestDetection.image_url)
                      }
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23334155'/%3E%3Ctext x='320' y='240' font-family='Arial' font-size='24' fill='%23666' text-anchor='middle' dy='.3em'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    {latestDetection.traffic_light?.detected && (
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                          Traffic Light Status
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getTrafficLightColor(latestDetection.traffic_light.color)} shadow-lg animate-pulse`}
                          ></div>
                          <div>
                            <p className="text-2xl font-bold text-white capitalize mb-1">
                              {latestDetection.traffic_light.color} Light
                            </p>
                            {latestDetection.traffic_light.countdown ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-3xl font-bold text-blue-400">
                                  {latestDetection.traffic_light.countdown}
                                </span>
                                <span className="text-slate-500">seconds</span>
                              </div>
                            ) : (
                              <p className="text-amber-400 flex items-center space-x-2">
                                <span>⚠️</span>
                                <span>No countdown detected</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Detection Summary
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: "People",
                            value: latestDetection.person_count || 0,
                            icon: "👤",
                            color: "text-blue-400",
                          },
                          {
                            label: "Vehicles",
                            value: latestDetection.vehicle_count || 0,
                            icon: "🚗",
                            color: "text-green-400",
                          },
                          {
                            label: "Total",
                            value: latestDetection.detection_count || 0,
                            icon: "📊",
                            color: "text-purple-400",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="bg-slate-800/50 rounded-lg p-3 text-center"
                          >
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <div className={`text-lg font-bold ${item.color}`}>
                              {item.value}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {latestDetection.objects?.length > 0 && (
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                          Detected Objects
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {latestDetection.objects.map((obj, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-600"
                            >
                              {obj === "person"
                                ? "👤"
                                : obj === "car"
                                  ? "🚗"
                                  : "🚦"}{" "}
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Timeline */}
        {history.length > 0 && (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <span>🎬</span>
                    <span>Detection Timeline</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Hover to preview • {history.length} frames •{" "}
                    {hoveredIndex !== null
                      ? `Frame ${hoveredIndex + 1}`
                      : "Ready"}
                  </p>
                </div>
                {hoveredIndex !== null && history[hoveredIndex] && (
                  <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-sm text-slate-300">
                      #{history[hoveredIndex].sequence_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Timeline Strip */}
              <div
                ref={timelineRef}
                className="relative h-40 bg-slate-900 rounded-xl overflow-hidden cursor-pointer mb-6 border border-slate-700"
                onMouseEnter={() => handleTimelineHover(0)}
                onMouseLeave={handleTimelineLeave}
              >
                <div className="flex h-full">
                  {history.map((detection, index) => (
                    <div
                      key={detection.id}
                      className="relative flex-1 min-w-[80px] h-full transition-all duration-300 ease-out"
                      style={{
                        filter:
                          hoveredIndex === index
                            ? "brightness(1.2) contrast(1.1)"
                            : "brightness(0.7)",
                        transform:
                          hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                        zIndex: hoveredIndex === index ? 20 : 1,
                        boxShadow:
                          hoveredIndex === index
                            ? "0 0 20px rgba(59, 130, 246, 0.5)"
                            : "none",
                      }}
                    >
                      <img
                        src={`${API_BASE}${detection.image_url || `/detections/${detection.sequence_number}.jpg`}`}
                        alt={`Frame ${detection.sequence_number}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Frame Number */}
                      <div className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/50 px-1 rounded">
                        #{detection.sequence_number}
                      </div>

                      {/* Traffic Light Indicator */}
                      {detection.traffic_light_detected && (
                        <div
                          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            detection.traffic_light_color === "red"
                              ? "bg-red-500 animate-pulse"
                              : detection.traffic_light_color === "yellow"
                                ? "bg-yellow-500 animate-pulse"
                                : detection.traffic_light_color === "green"
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-gray-500"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Playhead */}
                {hoveredIndex !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-lg shadow-blue-500/50"
                    style={{
                      left: `${(hoveredIndex / history.length) * 100}%`,
                      transition: "left 0.1s linear",
                    }}
                  >
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              {hoveredIndex !== null && history[hoveredIndex] && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
                  <div className="md:col-span-1">
                    <div className="relative group/preview">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>
                      <img
                        src={`${API_BASE}${history[hoveredIndex].image_url || `/detections/${history[hoveredIndex].sequence_number}.jpg`}`}
                        alt={`Preview ${history[hoveredIndex].sequence_number}`}
                        className="relative w-full rounded-lg border border-slate-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg"></div>
                      <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
                        Frame #{history[hoveredIndex].sequence_number}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 h-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-slate-500">Time</div>
                          <div className="text-sm font-medium text-white">
                            {new Date(
                              history[hoveredIndex].timestamp,
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">People</div>
                          <div className="text-sm font-medium text-blue-400">
                            {history[hoveredIndex].person_count || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Vehicles</div>
                          <div className="text-sm font-medium text-green-400">
                            {history[hoveredIndex].vehicle_count || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">
                            Traffic Light
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              history[hoveredIndex].traffic_light_color ===
                              "red"
                                ? "text-red-400"
                                : history[hoveredIndex].traffic_light_color ===
                                    "yellow"
                                  ? "text-yellow-400"
                                  : history[hoveredIndex]
                                        .traffic_light_color === "green"
                                    ? "text-green-400"
                                    : "text-gray-400"
                            }`}
                          >
                            {history[hoveredIndex].traffic_light_color ||
                              "none"}
                            {history[hoveredIndex].traffic_light_countdown &&
                              ` (${history[hoveredIndex].traffic_light_countdown}s)`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {history.slice(0, 16).map((detection, index) => (
                  <div
                    key={detection.id}
                    className="group/thumb relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => setSelectedImage(detection.image_url)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover/thumb:opacity-30 transition-opacity"></div>
                    <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group-hover/thumb:border-blue-500 transition-all">
                      <img
                        src={`${API_BASE}${detection.image_url || `/detections/${detection.sequence_number}.jpg`}`}
                        alt={`Thumb ${detection.sequence_number}`}
                        className="w-full aspect-square object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        #{detection.sequence_number}
                      </div>
                      {detection.traffic_light_detected && (
                        <div
                          className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                            detection.traffic_light_color === "red"
                              ? "bg-red-500"
                              : detection.traffic_light_color === "yellow"
                                ? "bg-yellow-500"
                                : detection.traffic_light_color === "green"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                          }`}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <img
              src={`${API_BASE}${selectedImage}`}
              alt="Enlarged view"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
