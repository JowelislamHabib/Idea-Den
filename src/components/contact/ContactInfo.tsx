import { Mail, MessageSquare, Clock } from "lucide-react";

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
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Get in touch
        </h2>
        <p className="text-muted-foreground">
          Have questions, feedback, or want to collaborate? We&apos;d love to
          hear from you.
        </p>
      </div>

      <div className="space-y-4">
        {info.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 p-4 rounded-xl border bg-card"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <item.icon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-sm text-foreground font-medium">{item.detail}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
