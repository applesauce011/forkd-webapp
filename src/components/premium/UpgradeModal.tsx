"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { FeatureTable } from "@/components/premium/FeatureTable";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Unlock everything with Premium</DialogTitle>
          <DialogDescription>
            Get unlimited recipes, advanced filters, bookmarks, and more — just $4.99/month.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <FeatureTable />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              onOpenChange(false);
              router.push(ROUTES.UPGRADE);
            }}
          >
            Upgrade to Premium
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
