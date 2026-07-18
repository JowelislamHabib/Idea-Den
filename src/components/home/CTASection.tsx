import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion-wrapper";

export function CTASection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border bg-background p-10 sm:p-14 text-center">
            <div className="pointer-events-none absolute inset-0 -z-0">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-primary/[0.05] blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
                <Sparkles className="size-3.5" />
                Start Building Today
              </div>

              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl max-w-xl mx-auto">
                Stop Overthinking.
                <br />
                <span className="text-muted-foreground">
                  Start Building with IdeaDen.
                </span>
              </h2>

              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Whether it&apos;s a weekend project or a production SaaS — get a
                complete PRD, tech stack, and data model in seconds.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-xl px-7 font-semibold",
                  })}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link
                  href="/explore/ideas"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "lg",
                    className: "rounded-xl px-7 font-semibold",
                  })}
                >
                  Browse Ideas First
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
