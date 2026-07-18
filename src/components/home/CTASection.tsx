import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/motion-wrapper";

const benefits = [
  "Generate complete PRDs in under 60 seconds",
  "Publish-ready blog posts with SEO optimization",
  "7+ blog templates, 4+ tones, any length",
  "Fresh alternatives every time — no duplicates",
  "100% ownership of everything you create",
  "Free tier available — no credit card required",
];

export function CTASection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.08),transparent_70%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-5 py-2 text-sm font-medium text-foreground/70 mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles className="size-4 text-primary" />
            Start Creating Today
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
            Stop Brainstorming.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-muted-foreground">
              Start Building with IdeaDen.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12 leading-relaxed">
            Join thousands of creators who have eliminated the blank page forever.
            Get full access to the Blueprint Engine and Content Engine — no credit
            card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 h-12 font-semibold text-base shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 w-full sm:w-auto group"
              )}
            >
              Get Started Free
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/generate/ideas"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 h-12 font-semibold text-base border-border/40 hover:bg-background/80 transition-all w-full sm:w-auto"
              )}
            >
              Try a Blueprint First
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-muted-foreground mb-5 uppercase tracking-wider">
              What you get when you join:
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-left">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
