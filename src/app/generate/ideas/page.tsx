"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Sparkles, X, Plus, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

const SUGGESTED_STACKS = [
  "React", "Next.js", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "Python", "Django", "FastAPI", "Go",
  "Vue.js", "Svelte", "TypeScript", "Tailwind CSS",
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
  "Writing the project blueprint...",
  "Finalizing your idea..."
];

export default function GeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const [interests, setInterests] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["userQuota", session?.user?.id],
    queryFn: () => apiClient<{ count: number; limit: number; isPro: boolean }>(`/api/ideas/quota?userId=${session?.user?.id}`),
    enabled: !!session?.user?.id,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      return apiClient<{ success: boolean; idea: { _id: string } }>("/api/ideas/generate", {
        method: "POST",
        body: JSON.stringify({
          interests: interests.trim(),
          timeAvailable,
          techStack,
          userId: session?.user?.id || "",
          userName: session?.user?.name || "",
          userEmail: session?.user?.email || "",
        }),
      });
    },
    onSuccess: (data) => {
      toast.success("Idea generated successfully!");
      router.push(`/explore/ideas/${data.idea._id}`);
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
    }, 2500);
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
          title="Sign in to generate project ideas"
          description="Create an account to start building project architectures with Idea AI."
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
    if (!interests.trim() || !timeAvailable || techStack.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }
    if (quota && !quota.isPro && quota.count >= quota.limit) {
      toast.error("You have reached your daily generation limit. Upgrade to Pro for unlimited generation.");
      return;
    }
    handleCooldown();
    generateMutation.mutate();
  };

  const isFormValid = interests.trim() && timeAvailable && techStack.length > 0;
  const isLimitReached = quota && !quota.isPro && quota.count >= quota.limit;

  if (generateMutation.isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 bg-muted/20">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="size-8 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
          Generating your idea...
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
                Powered by AI
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
                    {quota.count} / {quota.limit} Ideas Generated Today
                  </Badge>
                )
              ) : null}
            </div>
            <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Create a Project Idea
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer 3 simple questions, and our AI will write a complete plan for your next software project.
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <Card className={isLimitReached ? "opacity-75 pointer-events-none" : ""}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="interests" className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">1</div>
                    What do you want to build?
                  </Label>
                  <Input
                    id="interests"
                    placeholder="e.g. A game, an education app, a tool for doctors..."
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">2</div>
                    How much time do you have?
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={timeAvailable === option.value ? "default" : "outline"}
                        onClick={() => setTimeAvailable(option.value)}
                        className="w-full"
                      >
                        <Clock className="size-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Label className="font-semibold flex items-center gap-2 text-base">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">3</div>
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
                          onClick={() => removeTech(tech)}
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
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => addTech(customTech)}
                      disabled={!customTech.trim()}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SUGGESTED_STACKS.filter(
                      (s) => !techStack.includes(s)
                    ).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => addTech(tech)}
                      >
                        + {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
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
                        Create My Project Idea
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
