import Image from "next/image"
import Link from "next/link"
import { Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/layout/PageWrapper"

export const metadata = {
  title: "New Recipe — Fork'd",
}

export default function NewRecipePage() {
  return (
    <PageWrapper narrow>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12 px-4">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Fork'd"
            width={80}
            height={80}
            className="rounded-[18px] shadow-lg mx-auto"
          />
        </div>

        <h1 className="text-3xl font-bold mb-3">Create Recipes on the App</h1>
        <p className="text-muted-foreground text-lg mb-2 max-w-sm">
          Adding recipes is best done from your phone. Download Fork&apos;d on the App Store to start sharing your kitchen creations.
        </p>

        <div className="flex flex-col items-center gap-3 mt-8">
          <Button asChild size="lg" className="gap-2 px-8 text-base">
            <a
              href="https://apps.apple.com/app/forkd/id6757679956"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Apple className="h-5 w-5" />
              Download on the App Store
            </a>
          </Button>

          <Link
            href="/feed"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            Back to Feed
          </Link>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border max-w-sm w-full">
          <p className="text-sm font-medium mb-1">Already have the app?</p>
          <p className="text-xs text-muted-foreground">
            Sign in with the same account and your recipes will appear here automatically.
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}
