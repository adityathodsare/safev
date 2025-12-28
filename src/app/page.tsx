import BackGround from "../components/Background";
import Footer from "../components/Footer";
import WhyChooseUs from "@/components/WhyChooseUs";
import UpcomingFeatures from "../components/UpcomingFeatures";
import TeamSection from "@/components/TeamSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* HERO */}
      <BackGround />

      {/* SEO TEXT SECTION (VERY IMPORTANT) */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-gray-300">
        <h2 className="text-3xl font-bold text-white mb-4">What is SAFEV?</h2>

        <p className="leading-relaxed mb-4">
          <strong>SAFEV</strong> is a real-time IoT-based smart vehicle safety
          and accident detection system designed to save lives during
          emergencies. It continuously monitors accidents, temperature, gas
          leaks, alcohol usage, and abnormal driving conditions using
          intelligent sensors, GPS tracking, and a secure cloud backend.
        </p>

        <p className="leading-relaxed">
          When a critical incident is detected, SAFEV instantly sends alerts via
          Telegram and Email to emergency contacts, family members, and control
          rooms—ensuring rapid response and enhanced road safety.
        </p>
      </section>

      <WhyChooseUs />
      <UpcomingFeatures />
      <TeamSection />
      <Footer />
    </main>
  );
}
