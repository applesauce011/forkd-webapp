"use client";

import { useState } from "react";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedList } from "@/components/feed/FeedList";
import { useSession } from "@/hooks/useSession";

interface FeedTabsProps {
  userId?: string;
  defaultTab?: string;
}

export function FeedTabs({ userId, defaultTab = "everyone" }: FeedTabsProps) {
  const { user } = useSession();
  const [columns, setColumns] = useState<1 | 3>(3);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <TabsList className="flex-1 grid grid-cols-3">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="everyone">Everyone</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>

        {/* Layout toggle */}
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
      </div>

      <TabsContent value="following" className="mt-0">
        <FeedList type="following" userId={userId} columns={columns} />
      </TabsContent>

      <TabsContent value="everyone" className="mt-0">
        <FeedList type="everyone" userId={userId} columns={columns} />
      </TabsContent>

      <TabsContent value="liked" className="mt-0">
        {user ? (
          <FeedList type="liked" userId={userId} columns={columns} />
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Sign in to see your liked recipes</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
