"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/actions/auth";

export function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSave =
    !isPending &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  function handleSave() {
    if (!canSave) return;
    startTransition(async () => {
      try {
        // updatePassword redirects to /feed on success; on error it returns { error }
        const result = await updatePassword(newPassword);
        if (result?.error) {
          toast.error(result.error);
        }
      } catch {
        // NEXT_REDIRECT throws — navigation is handled by the framework
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Signed up with Apple?{" "}
        <a
          href="/forgot-password"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Use this link to set or change your password.
        </a>
      </p>

      {/* New password */}
      <div className="space-y-1.5">
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className={mismatch ? "pr-10 border-destructive" : "pr-10"}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {mismatch && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!canSave}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </div>
    </div>
  );
}
