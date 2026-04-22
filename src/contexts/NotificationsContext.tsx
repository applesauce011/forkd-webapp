"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSupabaseContext } from "@/contexts/SupabaseContext";
import type { Database } from "@/types/database";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type ProfilesVisibleRow = {
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  avatar_source: string | null;
  avatar_placeholder_key?: string | null;
  avatar_custom_path?: string | null;
};

export type NotificationWithActor = NotificationRow & {
  actor: ProfilesVisibleRow | null;
};

interface NotificationsContextValue {
  notifications: NotificationWithActor[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markRead: async () => {},
  markAllRead: async () => {},
});

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = useSupabaseContext();
  const [notifications, setNotifications] = useState<NotificationWithActor[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select(
        "*, actor:profiles_visible!actor_id(username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path)"
      )
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifications((data as NotificationWithActor[]) ?? []);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("user-notifications-" + user.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: "recipient_id=eq." + user.id,
        },
        (payload) => {
          const newNotif = payload.new as NotificationRow;
          // Fetch actor separately since realtime doesn't join
          supabase
            .from("profiles_visible")
            .select("username, display_name, avatar_source, avatar_placeholder_key, avatar_custom_path")
            .eq("id", newNotif.actor_id ?? "")
            .single()
            .then(({ data: actor }) => {
              setNotifications((prev) => [
                { ...newNotif, actor: actor ?? null } as NotificationWithActor,
                ...prev,
              ]);
            });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: "recipient_id=eq." + user.id,
        },
        (payload) => {
          const updated = payload.new as NotificationRow;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updated.id ? { ...n, ...updated } : n
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, fetchNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      const readAt = new Date().toISOString();
      await supabase
        .from("notifications")
        .update({ read_at: readAt })
        .eq("id", id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: readAt } : n))
      );
    },
    [supabase]
  );

  const markAllRead = useCallback(async () => {
    if (!user) return;
    const readAt = new Date().toISOString();
    await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("recipient_id", user.id)
      .is("read_at", null);
    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: readAt }))
    );
  }, [supabase, user]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, loading, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
