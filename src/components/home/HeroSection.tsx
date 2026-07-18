"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-muted/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <SlideUp>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8 backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Powered by Idea AI
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.1]">
            Generate Project Ideas & <span className="text-primary">AI Blog Articles</span>
          </h1>
        </SlideUp>

        <SlideUp delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            IdeaDen is your AI-powered ideation engine. Generate structured project ideas, or use our AI Blog generator featuring custom prompt templates and adjustable output lengths to craft the perfect article.
          </p>
        </SlideUp>

        <SlideUp delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/generate/ideas" className={buttonVariants({ size: "lg" }) + " font-bold px-8 h-12"}>
              Generate Blueprint <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/generate/blogs" className={buttonVariants({ variant: "outline", size: "lg" }) + " font-bold px-8 h-12"}>
              Write Article <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
