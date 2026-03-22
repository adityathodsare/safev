import BackGround from "../components/Background";
import Footer from "../components/Footer";
import HowToUseGuide from "@/components/HowToUseGuide";
import WhySafev from "@/components/WhySafev";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
export default function Page() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* HERO */}
      <BackGround />

      {/* SEO TEXT SECTION (VERY IMPORTANT) - Enhanced */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-gray-300 relative z-10">
        {/* Background gradient effect */}
      </section>
      <WhySafev />
      <Features />
      <TechStack />
      <HowToUseGuide />

      <Footer />
    </main>
  );
}
