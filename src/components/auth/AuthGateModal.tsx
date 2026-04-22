"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
}

export function AuthGateModal({ open, onOpenChange, action = "view this recipe" }: AuthGateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">Join Fork&apos;d to {action}</DialogTitle>
          <DialogDescription>
            Create a free account to access full recipes, like, bookmark, and connect with other cooks.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button asChild className="w-full">
            <Link href="/signup">Create Free Account</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
