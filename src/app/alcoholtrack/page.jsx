"use client";
import { useState, useEffect } from "react";
import {
  FaWineGlassAlt,
  FaTemperatureHigh,
  FaBurn,
  FaCar,
  FaBolt,
  FaExclamationTriangle,
  FaRedo,
  FaHistory,
  FaFire,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AlcoholDetection = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [liveMode, setLiveMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ThingSpeak Configuration
  const channelID = "3234684";
  const apiKey = "CUIZ4UY1OAKLLVXJ";

  const fetchLiveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=20`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.feeds || data.feeds.length === 0) {
        throw new Error("No data available from the sensor");
      }

      const formatted = data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        timestamp: new Date(feed.created_at).getTime(),
        alcoholLevel: parseFloat(feed.field1) || 0,
        temperature: parseFloat(feed.field3) || 0,
        fireDetected: parseFloat(feed.field4) || 0,
        engineAllowed: parseFloat(feed.field5) || 0,
        acPower: parseFloat(feed.field6) || 0,
      }));

      // Sort by timestamp (newest first)
      formatted.sort((a, b) => b.timestamp - a.timestamp);

      setSensorData(formatted);
      setLatestData(formatted[0]); // Latest is first after sorting
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetch24hData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&days=1&sum=daily`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.feeds || data.feeds.length === 0) {
        throw new Error("No historical data available");
      }

      const formatted = data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(feed.created_at).getTime(),
        alcoholLevel: parseFloat(feed.field1) || 0,
        temperature: parseFloat(feed.field3) || 0,
        fireDetected: parseFloat(feed.field4) || 0,
        engineAllowed: parseFloat(feed.field5) || 0,
        acPower: parseFloat(feed.field6) || 0,
      }));

      // Sort by timestamp
      formatted.sort((a, b) => a.timestamp - b.timestamp);

      setSensorData(formatted);
      setLatestData(formatted[formatted.length - 1]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching 24hr data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (liveMode) {
      fetchLiveData();
      const interval = setInterval(fetchLiveData, 15000); // 15 seconds interval
      return () => clearInterval(interval);
    }
  }, [liveMode]);

  const sensors = [
    {
      id: "alcohol",
      name: "Alcohol Level",
      value: latestData?.alcoholLevel,
      unit: "ppm",
      icon: FaWineGlassAlt,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
      borderColor: "border-cyan-500/40",
      iconColor: "text-cyan-400",
      threshold: 2300,
      safeRange: "0 - 2300 ppm",
      dangerColor: "text-red-400",
      isDanger: (val) => val > 2300,
    },
    {
      id: "temperature",
      name: "Temperature",
      value: latestData?.temperature,
      unit: "°C",
      icon: FaTemperatureHigh,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-violet-600/20",
      borderColor: "border-purple-500/40",
      iconColor: "text-purple-400",
      safeRange: "20 - 40 °C",
      isDanger: (val) => val > 40 || val < 20,
    },
    {
      id: "fire",
      name: "Fire Status",
      value: latestData?.fireDetected,
      unit: "",
      icon: FaBurn,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-red-500/20 to-orange-600/20",
      borderColor: "border-red-500/40",
      iconColor: "text-red-400",
      isDanger: (val) => val === 1,
      statusText: (val) => (val === 1 ? "DETECTED" : "SAFE"),
    },
    {
      id: "engine",
      name: "Engine Status",
      value: latestData?.engineAllowed,
      unit: "",
      icon: FaCar,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20",
      borderColor: "border-blue-500/40",
      iconColor: "text-blue-400",
      statusText: (val) => (val === 1 ? "ALLOWED" : "BLOCKED"),
      isDanger: (val) => val === 0,
    },
    {
      id: "ac",
      name: "AC Power",
      value: latestData?.acPower,
      unit: "",
      icon: FaBolt,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/40",
      iconColor: "text-yellow-400",
      statusText: (val) => (val === 1 ? "ON" : "OFF"),
      isDanger: (val) => false,
    },
  ];

  const getAlertStatus = () => {
    if (!latestData) return null;

    const alerts = [];
    if (latestData.alcoholLevel > 2300) {
      alerts.push({
        type: "alcohol",
        message: "HIGH ALCOHOL LEVEL DETECTED",
        description: "Alcohol concentration exceeds safe limits",
        severity: "high",
        icon: FaWineGlassAlt,
      });
    }
    if (latestData.fireDetected === 1) {
      alerts.push({
        type: "fire",
        message: "FIRE DETECTED",
        description: "Fire sensor has been triggered",
        severity: "critical",
        icon: FaFire,
      });
    }
    if (latestData.engineAllowed === 0 && latestData.alcoholLevel > 2300) {
      alerts.push({
        type: "engine",
        message: "ENGINE DISABLED",
        description: "Engine blocked due to high alcohol level",
        severity: "medium",
        icon: FaCar,
      });
    }

    return alerts.length > 0 ? alerts : null;
  };

  const alerts = getAlertStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-4 w-full max-w-6xl">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              M.A.D.A.K.S.H
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mt-2">
              Monitoring Alcohol Detection & Kinetic Safety Hub
            </p>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full mt-4"></div>
          </div>

          {/* Live Status */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {liveMode && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-sm font-medium">
                  Live Updates Active
                </span>
              </div>
            )}

            <div className="text-gray-400 text-sm">
              Last updated:{" "}
              {latestData ? new Date().toLocaleTimeString() : "Loading..."}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-4xl mb-6">
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-red-400 text-xl" />
                  <div>
                    <h3 className="font-semibold text-red-300">
                      Connection Error
                    </h3>
                    <p className="text-red-400/80 text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={liveMode ? fetchLiveData : fetch24hData}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Banners */}
        {alerts && alerts.length > 0 && (
          <div className="w-full max-w-6xl mb-8 space-y-4 animate-slideDown">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-1 ${
                  alert.severity === "critical"
                    ? "bg-gradient-to-r from-red-600 to-orange-600"
                    : alert.severity === "high"
                      ? "bg-gradient-to-r from-orange-600 to-yellow-600"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600"
                }`}
              >
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          alert.severity === "critical"
                            ? "bg-red-500/20"
                            : alert.severity === "high"
                              ? "bg-orange-500/20"
                              : "bg-blue-500/20"
                        }`}
                      >
                        <alert.icon
                          className={`text-2xl ${
                            alert.severity === "critical"
                              ? "text-red-400"
                              : alert.severity === "high"
                                ? "text-orange-400"
                                : "text-blue-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl">
                          🚨 {alert.message}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        alert.severity === "critical"
                          ? "bg-red-500/30 text-red-200"
                          : alert.severity === "high"
                            ? "bg-orange-500/30 text-orange-200"
                            : "bg-blue-500/30 text-blue-200"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10 w-full max-w-md">
          <button
            onClick={() => {
              setLiveMode(true);
              fetchLiveData();
            }}
            className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              liveMode
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/30"
                : "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <FaRedo
                className={`text-lg ${liveMode ? "animate-spin-slow" : ""}`}
              />
              <span>Live Mode</span>
            </div>
          </button>

          <button
            onClick={() => {
              setLiveMode(false);
              fetch24hData();
            }}
            className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              !liveMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30"
                : "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <FaHistory />
              <span>24 Hours</span>
            </div>
          </button>
        </div>

        {/* Sensor Cards Grid - PERFECTLY ALIGNED */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-cyan-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaWineGlassAlt className="text-cyan-400 text-2xl" />
              </div>
            </div>
            <p className="text-gray-400">Loading sensor data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mb-8 sm:mb-12">
            {sensors.map((sensor, index) => {
              const isDanger = sensor.isDanger
                ? sensor.isDanger(sensor.value)
                : false;
              const hasExtraInfo = sensor.threshold || sensor.safeRange;

              return (
                <div
                  key={sensor.id}
                  className="group relative animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${sensor.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}
                  ></div>

                  {/* Card with fixed height structure */}
                  <div className="relative bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/30 h-full flex flex-col min-h-[280px]">
                    {/* Top Section: Icon and Status */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-xl ${sensor.bgColor}`}>
                        <sensor.icon
                          className={`text-2xl ${isDanger ? "text-red-400" : sensor.iconColor}`}
                        />
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${sensor.color} text-white`}
                      >
                        {sensor.statusText
                          ? sensor.statusText(sensor.value)
                          : "LIVE"}
                      </div>
                    </div>

                    {/* Middle Section: Name and Value */}
                    <div className="mb-6">
                      <h3 className="text-gray-400 text-sm font-medium mb-3">
                        {sensor.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-3xl font-bold ${
                            isDanger ? "text-red-400" : "text-white"
                          }`}
                        >
                          {sensor.value !== null && sensor.value !== undefined
                            ? sensor.value.toFixed(sensor.unit ? 1 : 0)
                            : "--"}
                        </span>
                        {sensor.unit && (
                          <span className="text-lg text-gray-500">
                            {sensor.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Info Lines - ALWAYS 2 LINES FOR PERFECT ALIGNMENT */}
                    <div className="mt-auto space-y-3 pt-4 border-t border-gray-800/50">
                      {/* Line 1: Dynamic based on sensor type */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {sensor.threshold
                            ? "Threshold"
                            : sensor.safeRange
                              ? "Safe Range"
                              : "Current Status"}
                        </span>
                        <span
                          className={`font-medium ${
                            isDanger
                              ? "text-red-400"
                              : sensor.id === "temperature"
                                ? "text-green-400"
                                : "text-gray-300"
                          }`}
                        >
                          {sensor.threshold
                            ? `${sensor.threshold} ppm`
                            : sensor.safeRange
                              ? sensor.safeRange
                              : sensor.statusText
                                ? sensor.statusText(sensor.value)
                                : "ACTIVE"}
                        </span>
                      </div>

                      {/* Line 2: Safety Status (Always Present) */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Safety Status</span>
                        <span
                          className={`font-medium flex items-center gap-1.5 ${
                            isDanger ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {isDanger ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              ALERT
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              NORMAL
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Graph Section */}
        <div className="w-full max-w-7xl">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Sensor Data Trends
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {liveMode ? "Last 20 readings" : "Last 24 hours"}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-xs text-gray-400">Alcohol Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-gray-400">Temperature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-400">Fire Status</span>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={sensorData.slice().reverse()} // Show in chronological order
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#6B7280"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    minTickGap={30}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                    }}
                    labelStyle={{ color: "#D1D5DB", fontWeight: 600 }}
                    formatter={(value, name) => {
                      const units = {
                        "Alcohol Level (ppm)": " ppm",
                        "Temperature (°C)": "°C",
                        "Fire Detected": "",
                        "Engine Allowed": "",
                        "AC Power": "",
                      };
                      return [value + (units[name] || ""), name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="alcoholLevel"
                    name="Alcohol Level (ppm)"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: "#06B6D4", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fireDetected"
                    name="Fire Detected"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: "#EF4444", r: 3 }}
                    activeDot={{ r: 6 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>Connected to ThingSpeak IoT Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Channel ID: {channelID}</span>
            </div>
          </div>
          <p className="text-gray-600 text-xs">
            M.A.D.A.K.S.H – Real-time Alcohol Detection & Safety Monitoring
            System
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AlcoholDetection;
