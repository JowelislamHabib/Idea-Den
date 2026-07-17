import { SlideUp } from "@/components/ui/motion-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    title: "E-Commerce Platform",
    domain: "Web Application",
    stack: ["Next.js", "Stripe", "MongoDB"],
    features: 12,
  },
  {
    title: "Health Tracker API",
    domain: "REST API",
    stack: ["FastAPI", "PostgreSQL", "Docker"],
    features: 8,
  },
  {
    title: "Real-Time Chat App",
    domain: "Web Application",
    stack: ["React", "Socket.io", "Express"],
    features: 15,
  },
];

export function HighlightsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Sample project ideas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              See what Forge generates. Each project idea includes features,
              collections, and API routes.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <SlideUp key={item.title} delay={i * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{item.domain}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.features} features
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
