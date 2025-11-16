"use client";

import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

export default function SuccessPage() {
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Order Confirmed!
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Thank you for your order. We have received your details
                successfully.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

            {/* Information Sections */}
            <div className="space-y-4 sm:space-y-5">
              {/* Confirmation Email Info */}
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Confirmation Email Sent
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      You will receive a confirmation email shortly with all the
                      details of your order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Contact Info */}
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
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      We'll Contact You Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Our team will reach out to you shortly for further
                      communication regarding your order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Issue Info */}
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200">
                      Need to Update Your Address?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      If there's an issue with your address or you need to make
                      any changes, please contact us immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4">
            <button
              onClick={() => navigateWithLoader(router, "/contact")}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
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
              Contact Us
            </button>

            <button
              onClick={() => navigateWithLoader(router, "/")}
              className="w-full py-3.5 sm:py-4 bg-zinc-800 border border-zinc-700 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white hover:bg-zinc-750 hover:border-zinc-600 transition-all duration-300 flex items-center justify-center gap-2"
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
          Thank you for choosing us. We appreciate your business and look
          forward to serving you.
        </p>
      </div>
    </div>
  );
}
