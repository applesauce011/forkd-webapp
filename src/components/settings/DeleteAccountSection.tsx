"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

export function DeleteAccountSection() {
  const router = useRouter();
  const { supabase } = useSupabaseContext();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) {
        toast.error("Could not delete account. Please try again or contact support.");
        setOpen(false);
        return;
      }
      await supabase.auth.signOut();
      router.push("/login");
    });
  }

  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 space-y-3">
      <div>
        <h3 className="font-semibold text-destructive">Delete Account</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Delete my account
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="All your recipes, bookmarks, and personal data will be permanently deleted. This cannot be undone."
        confirmLabel="Yes, delete my account"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        destructive
      />
    </div>
  );
}
