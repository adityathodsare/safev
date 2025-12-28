import BackGround from "../components/Background";
import Footer from "../components/Footer";
import WhyChooseUs from "@/components/WhyChooseUs";
import UpcomingFeatures from "../components/UpcomingFeatures";
import TeamSection from "@/components/TeamSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* HERO */}
      <BackGround />

      {/* SEO TEXT SECTION (VERY IMPORTANT) - Enhanced */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-gray-300 relative z-10">
        {/* Background gradient effect */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-blue-300 font-medium">
              About SAFEV
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            What is SAFEV?
          </h2>

          {/* Content Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed text-gray-300 text-base sm:text-lg">
                    <strong className="text-white font-semibold text-xl">
                      SAFEV
                    </strong>{" "}
                    is a real-time IoT-based smart vehicle safety and accident
                    detection system designed to save lives during emergencies.
                    It continuously monitors accidents, temperature, gas leaks,
                    alcohol usage, and abnormal driving conditions using
                    intelligent sensors, GPS tracking, and a secure cloud
                    backend.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed text-gray-300 text-base sm:text-lg">
                    When a critical incident is detected, SAFEV instantly sends
                    alerts via
                    <span className="text-blue-400 font-semibold">
                      {" "}
                      Telegram
                    </span>{" "}
                    and
                    <span className="text-purple-400 font-semibold">
                      {" "}
                      Email
                    </span>{" "}
                    to emergency contacts, family members, and control
                    rooms—ensuring rapid response and enhanced road safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold">GPS Tracking</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Real-time location monitoring
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold">Accident Alert</h3>
                </div>
                <p className="text-xs text-gray-400">Instant crash detection</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold">Alcohol Check</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Driver safety monitoring
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold">Gas Detection</h3>
                </div>
                <p className="text-xs text-gray-400">Leak monitoring system</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Enhance Your Vehicle Safety?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Join thousands of users who trust SAFEV for their vehicle safety
                and emergency response needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300">
                  Get Started Now
                </button>
                <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 hover:border-blue-500 transform hover:scale-105 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <UpcomingFeatures />
      <TeamSection />
      <Footer />
    </main>
  );
}
