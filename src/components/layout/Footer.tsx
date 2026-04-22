import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  recipeCount?: number;
}

export function Footer({ recipeCount }: FooterProps) {
  const count = recipeCount ?? 0;
  const formatted = count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : count.toString();

  return (
    <footer className="border-t bg-background/80 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Fork'd" width={28} height={28} className="rounded-[6px]" />
              <span className="text-lg font-bold text-primary">Fork&apos;d</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The home for real home cooks. Discover, save, and share the recipes you actually make.
            </p>
            {count > 0 && (
              <p className="text-sm font-semibold text-foreground">
                <span className="text-primary text-base">{formatted}</span> recipes worth stealing
              </p>
            )}
          </div>

          {/* App */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Get the App</p>
            <a
              href="https://apps.apple.com/app/forkd/id6757679956"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 814 1000" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.1 134.8-316.7 267.4-316.7 49.8 0 91.4 33.2 123.4 33.2 30.7 0 78.4-35.1 135.7-35.1c21.9 0 108.2 1.9 163.3 72.4zm-165.3-164.5c24.4-28.9 41.2-69.7 41.2-110.5 0-5.8-.6-11.6-1.6-16.5-39.5 1.6-86.4 26.4-114.3 58.7-22.3 25.7-42.6 66-42.6 107.3 0 6.4 1.3 12.9 1.9 15.1 2.6.6 6.4 1.3 10.3 1.3 34.5 0 78.4-23.8 105.1-55.4z" />
              </svg>
              App Store
            </a>
            <p className="text-xs text-muted-foreground">
              Adding recipes is best done in-app.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Company</p>
            <ul className="space-y-2">
              {[
                { label: "Feed", href: "/feed" },
                { label: "Search", href: "/search" },
                { label: "Settings", href: "/settings" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fork&apos;d. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for home cooks everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
