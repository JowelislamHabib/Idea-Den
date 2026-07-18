import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper";
import { Lightbulb, PenTool, CheckCircle2, ArrowRight, ListChecks } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const blueprintFeatures = [
  "Catchy project name & tagline",
  "Problem statement & 4+ target personas",
  "Core feature specifications",
  "Tech stack by layer (frontend, backend, DB, AI)",
  "Competitor landscape & differentiation",
  "Elevator pitch & first steps roadmap",
];

const contentFeatures = [
  "SEO-optimized title & meta description",
  "Full markdown-formatted article body",
  "Natural keyword integration (no stuffing)",
  "Heading hierarchy for readability",
  "Tone-matched (Professional, Casual, Humorous)",
  "Fresh content on regeneration (no duplicates)",
];

export function SolutionSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Two Powerful Tools. One Creative Workshop.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            IdeaDen is a purpose-built creative environment with two specialized
            engines designed for two distinct creative challenges.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <SlideUp className="h-full">
            <div className="group/card relative h-full rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/[0.03] p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/10 blur-[60px] pointer-events-none transition-opacity duration-300 group-hover/card:opacity-100 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:shadow-lg">
                    <Lightbulb className="size-6 text-primary transition-colors duration-300 group-hover/card:text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary/60 uppercase tracking-widest">Engine One</div>
                    <h3 className="text-xl font-bold">The Blueprint Engine</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Tell IdeaDen all your interests, tech stack, and time constraints. It acts like a senior PM, generating a complete PRD with market analysis, feature specs, competitor insights, and a clear, actionable roadmap — all in under sixty seconds.
                </p>

                <div className="flex items-center gap-2 mb-5 text-sm font-semibold text-foreground/70">
                  <ListChecks className="size-4" />
                  What you get:
                </div>

                <ul className="space-y-3 mb-8">
                  {blueprintFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/generate/ideas"
                  className={cn(
                    buttonVariants(),
                    "rounded-full w-full sm:w-auto group/btn shadow-lg shadow-primary/20"
                  )}
                >
                  Generate a Blueprint
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </SlideUp>

          <SlideUp delay={0.15} className="h-full">
            <div className="group/card relative h-full rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-secondary/30 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20 hover:border-foreground/20">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-secondary/40 blur-[60px] pointer-events-none transition-opacity duration-300 group-hover/card:opacity-100 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary border border-border transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-foreground group-hover/card:shadow-lg">
                    <PenTool className="size-6 text-foreground transition-colors duration-300 group-hover/card:text-background" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Engine Two</div>
                    <h3 className="text-xl font-bold">The Content Engine</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Feed a topic into IdeaDen, choose your format and tone, and watch it craft a complete, SEO-optimized, markdown-formatted blog post. It organically integrates keywords and structures headers so you never waste hours editing AI texts again.
                </p>

                <div className="flex items-center gap-2 mb-5 text-sm font-semibold text-foreground/70">
                  <ListChecks className="size-4" />
                  What you get:
                </div>

                <ul className="space-y-3 mb-8">
                  {contentFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="size-4 text-accent-foreground/70 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/generate/blogs"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "rounded-full w-full sm:w-auto group/btn shadow-lg"
                  )}
                >
                  Write an Article
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </section>
  );
}
