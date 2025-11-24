"use client";
import { useState } from "react";

export default function TrackingErrorPage() {
  const [copied, setCopied] = useState(false);
  const demoUCOD = "SAFEV1";

  const handleCopy = () => {
    navigator.clipboard.writeText(demoUCOD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Error Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/30 animate-bounce">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                Device Not Found
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                The UCOD you entered doesn't match any of our registered
                devices.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

            {/* Information Sections */}
            <div className="space-y-4 sm:space-y-5">
              {/* Check UCOD */}
              <div className="bg-black/30 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Double-Check Your UCOD
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Please verify the UCOD on the back or inside of your
                      device for accuracy.
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-black/30 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Scan QR Code
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      You can also scan the QR code printed on your box for
                      quick access to your device information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo UCOD */}
              <div className="bg-black/30 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Try Demo UCOD
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Want to see how it works? Click to copy our sample UCOD:
                    </p>
                    <button
                      onClick={handleCopy}
                      className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-lg font-semibold text-sm text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      <span className="font-mono tracking-wider">
                        {demoUCOD}
                      </span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-fadeIn whitespace-nowrap">
                          Copied to clipboard! ✓
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Support Contact */}
              <div className="bg-black/30 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Need Help?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Still facing issues? Our support team is here to help you
                      resolve any problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4">
            <button
              onClick={() => (window.location.href = "/tracking")}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/contact")}
              className="w-full py-3.5 sm:py-4 bg-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white hover:bg-zinc-750 hover:border-zinc-600 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Support
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-3.5 sm:py-4 bg-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white hover:bg-zinc-750 hover:border-zinc-600 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 px-4">
          We're here to help. If you need assistance, please don't hesitate to
          reach out to our support team.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
