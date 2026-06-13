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
    if (ucod.trim().toLowerCase() === "safev1") {
      navigateWithLoader(router, "/tracking/choose");
    } else {
      navigateWithLoader(router, "/tracking/error");
    }
  };

  return (
    <div className="page-container flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass-card mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
          </div>
          <h1 className="section-heading text-3xl sm:text-4xl">Device Tracking</h1>
          <p className="text-sm sm:text-base text-theme-secondary max-w-sm mx-auto px-4">
            Enter your unique device code to track and manage your device
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="ucod" className="block text-sm font-medium text-theme mb-2">
                Device UCOD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-blue-500" : "text-text-secondary-dark"}`} />
                </div>
                <input
                  id="ucod"
                  type="text"
                  value={ucod}
                  onChange={(e) => setUcod(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter device UCOD"
                  className="input-field pl-12"
                  required
                />
              </div>
              <p className="text-xs text-theme-secondary mt-2">
                UCOD is located on the back of your device
              </p>
            </div>

            <button type="submit" disabled={!ucod.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Track Device</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-theme-secondary">
            Need help?{" "}
            <a href="/contact" className="text-blue-500 hover:text-blue-400 underline underline-offset-2 transition-colors">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
