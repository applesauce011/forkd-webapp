import { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata: Metadata = { title: "Feed" };

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  return (
    <PageWrapper className="max-w-4xl py-4">
      <Suspense fallback={<LoadingSpinner />}>
        <FeedContent defaultTab={tab} />
      </Suspense>
    </PageWrapper>
  );
}

async function FeedContent({ defaultTab }: { defaultTab?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let resolvedTab = defaultTab;
  if (!resolvedTab && user) {
    const { data: follows } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", user.id)
      .limit(1);
    resolvedTab = follows && follows.length > 0 ? "following" : "everyone";
  }

  return <FeedTabs userId={user?.id} defaultTab={resolvedTab} isAuthenticated={!!user} />;
}
