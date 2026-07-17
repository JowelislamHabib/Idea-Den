import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { SlideUp } from "@/components/ui/motion-wrapper";

export default function ContactPage() {
  return (
    <div className="min-h-[60vh] py-12 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Contact Us
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              We&apos;re here to help. Reach out with any questions about
              IdeaDen.
            </p>
          </div>
        </SlideUp>

        <div className="grid gap-12 lg:grid-cols-2">
          <SlideUp delay={0.1}>
            <ContactForm />
          </SlideUp>
          <SlideUp delay={0.2}>
            <ContactInfo />
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
