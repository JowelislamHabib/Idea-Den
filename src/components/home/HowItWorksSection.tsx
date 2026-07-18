import { Crosshair, Cpu, Rocket } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: Crosshair,
    title: "Tell IdeaDen What You Need",
    description:
      "Choose your tool — Blueprint or Blog. Fill in a few simple inputs: your interests, preferred tone, topic, tech stack, whatever's relevant. It takes less than 60 seconds.",
  },
  {
    icon: Cpu,
    title: "IdeaDen's AI Works Its Magic",
    description:
      "IdeaDen's specially-tuned AI models analyze your inputs and generate comprehensive, context-aware output. It doesn't just predict words — it crafts structured, actionable, human-quality results.",
  },
  {
    icon: Rocket,
    title: "Launch, Publish, Build",
    description:
      "Copy your blog straight into your CMS. Take your blueprint and start coding. Share with your team. Regenerate for a fresh take. Everything IdeaDen produces is yours.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <FadeIn className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            From Blank Page to Brilliant
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            How IdeaDen works in three steps.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerItem key={step.title} delay={i * 120}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground mb-4">
                  <step.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
