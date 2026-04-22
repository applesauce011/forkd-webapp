import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🍴</div>
      <h1 className="text-4xl font-bold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8">This page doesn&apos;t exist or has been removed.</p>
      <Button asChild>
        <Link href="/feed">Back to Feed</Link>
      </Button>
    </div>
  );
}
