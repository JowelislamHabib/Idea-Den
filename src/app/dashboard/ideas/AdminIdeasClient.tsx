"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { createIdea, updateIdea, deleteIdea } from "../actions";
import { Plus, Trash2, ExternalLink, Pencil, Loader2 } from "lucide-react";
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

interface IdeaForm {
  title: string;
  description: string;
}

const emptyForm: IdeaForm = { title: "", description: "" };

export function IdeasClient({ ideas, page, totalPages, total }: { ideas: any[]; page: number; totalPages: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<IdeaForm>(emptyForm);
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
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (idea: any) => {
    setEditing(idea);
    setForm({
      title: idea.projectTitle || idea.title || "",
      description: idea.elevatorPitch || idea.description || "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateIdea(editing._id, form);
        toast.success("Idea updated successfully");
      } else {
        await createIdea(form);
        toast.success("Idea created successfully");
      }
      setFormOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save idea");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await deleteIdea(deleting._id);
      toast.success("Idea deleted successfully");
      setDeleting(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete idea");
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "idea" : "ideas"} total
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
            <Plus className="size-4" /> Create Idea
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Idea Title</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Author</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">Visibility</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea) => (
            <TableRow key={idea._id} className="border-border/50 group hover:bg-muted/20">
              <TableCell className="px-6 py-4">
                <p className="truncate text-sm font-semibold text-foreground max-w-[300px]">
                  {idea.projectTitle || idea.title || "Untitled"}
                </p>
                <p className="truncate text-xs text-muted-foreground max-w-[300px]">
                  {idea.tagline || idea.elevatorPitch || idea.description || "No description"}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="text-sm font-semibold truncate max-w-[150px]">{idea.ownerName || "Anonymous"}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{idea.ownerEmail || ""}</div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <Badge variant={idea.visibility === "private" ? "secondary" : "default"} className="capitalize">
                  {idea.visibility || "public"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/explore/ideas/${idea._id}`}>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-[11px] font-bold">
                      <ExternalLink className="size-3.5" /> View
                    </Button>
                  </Link>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => openEdit(idea)}
                    className="h-8 gap-1.5 px-3 text-[11px] font-bold"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setDeleting(idea)}
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
            <DialogTitle>{editing ? "Edit Idea" : "Create Idea"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the metadata for this idea."
                : "Add a new project idea blueprint."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Title</Label>
              <Input
                id="idea-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-desc">Description</Label>
              <Textarea
                id="idea-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of the idea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editing ? "Save Changes" : "Create Idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete Idea"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">&quot;{deleting?.title || "this idea"}&quot;</span>?
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