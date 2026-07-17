import { PenLine, Cpu, FileCode } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Describe Your Project",
    description:
      "Enter your project title, target domain, available time, and preferred tech stack.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Forge Generates",
    description:
      "Our AI architect processes your input and generates a complete project project idea in one pass.",
  },
  {
    icon: FileCode,
    step: "03",
    title: "Get Your Idea",
    description:
      "Receive structured features, database collections, API routes, and a full technical specification.",
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
              Three steps from idea to complete project architecture.
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
