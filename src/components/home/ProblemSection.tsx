import { BrainCircuit, Box, Clock, BotOff, EyeOff, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const painPoints = [
  {
    icon: BrainCircuit,
    problem: `"I have too many ideas and no idea where to start."`,
    description: "The paralysis of possibility is real. Notebooks full of concepts, browser tabs overflowing — but none of it translates into action.",
  },
  {
    icon: Box,
    problem: `"What project should I build next?"`,
    description: "Your portfolio needs a standout project, but every idea feels either too simple to impress or too complex to finish.",
  },
  {
    icon: Clock,
    problem: `"I need blog content, but writing takes forever."`,
    description: "Between research, drafting, editing, and optimizing, one post eats your entire week. IdeaDen changes that equation.",
  },
  {
    icon: BotOff,
    problem: `"I'm tired of generic, soulless AI output."`,
    description: "Most AI tools spit out robotic text anyone can spot. IdeaDen delivers content that sounds human — because your audience is human.",
  },
  {
    icon: EyeOff,
    problem: `"Brainstorming alone leads to blind spots."`,
    description: "When you're the only one in the room, you miss perspectives and settle for your first decent idea instead of your best one.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-28 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <FadeIn className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm">
              <span className="flex size-2 rounded-full bg-primary/50" />
              The Struggle Is Real
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1]">
              Sound Familiar?
              <span className="block text-muted-foreground mt-3 text-2xl sm:text-3xl font-semibold">
                IdeaDen Was Built for These Moments.
              </span>
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-sm">
              Every creator hits the same wall — the gap between having a spark of
              inspiration and bringing it to life. That gap is exactly what IdeaDen
              eliminates.
            </p>
            <div className="hidden lg:flex mt-8 items-center gap-2 text-sm font-medium text-primary">
              Scroll to see how <ArrowRight className="size-4" />
            </div>
          </FadeIn>

          <div className="lg:col-span-3 space-y-5">
            <StaggerContainer className="space-y-5">
              {painPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <StaggerItem key={i} delay={i * 0.1}>
                    <div className="group relative rounded-2xl border border-border/60 bg-background/50 backdrop-blur-sm p-6 sm:p-8 transition-all hover:border-primary/30 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex items-start gap-5">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">
                              Pain Point {i + 1}
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-semibold italic text-foreground leading-snug">
                            {point.problem}
                          </p>
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
