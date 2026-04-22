import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlockedUsersList } from "@/components/settings/BlockedUsersList";

export const metadata = { title: "Blocked Users — Fork'd" };

export default async function BlockedUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: blocks } = await supabase
    .from("user_blocks")
    .select(
      "blocked_id, blocked:profiles_visible!blocked_id(username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path)"
    )
    .eq("blocker_id", user.id)
    .order("created_at", { ascending: false });

  // Supabase returns the joined row as an object or array depending on cardinality;
  // normalize it to a single object.
  const normalizedBlocks = (blocks ?? []).map((b) => ({
    blocked_id: b.blocked_id,
    blocked: Array.isArray(b.blocked) ? (b.blocked[0] ?? null) : b.blocked,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Blocked Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Blocked users can't see your profile or recipes, and you won't see theirs.
        </p>
      </div>

      <BlockedUsersList initialBlocks={normalizedBlocks as Parameters<typeof BlockedUsersList>[0]["initialBlocks"]} />
    </div>
  );
}
