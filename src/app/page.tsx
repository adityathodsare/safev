import BackGround from "../components/Background";
import Footer from "../components/Footer";
import HowToUseGuide from "@/components/HowToUseGuide";
import WhySafev from "@/components/WhySafev";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
import CreatorSection from "@/components/Creatorsection";
export default function Page() {
  return (
    <main className="page-container antialiased relative overflow-hidden">
      {/* HERO */}
      <BackGround />

      {/* SEO TEXT SECTION (VERY IMPORTANT) - Enhanced */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-theme-secondary relative z-10">
        {/* Background gradient effect */}
      </section>
      <WhySafev />
      <Features />
      <TechStack />
      <HowToUseGuide />
      <CreatorSection />

      <Footer />
    </main>
  );
}
