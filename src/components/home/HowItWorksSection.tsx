import { PenLine, Cpu, Sparkles } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Describe Your Goal",
    description:
      "Choose to build a software project or write a blog. Enter your preferred stack, target tone, or SEO keywords.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Forge Generates",
    description:
      "Our AI engine processes your input and drafts your output instantly using advanced reasoning models.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get Your Output",
    description:
      "Receive a structured project architecture or a perfectly formatted, engaging markdown article ready to publish.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How Forge works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three steps from blank page to a complete blueprint or article.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <SlideUp key={step.step} delay={i * 0.15}>
              <div className="relative rounded-xl border bg-background p-8 text-center shadow-sm">
                <div className="text-xs font-bold text-primary mb-4 tracking-widest">
                  STEP {step.step}
                </div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <step.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
