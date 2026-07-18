"use client";

import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, PenTool, Eye, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DashboardBlog {
  _id: string;
  topic?: string;
  title?: string;
  template?: string;
  tone?: string;
  createdAt: string;
}

export default function DashboardBlogsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userId = session?.user?.id || "";

  const { data, isPending } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: () =>
      apiClient<{ blogs: DashboardBlog[] }>(`/api/blogs/mine?userId=${userId}`),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/blogs/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      toast.success("Blog deleted");
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      setDeleteId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete");
    },
  });

  const blogs = data?.blogs || [];

  return (
    <>
      <SlideUp delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>My AI Blogs</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {isPending ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                  <PenTool className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No blogs generated yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Generate your first AI blog to get started.
                </p>
                <Link href="/generate/blogs" className={buttonVariants({ className: "flex items-center" })}>
                    <Plus className="mr-1.5 size-4" /> Generate Blog
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blog Title</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Template / Tone</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell className="font-semibold max-w-[250px] truncate">
                          {blog.title || "Untitled"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {blog.topic || "Unknown topic"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {blog.template || "Standard"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {blog.tone || "Professional"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/explore/blogs/${blog._id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                                <Eye className="size-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(blog._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </SlideUp>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
