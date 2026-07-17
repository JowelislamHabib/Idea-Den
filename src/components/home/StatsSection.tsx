import { SlideUp } from "@/components/ui/motion-wrapper";

const stats = [
  { value: "3", label: "Seconds to generate" },
  { value: "100%", label: "Free to use" },
  { value: "12+", label: "Supported stacks" },
  { value: "0", label: "Setup required" },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <SlideUp key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
