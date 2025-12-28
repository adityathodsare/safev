import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { NavigationProvider } from "../context/NavigationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ✅ SEO-OPTIMIZED METADATA */
export const metadata: Metadata = {
  title: "SAFEV – Smart Accident Detection & Vehicle Safety System",
  description:
    "SAFEV is an IoT-based smart vehicle safety system with accident detection, GPS tracking, alcohol detection, gas leak alerts, and real-time emergency notifications via Telegram and Email.",
  keywords: [
    "SAFEV",
    "Smart Vehicle Safety",
    "Accident Detection System",
    "IoT Vehicle Monitoring",
    "ESP32 Accident Detection",
    "Vehicle Emergency Alert System",
    "GPS Accident Tracking",
    "Drunk Driving Detection",
  ],
  openGraph: {
    title: "SAFEV – Smart Accident Detection & Vehicle Safety System",
    description:
      "Real-time accident detection, GPS tracking, alcohol detection & emergency alerts using IoT and AI.",
    url: "https://safev.vercel.app",
    siteName: "SAFEV",
    images: [
      {
        url: "https://safev.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SAFEV Smart Vehicle Safety System",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationProvider>
          <Navbar />
          <AuthProvider>{children}</AuthProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
