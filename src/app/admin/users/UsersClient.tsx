"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { banUser, unbanUser, setUserRole, deleteUser } from "../actions";
import { useSession } from "@/lib/auth-client";
import { Ban, ShieldBan, Trash2, Crown, UserX, Loader2 } from "lucide-react";
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

type ConfirmAction = "ban" | "unban" | "upgrade" | "downgrade" | "delete";

type ConfirmState = {
  type: ConfirmAction;
  user: any;
} | null;

export function UsersClient({ users, page, totalPages, total }: { users: any[]; page: number; totalPages: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [banReason, setBanReason] = useState("");
  const [loading, setLoading] = useState(false);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isSelf = (user: any) =>
    user.id === session?.user?.id || user._id === session?.user?.id;

  const request = (type: ConfirmAction, user: any) => {
    setBanReason("");
    setConfirm({ type, user });
  };

  const run = async () => {
    if (!confirm) return;
    const { type, user } = confirm;
    setLoading(true);
    const label = {
      ban: "User banned",
      unban: "User unbanned",
      upgrade: "User upgraded to Pro",
      downgrade: "User downgraded to Free",
      delete: "User deleted",
    }[type];
    try {
      if (type === "ban") await banUser(user._id, banReason || undefined);
      else if (type === "unban") await unbanUser(user._id);
      else if (type === "upgrade") await setUserRole(user._id, "pro");
      else if (type === "downgrade") await setUserRole(user._id, "free");
      else await deleteUser(user._id);
      toast.success(label);
      setConfirm(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${type} user`);
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = (user: any) => {
    const banned = user.banned || user.banExpires && new Date(user.banExpires) > new Date();
    if (banned)
      return "inline-flex items-center rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 text-[10px] font-bold uppercase tracking-widest";
    if (user.role === "admin")
      return "inline-flex items-center rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 text-[10px] font-bold uppercase tracking-widest";
    if (user.role === "pro")
      return "inline-flex items-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 text-[10px] font-bold uppercase tracking-widest";
    return "inline-flex items-center rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-widest";
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "user" : "users"} total
        </p>
      </div>
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-6 font-bold uppercase text-xs h-12">User</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs">Role</TableHead>
            <TableHead className="px-6 font-bold uppercase text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const banned = !!(user.banned || (user.banExpires && new Date(user.banExpires) > new Date()));
            const label = user.banned ? "Banned" : user.role === "admin" ? "Admin" : user.role === "pro" ? "Pro" : "Free";
            const self = isSelf(user);
            return (
              <TableRow key={user._id} className="border-border/50 group hover:bg-muted/20">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <p className="font-bold text-foreground">{user.name || "Unknown"}</p>
                    {self && (
                      <span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {user.banReason && (
                    <p className="text-xs text-red-500 mt-0.5">Ban reason: {user.banReason}</p>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className={roleBadge(user)}>{label}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {banned ? (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => request("unban", user)}
                        className="h-8 gap-1.5 px-3 text-[11px] font-bold"
                      >
                        <ShieldBan className="size-3.5" /> Unban
                      </Button>
                    ) : (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => request("ban", user)}
                        disabled={self}
                        title={self ? "You cannot ban yourself" : "Ban user"}
                        className="h-8 gap-1.5 px-3 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900"
                      >
                        <Ban className="size-3.5" /> Ban
                      </Button>
                    )}

                    {user.role === "pro" && (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => request("downgrade", user)}
                        disabled={self || user.role === "admin"}
                        title={self ? "You cannot change your own role" : "Downgrade to Free"}
                        className="h-8 gap-1.5 px-3 text-[11px] font-bold"
                      >
                        <UserX className="size-3.5" /> Downgrade
                      </Button>
                    )}

                    {user.role !== "admin" && user.role !== "pro" && (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => request("upgrade", user)}
                        disabled={self}
                        title={self ? "You cannot change your own role" : "Upgrade to Pro"}
                        className="h-8 gap-1.5 px-3 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900"
                      >
                        <Crown className="size-3.5" /> Upgrade to Pro
                      </Button>
                    )}

                    <Button
                      variant="outline" size="sm"
                      onClick={() => request("delete", user)}
                      disabled={self}
                      title={self ? "You cannot delete your own account" : "Delete user"}
                      className="h-8 gap-1.5 px-3 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
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

      <Dialog open={confirm?.type === "ban"} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Ban <span className="font-semibold text-foreground">{confirm?.user?.name || "this user"}</span>?
              They will be signed out and blocked from signing in. You can unban them later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Reason (optional)</Label>
            <Textarea
              id="ban-reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g. Spamming, abuse, policy violation"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={run}
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirm && confirm.type !== "ban"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={
          confirm?.type === "unban" ? "Unban User"
          : confirm?.type === "upgrade" ? "Upgrade to Pro"
          : confirm?.type === "downgrade" ? "Downgrade to Free"
          : "Delete User"
        }
        description={
          confirm?.type === "unban" ? (
            <>Allow <span className="font-semibold text-foreground">{confirm.user?.name || "this user"}</span> to sign in again?</>
          ) : confirm?.type === "upgrade" ? (
            <>Grant <span className="font-semibold text-foreground">{confirm.user?.name || "this user"}</span> a <span className="font-semibold text-foreground">Pro</span> plan? They will get full access immediately.</>
          ) : confirm?.type === "downgrade" ? (
            <>Downgrade <span className="font-semibold text-foreground">{confirm.user?.name || "this user"}</span> from Pro to Free?</>
          ) : (
            <>Permanently delete <span className="font-semibold text-foreground">{confirm?.user?.name || "this user"}</span> and all their data? This cannot be undone.</>
          )
        }
        confirmLabel={
          confirm?.type === "unban" ? "Unban"
          : confirm?.type === "upgrade" ? "Upgrade"
          : confirm?.type === "downgrade" ? "Downgrade"
          : "Delete"
        }
        variant={
          confirm?.type === "delete" || confirm?.type === "downgrade"
            ? "destructive"
            : "default"
        }
        loading={loading}
        onConfirm={run}
      />
    </>
  );
}