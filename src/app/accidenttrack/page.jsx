"use client";
import { useState, useEffect } from "react";
import {
  FaCarCrash,
  FaBolt,
  FaSync,
  FaCompass,
  FaGasPump,
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

const Home = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [liveMode, setLiveMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const channelID = "3178329";
  const apiKey = "6FP5OUS42Y6AQ7BW";

  const fetchLiveData = async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=7`
      );
      const data = await res.json();

      const formatted = data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        gforce: parseFloat(feed.field1),
        impact: parseFloat(feed.field2),
        jerk: parseFloat(feed.field3),
        tilt: parseFloat(feed.field4),
        gas: parseFloat(feed.field5),
        alert: parseInt(feed.field6),
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
        gforce: parseFloat(feed.field1),
        impact: parseFloat(feed.field2),
        jerk: parseFloat(feed.field3),
        tilt: parseFloat(feed.field4),
        gas: parseFloat(feed.field5),
        alert: parseInt(feed.field6),
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
      name: "G-Force",
      value: latestData?.gforce,
      unit: "g",
      icon: FaCarCrash,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
    },
    {
      name: "Impact",
      value: latestData?.impact,
      unit: "m/s²",
      icon: FaBolt,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
    },
    {
      name: "Jerk",
      value: latestData?.jerk,
      unit: "m/s³",
      icon: FaSync,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
    },
    {
      name: "Tilt Angle",
      value: latestData?.tilt,
      unit: "°",
      icon: FaCompass,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      name: "Gas Level",
      value: latestData?.gas,
      unit: "",
      icon: FaGasPump,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      name: "Alert Flag",
      value: latestData?.alert,
      unit: "",
      icon: FaExclamationTriangle,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
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
              P.R.O.T.E.K – Proactive Rollover Observer & Tracking Emergency Kit
            </h1>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full mt-2"></div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Real-time IoT Monitoring & Analytics
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

        {/* Alert Banner */}
        {latestData && latestData.alert !== 0 && (
          <div className="w-full max-w-6xl mb-6 sm:mb-8 animate-slideDown">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-1">
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <FaExclamationTriangle className="text-2xl sm:text-3xl animate-bounce" />
                  <span className="font-bold text-base sm:text-lg lg:text-xl text-center">
                    {latestData.alert === 1 &&
                      "🚨 ACCIDENT DETECTED — Emergency Alert!"}
                    {latestData.alert === 2 &&
                      "⚠ ROLLOVER DETECTED — Emergency Alert!"}
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
                : "bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600"
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
                : "bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600"
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
                  className={`relative bg-slate-900/50 backdrop-blur-xl border ${sensor.borderColor} rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
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
                  <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-2">
                    {sensor.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                    {sensor.value?.toFixed(2)}
                    <span className="text-base sm:text-lg text-gray-500 ml-1">
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
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Sensor Data Trends
            </h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="sm:h-[350px] lg:h-[400px]"
              >
                <LineChart
                  data={sensorData.map((d) => ({
                    ...d,
                    gas_scaled: d.gas / 100,
                  }))}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="colorGforce"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#FF69B4"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorImpact"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#FFD700"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    stroke="#475569"
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    stroke="#475569"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gforce"
                    stroke="#FF69B4"
                    strokeWidth={3}
                    dot={{ fill: "#FF69B4", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="impact"
                    stroke="#FFD700"
                    strokeWidth={3}
                    dot={{ fill: "#FFD700", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="jerk"
                    stroke="#00BFFF"
                    strokeWidth={3}
                    dot={{ fill: "#00BFFF", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tilt"
                    stroke="#32CD32"
                    strokeWidth={3}
                    dot={{ fill: "#32CD32", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gas_scaled"
                    stroke="#A020F0"
                    strokeWidth={3}
                    dot={{ fill: "#A020F0", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Gas (×0.01)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Powered by ThingSpeak IoT Platform</span>
          </div>
          <p className="text-gray-600 text-xs">
            Real-time monitoring & analytics dashboard
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
            transform: translateY(-100%);
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
