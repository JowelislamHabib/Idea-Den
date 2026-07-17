"use client";

import { useSession } from "@/lib/auth-client";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { apiClient } from "@/lib/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Loader2, Save, Plus, X, User } from "lucide-react";

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const FOCUS_AREAS = [
  "Frontend",
  "Backend",
  "Full-stack",
  "Mobile",
  "DevOps",
  "Data Science",
  "AI/ML",
];

const COMMON_STACKS = [
  "React", "Next.js", "Vue.js", "Svelte", "Angular",
  "Node.js", "Express", "Fastify", "Django", "FastAPI",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "TypeScript", "Python", "Go", "Rust",
  "Docker", "Kubernetes", "AWS", "Vercel",
];

interface ProfileData {
  user: {
    name?: string;
    email?: string;
    developerPreferences?: {
      stack?: string[];
      experience?: string;
      focus?: string;
    };
  };
}

export default function ProfilePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id || "";

  const { data, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient<ProfileData>(`/api/users/profile?userId=${userId}`),
    enabled: !!userId,
  });

  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [focus, setFocus] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [customStack, setCustomStack] = useState("");

  const initialized = useRef(false);

  useEffect(() => {
    if (data?.user && !initialized.current) {
      initialized.current = true;
      setName(data.user.name || "");
      setExperience(data.user.developerPreferences?.experience || "");
      setFocus(data.user.developerPreferences?.focus || "");
      setStack(data.user.developerPreferences?.stack || []);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      apiClient("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          userId,
          name: name.trim(),
          developerPreferences: {
            stack,
            experience,
            focus,
          },
        }),
      }),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  const addStack = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !stack.includes(trimmed)) {
      setStack([...stack, trimmed]);
    }
    setCustomStack("");
  };

  const removeStack = (tech: string) => {
    setStack(stack.filter((t) => t !== tech));
  };

  if (sessionPending || isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <AuthRequired redirectUrl="/profile" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-12 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SlideUp>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Profile
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account and developer preferences.
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || ""}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground">
                    {(session.user.name || "?")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{session.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.user.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="font-semibold">
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.2}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Developer Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Experience Level</Label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperience(level)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        experience === level
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Focus Area</Label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setFocus(area)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        focus === area
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Preferred Tech Stack</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="gap-1 pr-1.5"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeStack(tech)}
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
                    value={customStack}
                    onChange={(e) => setCustomStack(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStack(customStack);
                      }
                    }}
                    className="h-10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStack(customStack)}
                    disabled={!customStack.trim()}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {COMMON_STACKS.filter((s) => !stack.includes(s))
                    .slice(0, 12)
                    .map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addStack(tech)}
                        className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        + {tech}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.3}>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full h-12 font-bold"
            size="lg"
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <Save className="mr-2 size-5" />
            )}
            Save Profile
          </Button>
        </SlideUp>
      </div>
    </div>
  );
}
