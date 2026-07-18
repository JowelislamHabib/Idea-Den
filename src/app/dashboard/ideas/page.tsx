"use client";

import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, Lightbulb, Eye, Trash2, Plus } from "lucide-react";
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

interface DashboardIdea {
  _id: string;
  projectTitle?: string;
  title?: string;
  elevatorPitch?: string;
  techStack: string[];
  createdAt: string;
}

export default function DashboardIdeasPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userId = session?.user?.id || "";

  const { data, isPending } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: () =>
      apiClient<{ ideas: DashboardIdea[] }>(`/api/ideas/mine?userId=${userId}`),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/ideas/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      toast.success("Idea deleted");
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      setDeleteId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete");
    },
  });

  const ideas = data?.ideas || [];

  return (
    <>
      <SlideUp delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>My Project Ideas</CardTitle>
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
            ) : ideas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Lightbulb className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No project ideas yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Generate your first project idea to get started.
                </p>
                <Link href="/generate/ideas" className={buttonVariants({ className: "flex items-center" })}>
                    <Plus className="mr-1.5 size-4" /> Generate Idea
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Pitch</TableHead>
                      <TableHead>Stack</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ideas.map((idea) => (
                      <TableRow key={idea._id}>
                        <TableCell className="font-semibold">
                          {idea.projectTitle || idea.title || "Untitled"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {idea.elevatorPitch || "No pitch available"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {idea.techStack?.slice(0, 3).map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-xs"
                              >
                                {t}
                              </Badge>
                            ))}
                            {(idea.techStack?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{idea.techStack.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(idea.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/explore/ideas/${idea._id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                                <Eye className="size-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(idea._id)}
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
            <DialogTitle>Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project idea? This action cannot
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
