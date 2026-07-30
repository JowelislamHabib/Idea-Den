"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/shared/PageLoading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/api/get-token";
import { toast } from "sonner";
import { VisibilityToggle } from "@/components/shared/VisibilityToggle";
import {
  Sparkles,
  X,
  Plus,
  Clock,
  Loader2,
  CheckCircle2,
  Type,
  FileText,
  Zap,
  Crown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TEMPLATE_OPTIONS = [
  "Standard Article",
  "How-To Guide",
  "Listicle",
  "Thought Leadership",
  "Case Study",
  "Review",
];

const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Humorous",
  "Persuasive",
  "Inspirational",
  "Educational",
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
  "Polishing the final draft...",
];

export default function BlogGeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRouting, setIsRouting] = useState(false);
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState("");
  const [template, setTemplate] = useState("Standard Article");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [cooldown, setCooldown] = useState(0);
  const [randomCooldown, setRandomCooldown] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [errors, setErrors] = useState<{ topic?: string }>({});

  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["userBlogQuota", session?.user?.id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ count: number; limit: number; isPro: boolean }>(
        "/api/blogs/quota",
        { token },
      );
    },
    enabled: !!session?.user?.id,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient<{ success: boolean; blog: { _id: string } }>(
        "/api/blogs/generate",
        {
          method: "POST",
          body: JSON.stringify({
            topic,
            template,
            tone,
            length,
            keywords,
            additionalInstructions,
            visibility,
          }),
          token,
        },
      );
    },
    onSuccess: (data) => {
      if (data.blog) {
        queryClient.setQueryData(["blog", data.blog._id], { blog: data.blog });
      }
      setIsRouting(true);
      toast.success("Blog generated successfully!");
      startTransition(() => {
        window.scrollTo(0, 0);
        router.push(`/explore/blogs/${data.blog._id}`);
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Generation failed. Please try again.",
      );
    },
  });

  useEffect(() => {
    if (generateMutation.isPending || isRouting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev + 1 < LOADING_STATES.length ? prev + 1 : prev,
      );
    }, 3000); // slightly slower for blogs as generation takes longer
    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [generateMutation.isPending, isRouting]);

  if (sessionPending) {
    return <PageLoading />;
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <AuthRequired
          title="Sign in to generate articles & blogs"
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

  const handleRandomCooldown = () => {
    setRandomCooldown(15);
    const interval = setInterval(() => {
      setRandomCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSurpriseMe = async () => {
    if (randomCooldown > 0) return;
    try {
      setIsGeneratingRandom(true);
      const token = await getToken();
      const res = await apiClient<{ topic: string }>("/api/blogs/random", {
        method: "POST",
        token,
      });
      if (res && res.topic) {
        setTopic(res.topic);
      }
      handleRandomCooldown();
    } catch (err) {
      toast.error("Failed to generate a random topic. Please try again.");
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      setErrors({ topic: "Enter a topic for your article" });
      return;
    }
    setErrors({});
    if (quota && !quota.isPro && quota.count >= quota.limit) {
      toast.error(
        "You have reached your daily generation limit. Upgrade to Pro for unlimited generation.",
      );
      return;
    }
    handleCooldown();
    window.scrollTo({ top: 0, behavior: "smooth" });
    generateMutation.mutate();
  };

  const isFormValid = topic.trim().length > 0;
  const isLimitReached = quota && !quota.isPro && quota.count >= quota.limit;

  return (
    <>
      {(generateMutation.isPending || isRouting) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-xl">
            <Type className="size-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
            Generating your article...
          </h2>
          <div className="text-muted-foreground h-6 overflow-hidden relative w-64 text-center">
            {LOADING_STATES.map((state, idx) => (
              <div
                key={idx}
                className="absolute inset-0 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateY(${(idx - loadingStep) * 100}%)`,
                  opacity: idx === loadingStep ? 1 : 0,
                }}
              >
                {state}
              </div>
            ))}
          </div>
        </div>
      )}

    <div className={`min-h-[60vh] py-12 bg-muted/20 ${(generateMutation.isPending || isRouting) ? 'pointer-events-none' : ''}`}>
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
                  <Badge
                    variant="outline"
                    className="text-emerald-500 border-emerald-500/30"
                  >
                    <CheckCircle2 className="size-3 mr-1.5" /> Pro Plan
                    (Unlimited)
                  </Badge>
                ) : (
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background shadow-sm">
                      <Zap
                        className={
                          isLimitReached
                            ? "size-4 text-destructive"
                            : "size-4 text-amber-500"
                        }
                      />
                      <span className="text-sm font-medium">
                        {isLimitReached
                          ? "Daily Limit Reached"
                          : `${quota.limit - quota.count} Generations Left`}
                      </span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-2 hidden sm:block">
                        <div
                          className={
                            isLimitReached
                              ? "h-full rounded-full transition-all bg-destructive"
                              : "h-full rounded-full transition-all bg-amber-500"
                          }
                          style={{
                            width: `${(quota.count / quota.limit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 h-8 rounded-full px-4"
                      onClick={() => router.push("/pricing", { scroll: false })}
                    >
                      <Crown className="mr-1.5 size-3.5" />
                      Upgrade
                    </Button>
                  </div>
                )
              ) : null}
            </div>
            <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Generate an Article or Blog
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed for content writers. Configure your topic, tone, and length, and let AI write a highly
              engaging, SEO-optimized article or blog post.
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <Card className="relative overflow-hidden">
            {isLimitReached && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
                <div className="bg-background border shadow-lg rounded-xl p-6 text-center max-w-sm mx-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                     <Zap className="size-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Daily Limit Reached</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    You've reached your free limit for today. Upgrade to Pro for unlimited access and priority generation.
                  </p>
                  <Button onClick={() => router.push("/pricing")} className="w-full">
                    <Crown className="size-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            )}
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <Label
                      htmlFor="topic"
                      className="font-semibold flex items-center gap-2 text-base"
                    >
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                        1
                      </div>
                      What is the topic?
                    </Label>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={handleSurpriseMe}
                      disabled={isGeneratingRandom || randomCooldown > 0}
                      className="text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 bg-amber-500/5 border border-amber-600 h-8 px-4 transition-all w-full sm:w-auto min-w-[130px]"
                    >
                      {isGeneratingRandom ? (
                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Sparkles
                          className={`size-3.5 mr-1.5 ${randomCooldown > 0 ? "opacity-50" : ""}`}
                        />
                      )}
                      {isGeneratingRandom
                        ? "Thinking..."
                        : randomCooldown > 0
                          ? `Wait ${randomCooldown}s`
                          : "Random Topic"}
                    </Button>
                  </div>
                  <Input
                    id="topic"
                    placeholder="e.g. The Future of AI in Web Development"
                    value={topic}
                    onChange={(e) => { setTopic(e.target.value); setErrors(prev => ({ ...prev, topic: undefined })); }}
                  />
                  {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic}</p>}
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      2
                    </div>
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
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      3
                    </div>
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
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      4
                    </div>
                    Article Length
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LENGTH_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          length === option.value ? "default" : "outline"
                        }
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
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      5
                    </div>
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
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      6
                    </div>
                    Additional Instructions (Optional)
                  </Label>
                  <Textarea
                    placeholder="Include a call to action at the end..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <VisibilityToggle
                  visibility={visibility}
                  onChange={setVisibility}
                  isPro={quota?.isPro ?? false}
                />

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={cooldown > 0 || isLimitReached}
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
                        Generate Article / Blog
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
    </>
  );
}
