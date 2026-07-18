import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion-wrapper";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[600px] w-[900px] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <FadeIn className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm mb-8">
            <Sparkles className="size-3.5 text-primary" />
            AI-Powered Ideation &amp; Content Engine
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.1]">
            Stop Staring at a Blank Screen.
            <br />
            <span className="text-muted-foreground">
              Start Building with IdeaDen.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            IdeaDen uses advanced AI to help you generate fully-formed project
            blueprints and publish-ready blog content — in minutes, not weeks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/generate/ideas"
              className={buttonVariants({
                size: "lg",
                className: "rounded-xl px-7 font-semibold",
              })}
            >
              Try IdeaDen Free
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-xl px-7 font-semibold",
              })}
            >
              See How It Works
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground/70">
            Free tier available &middot; No credit card required
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
