import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { Users, Code2, PenTool } from "lucide-react";

const personas = [
  {
    name: "The Developer",
    icon: Code2,
    painPoint: "I want to build something to learn a new stack, but I can't think of a good idea, and writing a spec takes too long.",
    solution: "Generates unique project ideas and compiles them into complete, actionable PRDs based on your time and tech stack constraints.",
  },
  {
    name: "The Content Writer",
    icon: PenTool,
    painPoint: "Drafting engaging, SEO-optimized articles from scratch takes hours of research and structuring.",
    solution: "Transforms topics into fully formatted markdown articles with perfectly integrated keywords and tone matching.",
  }
];

export function PersonaSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm">
            <Users className="size-4" />
            Who It&apos;s For
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Built For Two Distinct Workflows
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Whether you&apos;re writing code or writing copy, IdeaDen is engineered for your specific needs.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {personas.map((persona, i) => {
            const Icon = persona.icon;
            return (
              <StaggerItem key={i} delay={i * 0.05}>
                <div className="group relative h-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 hover:bg-background/80">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-bold text-base">{persona.name}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">The Problem</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        &ldquo;{persona.painPoint}&rdquo;
                      </p>
                    </div>

                    <div className="rounded-xl bg-accent/20 border border-accent/30 p-4">
                      <p className="text-xs font-bold text-accent-foreground uppercase tracking-wider mb-1.5">How IdeaDen Helps</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {persona.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
