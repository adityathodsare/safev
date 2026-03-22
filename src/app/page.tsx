import BackGround from "../components/Background";
import Footer from "../components/Footer";
import HowToUseGuide from "@/components/HowToUseGuide";
export default function Page() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* HERO */}
      <BackGround />

      {/* SEO TEXT SECTION (VERY IMPORTANT) - Enhanced */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-gray-300 relative z-10">
        {/* Background gradient effect */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>
      <HowToUseGuide />

      <Footer />
    </main>
  );
}
