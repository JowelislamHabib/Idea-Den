import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { Users, Code2, Lightbulb, Building2, PenTool, GraduationCap, Megaphone, Briefcase } from "lucide-react";

const personas = [
  {
    name: "Solo Developers",
    icon: Code2,
    painPoint: "I need portfolio projects but can't think of anything original.",
    solution: "IdeaDen generates unique, scoped project ideas with complete PRDs and tech stack recommendations.",
  },
  {
    name: "Indie Hackers",
    icon: Lightbulb,
    painPoint: "I have limited time to validate ideas before building.",
    solution: "Market analysis, competitor research, and differentiation strategy in one output.",
  },
  {
    name: "Content Creators",
    icon: PenTool,
    painPoint: "Publishing consistently drains my creative energy.",
    solution: "Publish-ready blog posts in any tone and format, optimized for SEO.",
  },
  {
    name: "Startup Founders",
    icon: Building2,
    painPoint: "I need to explore multiple directions quickly.",
    solution: "Generate and compare multiple project blueprints to find the most promising direction.",
  },
  {
    name: "Technical Bloggers",
    icon: PenTool,
    painPoint: "I want to share knowledge but hate the writing process.",
    solution: "Converts your expertise into structured, readable articles without the writing grind.",
  },
  {
    name: "Students & Learners",
    icon: GraduationCap,
    painPoint: "I need project ideas to practice new technologies.",
    solution: "Beginner-appropriate project blueprints matched to your learning goals and time constraints.",
  },
  {
    name: "Marketing Teams",
    icon: Megaphone,
    painPoint: "We need content at scale without hiring an army of writers.",
    solution: "Diverse content formats with consistent quality and SEO optimization.",
  },
  {
    name: "Agencies",
    icon: Briefcase,
    painPoint: "Clients want fresh ideas fast.",
    solution: "Rapidly prototype project concepts and content strategies for client pitches.",
  },
];

export function PersonaSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm">
            <Users className="size-4" />
            Who It&apos;s For
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            IdeaDen — Made for Makers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No matter what you&apos;re building, IdeaDen accelerates your creative workflow.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {personas.map((persona, i) => {
            const Icon = persona.icon;
            return (
              <StaggerItem key={i} delay={i * 0.05}>
                <div className="group relative h-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 hover:bg-background/80">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-bold text-base">{persona.name}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">The Problem</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        &ldquo;{persona.painPoint}&rdquo;
                      </p>
                    </div>

                    <div className="rounded-xl bg-accent/20 border border-accent/30 p-4">
                      <p className="text-xs font-bold text-accent-foreground uppercase tracking-wider mb-1.5">How IdeaDen Helps</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {persona.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
