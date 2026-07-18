import { Star, Rocket, PenTool, Award, Clock, Quote } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const stats = [
  { value: "50,000+", label: "Blueprints Generated", icon: Rocket },
  { value: "100,000+", label: "Blog Posts Written", icon: PenTool },
  { value: "4.8/5", label: "Average Rating", icon: Award },
  { value: "12 Hrs", label: "Avg Time Saved Per Project", icon: Clock },
];

const testimonials = [
  {
    quote: "IdeaDen helped me generate three portfolio projects in one afternoon. The PRDs were so detailed that I started coding immediately instead of spending days planning. It's now a permanent part of my workflow.",
    name: "Sarah Chen",
    role: "Frontend Developer",
  },
  {
    quote: "I was skeptical about AI-generated content until I tried IdeaDen. The blog posts actually sound like me — not some generic robot. It saves me 10+ hours every week.",
    name: "Marcus Rodriguez",
    role: "Technical Blogger",
  },
  {
    quote: "As a startup founder, IdeaDen is my secret weapon for rapid idea validation. I can explore five different product directions in the time it used to take me to research one.",
    name: "Priya Kapoor",
    role: "Indie Hacker",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Trusted by Creative Minds Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of creators who have eliminated the blank page.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={i} delay={i * 0.08}>
                <div className="rounded-2xl bg-gradient-to-br from-background via-background to-primary/[0.03] border border-border/50 p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
                  <div className="flex justify-center mb-3">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <StaggerItem key={i} delay={0.2 + i * 0.1}>
              <div className="group relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80">
                <Quote className="size-10 text-primary/20 mb-4" />
                <div className="flex mb-4 gap-1 text-amber-400/80">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-8 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border/40 pt-5">
                  <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
