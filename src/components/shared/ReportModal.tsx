"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "nudity", label: "Nudity or Sexual Content" },
  { value: "harassment", label: "Harassment" },
  { value: "violence", label: "Violence" },
  { value: "other", label: "Other" },
] as const;

type Reason = typeof REASONS[number]["value"];

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "recipe" | "user";
  targetId: string;
  contextRecipeId?: string;
}

export function ReportModal({ open, onOpenChange, targetType, targetId, contextRecipeId }: ReportModalProps) {
  const { supabase } = useSupabaseContext();
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); toast.error("You must be logged in to report"); return; }
    const { error } = await supabase.from("content_reports").insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reason: selectedReason,
      note: note.trim() || null,
      context_recipe_id: contextRecipeId ?? null,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit report");
    } else {
      toast.success("Report submitted. We'll review it shortly.");
      onOpenChange(false);
      setSelectedReason(null);
      setNote("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {targetType === "recipe" ? "Recipe" : "User"}</DialogTitle>
          <DialogDescription>Help us keep Fork'd a safe and welcoming community.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedReason(r.value)}
                className={`px-4 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                  selectedReason === r.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Additional details (optional)</Label>
            <Textarea
              placeholder="Tell us more..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={loading || !selectedReason}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
