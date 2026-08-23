import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { NavigationProvider } from "../context/NavigationContext";
import { ThemeProvider } from "../context/ThemeContext";
import { UcodProvider } from "../context/UcodContext";
import { Analytics } from "@vercel/analytics/next";

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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  verification: {
    google: "bYKpAg9RD4Qg0148KYs86YUCpw1hm3zBXraKDy81gVQ",
  },
  openGraph: {
    title: "SAFEV – Smart Accident Detection & Vehicle Safety System",
    description:
      "Real-time accident detection, GPS tracking, alcohol detection & emergency alerts using IoT and AI.",
    url: "https://safev.vercel.app",
    siteName: "SAFEV",
    images: [
      {
        url: "https://safev.vercel.app/logo.png",
        width: 533,
        height: 468,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';var r=document.documentElement;r.classList.remove('dark','light');r.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NavigationProvider>
            <UcodProvider>
              <Navbar />
              <AuthProvider>{children}</AuthProvider>
            </UcodProvider>
          </NavigationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
