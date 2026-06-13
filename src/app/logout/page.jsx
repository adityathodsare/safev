"use client";

import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

export default function LogoutPage() {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative mx-auto w-16 h-16">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-theme">
          Logging out...
        </h2>
      </div>
    </div>
  );
}
