import { Target, Zap, Rocket } from "lucide-react";
import { FadeIn } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: Target,
    number: "01",
    title: "Tell IdeaDen What You Need",
    description:
      "Choose your tool (Blueprint or Blog), fill in a few simple inputs — your interests, tone, topic, or tech stack. It takes less than 60 seconds.",
  },
  {
    icon: Zap,
    number: "02",
    title: "IdeaDen's AI Works Its Magic",
    description:
      "Specially-tuned AI models analyze your inputs and generate comprehensive, context-aware output. Structured, actionable, human-quality results in seconds.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch, Publish, Build with IdeaDen",
    description:
      "Copy your blog straight into your CMS. Take your blueprint and start coding. Everything IdeaDen produces is yours — use it however you want.",
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
