import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
