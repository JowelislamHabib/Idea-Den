"use client";

import { useRouter } from "next/navigation";
import { Crown, Sparkles, Check, X, ChevronRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring what IdeaDen can do.",
    icon: Sparkles,
    features: [
      { text: "3 project ideas per day", included: true },
      { text: "3 blog articles per day", included: true },
      { text: "Public content only", included: true },
      { text: "Standard generation speed", included: true },
      { text: "Can protect own idea from public", included: false },
      { text: "Priority generation", included: false },
      { text: "Early access to features", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    description: "For serious creators who need more power.",
    icon: Crown,
    features: [
      { text: "Unlimited project ideas", included: true },
      { text: "Unlimited blog articles", included: true },
      { text: "Public content", included: true },
      { text: "Can protect own idea from public", included: true },
      { text: "Priority generation speed", included: true },
      { text: "Early access to features", included: true },
    ],
  },
];

const features = [
  { label: "Project Ideas", free: "3 / day", pro: "Unlimited" },
  { label: "Blog Articles", free: "3 / day", pro: "Unlimited" },
  { label: "Content Visibility", free: "Public only", pro: "Can protect from public" },
  { label: "Generation Speed", free: "Standard", pro: "Priority" },
  { label: "Early Access", free: "\u2014", pro: "Included" },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes \u2014 you can upgrade from Free to Pro at any time. Your current content will not be affected.",
  },
  {
    q: "What happens when I hit the daily limit?",
    a: "You can continue generating the next day when your quota resets. Upgrading to Pro removes all daily limits.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Not yet \u2014 but the Free plan gives you full access to try the platform with 3 generations per day per feature.",
  },
  {
    q: "Can I cancel my Pro subscription?",
    a: "Yes \u2014 you can cancel anytime. Your Pro benefits will remain active until the end of your billing period.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleProClick = () => {
    if (!user) {
      router.push("/register?redirect=/pricing");
      return;
    }
    toast.info("Upgrade to Pro \u2014 coming soon!");
  };

  return (
    <>
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-5 py-2 text-sm font-medium text-foreground/70 mb-6 backdrop-blur-sm shadow-sm">
              <DollarSign className="size-3.5" />
              Pricing
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your workflow. Start free, upgrade when you need more.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24 lg:max-w-5xl">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPro = plan.name === "Pro";

              return (
                <StaggerItem key={plan.name}>
                  <Card
                    className={`relative flex flex-col h-full ${
                      isPro
                        ? "border-primary/30 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                        : "border-border/50"
                    }`}
                  >
                    {isPro && (
                      <div className="flex justify-center">
                        <Badge className="bg-primary text-primary-foreground shadow-sm px-4 py-0.5 text-xs font-semibold rounded-full border-0 -mt-3">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pt-4 pb-0">
                      <div className={`mx-auto flex size-12 items-center justify-center rounded-2xl mb-4 ${
                        isPro ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Icon className={`size-6 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                      </div>
                      <CardDescription className="mt-2 text-sm max-w-xs mx-auto">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 pt-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature.text} className="flex items-start gap-3 text-sm">
                            {feature.included ? (
                              <Check className="size-4 mt-0.5 text-emerald-500 shrink-0" />
                            ) : (
                              <X className="size-4 mt-0.5 text-muted-foreground/30 shrink-0" />
                            )}
                            <span className={
                              feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                            }>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-2 pb-8">
                      {isPro ? (
                        <Button
                          size="lg"
                          className="w-full rounded-full font-semibold"
                          onClick={handleProClick}
                        >
                          {user ? "Upgrade to Pro" : "Get Pro"}
                          <ChevronRight className="size-4 ml-1" />
                        </Button>
                      ) : (
                        user ? (
                          <Button
                            size="lg"
                            variant="outline"
                            className="w-full rounded-full font-semibold"
                            disabled
                          >
                            Your Current Plan
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            variant="outline"
                            className="w-full rounded-full font-semibold"
                            onClick={() => router.push("/register?redirect=/pricing")}
                          >
                            Get Started Free
                            <ChevronRight className="size-4 ml-1" />
                          </Button>
                        )
                      )}
                    </CardFooter>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <SlideUp className="mb-24">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-center mb-2">
                Compare Plans
              </h2>
              <p className="text-center text-muted-foreground mb-10">
                Everything you need to make the right choice.
              </p>

              <div className="rounded-2xl border border-border/50 overflow-hidden bg-background/40 backdrop-blur-xl">
                <div className="grid grid-cols-3 gap-0">
                  <div className="p-4 text-sm text-muted-foreground border-b border-border/40 bg-muted/30" />
                  <div className="p-4 text-center text-sm font-semibold border-b border-border/40 bg-muted/30">
                    Free
                  </div>
                  <div className="p-4 text-center text-sm font-semibold border-b border-border/40 bg-muted/30 text-primary">
                    Pro
                  </div>

                  {features.map((feature, i) => (
                    <div key={feature.label} className="contents">
                      <div className={`p-4 text-sm border-t border-border/20 ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                        {feature.label}
                      </div>
                      <div className={`p-4 text-sm text-center text-muted-foreground border-t border-border/20 ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                        {feature.free}
                      </div>
                      <div className={`p-4 text-sm text-center font-medium border-t border-border/20 ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                        {feature.pro}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SlideUp>

          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-center mb-10">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl p-6"
                  >
                    <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
