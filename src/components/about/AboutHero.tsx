import { SlideUp } from "@/components/ui/motion-wrapper";
import { Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <SlideUp>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="size-4" />
            Meet Forge
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl max-w-3xl mx-auto">
            Your AI software architect
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            IdeaDen was built to eliminate the blank canvas problem. Instead of
            spending hours planning project architecture, let Forge generate a
            complete project idea in seconds.
          </p>
        </SlideUp>
      </div>
    </section>
  );
}
