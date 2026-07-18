import { Mail, MessageSquare, Clock, ArrowRight } from "lucide-react";

const info = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@ideaden.dev",
    description: "For general inquiries and support",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    detail: "feedback@ideaden.dev",
    description: "Share ideas for new features",
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Within 24 hours",
    description: "We aim to respond quickly",
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight mb-2">
          Other ways to reach us
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Prefer not to use the form? Drop us an email directly and
          we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="space-y-4">
        {info.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-foreground font-medium">
                  {item.detail}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground/30 shrink-0 mt-1.5 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
