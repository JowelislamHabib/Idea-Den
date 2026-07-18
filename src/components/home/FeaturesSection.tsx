import {
  Brain,
  Pen,
  LayoutDashboard,
  Zap,
  RefreshCw,
  Settings2,
} from "lucide-react";
import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const features = [
  {
    icon: Brain,
    title: "Structured PRD Generation",
    description:
      "Full Product Requirements Documents with problem statements, audience analysis, feature specs, tech stack, competitors, and first steps — in one generation.",
    accent: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15",
  },
  {
    icon: Pen,
    title: "Multi-Format Blog Writing",
    description:
      "How-to guides, listicles, thought leadership, and comparison posts with matching structure, depth, and SEO optimization.",
    accent: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & Analytics",
    description:
      "Track all your generated ideas and blogs in one place with timeline charts, usage stats, and quick access to everything you've created.",
    accent: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/15",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Single-pass AI inference returns structured JSON or formatted markdown. No multi-step agent loops — just fast, complete output in under 60 seconds.",
    accent: "text-orange-500 bg-orange-500/10 dark:bg-orange-500/15",
  },
  {
    icon: RefreshCw,
    title: "Duplicate-Aware Regeneration",
    description:
      "Hit regenerate and get genuinely different alternatives every time. IdeaDen remembers previous outputs and intentionally diverges.",
    accent: "text-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/15",
  },
  {
    icon: Settings2,
    title: "Full Creative Control",
    description:
      "Templates, tones, length preferences, keyword targeting, tech stack constraints — you set the parameters, AI works within your vision.",
    accent: "text-violet-500 bg-violet-500/10 dark:bg-violet-500/15",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <SlideUp className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Two Powerful Tools. One Creative Workshop.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            IdeaDen isn&apos;t just another AI wrapper. It&apos;s a
            purpose-built creative environment with two specialized engines for
            two distinct creative challenges.
          </p>
        </SlideUp>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <StaggerItem key={feature.title} delay={i * 80}>
              <div className="group rounded-xl border bg-background/60 p-6 backdrop-blur-sm transition-colors hover:bg-background hover:border-primary/20 h-full">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg mb-4 transition-colors ${feature.accent}`}
                >
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
