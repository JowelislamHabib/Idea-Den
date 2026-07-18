import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const stats = [
  { value: "50K+", label: "Blueprints Generated" },
  { value: "100K+", label: "Blog Posts Written" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "12h", label: "Avg. Time Saved Per Project" },
];

export function StatsSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <FadeIn className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Creative Minds Worldwide
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Join thousands of creators using IdeaDen every day.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StaggerItem key={stat.label} delay={i * 80}>
              <div className="text-center rounded-xl border bg-background/60 p-6 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight font-heading">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
