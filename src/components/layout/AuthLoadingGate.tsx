"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

const MESSAGES = [
  "Preheating the oven…",
  "Chopping fresh ingredients…",
  "Marinating your feed…",
  "Simmering your profile…",
  "Whisking it all together…",
  "Plating your experience…",
  "Seasoning to perfection…",
  "Letting it rest…",
];

export function AuthLoadingGate({ children }: { children: React.ReactNode }) {
  const { loading } = useSupabaseContext();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, [loading]);

  if (!loading) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Fork'd" width={48} height={48} className="rounded-[10px]" priority />
        <span className="text-3xl font-bold text-primary">Fork&apos;d</span>
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{MESSAGES[msgIndex]}</p>
    </div>
  );
}
