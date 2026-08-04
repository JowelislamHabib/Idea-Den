"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/shared/PageLoading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { apiClient, ApiError } from "@/lib/api/client";
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
  Zap,
  Crown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SUGGESTED_STACKS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Django",
  "FastAPI",
  "Go",
  "Vue.js",
  "Svelte",
  "TypeScript",
  "Tailwind CSS",
];

const TIME_OPTIONS = [
  { value: "1-week", label: "1 Week" },
  { value: "2-weeks", label: "2 Weeks" },
  { value: "1-month", label: "1 Month" },
  { value: "2-months", label: "2 Months" },
];

const LOADING_STATES = [
  "Looking for the best ideas...",
  "Analyzing your interests...",
  "Finding the perfect tech stack...",
  "Matching the deadline...",
  "Writing the project PRD...",
  "Finalizing your PRD...",
];

export default function GeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRouting, setIsRouting] = useState(false);
  const queryClient = useQueryClient();

  const [interests, setInterests] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [cooldown, setCooldown] = useState(0);
  const [randomCooldown, setRandomCooldown] = useState(0);
  const randomCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [errors, setErrors] = useState<{ interests?: string; timeAvailable?: string; techStack?: string }>({});

  const startRandomCooldown = useCallback((seconds: number) => {
    if (randomCooldownRef.current) clearInterval(randomCooldownRef.current);
    if (seconds <= 0) { setRandomCooldown(0); return; }
    setRandomCooldown(seconds);
    const interval = setInterval(() => {
      setRandomCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          randomCooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    randomCooldownRef.current = interval;
  }, []);

  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["userQuota", session?.user?.id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ count: number; limit: number; isPro: boolean }>(
        "/api/ideas/quota",
        { token },
      );
    },
    enabled: !!session?.user?.id,
  });

  useQuery({
    queryKey: ["randomIdeaCooldown", session?.user?.id],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient<{ retryAfter: number }>("/api/ideas/random/cooldown", { token });
      if (res.retryAfter > 0) {
        startRandomCooldown(res.retryAfter);
      }
      return res;
    },
    enabled: !!session?.user?.id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient<{ success: boolean; idea: { _id: string } }>(
        "/api/ideas/generate",
        {
          method: "POST",
          body: JSON.stringify({
            interests: interests.trim(),
            timeAvailable,
            techStack,
            visibility,
          }),
          token,
        },
      );
    },
    onSuccess: (data) => {
      if (data.idea) {
        queryClient.setQueryData(["project idea", data.idea._id], { idea: data.idea });
      }
      setIsRouting(true);
      toast.success("Idea generated successfully!");
      startTransition(() => {
        window.scrollTo(0, 0);
        router.push(`/explore/ideas/${data.idea._id}`);
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
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev + 1 < LOADING_STATES.length ? prev + 1 : prev,
      );
    }, 2500);
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
          title="Sign in to generate PRDs"
          description="Create an account to start building project PRDs with Idea AI."
          redirectUrl="/ideas/generate"
        />
      </div>
    );
  }

  const addTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
    }
    setCustomTech("");
  };


  const handleSurpriseMe = async () => {
    if (randomCooldown > 0) return;
    try {
      setIsGeneratingRandom(true);
      const token = await getToken();
      const res = await apiClient<{ idea: string }>("/api/ideas/random", {
        method: "POST",
        token,
      });
      if (res && res.idea) {
        setInterests(res.idea);
      }
      startRandomCooldown(15);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429 && typeof err.data.retryAfter === "number") {
        startRandomCooldown(err.data.retryAfter as number);
      } else {
        toast.error("Failed to generate a random idea. Please try again.");
      }
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
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
    const newErrors: typeof errors = {};
    if (!interests.trim()) newErrors.interests = "Enter what you want to build";
    if (!timeAvailable) newErrors.timeAvailable = "Select how much time you have";
    if (techStack.length === 0) newErrors.techStack = "Add at least one technology";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
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

  const isFormValid = interests.trim() && timeAvailable && techStack.length > 0;
  const isLimitReached = quota && !quota.isPro && quota.count >= quota.limit;

  return (
    <>
      {(generateMutation.isPending || isRouting) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-xl">
            <Sparkles className="size-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
            Generating your PRD...
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
                Powered by AI
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
              Create an Idea & Generate a PRD
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer 3 simple questions, and our AI will write a complete PRD
              for your next software project based on your idea.
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
                      htmlFor="interests"
                      className="font-semibold flex items-center gap-2 text-base"
                    >
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                        1
                      </div>
                      What do you want to build?
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
                          : "Random Idea"}
                    </Button>
                  </div>
                    <Input
                      id="interests"
                      placeholder="e.g. A game, an education app, a tool for doctors..."
                      value={interests}
                      onChange={(e) => { setInterests(e.target.value); setErrors(prev => ({ ...prev, interests: undefined })); }}
                    />
                    {errors.interests && <p className="text-sm text-destructive mt-1">{errors.interests}</p>}
                  </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      2
                    </div>
                    How much time do you have?
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          timeAvailable === option.value ? "default" : "outline"
                        }
                        onClick={() => { setTimeAvailable(option.value); setErrors(prev => ({ ...prev, timeAvailable: undefined })); }}
                        className="w-full"
                      >
                        <Clock className="size-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  {errors.timeAvailable && <p className="text-sm text-destructive mt-1">{errors.timeAvailable}</p>}
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                      3
                    </div>
                    What technologies do you know?
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="gap-1 pr-1.5"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => { removeTech(tech); setErrors(prev => ({ ...prev, techStack: undefined })); }}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a technology..."
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTech(customTech);
                      setErrors(prev => ({ ...prev, techStack: undefined }));
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => { addTech(customTech); setErrors(prev => ({ ...prev, techStack: undefined })); }}
                      disabled={!customTech.trim()}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SUGGESTED_STACKS.filter((s) => !techStack.includes(s)).map(
                      (tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary transition-colors"
                          onClick={() => { addTech(tech); setErrors(prev => ({ ...prev, techStack: undefined })); }}
                        >
                          + {tech}
                        </Badge>
                      ),
                    )}
                  </div>
                  {errors.techStack && <p className="text-sm text-destructive mt-1">{errors.techStack}</p>}
                </div>

                <VisibilityToggle
                  visibility={visibility}
                  onChange={setVisibility}
                  isPro={quota?.isPro ?? false}
                />

                <div className="mt-4 space-y-3">
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
                        Generate PRD
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
