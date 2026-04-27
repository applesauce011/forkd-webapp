"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutList, LayoutGrid, Clock, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedList } from "@/components/feed/FeedList";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface FeedTabsProps {
  userId?: string;
  defaultTab?: string;
  isAuthenticated?: boolean;
}

export function FeedTabs({ userId, defaultTab = "everyone", isAuthenticated = false }: FeedTabsProps) {
  const [columns, setColumns] = useState<1 | 3>(3);
  const [sort, setSort] = useState<"recent" | "trending">("recent");

  const layoutToggle = (
    <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
      <button
        onClick={() => setColumns(1)}
        className={`p-2 transition-colors ${
          columns === 1
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
        title="Single column"
      >
        <LayoutList className="h-4 w-4" />
      </button>
      <button
        onClick={() => setColumns(3)}
        className={`p-2 transition-colors ${
          columns === 3
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
        title="Grid"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="w-full space-y-4">
        {/* Sign-up CTA banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm flex-1 text-foreground">
            Join Fork&apos;d free — follow cooks, save recipes &amp; unlock full instructions
          </p>
          <div className="flex gap-2 shrink-0">
            <Button asChild size="sm">
              <Link href={ROUTES.SIGNUP}>Join Free</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.LOGIN}>Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Sort + layout controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden flex-1 max-w-fit">
            <button
              onClick={() => setSort("recent")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                sort === "recent"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Most Recent
            </button>
            <button
              onClick={() => setSort("trending")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                sort === "trending"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Trending
            </button>
          </div>
          <div className="ml-auto">{layoutToggle}</div>
        </div>

        <FeedList type="everyone" userId={userId} columns={columns} sort={sort} />
      </div>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <TabsList className="flex-1 grid grid-cols-3">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="everyone">Everyone</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>
        {layoutToggle}
      </div>

      <TabsContent value="following" className="mt-0">
        <FeedList type="following" userId={userId} columns={columns} />
      </TabsContent>

      <TabsContent value="everyone" className="mt-0">
        <FeedList type="everyone" userId={userId} columns={columns} />
      </TabsContent>

      <TabsContent value="liked" className="mt-0">
        <FeedList type="liked" userId={userId} columns={columns} />
      </TabsContent>
    </Tabs>
  );
}
