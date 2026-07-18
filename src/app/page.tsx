import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { PersonaSection } from "@/components/home/PersonaSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <PersonaSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
