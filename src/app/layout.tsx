import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Fork'd — Social Recipe Platform", template: "%s | Fork'd" },
  description: "Share recipes, discover dishes, and cook together. Fork'd is the social recipe platform for home cooks.",
  keywords: ["recipes", "cooking", "home cook", "recipe sharing", "food", "social cooking", "cook together"],
  authors: [{ name: "Fork'd" }],
  creator: "Fork'd",
  metadataBase: new URL("https://forkd.app"),
  openGraph: {
    title: "Fork'd — Social Recipe Platform",
    description: "Share recipes, discover dishes, and cook together.",
    type: "website",
    siteName: "Fork'd",
    url: "https://forkd.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fork'd — Social Recipe Platform",
    description: "Share recipes, discover dishes, and cook together.",
    site: "@forkdapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://forkd.app",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fork'd",
  url: "https://forkd.app",
  description: "Share recipes, discover dishes, and cook together.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://forkd.app/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
                <Analytics />

      </body>
    </html>
  );
}
