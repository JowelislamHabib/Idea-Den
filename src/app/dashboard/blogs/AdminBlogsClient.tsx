"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { createBlog, updateBlog, deleteBlog } from "../actions";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function BlogsClient({ blogs, page, totalPages, total }: { blogs: any[]; page: number; totalPages: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setFormOpen(true);
  };

  const openEdit = (blog: any) => {
    setEditing(blog);
    setTitle(blog.title || blog.topic || "");
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateBlog(editing._id, { title });
        toast.success("Blog updated successfully");
      } else {
        await createBlog({ title });
        toast.success("Blog created successfully");
      }
      setFormOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await deleteBlog(deleting._id);
      toast.success("Blog deleted successfully");
      setDeleting(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog");
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "blog" : "blogs"} total
        </p>
        <div className="flex items-center gap-3">
          <Select 
            value={searchParams.get("visibility") || "all"} 
            onValueChange={(val: string) => {
              const params = new URLSearchParams(searchParams.toString());
              if (val === "all") params.delete("visibility");
              else params.set("visibility", val);
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openCreate} className="gap-1.5 h-9">
            <Plus className="size-4" /> Create Blog
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Blog Title</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Author</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Visibility</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog._id} className="border-border/50 group hover:bg-muted/20">
              <TableCell className="px-6 py-4">
                <p className="font-bold text-foreground max-w-[500px] truncate">{blog.title || blog.topic || "Untitled Blog"}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="text-sm font-semibold truncate max-w-[150px]">{blog.ownerName || "Anonymous"}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{blog.ownerEmail || ""}</div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <Badge variant={blog.visibility === "private" ? "secondary" : "default"} className="capitalize">
                  {blog.visibility || "public"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => openEdit(blog)}
                    className="h-8 gap-1.5 px-3 text-[11px] font-bold"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setDeleting(blog)}
                    className="h-8 gap-1.5 px-3 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900"
                  >
                    <Trash2 className="size-3.5" /> Delete
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Blog" : "Create Blog"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the title for this blog post."
                : "Add a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="blog-title">Title</Label>
            <Input
              id="blog-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog post title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editing ? "Save Changes" : "Create Blog"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete Blog"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">&quot;{deleting?.title || deleting?.topic || "this blog"}&quot;</span>?
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={deletingLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}