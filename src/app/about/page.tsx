import { AboutHero } from "@/components/about/AboutHero";
import { StorySection } from "@/components/about/StorySection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { TeamSection } from "@/components/about/TeamSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <TeamSection />
    </>
  );
}
