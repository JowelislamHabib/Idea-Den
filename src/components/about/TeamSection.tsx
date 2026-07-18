import { FadeIn } from "@/components/ui/motion-wrapper";
import { Code2, PenTool } from "lucide-react";

export function TeamSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Built by Creators, for Creators
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-8 sm:p-10 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex gap-3 shrink-0">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Code2 className="size-5" />
                </div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent/30 border border-accent/40 text-accent-foreground">
                  <PenTool className="size-5" />
                </div>
              </div>
              <div>
                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                  IdeaDen was built by people who understand both sides of the
                  equation&mdash;the technical challenges of AI engineering and
                  the creative challenges of making things from scratch.
                  We&apos;re developers who&apos;ve struggled with portfolio
                  projects. We&apos;re writers who&apos;ve battled blank pages.
                  We built IdeaDen because it&apos;s the tool we wished we had.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
