import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { Lightbulb, Cog, Shield, Zap, RefreshCcw, Eye } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Creativity Over Conformity",
    description:
      "IdeaDen doesn't believe in 'one right answer.' That's why IdeaDen encourages regeneration, exploration, and iteration. Your first idea is rarely your best — and IdeaDen makes finding your best effortless.",
  },
  {
    icon: Cog,
    title: "Utility Over Hype",
    description:
      "AI is exciting, but excitement fades. What lasts is genuine usefulness. Every feature in IdeaDen exists because it solves a real problem for real creators — not because it looks good in a demo.",
  },
  {
    icon: Shield,
    title: "You Own Your Output from IdeaDen",
    description:
      "What happens in IdeaDen is yours. We don't claim ownership, we don't require attribution, and we don't train on your private inputs. Your creativity remains your intellectual property. Period.",
  },
  {
    icon: Zap,
    title: "Speed Without Sacrifice",
    description:
      "Fast doesn't have to mean sloppy. IdeaDen has been tuned for both speed and quality because we know you need content that's both timely and publishable.",
  },
  {
    icon: RefreshCcw,
    title: "Continuous Improvement",
    description:
      "AI technology evolves rapidly, and so does IdeaDen. We're constantly refining our prompts, updating our models, and listening to user feedback to make IdeaDen better every week.",
  },
  {
    icon: Eye,
    title: "Transparency You Can Trust",
    description:
      "We believe in being open about how IdeaDen works, what it can and can't do, and how your data is handled. No black boxes, no fine-print surprises — just honest AI that respects your trust.",
  },
];

export function ValuesSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            What IdeaDen Stands For
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Six principles that guide everything we build.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <StaggerItem key={i} delay={i * 0.08}>
                <div className="group relative h-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-5 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
