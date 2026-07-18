import { Quote } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const testimonials = [
  {
    quote:
      "IdeaDen helped me generate three portfolio projects in one afternoon. The PRDs were so detailed that I started coding immediately instead of spending days planning. It's now a permanent part of my workflow.",
    name: "Sarah Chen",
    role: "Frontend Developer",
  },
  {
    quote:
      "I was skeptical about AI-generated content until I tried IdeaDen. The blog posts actually sound like me — not some generic robot. It saves me 10+ hours every week.",
    name: "Marcus Rodriguez",
    role: "Technical Blogger",
  },
  {
    quote:
      "As a startup founder, IdeaDen is my secret weapon for rapid idea validation. I can explore five different product directions in the time it used to take me to research one.",
    name: "Priya Kapoor",
    role: "Indie Hacker",
  },
];

export function TestimonialsSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <FadeIn className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            What Creators Are Saying
          </h2>
        </FadeIn>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <StaggerItem key={t.name} delay={i * 80}>
              <div className="rounded-xl border bg-background/60 p-6 backdrop-blur-sm flex flex-col h-full">
                <Quote className="size-5 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-border/50">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
