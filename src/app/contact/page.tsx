import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { FadeIn } from "@/components/ui/motion-wrapper";

export default function ContactPage() {
  return (
    <>
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions, feedback, or want to collaborate? We&apos;d love
              to hear from you.
            </p>
          </FadeIn>

          <div className="grid gap-12 lg:grid-cols-5 items-start">
            <FadeIn delay={0.1} className="lg:col-span-3">
              <ContactForm />
            </FadeIn>
            <FadeIn delay={0.15} className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
              <ContactInfo />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
