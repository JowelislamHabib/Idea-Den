import { SlideUp } from "@/components/ui/motion-wrapper";

const stacks = [
  { name: "React", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { name: "Next.js", color: "bg-foreground/10 text-foreground" },
  { name: "Node.js", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { name: "Python", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  { name: "MongoDB", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "PostgreSQL", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Express", color: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
  { name: "Django", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { name: "FastAPI", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { name: "Vue.js", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "Svelte", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { name: "Go", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
];

export function StacksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Supports your stack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Forge understands a wide range of frameworks, languages, and
              databases.
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {stacks.map((stack) => (
              <span
                key={stack.name}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${stack.color}`}
              >
                {stack.name}
              </span>
            ))}
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
