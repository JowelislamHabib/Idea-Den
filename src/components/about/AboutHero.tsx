import { FadeIn } from "@/components/ui/motion-wrapper";
import { Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm">
            <Sparkles className="size-4 text-primary" />
            About IdeaDen
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto text-foreground">
            We Believe Creativity Shouldn&apos;t Have a Starting Cost
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            IdeaDen was built to eliminate the most expensive part of any
            creative project: the gap between having an idea and acting on it.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
