import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Type, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCardProps {
  _id: string;
  title: string;
  topic?: string;
  seoMetaDescription?: string;
  keywords: string[];
  template?: string;
  tone?: string;
  createdAt: string;
}

export function BlogCard({
  _id,
  title,
  topic,
  seoMetaDescription,
  keywords,
  template,
  tone,
  createdAt,
}: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <BookOpen className="size-3.5" />
            <span>Blog Post</span>
          </div>
          <CardTitle className="line-clamp-2 font-heading leading-tight">
            {title || topic || "Untitled Blog"}
          </CardTitle>
          <CardDescription className="text-xs">
            {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {seoMetaDescription && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {seoMetaDescription}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {template && (
              <Badge variant="outline" className="text-xs font-normal">
                {template}
              </Badge>
            )}
            {tone && (
              <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                {tone}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link 
            href={`/blog/${_id}`} 
            className={buttonVariants({ variant: "default", size: "sm" }) + " w-full flex items-center justify-center group"}
          >
            Read Article 
            <motion.div
              className="ml-2 flex items-center justify-center"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="size-4" />
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
