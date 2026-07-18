import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home, Lightbulb, PenTool } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <Card className="border-border/50 shadow-sm text-center">
          <CardHeader className="space-y-2 pb-4">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="size-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">404</CardTitle>
            <CardDescription className="text-base">
              We couldn't find the page you were looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-sm text-muted-foreground">
              The page might have been removed, renamed, or is temporarily unavailable. 
              Check out some of our generated content below instead.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex w-full flex-col sm:flex-row gap-3">
              <Link href="/explore/ideas" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:flex-1")}>
                <Lightbulb className="size-4 mr-2 shrink-0" />
                <span className="truncate">Explore Ideas</span>
              </Link>
              <Link href="/explore/blogs" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:flex-1")}>
                <PenTool className="size-4 mr-2 shrink-0" />
                <span className="truncate">Explore Blogs</span>
              </Link>
            </div>
            <Link href="/" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
              <Home className="size-4 mr-2" />
              Return Home
            </Link>
          </CardFooter>
        </Card>
      </FadeIn>
    </div>
  );
}
