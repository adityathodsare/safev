"use client";
import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-theme/90 backdrop-blur-sm flex items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-emerald-500 rounded-full animate-spin" />
        <div className="absolute inset-2 w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-75" />
        <div className="absolute inset-4 w-16 h-16 bg-theme-elevated rounded-full animate-bounce" />
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
      </div>

      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2">
        <p className="text-theme text-lg font-semibold animate-pulse">Loading...</p>
      </div>

      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]" />
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      </div>
    </div>
  );
};

export default PageLoader;
