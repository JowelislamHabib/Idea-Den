import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const categories = [
  {
    label: "Frontend",
    stacks: ["React", "Next.js", "Vue", "Svelte", "Angular", "Tailwind CSS"],
    color: "text-indigo-500",
  },
  {
    label: "Backend",
    stacks: ["Node.js", "Express", "Python", "FastAPI", "Go", "Rails"],
    color: "text-emerald-500",
  },
  {
    label: "Database",
    stacks: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase"],
    color: "text-amber-500",
  },
  {
    label: "Cloud & DevOps",
    stacks: ["AWS", "Vercel", "Docker", "GCP", "Cloudflare", "Netlify"],
    color: "text-cyan-500",
  },
];

export function StacksSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <SlideUp className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Supports Your Entire Stack
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            IdeaDen tailors blueprints to the technologies you actually use — or
            recommends the best fit for your project.
          </p>
        </SlideUp>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <StaggerItem key={cat.label} delay={i * 80}>
              <div className="rounded-xl border bg-background/60 p-5 backdrop-blur-sm h-full">
                <h3
                  className={`text-sm font-semibold mb-3 ${cat.color}`}
                >
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.stacks.map((stack) => (
                    <span
                      key={stack}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
