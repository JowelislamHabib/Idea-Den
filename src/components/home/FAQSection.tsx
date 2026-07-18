"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { ChevronDown, HelpCircle, Shield, Sparkles, RefreshCcw, Briefcase, Globe, Search, Lock, Save, Rocket as RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Sparkles, Shield, HelpCircle, RefreshCcw, Briefcase, Globe, Search, Lock, Save, RocketIcon];

const faqs = [
  {
    question: "Is the content from IdeaDen actually unique, or does it repeat itself?",
    answer: "IdeaDen uses a regeneration-aware system. When you ask for a fresh version, the AI is explicitly instructed to produce something different from what it showed you before. Plus, temperature settings and prompt engineering ensure natural variety. You'll rarely see the same idea twice.",
  },
  {
    question: "Do I own the content IdeaDen generates?",
    answer: "Absolutely. 100%. Every blueprint, every blog post, every word generated — it's yours. Use it commercially, publish it under your name, modify it however you want. No attribution required. No strings attached.",
  },
  {
    question: "How is IdeaDen different from just using ChatGPT?",
    answer: "ChatGPT is a general-purpose conversationalist. IdeaDen is a specialized workshop. Our prompts are deeply engineered for specific outputs (structured PRDs, markdown-formatted blogs), our interfaces are purpose-built for these workflows, and our regeneration logic prevents duplicates.",
  },
  {
    question: "What if I don't like what IdeaDen generates?",
    answer: "Hit the regenerate button. Try different inputs. Adjust your tone, template, or constraints. IdeaDen is designed for rapid iteration. The first output is rarely the best — exploration is encouraged and effortless.",
  },
  {
    question: "Can I use IdeaDen for client work?",
    answer: "Yes! Many freelancers and agencies use IdeaDen to accelerate client deliverables. Generate project proposals with PRDs, or create content drafts for client blogs. Just review and personalize before delivery — IdeaDen gets you 90% there.",
  },
  {
    question: "Does IdeaDen support languages other than English?",
    answer: "Currently, IdeaDen is optimized for English-language output. We're actively exploring multilingual support for future updates.",
  },
  {
    question: "How does keyword integration work in the blog writer?",
    answer: "You provide a list of target keywords, and IdeaDen's AI naturally weaves them into the content. No awkward keyword stuffing — just organic, contextually appropriate placement that search engines appreciate.",
  },
  {
    question: "Is my data private when using IdeaDen?",
    answer: "IdeaDen does not store your inputs or outputs beyond what's necessary for regeneration awareness within a single session. We do not train AI models on your content. Your ideas remain your ideas.",
  },
  {
    question: "Can I save my generated content from IdeaDen?",
    answer: "Yes, you can copy any output directly. We recommend saving important generations immediately, as our regeneration awareness is session-based and historical outputs aren't permanently archived.",
  },
  {
    question: "What's coming next to IdeaDen?",
    answer: "We're working on project management integrations, multi-language support, collaborative team workspaces, and export-to-CMS functionality. Stay tuned.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-28 overflow-hidden bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <FadeIn className="lg:col-span-2 lg:sticky lg:top-24">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              You&apos;ve Got Questions.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground font-semibold">
              We&apos;ve Got Answers.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Everything you need to know about IdeaDen. Can&apos;t find what you&apos;re looking for? Our team is happy to help.
            </p>
          </FadeIn>

          <div className="lg:col-span-3">
            <StaggerContainer className="flex flex-col gap-3">
              {faqs.map((faq, index) => {
                const Icon = icons[index];
                return (
                  <StaggerItem key={index} delay={index * 0.04}>
                    <div
                      className={cn(
                        "rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group",
                        openIndex === index
                          ? "border-primary/30 bg-background shadow-lg shadow-primary/5"
                          : "border-border/40 bg-background/50 hover:bg-background/80 hover:border-border"
                      )}
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <div className="flex items-center gap-4 p-5 sm:p-6 select-none">
                        <div className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all",
                          openIndex === index
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-muted/50 border-border/50 text-muted-foreground group-hover:bg-primary/5 group-hover:border-primary/20"
                        )}>
                          <Icon className="size-4" />
                        </div>
                        <h3 className="flex-1 text-sm sm:text-base font-semibold text-foreground/90 pr-4 leading-snug">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "size-5 text-muted-foreground transition-transform duration-300 shrink-0",
                            openIndex === index ? "rotate-180 text-primary" : ""
                          )}
                        />
                      </div>
                      <div
                        className={cn(
                          "grid transition-all duration-300 ease-in-out",
                          openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40 mx-5 sm:mx-6">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
