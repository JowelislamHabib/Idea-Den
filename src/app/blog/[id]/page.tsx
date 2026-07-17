"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, ArrowLeft, RefreshCw, Type, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Blog {
  _id: string;
  title: string;
  topic: string;
  template: string;
  tone: string;
  length: string;
  keywords: string[];
  content: string;
  ownerId: string;
  createdAt: string;
  seoMetaDescription: string;
}

const LOADING_STATES = [
  "Rethinking the narrative...",
  "Structuring new points...",
  "Drafting fresh content...",
  "Applying the selected tone...",
  "Polishing the final article..."
];

export default function BlogDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const { data: blogData, isPending, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => apiClient<{ blog: Blog }>(`/api/blogs/${id}`),
    enabled: !!id,
  });

  const generateMutation = useMutation({
    mutationFn: async (currentBlog: Blog) => {
      return apiClient<{ success: boolean; blog: { _id: string } }>("/api/blogs/generate", {
        method: "POST",
        body: JSON.stringify({
          topic: currentBlog.topic,
          template: currentBlog.template,
          tone: currentBlog.tone,
          length: currentBlog.length,
          keywords: currentBlog.keywords,
          regenerateId: currentBlog._id,
          userId: session?.user?.id || "",
          userName: session?.user?.name || "",
          userEmail: session?.user?.email || "",
        }),
      });
    },
    onMutate: () => {
      setIsRegenerating(true);
    },
    onSuccess: (data) => {
      toast.success("Blog regenerated successfully!");
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
      setIsRegenerating(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Regeneration failed.");
      setIsRegenerating(false);
    }
  });

  useEffect(() => {
    if (!isRegenerating) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1 < LOADING_STATES.length ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, [isRegenerating]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-4 pt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogData?.blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Blog not found</h2>
        <p className="text-muted-foreground mb-6">
          The blog article you are looking for does not exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/dashboard/blogs")}>
          Back to My Blogs
        </Button>
      </div>
    );
  }

  const { blog } = blogData;
  const isOwner = session?.user?.id === blog.ownerId;

  if (isRegenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 bg-muted/20">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <RefreshCw className="size-8 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-heading mb-2">
          Regenerating your article...
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
    <div className="min-h-screen py-12 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-muted-foreground -ml-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateMutation.mutate(blog)}
                disabled={generateMutation.isPending}
              >
                <RefreshCw className="mr-2 size-4" />
                Regenerate
              </Button>
            )}
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <div className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">
                <Type className="size-3 mr-1.5" />
                {blog.template}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {blog.tone}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {blog.length} Length
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center ml-2">
                <Clock className="size-3.5 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading">
              {blog.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-4 py-1 italic">
              {blog.seoMetaDescription}
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={0.2}>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown>
              {blog.content.replace(/^#\s+[^\n]+\n+/, '')}
            </ReactMarkdown>
          </div>
        </SlideUp>

        {blog.keywords && blog.keywords.length > 0 && (
          <SlideUp delay={0.3}>
            <div className="mt-12 pt-8 border-t">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Target Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          </SlideUp>
        )}
      </div>
    </div>
  );
}
