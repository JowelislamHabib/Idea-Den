import { Target, User, RefreshCcw, Sliders, Zap, Shield, Check } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const valueProps = [
  {
    icon: Target,
    title: "Purpose-Built, Not Generic",
    description:
      "Unlike general-purpose chatbots, IdeaDen's engines are specifically fine-tuned for project ideation and blog writing. The prompts, outputs, and structure are optimized for these exact use cases.",
  },
  {
    icon: User,
    title: "Actually Human Output",
    description:
      "IdeaDen's team has obsessed over tone, flow, and readability. Blog content passes the 'would I actually publish this?' test. Blueprints read like they came from a senior PM.",
  },
  {
    icon: RefreshCcw,
    title: "Never Duplicates",
    description:
      "Hated an output? Hit regenerate. IdeaDen remembers what it showed you before and intentionally diverges, giving you genuinely fresh alternatives every time.",
  },
  {
    icon: Sliders,
    title: "You're in Control",
    description:
      "Templates, tones, length preferences, keyword targeting, tech stack constraints, time availability — you set the parameters, and IdeaDen's AI works within your creative vision.",
  },
  {
    icon: Zap,
    title: "Saves You Hours",
    description:
      "What would take days of research, outlining, drafting, and editing now happens in seconds. Free your time for the work that actually requires human touch.",
  },
  {
    icon: Shield,
    title: "Your Ideas, Your Ownership",
    description:
      "Everything IdeaDen generates is yours. No attribution required. No usage restrictions. No training on your private inputs. Your creativity remains your intellectual property.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Why Creators Choose IdeaDen
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Over everything else. Here&apos;s what makes the difference.
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-4">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            const isEven = i % 2 === 0;
            return (
              <StaggerItem key={i} delay={i * 0.08}>
                <div className={`group relative rounded-2xl border border-border/50 bg-gradient-to-r ${isEven ? "from-background via-background to-primary/[0.02]" : "from-background via-background to-accent/15"} p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30`}>
                  <div className="flex items-start gap-5 sm:gap-8">
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border ${isEven ? "bg-primary/10 border-primary/20 text-primary" : "bg-accent/30 border-accent/40 text-accent-foreground"} transition-all group-hover:scale-110 group-hover:shadow-md`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-3">{prop.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {prop.description}
                      </p>
                    </div>
                    <div className="hidden sm:flex shrink-0 items-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
