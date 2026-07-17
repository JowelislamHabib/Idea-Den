import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StacksSection } from "@/components/home/StacksSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StacksSection />
      <StatsSection />
      <HighlightsSection />
      <CTASection />
    </>
  );
}
