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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1224] to-[#0a0f1c] text-cyan-300 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse top-0 -left-48"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse bottom-0 -right-48 animation-delay-2000"></div>
        <div className="absolute w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-1000"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-3 h-3 bg-pink-400 rounded-full top-3/4 right-1/4 animate-float animation-delay-1000"></div>
        <div className="absolute w-2 h-2 bg-violet-400 rounded-full bottom-1/4 left-3/4 animate-float animation-delay-2000"></div>
      </div>

      <div className="max-w-xl w-full text-center p-6 sm:p-10 border border-pink-600/50 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-[#0f172a]/90 backdrop-blur-sm relative z-10 animate-fadeIn">
        {/* Warning icon with animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative text-6xl sm:text-7xl animate-bounce">
              ⚠️
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-pink-500 animate-gradient leading-tight">
          Device Not Found
        </h1>

        <p className="text-base sm:text-lg mb-8 font-mono text-cyan-400/90 px-2">
          The UCOD you entered doesn't match any of our registered devices.
        </p>

        <div className="text-sm sm:text-base font-mono space-y-4 text-cyan-400/90 text-left bg-black/30 p-4 sm:p-6 rounded-xl border border-cyan-500/20 mb-8">
          <div className="flex items-start gap-3 hover:text-cyan-300 transition-colors">
            <span className="text-xl shrink-0">🔍</span>
            <p>Double-check the UCOD on the back or inside of your device.</p>
          </div>

          <div className="flex items-start gap-3 hover:text-cyan-300 transition-colors">
            <span className="text-xl shrink-0">📦</span>
            <p>
              You can also scan the QR code printed on your box for accuracy.
            </p>
          </div>

          <div className="flex items-start gap-3 hover:text-cyan-300 transition-colors">
            <span className="text-xl shrink-0">🧪</span>
            <div className="flex-1">
              <p className="mb-2">
                Want to see how it works? Try this sample UCOD:
              </p>
              <button
                onClick={handleCopy}
                className="group relative text-pink-400 font-bold tracking-wider bg-black px-4 py-2 rounded-lg border border-pink-600 shadow-lg inline-flex items-center gap-2 hover:bg-pink-950/50 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
              >
                <span>{demoUCOD}</span>
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
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg animate-fadeIn whitespace-nowrap">
                    Copied! ✓
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 hover:text-cyan-300 transition-colors">
            <span className="text-xl shrink-0">📞</span>
            <p>
              Still facing issues?{" "}
              <a
                href="/contact"
                className="text-pink-400 underline hover:text-pink-300 transition-all hover:shadow-[0_2px_8px_rgba(236,72,153,0.3)]"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/tracking"
            className="group relative px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-semibold hover:from-cyan-400 hover:to-pink-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] overflow-hidden"
          >
            <span className="relative z-10">Try Again</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>

          <a
            href="/"
            className="group relative px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-400 text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] overflow-hidden"
          >
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-pink-500/30 rounded-br-2xl"></div>
      </div>

      <style jsx>{`
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

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
