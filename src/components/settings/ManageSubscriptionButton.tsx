"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        toast.error("Could not open billing portal. Please try again.");
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    });
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Manage subscription
    </Button>
  );
}
