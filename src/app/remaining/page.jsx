"use client";
import React from "react";
import {
  Camera,
  MapPin,
  Server,
  Monitor,
  Users,
  Eye,
  Shield,
  AlertTriangle,
  Navigation,
  Clock,
  Smartphone,
  Cpu,
  Zap,
  Wrench,
  Package,
  Layers,
  CircuitBoard,
} from "lucide-react";

export default function RemainingFeaturesPage() {
  const features = [
    {
      id: 1,
      title: "Internal Camera System",
      subtitle: "Driver & Passenger Monitoring",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-blue-500",
      description: "Advanced in-vehicle monitoring with AI-powered detection",
      capabilities: [
        "Driver alcohol detection",
        "Drowsiness & consciousness monitoring",
        "Passenger overload detection",
        "Theft & safety monitoring",
        "Real-time anomaly alerts to backend",
      ],
      status: "In Development",
    },
    {
      id: 2,
      title: "External Dashcam",
      subtitle: "Traffic & Road Monitoring",
      icon: <Camera className="w-8 h-8" />,
      color: "bg-green-500",
      description:
        "Intelligent traffic signal detection and road condition monitoring",
      capabilities: [
        "Traffic light color detection",
        "Road condition analysis",
        "Real-time signal status updates",
        "Map integration for traffic data",
        "External safety monitoring",
      ],
      status: "Planning Phase",
    },
    {
      id: 3,
      title: "Backend Processing Server",
      subtitle: "Flask/Django with OpenCV",
      icon: <Server className="w-8 h-8" />,
      color: "bg-purple-500",
      description:
        "Powerful AI backend for video processing and anomaly detection",
      capabilities: [
        "Multi-stream video processing",
        "Machine learning anomaly detection",
        "Real-time alert system",
        "Traffic signal mapping",
        "Data synchronization",
      ],
      status: "Architecture Design",
    },
    {
      id: 4,
      title: "Live Monitoring Dashboard",
      subtitle: "Next.js Web Application",
      icon: <Monitor className="w-8 h-8" />,
      color: "bg-orange-500",
      description:
        "Comprehensive dashboard for real-time monitoring and alerts",
      capabilities: [
        "Live video stream display",
        "Real-time safety alerts",
        "Interactive traffic map",
        "Multi-user access control",
        "Mobile-responsive interface",
      ],
      status: "UI/UX Design",
    },
    {
      id: 5,
      title: "GPS Tracking System",
      subtitle: "Real-time Location & Traffic Intelligence",
      icon: <MapPin className="w-8 h-8" />,
      color: "bg-red-500",
      description: "Advanced GPS integration with traffic signal mapping",
      capabilities: [
        "Real-time vehicle location tracking",
        "Traffic light detection with GPS coordinates",
        "Signal countdown timer capture",
        "Live traffic map updates",
        "Multi-user location sharing",
      ],
      status: "Research Phase",
      hasNavigation: true,
    },
    {
      id: 6,
      title: "User Access Control",
      subtitle: "Multi-role Management",
      icon: <Users className="w-8 h-8" />,
      color: "bg-indigo-500",
      description: "Secure access management for different user types",
      capabilities: [
        "Driver access interface",
        "Owner monitoring dashboard",
        "Control room supervision",
        "Real-time data sharing",
        "Role-based permissions",
      ],
      status: "Specification Phase",
    },
    {
      id: 7,
      title: "PCB Design & Hardware Development",
      subtitle: "ESP32-CAM Based Circuit Design",
      icon: <CircuitBoard className="w-8 h-8" />,
      color: "bg-cyan-500",
      description:
        "Complete hardware design workflow from requirements to production-ready device",
      capabilities: [
        "System requirements & block diagram design",
        "ESP32-CAM integration with sensors & power management",
        "KiCad schematic design with component footprints",
        "Professional PCB layout with routing optimization",
        "Gerber files, BOM & pick-place generation",
        "Prototype PCB ordering (JLCPCB/PCBWay)",
        "Assembly process (hand/reflow/professional)",
        "3D enclosure design & manufacturing",
      ],
      status: "Learning Phase",
      isHardware: true,
    },
    {
      id: 8,
      title: "End-to-End Product Development",
      subtitle: "Complete Product Lifecycle",
      icon: <Package className="w-8 h-8" />,
      color: "bg-emerald-500",
      description:
        "Full product development cycle from concept to market-ready solution",
      capabilities: [
        "Market research & competitive analysis",
        "Product specification & requirement gathering",
        "Hardware & software integration testing",
        "Quality assurance & compliance testing",
        "Manufacturing process optimization",
        "Supply chain management & vendor relations",
        "Product certification & regulatory approval",
        "Go-to-market strategy & launch preparation",
      ],
      status: "Strategic Planning",
      isProduct: true,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Development":
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-700";
      case "Planning Phase":
        return "bg-blue-900/30 text-blue-400 border border-blue-700";
      case "Architecture Design":
        return "bg-purple-900/30 text-purple-400 border border-purple-700";
      case "UI/UX Design":
        return "bg-orange-900/30 text-orange-400 border border-orange-700";
      case "Research Phase":
        return "bg-red-900/30 text-red-400 border border-red-700";
      case "Specification Phase":
        return "bg-indigo-900/30 text-indigo-400 border border-indigo-700";
      case "Learning Phase":
        return "bg-cyan-900/30 text-cyan-400 border border-cyan-700";
      case "Strategic Planning":
        return "bg-emerald-900/30 text-emerald-400 border border-emerald-700";
      default:
        return "bg-gray-800/30 text-theme-secondary border border-gray-600";
    }
  };

  const handleTrackNavigation = () => {
    // In a real Next.js app, you would use: router.push('/track')
    window.location.href = "/track";
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SafeV
                </h1>
                <p className="text-theme-secondary">
                  Vehicle Safety & Monitoring System
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-green-900/30 border border-green-700 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Project Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Upcoming Features & Development Roadmap
          </h2>
          <p className="text-xl text-theme-secondary max-w-4xl mx-auto">
            Comprehensive development plan from software features to hardware
            design and complete product lifecycle management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden group hover:scale-105 border border-gray-700/50 hover:border-gray-600"
            >
              {/* Feature Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${feature.color} p-3 rounded-xl shadow-lg ring-1 ring-white/10`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      feature.status
                    )}`}
                  >
                    {feature.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-theme-secondary mb-3">{feature.subtitle}</p>
                <p className="text-theme-secondary leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Capabilities List */}
              <div className="px-6 pb-4">
                <h4 className="font-semibold text-white mb-3 flex items-center text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                  Key Capabilities
                </h4>
                <ul className="space-y-1.5">
                  {feature.capabilities.map((capability, index) => (
                    <li
                      key={index}
                      className="flex items-start text-xs text-theme-secondary"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GPS Navigation Button */}
              {feature.hasNavigation && (
                <div className="mx-6 mb-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={handleTrackNavigation}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25 ring-1 ring-red-400/20"
                  >
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm">View Live Tracking</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Development Timeline */}
        <div className="mt-16 bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-400" />
            Comprehensive Development Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl backdrop-blur-sm">
              <div className="text-yellow-400 font-bold text-lg">Phase 1</div>
              <div className="text-theme-secondary mt-1">Software Features</div>
              <div className="text-xs text-theme-secondary mt-2">Q3 2025</div>
            </div>
            <div className="text-center p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl backdrop-blur-sm">
              <div className="text-blue-400 font-bold text-lg">Phase 2</div>
              <div className="text-theme-secondary mt-1">Backend & AI</div>
              <div className="text-xs text-theme-secondary mt-2">Q4 2025</div>
            </div>
            <div className="text-center p-4 bg-cyan-900/20 border border-cyan-700/30 rounded-xl backdrop-blur-sm">
              <div className="text-cyan-400 font-bold text-lg">Hardware</div>
              <div className="text-theme-secondary mt-1">PCB Design</div>
              <div className="text-xs text-theme-secondary mt-2">Learning Phase</div>
            </div>
            <div className="text-center p-4 bg-green-900/20 border border-green-700/30 rounded-xl backdrop-blur-sm">
              <div className="text-green-400 font-bold text-lg">Phase 3</div>
              <div className="text-theme-secondary mt-1">Integration</div>
              <div className="text-xs text-theme-secondary mt-2">Q1 2026</div>
            </div>
            <div className="text-center p-4 bg-emerald-900/20 border border-emerald-700/30 rounded-xl backdrop-blur-sm">
              <div className="text-emerald-400 font-bold text-lg">
                Production
              </div>
              <div className="text-theme-secondary mt-1">Market Launch</div>
              <div className="text-xs text-theme-secondary mt-2">
                Strategic Planning
              </div>
            </div>
          </div>
        </div>

        {/* Technical Stack Overview */}
        <div className="mt-12 bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Wrench className="w-6 h-6 mr-3 text-purple-400" />
            Technology Stack & Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Frontend
              </h4>
              <div className="text-sm text-theme-secondary space-y-1">
                <div>• Next.js</div>
                <div>• React</div>
                <div>• Tailwind CSS</div>
                <div>• WebRTC</div>
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                <Server className="w-4 h-4 mr-2" />
                Backend
              </h4>
              <div className="text-sm text-theme-secondary space-y-1">
                <div>• Flask/Django</div>
                <div>• OpenCV</div>
                <div>• TensorFlow</div>
                <div>• WebSocket</div>
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
              <h4 className="text-cyan-400 font-semibold mb-2 flex items-center">
                <CircuitBoard className="w-4 h-4 mr-2" />
                Hardware
              </h4>
              <div className="text-sm text-theme-secondary space-y-1">
                <div>• ESP32-CAM</div>
                <div>• KiCad</div>
                <div>• JLCPCB/PCBWay</div>
                <div>• Fusion 360</div>
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Production
              </h4>
              <div className="text-sm text-theme-secondary space-y-1">
                <div>• Manufacturing</div>
                <div>• Quality Control</div>
                <div>• Supply Chain</div>
                <div>• Certification</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-2xl p-8 text-white shadow-2xl border border-blue-500/20">
            <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-3">
              Join the SafeV Development Journey
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Follow our comprehensive development process from initial concept
              to market-ready vehicle safety solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg border border-white/20 hover:border-white/30">
                Subscribe to Updates
              </button>
              <button className="bg-white/5 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-200 shadow-lg border border-white/10 hover:border-white/20">
                View Technical Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-theme-secondary">
            SafeV © 2025 - Comprehensive vehicle safety solution from concept to
            production
          </p>
        </div>
      </div>
    </div>
  );
}
