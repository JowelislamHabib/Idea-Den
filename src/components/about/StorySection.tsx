import { FadeIn } from "@/components/ui/motion-wrapper";
import { Quote } from "lucide-react";

export function StorySection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            The IdeaDen Origin Story
          </h2>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.1} className="relative">
            <Quote className="absolute top-0 left-0 size-16 sm:size-20 text-primary/[0.06] -translate-x-4 -translate-y-4" />
            <p className="relative text-xl sm:text-2xl text-foreground/85 leading-relaxed font-medium pl-6 sm:pl-8 border-l-4 border-primary/30">
              Every creator knows the feeling. You sit down, ready to build
              something amazing, and&hellip; nothing. The blank page stares
              back. The cursor blinks mockingly. You have the skills. You have
              the motivation. But the spark&mdash;the specific, actionable idea
              that bridges &ldquo;I want to create&rdquo; and &ldquo;I am
              creating&rdquo;&mdash;is missing.
            </p>
          </FadeIn>

          <div className="mt-10 sm:mt-14 space-y-6">
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                This isn&apos;t writer&apos;s block. It&apos;s not lack of
                talent. It&apos;s the natural friction that exists between
                potential energy and kinetic energy. And for too long, crossing
                that gap required either a sudden bolt of inspiration or hours
                of painful brainstorming.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                We started with a simple observation:{" "}
                <span className="text-foreground font-semibold">
                  AI language models are remarkably good at generating ideas
                  when properly guided.
                </span>{" "}
                But raw AI output is chaotic&mdash;sometimes brilliant, often
                unusable, always requiring significant wrestling. The missing
                piece wasn&apos;t the intelligence. It was the structure.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="my-14 sm:my-20">
            <div className="relative flex items-center gap-6">
              <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/10" />
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/15">
                <span className="flex size-2 rounded-full bg-primary/50" />
                <span className="text-lg sm:text-xl font-bold text-primary">
                  IdeaDen was built to be the bridge.
                </span>
                <span className="flex size-2 rounded-full bg-primary/50" />
              </div>
              <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-primary/10 via-primary/20 to-transparent" />
            </div>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.35}>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                So we built structure into IdeaDen. For project ideas: the
                complete Product Requirements Document format that product
                managers use at world-class companies. For blog content: the
                tone-matching, SEO-aware, markdown-formatted output that content
                teams spend days producing. We engineered prompts, tuned
                parameters, and built regeneration logic that prevents
                duplicates.{" "}
                <span className="text-foreground font-semibold">
                  IdeaDen makes AI output genuinely useful
                </span>
                &mdash;not just impressive in theory, but copy-paste ready in
                practice.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                Today, IdeaDen serves developers planning their next portfolio
                piece, founders validating startup concepts, content creators
                maintaining publishing schedules, and everyone in between who
                knows that the hardest step is always the first one.
              </p>
            </FadeIn>

            <FadeIn delay={0.45}>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed pb-6 border-b border-border/40">
                We didn&apos;t build IdeaDen to replace human creativity. We
                built IdeaDen to remove the obstacles that keep human creativity
                from flowing.{" "}
                <span className="text-foreground font-semibold">
                  The ideas are still yours. The vision is still yours.
                </span>{" "}
                IdeaDen just helps you get there faster.
              </p>
            </FadeIn>

            <FadeIn delay={0.5} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome to IdeaDen.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
