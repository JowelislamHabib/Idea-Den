"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Sparkles, X, Plus, Clock, Loader2, CheckCircle2, Type, FileText } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

const TEMPLATE_OPTIONS = [
  "Standard Article", "How-To Guide", "Listicle", "Thought Leadership", "Case Study", "Review"
];

const TONE_OPTIONS = [
  "Professional", "Casual", "Humorous", "Persuasive", "Inspirational", "Educational"
];

const LENGTH_OPTIONS = [
  { value: "Short", label: "Short (~500 words)" },
  { value: "Medium", label: "Medium (~1000 words)" },
  { value: "Long", label: "Long (~1500 words)" },
];

const LOADING_STATES = [
  "Researching the topic...",
  "Structuring the article...",
  "Writing engaging content...",
  "Optimizing for SEO...",
  "Applying the selected tone...",
  "Polishing the final draft..."
];

export default function BlogGeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [template, setTemplate] = useState("Standard Article");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  const [cooldown, setCooldown] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["userBlogQuota", session?.user?.id],
    queryFn: () => apiClient<{ count: number; limit: number; isPro: boolean }>(`/api/blogs/quota?userId=${session?.user?.id}`),
    enabled: !!session?.user?.id,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      return apiClient<{ success: boolean; blog: { _id: string } }>("/api/blogs/generate", {
        method: "POST",
        body: JSON.stringify({
          topic,
          template,
          tone,
          length,
          keywords,
          additionalInstructions,
          userId: session?.user?.id || "",
          userName: session?.user?.name || "",
          userEmail: session?.user?.email || "",
        }),
      });
    },
    onSuccess: (data) => {
      toast.success("Blog generated successfully!");
      router.push(`/explore/blogs/${data.blog._id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Generation failed. Please try again.");
    }
  });

  useEffect(() => {
    if (!generateMutation.isPending) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1 < LOADING_STATES.length ? prev + 1 : prev));
    }, 3000); // slightly slower for blogs as generation takes longer
    return () => clearInterval(interval);
  }, [generateMutation.isPending]);

  if (sessionPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <AuthRequired
          title="Sign in to generate blogs"
          description="Create an account to start writing AI-powered articles with Idea AI."
          redirectUrl="/blogs/generate"
        />
      </div>
    );
  }

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setCustomKeyword("");
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleCooldown = () => {
    setCooldown(15);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (quota && !quota.isPro && quota.count >= quota.limit) {
      toast.error("You have reached your daily generation limit. Upgrade to Pro for unlimited generation.");
      return;
    }
    handleCooldown();
    generateMutation.mutate();
  };

  const isFormValid = topic.trim().length > 0;
  const isLimitReached = quota && !quota.isPro && quota.count >= quota.limit; 

  if (generateMutation.isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 bg-muted/20">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Type className="size-8 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
          Writing your article...
        </h2>
        <div className="text-muted-foreground h-6 overflow-hidden relative w-64 text-center">
          {LOADING_STATES.map((state, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(${(idx - loadingStep) * 100}%)`, opacity: idx === loadingStep ? 1 : 0 }}
            >
              {state}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-12 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideUp>
          <div className="text-center mb-10">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
              <Badge variant="secondary">
                <Sparkles className="size-3.5 mr-1.5" />
                AI Content Generator
              </Badge>
              {quotaLoading ? (
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              ) : quota ? (
                quota.isPro ? (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                    <CheckCircle2 className="size-3 mr-1.5" /> Pro Plan (Unlimited)
                  </Badge>
                ) : (
                  <Badge variant={isLimitReached ? "destructive" : "outline"} className={isLimitReached ? "" : "text-amber-500 border-amber-500/30"}>
                    {quota.count} / {quota.limit} Blogs Generated Today
                  </Badge>
                )
              ) : null}
            </div>
            <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Write a Blog Article
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure your topic, tone, and length, and let AI write a highly engaging, SEO-optimized article.
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <Card className={isLimitReached ? "opacity-75 pointer-events-none" : ""}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-3">
                  <Label htmlFor="topic" className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">1</div>
                    What is the topic?
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g. The Future of AI in Web Development"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">2</div>
                    Template / Style
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATE_OPTIONS.map((opt) => (
                      <Badge
                        key={opt}
                        variant={template === opt ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors"
                        onClick={() => setTemplate(opt)}
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">3</div>
                    Tone of Voice
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TONE_OPTIONS.map((opt) => (
                      <Badge
                        key={opt}
                        variant={tone === opt ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors"
                        onClick={() => setTone(opt)}
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">4</div>
                    Article Length
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LENGTH_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={length === option.value ? "default" : "outline"}
                        onClick={() => setLength(option.value)}
                        className="w-full"
                      >
                        <FileText className="size-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">5</div>
                    SEO Keywords (Optional)
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="gap-1 pr-1.5"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(kw)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a keyword..."
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword(customKeyword);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => addKeyword(customKeyword)}
                      disabled={!customKeyword.trim()}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">6</div>
                    Additional Instructions (Optional)
                  </Label>
                  <Textarea
                    placeholder="Include a call to action at the end..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleGenerate}
                    disabled={!isFormValid || cooldown > 0 || isLimitReached}
                    className="w-full font-semibold"
                    size="lg"
                  >
                    {isLimitReached ? (
                      <>
                        <Sparkles className="mr-2 size-5" />
                        Daily Limit Reached
                      </>
                    ) : cooldown > 0 ? (
                      <>
                        <Clock className="mr-2 size-5" />
                        Please wait {cooldown}s
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-5" />
                        Generate Article
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  );
}
