"use client";

import { useState } from "react";
import { UpgradeModal } from "./UpgradeModal";

interface PremiumGateProps {
  isPremium: boolean;
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
}

export function PremiumGate({
  isPremium,
  children,
  feature = "this feature",
  fallback,
}: PremiumGateProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (isPremium) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        aria-label={`Unlock ${feature}`}
      >
        <div className="relative select-none pointer-events-none opacity-60">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow">
            Unlock {feature}
          </span>
        </div>
      </div>
      <UpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        feature={feature}
      />
    </>
  );
}
