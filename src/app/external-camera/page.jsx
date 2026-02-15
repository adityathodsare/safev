"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [detection, setDetection] = useState(null);
  const [serverOnline, setServerOnline] = useState(true);
  const [cameraSource, setCameraSource] = useState("webcam");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Check server health on load
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/health");
      if (res.ok) {
        setServerOnline(true);
        setApiError(false);
      } else {
        setServerOnline(false);
      }
    } catch (err) {
      setServerOnline(false);
    }
  };

  // Poll the detection API every second (only if server is online)
  useEffect(() => {
    if (!serverOnline) return;

    const fetchDetection = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/detection");
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setDetection(data);
        setApiError(false);
      } catch (err) {
        console.error("Failed to fetch detection:", err);
        setApiError(true);
      }
    };

    fetchDetection();
    const interval = setInterval(fetchDetection, 1000);
    return () => clearInterval(interval);
  }, [serverOnline]);

  // Function to switch camera
  const switchCamera = async (target) => {
    setLoading(true);
    setMobileMenuOpen(false);
    try {
      const res = await fetch("http://localhost:5000/api/switch_camera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target }),
      });

      if (res.ok) {
        setCameraSource(target);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to switch camera", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e6edf3] font-mono">
      {/* Header */}
      <header className="border-b border-[#2d333b] bg-[#0d1117] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚦</span>
              <h1 className="text-xl font-bold">
                traffic-light
                <span className="text-[#7bc96f]">.detect()</span>
              </h1>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-2xl hover:text-[#7bc96f] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* Status indicator */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${serverOnline ? "bg-[#7bc96f] animate-pulse" : "bg-[#ff7b7b]"}`}
                />
                <code className="text-sm text-[#8b949e]">
                  {serverOnline ? "API: connected" : "API: offline"}
                </code>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0d1117] border-b border-[#2d333b] z-40 p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
              Camera Source
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => switchCamera("webcam")}
                disabled={cameraSource === "webcam" || loading}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  cameraSource === "webcam"
                    ? "bg-[#7bc96f] bg-opacity-10 border border-[#7bc96f]"
                    : "bg-[#161b22] border border-[#2d333b] hover:border-[#7bc96f]"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-xl">📷</span>
                <code className="text-sm">webcam.init()</code>
              </button>
              <button
                onClick={() => switchCamera("esp")}
                disabled={cameraSource === "esp" || loading}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  cameraSource === "esp"
                    ? "bg-[#7bc96f] bg-opacity-10 border border-[#7bc96f]"
                    : "bg-[#161b22] border border-[#2d333b] hover:border-[#7bc96f]"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-xl">📡</span>
                <code className="text-sm">esp32.connect()</code>
              </button>
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-[#7bc96f]">
                <span className="animate-spin">⟳</span>
                <code className="text-xs">switching source...</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Camera controls (desktop) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                  Camera Source
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => switchCamera("webcam")}
                    disabled={cameraSource === "webcam" || loading}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      cameraSource === "webcam"
                        ? "bg-[#7bc96f] bg-opacity-10 border border-[#7bc96f]"
                        : "bg-[#161b22] border border-[#2d333b] hover:border-[#7bc96f]"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-xl">📷</span>
                    <code className="text-sm">webcam.init()</code>
                  </button>
                  <button
                    onClick={() => switchCamera("esp")}
                    disabled={cameraSource === "esp" || loading}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      cameraSource === "esp"
                        ? "bg-[#7bc96f] bg-opacity-10 border border-[#7bc96f]"
                        : "bg-[#161b22] border border-[#2d333b] hover:border-[#7bc96f]"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-xl">📡</span>
                    <code className="text-sm">esp32.connect()</code>
                  </button>
                </div>
                {loading && (
                  <div className="mt-4 flex items-center space-x-2 text-[#7bc96f]">
                    <span className="animate-spin">⟳</span>
                    <code className="text-xs">switching source...</code>
                  </div>
                )}
              </div>

              {/* Status info */}
              <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-4">
                <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
                  System Status
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <code className="text-xs text-[#8b949e]">API:</code>
                    <code
                      className={`text-xs ${serverOnline ? "text-[#7bc96f]" : "text-[#ff7b7b]"}`}
                    >
                      {serverOnline ? "connected" : "offline"}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs text-[#8b949e]">source:</code>
                    <code className="text-xs text-[#e6edf3]">
                      {cameraSource === "webcam" ? "webcam" : "esp32-cam"}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content area */}
          <main className="flex-1 space-y-8">
            {/* Video feed section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  <span className="text-[#7bc96f] mr-2">#</span>
                  live-feed
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="bg-[#161b22] border border-[#2d333b] px-3 py-1 rounded-full">
                    <code className="text-xs text-[#8b949e]">
                      {cameraSource === "webcam" ? "WEBCAM" : "ESP32-CAM"}
                    </code>
                  </span>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#2d333b] rounded-lg overflow-hidden">
                <img
                  src={serverOnline ? "http://localhost:5000/video_feed" : ""}
                  alt="Live Feed"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
                        <rect width="640" height="360" fill="#161b22"/>
                        <text x="200" y="180" font-family="monospace" font-size="14" fill="#8b949e">
                          ${serverOnline ? "Waiting for video feed..." : "Server offline - video unavailable"}
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>
            </section>

            {/* Detection data section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  <span className="text-[#7bc96f] mr-2">#</span>
                  detection.result
                </h2>
                <span className="bg-[#161b22] border border-[#2d333b] px-3 py-1 rounded-full">
                  <code className="text-xs text-[#8b949e]">polling: 1s</code>
                </span>
              </div>

              {/* API Error Message - Shows when API fails but server is online */}
              {apiError && serverOnline && (
                <div className="bg-[#161b22] border border-[#ff7b7b] border-opacity-30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#ff7b7b] text-xl">⚠️</span>
                    <div>
                      <code className="text-sm text-[#ff7b7b]">
                        API Error: Unable to fetch detection data
                      </code>
                      <p className="text-xs text-[#8b949e] mt-1">
                        Using last known data (if available)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Server Offline Message - Clean message without errors */}
              {!serverOnline && (
                <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-8">
                  <div className="text-center space-y-3">
                    <span className="text-4xl block">📡</span>
                    <code className="text-sm text-[#8b949e]">
                      Server is offline
                    </code>
                    <p className="text-xs text-[#6b7280]">
                      Waiting for connection on port 5000...
                    </p>
                    <button
                      onClick={checkServerHealth}
                      className="mt-4 px-4 py-2 bg-[#161b22] border border-[#2d333b] rounded-lg hover:border-[#7bc96f] transition-colors text-sm"
                    >
                      <code>retry()</code>
                    </button>
                  </div>
                </div>
              )}

              {/* Detection Data Grid - Shows even if API fails (last known data) */}
              {serverOnline && detection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Traffic Light Status */}
                  <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">🚦</span>
                      <code className="text-xs text-[#8b949e]">
                        isTrafficLightDetected()
                      </code>
                    </div>
                    <div className="text-2xl font-mono">
                      <span
                        className={
                          detection.isTrafficLightDetected
                            ? "text-[#7bc96f]"
                            : "text-[#ff7b7b]"
                        }
                      >
                        {detection.isTrafficLightDetected ? "true" : "false"}
                      </span>
                    </div>
                  </div>

                  {/* Color Detected */}
                  <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">🎨</span>
                      <code className="text-xs text-[#8b949e]">getColor()</code>
                    </div>
                    <div className="text-2xl font-mono">
                      <span
                        style={{
                          color:
                            detection.colorDetected === "red"
                              ? "#ff7b7b"
                              : detection.colorDetected === "yellow"
                                ? "#ffd966"
                                : detection.colorDetected === "green"
                                  ? "#7bc96f"
                                  : "#8b949e",
                        }}
                      >
                        "{detection.colorDetected}"
                      </span>
                    </div>
                  </div>

                  {/* Countdown Visible */}
                  <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">⏱️</span>
                      <code className="text-xs text-[#8b949e]">
                        isCountdownVisible()
                      </code>
                    </div>
                    <div className="text-2xl font-mono">
                      <span
                        className={
                          detection.isCountDownVisible
                            ? "text-[#7bc96f]"
                            : "text-[#ff7b7b]"
                        }
                      >
                        {detection.isCountDownVisible ? "true" : "false"}
                      </span>
                    </div>
                  </div>

                  {/* Countdown Value */}
                  <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">🔢</span>
                      <code className="text-xs text-[#8b949e]">
                        getCountdown()
                      </code>
                    </div>
                    <div className="text-3xl font-mono text-[#7bc96f]">
                      {detection.countdown !== null
                        ? `${detection.countdown}s`
                        : "null"}
                    </div>
                  </div>
                </div>
              ) : serverOnline && !detection ? (
                // Loading state when server is online but no data yet
                <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-8">
                  <div className="text-center space-y-3">
                    <span className="text-4xl block animate-pulse">⚡</span>
                    <code className="text-sm text-[#8b949e]">
                      Waiting for detection data...
                    </code>
                  </div>
                </div>
              ) : null}

              {/* API Endpoint info - Always visible */}
              <div className="bg-[#161b22] border border-[#2d333b] rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-[#8b949e]">GET</code>
                  <code className="text-xs text-[#7bc96f]">
                    http://localhost:5000/api/detection
                  </code>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
