"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { ArrowLeft, Type, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    queryFn: () => apiClient<{ blog: Blog }>(`/api/blogs/${id}`),
    enabled: !!id,
  });

  if (isPending) {
    return (
      <div className="min-h-[60vh] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
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

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
