"use client";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

export default function BuyPage() {
  const router = useRouter();
  const { navigateWithLoader } = useNavigation();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

  return (
    <div className="page-container flex flex-col items-center justify-center px-4 py-12">
      <div className="glass-card p-8 w-full max-w-md shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
          Welcome to SafeV
        </h1>
        <div className="border-t border-slate-200 dark:border-white/10 pt-4">
          <p className="text-lg font-semibold text-theme">
            Price: <span className="line-through text-theme-secondary">₹4000</span>{" "}
            <span className="text-emerald-500">₹2000</span>
          </p>
          <p className="text-sm text-theme-secondary">
            + Tax & Shipping Charges
          </p>
        </div>
        <div className="mt-4 text-left text-sm text-theme-secondary space-y-2">
          <p>✔ After confirming the order, you will receive an email with a unique code.</p>
          <p>✔ This code must be verified upon message receipt or during communication.</p>
          <p>✔ First 50% payment is mandatory.</p>
        </div>
        <div className="mt-6">
          {!token ? (
            <button className="btn-primary w-full" onClick={() => navigateWithLoader(router, "/register")}>
              Buy Now
            </button>
          ) : (
            <button className="btn-primary w-full" onClick={() => navigateWithLoader(router, "/confirmPurchase")}>
              Proceed to Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
