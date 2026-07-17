import { SlideUp } from "@/components/ui/motion-wrapper";
import { Target, Zap, Globe } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Every project idea is tailored to your specific domain, stack, and time constraints. No generic output.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Single-pass generation means you get a complete architecture in seconds, not hours of iterative planning.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Free to use with no sign-up barriers for exploration. Generate project ideas with just a few clicks.",
  },
];

export function MissionSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for developers, by developers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe project planning should be fast, structured, and
              AI-assisted — not a chore.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value, i) => (
            <SlideUp key={value.title} delay={i * 0.1}>
              <div className="text-center p-8 rounded-xl border bg-card">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <value.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
