import { SlideUp } from "@/components/ui/motion-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    type: "Project Idea",
    title: "E-Commerce Platform",
    domain: "Web Application",
    tags: ["Next.js", "Stripe", "MongoDB"],
    meta: "12 features",
  },
  {
    type: "Blog Article",
    title: "The Future of AI in Web Dev",
    domain: "Thought Leadership",
    tags: ["Custom Tone", "1500 words"],
    meta: "Long Form",
  },
  {
    type: "Project Idea",
    title: "Real-Time Chat App",
    domain: "Web Application",
    tags: ["React", "Socket.io", "Express"],
    meta: "15 features",
  },
  {
    type: "Blog Article",
    title: "Building REST APIs with FastAPI",
    domain: "How-To Guide",
    tags: ["Educational", "Code Snippets"],
    meta: "Short Form",
  }
];

export function HighlightsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Sample generations
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              See what Idea AI generates. From structured project ideas to engaging articles driven by custom prompt templates.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <SlideUp key={item.title} delay={i * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={item.type === "Blog Article" ? "default" : "secondary"}>{item.domain}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.meta}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tech) => (
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
