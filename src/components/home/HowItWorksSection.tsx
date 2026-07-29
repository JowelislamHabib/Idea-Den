import { Target, Zap, Rocket } from "lucide-react";
import { FadeIn } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: Target,
    number: "01",
    title: "Choose Your Path",
    description:
      "Select your workflow: Developer (Idea & PRD) or Content Writer (Article & Blog). Fill in your parameters like tech stack, time constraints, or SEO tone.",
  },
  {
    icon: Zap,
    number: "02",
    title: "AI Crafts Your Output",
    description:
      "Our specialized engines get to work. Developers get a complete PRD with feature specs. Writers get a fully formatted, SEO-optimized markdown article.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch, Build, or Publish",
    description:
      "Developers: take your PRD and start coding immediately. Writers: copy your article straight into your CMS. Everything generated is yours to own.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28 overflow-hidden bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm">
            <span className="flex size-2 rounded-full bg-primary/50" />
            How It Works
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            From Blank Page to Brilliant
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            IdeaDen turns your blank page into a finished project in three
            simple steps.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={i} delay={i * 0.15} className="relative">
                <div className="group relative h-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-heading text-3xl font-black text-primary/10 leading-none">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
