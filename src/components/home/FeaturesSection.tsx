import { Zap, Layers, Brain, ShieldCheck, Clock, Code2 } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description:
      "Forge analyzes your requirements and generates a complete project architecture in a single pass.",
  },
  {
    icon: Layers,
    title: "Full Stack Ideas",
    description:
      "Get feature maps, database schemas, API routes, and component structures — all in one output.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description:
      "No iterations or back-and-forth. One prompt delivers a complete, structured project idea.",
  },
  {
    icon: Code2,
    title: "Tech Stack Aware",
    description:
      "Tell Forge your preferred stack and it tailors the architecture to your exact technologies.",
  },
  {
    icon: ShieldCheck,
    title: "Structured Output",
    description:
      "Every project idea follows a consistent schema with features, collections, and endpoints.",
  },
  {
    icon: Zap,
    title: "Free to Use",
    description:
      "Generate unlimited project ideas using the free Gemini API tier. No credit card required.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why developers choose IdeaDen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Skip the blank canvas. Get a structured starting point for your
              next project.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <SlideUp key={feature.title} delay={i * 0.1}>
              <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
