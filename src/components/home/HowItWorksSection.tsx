import { Target, Zap, Rocket, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: Target,
    number: "01",
    title: "Tell IdeaDen What You Need",
    description:
      "Choose your tool (Blueprint or Blog), fill in a few simple inputs — your interests, tone, topic, or tech stack. It takes less than 60 seconds.",
    border: "border-primary/30",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    icon: Zap,
    number: "02",
    title: "IdeaDen's AI Works Its Magic",
    description:
      "Specially-tuned AI models analyze your inputs and generate comprehensive, context-aware output. Structured, actionable, human-quality results in seconds.",
    border: "border-accent/50",
    iconBg: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch, Publish, Build with IdeaDen",
    description:
      "Copy your blog straight into your CMS. Take your blueprint and start coding. Everything IdeaDen produces is yours — use it however you want.",
    border: "border-secondary-foreground/20",
    iconBg: "bg-muted text-foreground/80",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28 overflow-hidden bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            From Blank Page to Brilliant
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            How IdeaDen Works in{" "}
            <span className="text-primary font-semibold">
              Three Simple Steps
            </span>
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[calc(16.666%+1.5rem)] right-[calc(16.666%+1.5rem)] h-px bg-gradient-to-r from-primary/30 via-accent/50 to-muted-foreground/20" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "relative z-10 flex size-32 items-center justify-center rounded-full border-4 border-background bg-gradient-to-b from-background via-background to-muted shadow-xl transition-transform group-hover:scale-105",
                    step.border
                  )}>
                    <div className={cn(
                      "flex size-16 items-center justify-center rounded-full backdrop-blur-sm transition-all group-hover:scale-110",
                      step.iconBg
                    )}>
                      <Icon className="size-7" />
                    </div>
                  </div>

                  <div className="mt-2 mb-5 inline-flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>

                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 -right-4 z-20">
                      <ArrowRight className="size-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
