"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUcod } from "@/context/UcodContext";
import { ShieldAlert, KeyRound, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const PUBLIC_MARKETING_PATHS = [
  "/",
  "/contact",
  "/prototype",
  "/remaining",
  "/buy",
  "/confirmPurchase",
  "/success",
  "/tracking",
  "/tracking/choose",
  "/register",
  "/logout"
];

export default function UcodGuard({ children }) {
  const { isValidated, isChecking } = useUcod();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_MARKETING_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname?.startsWith(path))
  );

  useEffect(() => {
    if (!isPublicPage && !isChecking && !isValidated) {
      const timer = setTimeout(() => {
        router.replace("/tracking");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPublicPage, isChecking, isValidated, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  // Loading state during initial session check
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Verifying Device Authorization...</p>
        </div>
      </div>
    );
  }

  // Access Denied if user is not validated
  if (!isValidated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-lg glass-card p-8 sm:p-10 text-center border border-rose-500/30 shadow-2xl rounded-3xl backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-6 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
            UCOD Validation Required
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Access to live vehicle telemetry, camera feeds, and real-time alerts on{" "}
            <span className="font-semibold text-white font-mono">{pathname}</span> is protected.
            You must enter a valid device UCOD code to view this page.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left mb-8 flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Sample Demo Code:</span> <code className="font-mono bg-amber-400/10 text-amber-300 px-1.5 py-0.5 rounded font-bold">MHXXRTXXXX</code>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/tracking"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <span>Enter Device UCOD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Automatically redirecting to UCOD login in 2 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Render protected content if validated
  return <>{children}</>;
}
