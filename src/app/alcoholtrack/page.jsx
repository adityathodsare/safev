"use client";
import { useState, useEffect } from "react";
import {
  FaWineGlassAlt,
  FaTemperatureHigh,
  FaTint,
  FaBurn,
  FaCar,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const AlcoholDetection = () => {
  const { theme } = useTheme();
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [liveMode, setLiveMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const channelID = "3407232";
  const apiKey = "UFVCOV4G37H5S9HN";

  const fetchLiveData = async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=7`
      );
      const data = await res.json();

      const formatted = data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        temperature: parseFloat(feed.field1),
        humidity: parseFloat(feed.field2),
        alcoholLevel: parseFloat(feed.field3),
        // Inverted: ThingSpeak sends 1 = safe (no fire) → display 0
        //           ThingSpeak sends 0 = fire present  → display 1
        fireDetected: parseInt(feed.field4) === 0 ? 1 : 0,
        engineAllowed: parseInt(feed.field5),
        // Scale all to a comparable range so every wave is visible:
        // temp ~38-39  → ×50 gives ~1900-1950  (sits in alcohol band)
        // humidity ~34-37 → ×50 gives ~1700-1850
        // alcoholLevel ~1500-4095 → raw (dominant wave)
        // fire 0/1 (inverted) → ×2000 gives 0 or 2000
        // engine 0/1 → ×1800 gives 0 or 1800 (slightly below fire so distinguishable)
        temp_scaled: parseFloat(feed.field1) * 50,
        humidity_scaled: parseFloat(feed.field2) * 50,
        fire_scaled: (parseInt(feed.field4) === 0 ? 1 : 0) * 2000,
        engine_scaled: parseInt(feed.field5) * 1800,
      }));

      setSensorData(formatted);
      setLatestData(formatted[formatted.length - 1]);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching data");
      setLoading(false);
    }
  };

  const fetch24hData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&days=1`
      );
      const data = await res.json();

      const formatted = data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        temperature: parseFloat(feed.field1),
        humidity: parseFloat(feed.field2),
        alcoholLevel: parseFloat(feed.field3),
        fireDetected: parseInt(feed.field4) === 0 ? 1 : 0,
        engineAllowed: parseInt(feed.field5),
        temp_scaled: parseFloat(feed.field1) * 50,
        humidity_scaled: parseFloat(feed.field2) * 50,
        fire_scaled: (parseInt(feed.field4) === 0 ? 1 : 0) * 2000,
        engine_scaled: parseInt(feed.field5) * 1800,
      }));

      setSensorData(formatted);
      setLatestData(formatted[formatted.length - 1]);
      setLoading(false);
    } catch {
      console.log("Error fetching 24hr data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (liveMode) {
      fetchLiveData();
      const interval = setInterval(fetchLiveData, 10000);
      return () => clearInterval(interval);
    }
  }, [liveMode]);

  const sensors = [
    {
      name: "Temperature",
      value: latestData?.temperature,
      unit: "°C",
      icon: FaTemperatureHigh,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
    },
    {
      name: "Humidity",
      value: latestData?.humidity,
      unit: "%",
      icon: FaTint,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      name: "Alcohol Level",
      value: latestData?.alcoholLevel,
      unit: "ppm",
      icon: FaWineGlassAlt,
      color: "from-cyan-500 to-teal-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
    },
    {
      name: "Fire Status",
      value: latestData?.fireDetected,
      unit: "",
      icon: FaBurn,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
    },
    {
      name: "Engine Status",
      value: latestData?.engineAllowed,
      unit: "",
      icon: FaCar,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
  ];

  const gridStroke = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)";
  const tickColor = theme === "dark" ? "#94a3b8" : "#475569";
  const axisStroke = theme === "dark" ? "#475569" : "#94a3b8";
  const tooltipBg = theme === "dark" ? "#090d16" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const tooltipLabel = theme === "dark" ? "#cbd5e1" : "#334155";

  return (
    <div className="page-container relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <div className="inline-block">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
              M.A.D.A.K.S.H – Monitoring Alcohol Detection &amp; Kinetic Safety Hub
            </h1>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full mt-2"></div>
          </div>
          <p className="text-theme-secondary text-sm sm:text-base">
            Real-time IoT Monitoring &amp; Analytics
          </p>
          {liveMode && (
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Updates Active
            </div>
          )}
        </div>

        {/* Alert – High Alcohol */}
        {latestData && latestData.alcoholLevel > 2300 && (
          <div className="w-full max-w-6xl mb-6 sm:mb-8 animate-slideDown">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-1">
              <div className="glass-card rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <FaExclamationTriangle className="text-2xl sm:text-3xl animate-bounce" />
                  <span className="font-bold text-base sm:text-lg lg:text-xl text-center">
                    🚨 HIGH ALCOHOL LEVEL DETECTED — Safety Alert!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert – Fire */}
        {latestData && latestData.fireDetected === 1 && (
          <div className="w-full max-w-6xl mb-6 sm:mb-8 animate-slideDown">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-yellow-600 p-1">
              <div className="glass-card rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <FaBurn className="text-2xl sm:text-3xl animate-bounce" />
                  <span className="font-bold text-base sm:text-lg lg:text-xl text-center">
                    🔥 FIRE DETECTED — Emergency Alert!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full max-w-md">
          <button
            onClick={() => {
              setLiveMode(true);
              fetchLiveData();
            }}
            className={`flex-1 px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              liveMode
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50"
                : "glass-card hover:border-blue-500/30"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔄</span>
              <span>Live Mode</span>
            </div>
          </button>

          <button
            onClick={() => {
              setLiveMode(false);
              fetch24hData();
            }}
            className={`flex-1 px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              !liveMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50"
                : "glass-card hover:border-blue-500/30"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📆</span>
              <span>24 Hours</span>
            </div>
          </button>
        </div>

        {/* Sensor Cards */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl w-full mb-8 sm:mb-12">
            {sensors.map((sensor, i) => (
              <div
                key={i}
                className="group relative animate-fadeIn"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sensor.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}
                ></div>
                <div
                  className={`relative glass-card p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${sensor.bgColor}`}>
                      <sensor.icon
                        className={`text-2xl sm:text-3xl ${sensor.iconColor}`}
                      />
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${sensor.color} text-white`}
                    >
                      LIVE
                    </div>
                  </div>
                  <h3 className="text-theme-secondary text-xs sm:text-sm font-medium mb-2">
                    {sensor.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-theme">
                    {sensor.value?.toFixed(2)}
                    <span className="text-base sm:text-lg text-theme-secondary ml-1">
                      {sensor.unit}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Graph Section */}
        <div className="w-full max-w-7xl">
          <div className="glass-card p-4 sm:p-6 lg:p-8 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Sensor Data Trends
            </h2>
            <div className="flex flex-wrap gap-4 mb-4 text-xs text-theme-secondary">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                Temperature (×50)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                Humidity (×50)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                Alcohol (ppm)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                Fire (×2000)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                Engine (×1800)
              </span>
            </div>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="sm:h-[350px] lg:h-[400px]"
              >
                <LineChart
                  data={sensorData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FB923C" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FB923C" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorAlc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorFire" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F87171" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.3} />
                  <XAxis dataKey="time" tick={{ fill: tickColor, fontSize: 12 }} stroke={axisStroke} />
                  <YAxis tick={{ fill: tickColor, fontSize: 12 }} stroke={axisStroke} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    }}
                    labelStyle={{ color: tooltipLabel }}
                    formatter={(value, name) => {
                      if (name === "Temperature (°C)") return [(value / 50).toFixed(1), "°C"];
                      if (name === "Humidity (%)") return [(value / 50).toFixed(1), "%"];
                      if (name === "Alcohol Level (ppm)") return [value, "ppm"];
                      if (name === "Fire Status") return [value / 2000, ""];
                      if (name === "Engine Status") return [value / 1800, ""];
                      return [value, ""];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp_scaled"
                    stroke="#FB923C"
                    strokeWidth={3}
                    dot={{ fill: "#FB923C", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity_scaled"
                    stroke="#60A5FA"
                    strokeWidth={3}
                    dot={{ fill: "#60A5FA", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Humidity (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="alcoholLevel"
                    stroke="#22D3EE"
                    strokeWidth={3}
                    dot={{ fill: "#22D3EE", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Alcohol Level (ppm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="fire_scaled"
                    stroke="#F87171"
                    strokeWidth={3}
                    dot={{ fill: "#F87171", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Fire Status"
                  />
                  <Line
                    type="monotone"
                    dataKey="engine_scaled"
                    stroke="#4ADE80"
                    strokeWidth={3}
                    dot={{ fill: "#4ADE80", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Engine Status"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-theme-secondary text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Powered by ThingSpeak IoT Platform</span>
          </div>
          <p className="text-theme-secondary text-xs">
            Real-time monitoring &amp; analytics dashboard
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AlcoholDetection;