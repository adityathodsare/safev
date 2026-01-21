"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaWineGlassAlt,
  FaTemperatureHigh,
  FaBurn,
  FaCar,
  FaBolt,
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

const AlcoholDetection = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);

  const channelID = "3234684";
  const apiKey = "CUIZ4UY1OAKLLVXJ";

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=5`
      );
      const data = response.data.feeds.map((feed) => ({
        time: new Date(feed.created_at).toLocaleTimeString(),
        alcoholLevel: parseFloat(feed.field1),
        temperature: parseFloat(feed.field3) * 10,
        fireDetected: parseFloat(feed.field4),
        engineAllowed: parseFloat(feed.field5),
        acPower: parseFloat(feed.field6),
      }));
      setSensorData(data);

      const latest = data[data.length - 1];
      if (latest) {
        setLatestData({
          ...latest,
          temperature: latest.temperature / 10,
        });

        // 🔴 Send alert if Alcohol > 1400 ppm
        if (latest.alcoholLevel > 2300) {
          sendAlertalcohol(
            "Alcohol Alert",
            "High alcohol level detected in vehicle!"
          );
        }

        // 🔥 Send alert if Fire Detected
        if (latest.fireDetected === 1) {
          sendAlertfire("Fire Alert", "Fire detected in vehicle!");
        }
      }
    } catch (error) {
      console.error("Error fetching data from ThingSpeak:", error);
    }
  };

  const sendAlertfire = async (type, message) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/alert/fire-detected",
        { type, message }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`${type} alert sent: ${message}`, response.data);
    } catch (error) {
      console.error(
        "Error sending alert:",
        error.response?.data || error.message
      );
    }
  };

  const sendAlertalcohol = async (type, message) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/alert/alcohol-level",
        { type, message }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`${type} alert sent: ${message}`, response.data);
    } catch (error) {
      console.error(
        "Error sending alert:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center p-4 sm:p-6 pt-20">
      <h1 className="text-4xl py-20 my-20 font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-10">
        VEHICLE SAFETY MONITORING
      </h1>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {latestData &&
          [
            {
              name: "Alcohol Level (>2300 Unsafe)",
              value: latestData.alcoholLevel,
              unit: "ppm",
              icon: FaWineGlassAlt,
              color: "text-cyan-400",
            },
            {
              name: "Temperature",
              value: latestData.temperature,
              unit: "°C",
              icon: FaTemperatureHigh,
              color: "text-purple-400",
            },
            {
              name: "Fire Detected",
              value: latestData.fireDetected,
              unit: "(0-1)",
              icon: FaBurn,
              color: "text-red-400",
            },
            {
              name: "Engine Allowed",
              value: latestData.engineAllowed,
              unit: "(0-1)",
              icon: FaCar,
              color: "text-blue-400",
            },
            {
              name: "AC Power",
              value: latestData.acPower,
              unit: "(0-1)",
              icon: FaBolt,
              color: "text-yellow-400",
            },
          ].map((sensor, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-center border rounded-2xl bg-[#121A2A] p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 border-gray-700"
            >
              <sensor.icon
                className={`absolute top-3 right-4 text-3xl ${sensor.color} opacity-80`}
              />
              <h2 className={`text-lg font-bold ${sensor.color}`}>
                {sensor.name}
              </h2>
              <p className="text-xl text-gray-300">
                {sensor.value !== null ? sensor.value.toFixed(2) : "Loading..."}{" "}
                {sensor.unit}
              </p>
            </div>
          ))}
      </div>

      {/* Charts Section */}
      <div className="w-full max-w-6xl mt-10 px-4">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">
          Sensor Data Over Time
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              formatter={(value, name) => {
                if (name === "temperature") {
                  return [`${value}°C`, "Temperature"];
                }
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="alcoholLevel"
              stroke="#00CED1"
              strokeWidth={2}
              dot={{ fill: "#00CED1" }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8A2BE2"
              strokeWidth={2}
              dot={{ fill: "#8A2BE2" }}
            />
            <Line
              type="monotone"
              dataKey="fireDetected"
              stroke="#FF4500"
              strokeWidth={2}
              dot={{ fill: "#FF4500" }}
            />
            <Line
              type="monotone"
              dataKey="engineAllowed"
              stroke="#4682B4"
              strokeWidth={2}
              dot={{ fill: "#4682B4" }}
            />
            <Line
              type="monotone"
              dataKey="acPower"
              stroke="#FFD700"
              strokeWidth={2}
              dot={{ fill: "#FFD700" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 text-gray-400 text-sm">
        Data powered by{" "}
        <a
          href="https://thingspeak.com"
          className="text-cyan-400 hover:underline"
        >
          ThingSpeak
        </a>
      </footer>
    </div>
  );
};

export default AlcoholDetection;
