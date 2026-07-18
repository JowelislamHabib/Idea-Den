import Link from "next/link";
import { ArrowRight, Sparkles, Code2, FileText, Lightbulb } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper";

const floatingBadges = [
  { icon: Code2, label: "Project Blueprints" },
  { icon: FileText, label: "Blog Content" },
  { icon: Lightbulb, label: "Smart Ideas" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] sm:h-[800px] sm:w-[1000px] rounded-full bg-primary/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-secondary/50 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full py-20 sm:py-28">
        <div className="flex flex-col items-center text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md mb-8 shadow-sm">
              <Sparkles className="size-4 text-primary" />
              IdeaDen — From Spark to Substance
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-5xl text-foreground">
              Stop Staring at a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Blank Screen.
              </span>
              <span className="block">
                Start Building with IdeaDen.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
              IdeaDen uses advanced AI to help you generate fully-formed project
              blueprints and publish-ready blog content — in minutes, not weeks.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/generate/ideas"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 h-12 font-semibold text-base shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 group"
                )}
              >
                Try IdeaDen Free
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-8 h-12 font-semibold text-base border-border/40 hover:bg-background/80 transition-all"
                )}
              >
                See How It Works
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mt-6 text-sm text-muted-foreground/60 flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary/40 animate-pulse" />
              Free tier available &middot; No credit card required &middot; 50,000+ blueprints generated
            </p>
          </FadeIn>

          <SlideUp delay={0.5} className="mt-16 w-full max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {floatingBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/40 bg-background/60 text-sm font-medium text-foreground/70 backdrop-blur-sm shadow-sm"
                  >
                    <Icon className="size-4 text-primary" />
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </SlideUp>
        </div>
      </div>
    </section>
  );
}
