import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";

export function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <SlideUp>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to architect your next project or write your next post?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join users who use IdeaDen to turn ideas into structured
            project blueprints and highly engaging articles in seconds.
          </p>
          <Link
            href="/ideas/generate"
            className={buttonVariants({ size: "lg", variant: "secondary" }) + " font-bold px-8 h-12"}
          >
            Get Started Free <ArrowRight className="ml-2 size-4" />
          </Link>
        </SlideUp>
      </div>
    </section>
  );
}
