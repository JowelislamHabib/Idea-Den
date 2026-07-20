"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, notFound } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/api/get-token";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { ArrowLeft, Type, Clock, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

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

export default function BlogDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: blogData, isPending, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ blog: Blog }>(`/api/blogs/${id}`, { token });
    },
    enabled: !!id,
  });

  const [copied, setCopied] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-[60vh] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
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
    notFound();
  }

  const { blog } = blogData;

  const handleCopy = async () => {
    const text = [
      blog.title,
      "",
      `Template: ${blog.template} | Tone: ${blog.tone} | Length: ${blog.length}`,
      `Published: ${new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      "",
      blog.seoMetaDescription,
      "",
      "---",
      "",
      blog.content,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy content");
    }
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy Content"}
            </Button>
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
