"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";
import { API_BASE_URL } from "@/lib/config";

export default function ConfirmPurchasePage() {
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setMessage("Unauthorized! Please login first.");
    }
  }, []);

  const handleConfirm = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("jwtToken");

    try {
      const res = await fetch(`${API_BASE_URL}/sendmail`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.text();
      setMessage(data || "Order confirmed successfully!");
    } catch {
      setMessage("Could not reach the server. Your order may still be processed — please check your email.");
    }

    setIsProcessing(false);
    setTimeout(() => {
      navigateWithLoader(router, "/success");
    }, 2000);
  };

  return (
    <div className="page-container flex flex-col items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-center mb-6">
          Confirm Your Purchase
        </h2>
        <p className="text-sm text-theme-secondary text-center mb-6">
          Please review the details before proceeding. Once you confirm, you will receive an email confirmation.
        </p>

        {message ? (
          <p className="text-center text-emerald-500 font-semibold mb-4">{message}</p>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`w-full px-6 py-3 rounded-xl text-white font-bold transition duration-300 ${
              isProcessing ? "bg-slate-500 cursor-not-allowed" : "btn-primary"
            }`}
          >
            {isProcessing ? "Processing..." : "Confirm Purchase"}
          </button>
        )}
      </div>
    </div>
  );
}
