"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Fork'd" width={28} height={28} className="rounded-md" />
          <span className="text-xl font-bold text-primary">Fork&apos;d</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
