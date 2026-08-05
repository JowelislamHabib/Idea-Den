"use client";

import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/api/get-token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, Lightbulb, Eye, Trash2, Plus, Globe, Lock } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VisibilitySelect } from "@/components/shared/VisibilitySelect";
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
  visibility?: "public" | "private";
}

import { useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DashboardIdeasPage({ initialIdeas = [], user }: { initialIdeas?: DashboardIdea[], user?: any }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filterVisibility = searchParams.get("visibility") || "all";

  const userId = user?.id || "";

  const { data, isPending } = useQuery({
    queryKey: ["my-ideas", filterVisibility],
    queryFn: async () => {
      const token = await getToken();
      const queryParams = new URLSearchParams();
      if (filterVisibility !== "all") queryParams.set("visibility", filterVisibility);
      return apiClient<{ ideas: DashboardIdea[] }>(`/api/ideas/mine?${queryParams.toString()}`, { token });
    },
    enabled: !!userId,
    initialData: filterVisibility === "all" ? { ideas: initialIdeas } : undefined
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return apiClient(`/api/ideas/${id}`, {
        method: "DELETE",
        token,
      });
    },
    onSuccess: () => {
      toast.success("Idea deleted");
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      setDeleteId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete");
    },
  });

  const allIdeas = data?.ideas || [];
  
  const total = allIdeas.length;
  const limit = 10;
  const pageParam = searchParams.get("page");
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const totalPages = Math.ceil(total / limit) || 1;
  const ideas = allIdeas.slice((page - 1) * limit, page * limit);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <SlideUp delay={0.1}>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>My Project Ideas</CardTitle>
            <VisibilitySelect />
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
            ) : allIdeas.length === 0 ? (
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
                      <TableHead>Visibility</TableHead>
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
                        <TableCell>
                          {idea.visibility === "private" ? (
                            <Badge variant="outline" className="gap-1 bg-muted/50 text-muted-foreground whitespace-nowrap">
                              <Lock className="size-3" /> Private
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/10 text-primary whitespace-nowrap">
                              <Globe className="size-3" /> Public
                            </Badge>
                          )}
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

                {totalPages > 1 && (
                  <div className="px-6 py-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href={page > 1 ? createPageURL(page - 1) : "#"} className={page <= 1 ? "pointer-events-none opacity-50" : ""} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => {
                          const p = i + 1;
                          if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                            return (
                              <PaginationItem key={p}>
                                <PaginationLink href={createPageURL(p)} isActive={p === page}>{p}</PaginationLink>
                              </PaginationItem>
                            );
                          }
                          if (p === page - 2 || p === page + 2) {
                            return (
                              <PaginationItem key={`ellipsis-${p}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        <PaginationItem>
                          <PaginationNext href={page < totalPages ? createPageURL(page + 1) : "#"} className={page >= totalPages ? "pointer-events-none opacity-50" : ""} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
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
