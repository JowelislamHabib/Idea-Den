import { Badge } from "@/components/ui/badge";
import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const sampleIdeas = [
  {
    title: "SkillBridge",
    tagline: "Micro-mentorship marketplace for developers",
    tags: ["React", "Node.js", "MongoDB"],
    type: "Project Idea" as const,
    sections: [
      "Problem: Junior devs lack access to affordable, targeted mentorship",
      "4+ target personas identified",
      "Full tech stack with WebSocket real-time messaging",
    ],
  },
  {
    title: "DevPulse",
    tagline: "Real-time GitHub contribution analytics dashboard",
    tags: ["Next.js", "Recharts", "PostgreSQL"],
    type: "Project Idea" as const,
    sections: [
      "Problem: Developers can't visualize their growth over time",
      "Competitor analysis vs GitHub Insights & Graphite",
      "Monetization strategy included",
    ],
  },
  {
    title: "The Pragmatic Guide to API Rate Limiting",
    tagline:
      "Token buckets, sliding windows, and production-ready patterns",
    tags: ["Technical", "Backend", "How-To Guide"],
    type: "Blog" as const,
    sections: [
      "SEO-optimized meta description (156 chars)",
      "Rich markdown with code examples",
      "Professional tone, 1200+ words",
    ],
  },
];

export function HighlightsSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <SlideUp className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            See What IdeaDen Can Create
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Sample outputs from the platform. Each one generated in a single
            pass — structured, actionable, and ready to use.
          </p>
        </SlideUp>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleIdeas.map((item, i) => (
            <StaggerItem key={item.title} delay={i * 80}>
              <div className="group rounded-xl border bg-background/60 p-6 backdrop-blur-sm transition-colors hover:bg-background hover:border-primary/20 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {item.type}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {item.tagline}
                </p>

                <ul className="space-y-1.5 mb-4 flex-1">
                  {item.sections.map((s) => (
                    <li
                      key={s}
                      className="text-xs text-muted-foreground/80 leading-relaxed flex items-start gap-2"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/30" />
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
