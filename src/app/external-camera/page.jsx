"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function Home() {
  const [latestDetection, setLatestDetection] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or timeline
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColor, setFilterColor] = useState("all");

  const timelineRef = useRef(null);
  const animationRef = useRef(null);
  const modalRef = useRef(null);
  const API_BASE = "http://localhost:8000";

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [latestRes, historyRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/latest`),
        fetch(`${API_BASE}/history?limit=50`),
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
  }, [API_BASE]);

  useEffect(() => {
    fetchData();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 10000);
    }
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRefresh, fetchData]);

  // Manual capture
  const triggerCapture = async () => {
    setIsCapturing(true);
    try {
      const response = await fetch(`${API_BASE}/webcam/capture`);
      const data = await response.json();
      await fetchData();

      // Show success toast
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn";
      toast.textContent = "✅ Capture successful!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
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

  // Image click handler
  const handleImageClick = (imageUrl, detection) => {
    setSelectedImage(imageUrl);
    setSelectedImageDetails(detection);
  };

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Filter history based on search and color
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.sequence_number.toString().includes(searchTerm) ||
      (item.traffic_light_color &&
        item.traffic_light_color.includes(searchTerm.toLowerCase()));

    const matchesColor =
      filterColor === "all" ||
      (item.traffic_light_color && item.traffic_light_color === filterColor);

    return matchesSearch && matchesColor;
  });

  // Get color classes
  const getTrafficLightColorClass = (color, type = "bg") => {
    const colors = {
      red: {
        bg: "bg-red-500",
        text: "text-red-400",
        border: "border-red-500/30",
        glow: "shadow-red-500/20",
      },
      yellow: {
        bg: "bg-yellow-500",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        glow: "shadow-yellow-500/20",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-400",
        border: "border-green-500/30",
        glow: "shadow-green-500/20",
      },
      unknown: {
        bg: "bg-gray-500",
        text: "text-gray-400",
        border: "border-gray-500/30",
        glow: "shadow-gray-500/20",
      },
    };
    return colors[color]?.[type] || colors.unknown[type];
  };

  const getConfidenceStars = (confidence) => {
    switch (confidence) {
      case "very_high":
        return "★★★";
      case "high":
        return "★★";
      case "medium":
        return "★";
      default:
        return "☆";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-blue-500/30 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-purple-500/30 rounded-full animate-ping animation-delay-300"></div>

          {/* Main spinner */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-300"></div>

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-3xl">🚦</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mt-8 text-center font-medium text-lg">
            Loading SafeV System
          </p>
          <p className="text-gray-600 text-sm text-center mt-2">
            Establishing secure connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl animate-bounce">🚦</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SafeV Traffic Intelligence
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${error ? "bg-red-500" : "bg-green-500"} animate-pulse`}
                  ></div>
                  <p className="text-sm text-gray-500">
                    {error ? "Connection Error" : "Real-time Monitoring Active"}
                  </p>
                </div>
                {latestDetection && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">•</span>
                    <span className="text-blue-400">
                      Last update:{" "}
                      {new Date(latestDetection.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                autoRefresh
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 shadow-lg shadow-green-500/10"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
              ></span>
              <span>
                {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
              </span>
            </button>

            <div className="flex rounded-xl overflow-hidden border border-gray-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  viewMode === "timeline"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                Timeline
              </button>
            </div>

            <button
              onClick={triggerCapture}
              disabled={isCapturing}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
                    <span className="text-xl">📸</span>
                    <span>Manual Capture</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-transform duration-500"></div>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm animate-shake">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-400 text-sm flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-400/50 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: "Total Detections",
                value: stats.total_detections,
                icon: "📊",
                color: "from-blue-600 to-blue-400",
              },
              {
                label: "Traffic Lights",
                value: stats.traffic_lights_detected,
                icon: "🚦",
                color: "from-purple-600 to-purple-400",
              },
              {
                label: "Red Lights",
                value: stats.red_lights,
                icon: "🔴",
                color: "from-red-600 to-red-400",
              },
              {
                label: "Yellow Lights",
                value: stats.yellow_lights,
                icon: "🟡",
                color: "from-yellow-600 to-yellow-400",
              },
              {
                label: "Green Lights",
                value: stats.green_lights,
                icon: "🟢",
                color: "from-green-600 to-green-400",
              },
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
                ></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all hover:scale-105 duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by sequence or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
          </div>

          <div className="flex gap-2">
            {["all", "red", "yellow", "green"].map((color) => (
              <button
                key={color}
                onClick={() => setFilterColor(color)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filterColor === color
                    ? color === "all"
                      ? "bg-blue-600 text-white"
                      : `bg-${color}-600 text-white`
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800"
                }`}
              >
                {color === "all" ? "All" : color}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Detection */}
        {latestDetection && latestDetection.traffic_light_detected && (
          <div className="group relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-gradient"></div>
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-md animate-ping"></div>
                      <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Live Detection #{latestDetection.sequence_number}
                    </h2>
                    {latestDetection.traffic_light_confidence && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getTrafficLightColorClass(latestDetection.traffic_light_color, "border")} bg-gray-900/50`}
                      >
                        {getConfidenceStars(
                          latestDetection.traffic_light_confidence,
                        )}{" "}
                        Confidence
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 flex items-center space-x-2">
                    <span>🕒</span>
                    <span>
                      {new Date(latestDetection.timestamp).toLocaleString()}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="relative group/image">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={`${API_BASE}${latestDetection.image_url}`}
                        alt={`Detection ${latestDetection.sequence_number}`}
                        className="w-full rounded-xl cursor-pointer transform transition-transform duration-500 group-hover/image:scale-105"
                        onClick={() =>
                          handleImageClick(
                            latestDetection.image_url,
                            latestDetection,
                          )
                        }
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23334155'/%3E%3Ctext x='320' y='240' font-family='Arial' font-size='24' fill='%23666' text-anchor='middle' dy='.3em'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                        }}
                      />

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-sm font-medium">
                            Click to enlarge
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    {/* Traffic Light Status */}
                    <div
                      className={`bg-gray-900/50 rounded-xl p-6 border ${getTrafficLightColorClass(latestDetection.traffic_light_color, "border")} hover:border-opacity-100 transition-all`}
                    >
                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <span>🚦</span>
                        <span>Traffic Light Status</span>
                      </h3>
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div
                            className={`absolute inset-0 ${getTrafficLightColorClass(latestDetection.traffic_light_color, "bg")} rounded-full blur-xl opacity-50 animate-pulse`}
                          ></div>
                          <div
                            className={`relative w-20 h-20 rounded-full ${getTrafficLightColorClass(latestDetection.traffic_light_color, "bg")} shadow-2xl flex items-center justify-center text-3xl`}
                          >
                            {latestDetection.traffic_light_color === "red" &&
                              "🔴"}
                            {latestDetection.traffic_light_color === "yellow" &&
                              "🟡"}
                            {latestDetection.traffic_light_color === "green" &&
                              "🟢"}
                          </div>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white capitalize mb-2">
                            {latestDetection.traffic_light_color} Light
                          </p>
                          {latestDetection.traffic_light_countdown ? (
                            <div className="flex items-center space-x-3">
                              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono">
                                {String(
                                  latestDetection.traffic_light_countdown,
                                ).padStart(2, "0")}
                              </span>
                              <span className="text-gray-500">seconds</span>
                            </div>
                          ) : (
                            <p className="text-amber-400 flex items-center space-x-2">
                              <span className="text-xl animate-pulse">⚠️</span>
                              <span>No countdown detected</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detection Summary */}
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                        Detection Summary
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            label: "People",
                            value: latestDetection.person_count || 0,
                            icon: "👤",
                            gradient: "from-blue-400 to-blue-600",
                          },
                          {
                            label: "Vehicles",
                            value: latestDetection.vehicle_count || 0,
                            icon: "🚗",
                            gradient: "from-green-400 to-green-600",
                          },
                          {
                            label: "Total",
                            value: latestDetection.detection_count || 0,
                            icon: "📊",
                            gradient: "from-purple-400 to-purple-600",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="bg-gray-800/50 rounded-lg p-4 text-center group/item hover:scale-105 transition-transform"
                          >
                            <span className="text-3xl mb-2 block group-hover/item:scale-110 transition-transform">
                              {item.icon}
                            </span>
                            <div
                              className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                            >
                              {item.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detected Objects */}
                    {latestDetection.objects?.length > 0 && (
                      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                          Detected Objects
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {latestDetection.objects.map((obj, i) => {
                            const colors = {
                              person:
                                "bg-blue-500/20 text-blue-400 border-blue-500/30",
                              car: "bg-green-500/20 text-green-400 border-green-500/30",
                              truck:
                                "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                              "traffic light":
                                "bg-purple-500/20 text-purple-400 border-purple-500/30",
                            };
                            return (
                              <span
                                key={i}
                                className={`px-4 py-2 rounded-full text-sm font-medium border ${colors[obj] || "bg-gray-700 text-gray-300 border-gray-600"} hover:scale-105 transition-transform`}
                              >
                                {obj === "person"
                                  ? "👤"
                                  : obj === "car"
                                    ? "🚗"
                                    : obj === "truck"
                                      ? "🚛"
                                      : "🚦"}{" "}
                                {obj}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {filteredHistory.length > 0 && (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center space-x-2">
                    <span>📸</span>
                    <span>Detection History</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredHistory.length} detections found
                    {filterColor !== "all" && ` • filtered by ${filterColor}`}
                  </p>
                </div>
                {hoveredIndex !== null && filteredHistory[hoveredIndex] && (
                  <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 animate-fadeIn">
                    <span className="text-sm text-blue-400 font-mono">
                      #{filteredHistory[hoveredIndex].sequence_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Timeline View */}
              {viewMode === "timeline" ? (
                <>
                  <div
                    ref={timelineRef}
                    className="relative h-48 bg-gray-900 rounded-xl overflow-hidden cursor-pointer mb-6 border border-gray-700"
                    onMouseEnter={() => handleTimelineHover(0)}
                    onMouseLeave={handleTimelineLeave}
                  >
                    <div className="flex h-full">
                      {filteredHistory.map((detection, index) => (
                        <div
                          key={detection.id}
                          className="relative flex-1 min-w-[100px] h-full transition-all duration-300 ease-out group/timeline"
                          style={{
                            filter:
                              hoveredIndex === index
                                ? "brightness(1.3) contrast(1.2)"
                                : "brightness(0.6)",
                            transform:
                              hoveredIndex === index
                                ? "scale(1.08)"
                                : "scale(1)",
                            zIndex: hoveredIndex === index ? 20 : 1,
                          }}
                        >
                          <img
                            src={`${API_BASE}${detection.image_url}`}
                            alt={`Frame ${detection.sequence_number}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                          {/* Frame info */}
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded inline-block">
                              #{detection.sequence_number}
                            </div>
                          </div>

                          {/* Traffic light indicator */}
                          {detection.traffic_light_detected && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${getTrafficLightColorClass(detection.traffic_light_color, "bg")} animate-pulse`}
                              ></div>
                              {detection.traffic_light_countdown && (
                                <span className="text-xs font-bold text-white bg-black/50 px-1.5 py-0.5 rounded-full">
                                  {detection.traffic_light_countdown}s
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Playhead */}
                    {hoveredIndex !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50"
                        style={{
                          left: `${(hoveredIndex / filteredHistory.length) * 100}%`,
                          transition: "left 0.1s linear",
                        }}
                      >
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                      </div>
                    )}
                  </div>

                  {/* Preview Panel */}
                  {hoveredIndex !== null && filteredHistory[hoveredIndex] && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-slideUp">
                      <div className="md:col-span-1">
                        <div className="relative group/preview">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>
                          <img
                            src={`${API_BASE}${filteredHistory[hoveredIndex].image_url}`}
                            alt={`Preview ${filteredHistory[hoveredIndex].sequence_number}`}
                            className="relative w-full rounded-lg border border-gray-700 cursor-pointer"
                            onClick={() =>
                              handleImageClick(
                                filteredHistory[hoveredIndex].image_url,
                                filteredHistory[hoveredIndex],
                              )
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg"></div>
                          <div className="absolute bottom-2 left-2 text-sm font-bold text-white">
                            #{filteredHistory[hoveredIndex].sequence_number}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 h-full">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Time
                              </div>
                              <div className="text-sm font-medium text-white">
                                {new Date(
                                  filteredHistory[hoveredIndex].timestamp,
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                People
                              </div>
                              <div className="text-sm font-medium text-blue-400">
                                {filteredHistory[hoveredIndex].person_count ||
                                  0}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Vehicles
                              </div>
                              <div className="text-sm font-medium text-green-400">
                                {filteredHistory[hoveredIndex].vehicle_count ||
                                  0}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Traffic Light
                              </div>
                              <div className="flex items-center space-x-1">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${getTrafficLightColorClass(filteredHistory[hoveredIndex].traffic_light_color, "bg")}`}
                                ></div>
                                <span
                                  className={`text-sm font-medium ${getTrafficLightColorClass(filteredHistory[hoveredIndex].traffic_light_color, "text")}`}
                                >
                                  {filteredHistory[hoveredIndex]
                                    .traffic_light_color || "none"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredHistory.map((detection, index) => (
                    <div
                      key={detection.id}
                      className="group/thumb relative cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onClick={() =>
                        handleImageClick(detection.image_url, detection)
                      }
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover/thumb:opacity-30 transition-opacity"></div>
                      <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group-hover/thumb:border-blue-500 transition-all hover:scale-105 duration-300">
                        <div className="relative aspect-square">
                          <img
                            src={`${API_BASE}${detection.image_url}`}
                            alt={`Thumb ${detection.sequence_number}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-xs font-bold text-white">
                                #{detection.sequence_number}
                              </div>
                              <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                                <span>👤 {detection.person_count || 0}</span>
                                <span>🚗 {detection.vehicle_count || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {detection.traffic_light_detected && (
                              <div
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTrafficLightColorClass(detection.traffic_light_color, "bg")} text-white`}
                              >
                                {detection.traffic_light_color}
                              </div>
                            )}
                          </div>

                          {detection.traffic_light_countdown && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {detection.traffic_light_countdown}s
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {filteredHistory.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
                <span className="text-7xl mb-4 block animate-bounce">🚦</span>
                <p className="text-2xl text-gray-300 mb-2">No detections yet</p>
                <p className="text-gray-500">
                  Click "Manual Capture" to start monitoring
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-50"></div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={`${API_BASE}${selectedImage}`}
                alt="Enlarged view"
                className="w-full h-full object-contain max-h-[80vh]"
              />

              {/* Modal toolbar */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() =>
                    window.open(`${API_BASE}${selectedImage}`, "_blank")
                  }
                  className="bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center text-xl backdrop-blur-sm"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center text-xl backdrop-blur-sm"
                >
                  ✕
                </button>
              </div>

              {/* Image details */}
              {selectedImageDetails && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold">
                        #{selectedImageDetails.sequence_number}
                      </span>
                      <span className="text-gray-400 ml-2">
                        {new Date(
                          selectedImageDetails.timestamp,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <span className="text-blue-400">
                        👤 {selectedImageDetails.person_count || 0}
                      </span>
                      <span className="text-green-400">
                        🚗 {selectedImageDetails.vehicle_count || 0}
                      </span>
                      {selectedImageDetails.traffic_light_detected && (
                        <span
                          className={getTrafficLightColorClass(
                            selectedImageDetails.traffic_light_color,
                            "text",
                          )}
                        >
                          {selectedImageDetails.traffic_light_color} light
                          {selectedImageDetails.traffic_light_countdown &&
                            ` (${selectedImageDetails.traffic_light_countdown}s)`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(20px, -20px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 10s infinite;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}
