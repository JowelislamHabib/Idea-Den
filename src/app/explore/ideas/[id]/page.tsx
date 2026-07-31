"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/api/get-token";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlideUp } from "@/components/ui/motion-wrapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/shared/PageLoading";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Clock,
  Copy,
  Check,
  Globe,
  Lock,
  FileText,
  Target,
  Users,
  Settings,
  Layout,
  AlertTriangle,
  Book,
  Sparkles,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

interface Idea {
  _id: string;
  projectTitle: string;
  tagline: string;
  techStack: string[];
  elevatorPitch: string;
  estimatedDuration: string;
  ownerName: string;
  ownerId?: string;
  createdAt: string;
  visibility?: string;
  prdSections?: {
    executiveSummary: string;
    strategyAndContext: string;
    usersAndScope: string;
    requirementsAndLogic: string;
    designAndExecution: string;
    planningAndRisk: string;
    appendix: string;
  };
  docs?: {
    technicalDesign?: string;
    appFlow?: string;
    designBrief?: string;
    schema?: string;
    engineeringPlan?: string;
    status?: string;
    generatedAt?: string;
  };
}

const DOC_TITLES: Record<string, string> = {
  prd: "PRD",
  technicalDesign: "Technical Design",
  appFlow: "App-Flow Map",
  designBrief: "Design Brief",
  schema: "Schema Plan",
  engineeringPlan: "Engineering Plan",
};

const DOC_LOADING_STATES = [
  "Analyzing your PRD...",
  "Writing Technical Design...",
  "Mapping the App Flow...",
  "Sketching the Design Brief...",
  "Planning the Schema...",
  "Building the Engineering Plan...",
  "Finalizing your docs...",
];

export default function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["project idea", id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ idea: Idea; related: Idea[] }>(
        `/api/ideas/${id}`,
        { token }
      );
    },
  });

  const [copied, setCopied] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("prd");
  const [loadingStep, setLoadingStep] = useState(0);

  const generateDocsMutation = useMutation({
    mutationFn: async (docKey?: string) => {
      const token = await getToken();
      return apiClient<{ success: boolean; idea: Idea }>(
        `/api/ideas/${id}/generate-docs`,
        {
          method: "POST",
          token,
          body: docKey ? JSON.stringify({ docKey }) : undefined,
        }
      );
    },
    onMutate: () => setLoadingStep(0),
    onSuccess: (data, docKey) => {
      if (docKey) {
        setSelectedDoc(docKey);
      } else {
        setSelectedDoc("prd");
      }
      queryClient.invalidateQueries({ queryKey: ["project idea", id] });
      toast.success(
        docKey
          ? `${DOC_TITLES[docKey]} generated successfully!`
          : "Project docs generated successfully!"
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate docs. Please try again."
      );
    },
  });

  useEffect(() => {
    if (generateDocsMutation.isPending) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev + 1 < DOC_LOADING_STATES.length ? prev + 1 : prev,
      );
    }, 3000);
    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [generateDocsMutation.isPending]);

  if (isPending) {
    return <PageLoading />;
  }

  if (error || !data?.idea) {
    notFound();
  }

  const { idea, related } = data;

  const isOwner =
    !!session?.user?.id && !!idea.ownerId && session.user.id === idea.ownerId;
  const isPro = session?.user?.role === "pro";
  const docs = idea.docs;

  const generatedDocs = (
    ["technicalDesign", "appFlow", "designBrief", "schema", "engineeringPlan"] as const
  ).filter((key) => docs?.[key]);
  const allDocsGenerated = generatedDocs.length === 5;
  const missingDocs = (
    ["technicalDesign", "appFlow", "designBrief", "schema", "engineeringPlan"] as const
  ).filter((key) => !docs?.[key]);

  const prdMarkdown = idea.prdSections
    ? [
        idea.prdSections.executiveSummary,
        idea.prdSections.strategyAndContext,
        idea.prdSections.usersAndScope,
        idea.prdSections.requirementsAndLogic,
        idea.prdSections.designAndExecution,
        idea.prdSections.planningAndRisk,
        idea.prdSections.appendix,
      ]
        .filter(Boolean)
        .join("\n\n---\n\n")
    : "";

  const docEntries = (
    ["prd", "technicalDesign", "appFlow", "designBrief", "schema", "engineeringPlan"] as const
  ).map((key) => ({
    key,
    title: DOC_TITLES[key],
    content: key === "prd" ? prdMarkdown : docs?.[key] || "",
  }));

  const selectedEntry =
    docEntries.find((entry) => entry.key === selectedDoc) ?? docEntries[0];

  const viewerDocEntries = isOwner
    ? docEntries.filter((entry) => entry.content)
    : docEntries;

  const allDocsMarkdown = docEntries
    .filter((entry) => entry.content && (isPro || entry.key === "prd"))
    .map((entry) => `# ${entry.title}\n\n${entry.content}`)
    .join("\n\n---\n\n");

  const handleDocSelect = (value: string) => {
    if (value === "generate-all" || value.startsWith("generate-")) {
      if (!isPro) {
        if (value.startsWith("generate-") && value !== "generate-all") {
          setSelectedDoc(value.slice("generate-".length));
        }
        toast.error("Upgrade to Pro to unlock project docs", {
          action: {
            label: "Upgrade",
            onClick: () => router.push("/pricing"),
          },
        });
        return;
      }
      if (value === "generate-all") {
        generateDocsMutation.mutate(undefined);
        return;
      }
      generateDocsMutation.mutate(value.slice("generate-".length));
      return;
    }
    setSelectedDoc(value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(allDocsMarkdown);
      setCopied(true);
      toast.success("All docs copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={`min-h-[60vh] py-12 bg-muted/20 ${generateDocsMutation.isPending ? "pointer-events-none" : ""}`}>
      {generateDocsMutation.isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-xl">
            <Sparkles className="size-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
            Generating Project Docs...
          </h2>
          <div className="text-muted-foreground h-6 overflow-hidden relative w-80 text-center">
            {DOC_LOADING_STATES.map((state, idx) => (
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
          <p className="mt-6 text-sm text-muted-foreground">
            This may take a minute or two.
          </p>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideUp>
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/explore/ideas"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to Explore
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : isPro && generatedDocs.length > 0 ? "Copy All Docs" : "Copy Idea"}
            </Button>
          </div>
        </SlideUp>

        <SlideUp delay={0.05}>
          <div className="mb-6">
            <h1 className="font-heading scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl mb-2">
              {idea.projectTitle}
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-4">
              {idea.tagline}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
                <Clock className="size-3 mr-1.5" /> Can be built in {idea.estimatedDuration}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
                Generated by {idea.ownerName}
              </Badge>
              {idea.visibility === "private" ? (
                <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-amber-500/40 text-amber-600 dark:text-amber-400">
                  <Lock className="size-3 mr-1.5" /> Private
                </Badge>
              ) : (
                <Badge variant="outline" className="px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Globe className="size-3 mr-1.5" /> Public
                </Badge>
              )}
            </div>
          </div>
        </SlideUp>

        <Separator className="my-6" />

        <SlideUp delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
                <Book className="size-5 text-amber-600 dark:text-amber-500 shrink-0" />
                <Select
                  value={selectedEntry?.key}
                  onValueChange={(value) => handleDocSelect(value as string)}
                >
                  <SelectTrigger className="w-full sm:w-72">
                    <FileText className="size-4" />
                    <SelectValue placeholder="Select a document">
                      {selectedEntry?.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    align="start"
                    alignItemWithTrigger={false}
                  >
                    {isOwner && missingDocs.length > 0 && (
                      <>
                        <SelectGroup>
                          <SelectLabel>
                            {isPro ? "Generate Docs" : "Generate Docs · Pro"}
                          </SelectLabel>
                          {missingDocs.map((key) => (
                            <SelectItem key={key} value={`generate-${key}`}>
                              {isPro ? (
                                <Sparkles className="size-4 text-primary" />
                              ) : (
                                <Crown className="size-4 text-amber-500" />
                              )}
                              Generate {DOC_TITLES[key]}
                            </SelectItem>
                          ))}
                          <SelectItem value="generate-all">
                            {isPro ? (
                              <Sparkles className="size-4 text-primary" />
                            ) : (
                              <Crown className="size-4 text-amber-500" />
                            )}
                            Generate All Docs
                          </SelectItem>
                        </SelectGroup>
                      </>
                    )}
                    {!(isOwner && !isPro) && (
                      <>
                        {isOwner && missingDocs.length > 0 && <SelectSeparator />}
                        <SelectGroup>
                          <SelectLabel>View Docs</SelectLabel>
                          {viewerDocEntries.map((entry) => (
                            <SelectItem key={entry.key} value={entry.key}>
                              <FileText className="size-4" />
                              {entry.title}
                              {!isPro && entry.key !== "prd" && (
                                <Crown className="size-3.5 text-amber-500" />
                              )}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {isOwner && !isPro && !allDocsGenerated && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                  className="gap-2 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                >
                  <Crown className="size-4" />
                  Upgrade to Pro to Generate Docs
                </Button>
              )}
            </div>
          </SlideUp>

        {selectedDoc === "prd" ? (
        <Tabs defaultValue="overview" className="w-full">
          <SlideUp delay={0.1}>
            <div className="w-full mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="inline-flex h-auto w-auto min-w-full sm:min-w-0 justify-start bg-muted/50 p-1">
                <TabsTrigger value="overview" className="text-sm whitespace-nowrap px-4 py-2">Strategy & Context</TabsTrigger>
                <TabsTrigger value="architecture" className="text-sm whitespace-nowrap px-4 py-2">Requirements & Logic</TabsTrigger>
                <TabsTrigger value="execution" className="text-sm whitespace-nowrap px-4 py-2">Planning & Execution</TabsTrigger>
              </TabsList>
            </div>
          </SlideUp>

          <TabsContent value="overview" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            <SlideUp delay={0.1}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <FileText className="size-5" /> Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.executiveSummary || "Generating Executive Summary..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.2}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <Target className="size-5" /> Strategy & Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.strategyAndContext || "Generating Strategy & Context..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.3}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <Users className="size-5" /> Users & Scope
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.usersAndScope || "Generating Users & Scope..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            <SlideUp delay={0.1}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <Settings className="size-5" /> Requirements & Logic
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.requirementsAndLogic || "Generating Requirements & Logic..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.2}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <Layout className="size-5" /> Design & Execution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.designAndExecution || "Generating Design & Execution..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>

          <TabsContent value="execution" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            <SlideUp delay={0.1}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="size-5" /> Planning & Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.planningAndRisk || "Generating Planning & Risk Management..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            <SlideUp delay={0.2}>
              <Card className="border bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                    <Book className="size-5" /> Appendix / Glossary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                    <ReactMarkdown>{idea.prdSections?.appendix || "Generating Appendix..."}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </TabsContent>
        </Tabs>
        ) : isPro && selectedEntry?.content ? (
          <SlideUp delay={0.1}>
            <Card className="border bg-card shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                  <FileText className="size-5" /> {selectedEntry?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                  <ReactMarkdown>{selectedEntry?.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        ) : isPro ? (
          <SlideUp delay={0.1}>
            <Card className="border bg-card shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                  <FileText className="size-5" /> {selectedEntry?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 sm:p-10 sm:pt-0">
                <p className="text-sm text-muted-foreground">
                  This document has not been generated for this idea yet.
                </p>
              </CardContent>
            </Card>
          </SlideUp>
        ) : (
          <SlideUp delay={0.1}>
            <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="border-b px-6 py-4 sm:px-10 sm:py-5">
                <h3 className="text-xl font-heading font-bold tracking-tight flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
                  <FileText className="size-5" /> {selectedEntry?.title}
                </h3>
              </div>
              <div className="space-y-3 p-6 sm:p-10 blur-sm select-none pointer-events-none" aria-hidden>
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse mt-6" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/5 bg-muted rounded animate-pulse mt-6" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/6 bg-muted rounded animate-pulse" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Crown className="size-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-1">
                  Unlock with Pro
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Upgrade to Pro to view this document.
                </p>
                <Button
                  onClick={() => router.push("/pricing")}
                  className="gap-2"
                >
                  <Crown className="size-4" />
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </SlideUp>
        )}

        {related?.length > 0 && (
          <SlideUp delay={0.35}>
            <div className="mt-12">
              <h2 className="font-heading text-xl font-bold tracking-tight mb-4">
                Related Ideas
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r._id} href={`/explore/ideas/${r._id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <h3 className="font-semibold line-clamp-1 mb-1">{r.projectTitle}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.elevatorPitch}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.techStack?.slice(0, 3).map((t) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="text-xs"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </SlideUp>
        )}
      </div>
    </div>
  );
}
