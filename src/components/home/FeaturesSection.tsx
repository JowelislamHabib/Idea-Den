import { Zap, Layers, Brain, FileText, Clock, Sparkles } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

const features = [
  {
    icon: Brain,
    title: "AI Project Ideas",
    description:
      "Idea AI analyzes your requirements and generates complete project ideas and architectures instantly.",
  },
  {
    icon: Layers,
    title: "Full Stack Blueprints",
    description:
      "Get feature maps, database schemas, API routes, and component structures for your software projects.",
  },
  {
    icon: FileText,
    title: "AI Blog Generation",
    description:
      "Generate highly readable articles using custom prompt templates tailored to your exact tone and format.",
  },
  {
    icon: Sparkles,
    title: "Adjustable Lengths",
    description:
      "Control exactly how much content you need. Generate short posts or long-form thought leadership articles.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description:
      "No iterations or back-and-forth. One prompt delivers a complete, structured output in seconds.",
  },
  {
    icon: Zap,
    title: "Free to Use",
    description:
      "Generate daily project ideas and articles using the free Gemini API tier. No credit card required.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why users choose IdeaDen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Skip the blank canvas. Get a structured starting point for your
              next project or your next post.
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
