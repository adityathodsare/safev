"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";
import { Search, Shield, ChevronRight } from "lucide-react";

export default function TrackingPage() {
  const [ucod, setUcod] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ucod.trim().toLowerCase() === "sigma001") {
      navigateWithLoader(router, "/tracking/choose");
    } else {
      navigateWithLoader(router, "/tracking/error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0f172a] to-[#1e293b] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-500 leading-tight">
            Device Tracking
          </h1>
          <p className="text-sm sm:text-base text-cyan-300/70 max-w-sm mx-auto px-4">
            Enter your unique device code to track and manage your device
          </p>
        </div>

        {/* Form Card */}
        <div className="relative bg-[#0f172a]/50 backdrop-blur-xl border border-cyan-500/30 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl opacity-0 hover:opacity-10 blur transition duration-300"></div>

          <div className="relative space-y-6">
            {/* Input Section */}
            <div className="space-y-2">
              <label
                htmlFor="ucod"
                className="block text-sm font-medium text-cyan-300/90 mb-2"
              >
                Device UCOD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isFocused ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  />
                </div>
                <input
                  id="ucod"
                  type="text"
                  value={ucod}
                  onChange={(e) => setUcod(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder="Enter device UCOD"
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl text-cyan-100 bg-[#0a0f1c]/80 border border-cyan-500/40 placeholder-cyan-600/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>
              <p className="text-xs sm:text-sm text-cyan-500/60 mt-2 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                UCOD is located on the back of your device
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!ucod.trim()}
              className="group w-full py-3.5 sm:py-4 rounded-xl font-semibold text-[#0a0f1c] bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-500 hover:from-pink-500 hover:via-blue-400 hover:to-cyan-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Track Device</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-cyan-400/50">
            Need help? Contact{" "}
            <a
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
