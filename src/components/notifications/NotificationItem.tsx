"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { NotificationWithActor } from "@/contexts/NotificationsContext";

interface NotificationItemProps {
  notification: NotificationWithActor;
  onRead?: (id: string) => void;
}

function getAvatarInitials(actor: NotificationWithActor["actor"]): string {
  if (!actor) return "?";
  const name = actor.display_name || actor.username || "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarSrc(actor: NotificationWithActor["actor"]): string | null {
  if (!actor) return null;
  // Use avatar_custom_path if available, otherwise null (fallback to initials)
  if ("avatar_custom_path" in actor && actor.avatar_custom_path) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${actor.avatar_custom_path}`;
  }
  return null;
}

function NotificationText({
  notification,
}: {
  notification: NotificationWithActor;
}) {
  const actor = notification.actor;
  const actorName = actor?.display_name || actor?.username || "Someone";
  const payload = notification.payload as Record<string, string> | null;
  const recipeTitle = payload?.recipe_title ?? "a recipe";

  switch (notification.type) {
    case "new_follower":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> started following
          you
        </span>
      );
    case "recipe_like":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> liked your recipe{" "}
          <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "recipe_comment":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> commented on{" "}
          <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "recipe_remix":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> remixed your
          recipe <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "recipe_cooked":
    case "cooked_your_recipe":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> cooked your
          recipe <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "recipe_rating":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> rated your recipe{" "}
          <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "recipe_reaction":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> reacted to{" "}
          <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "follow_recipe":
    case "new_from_followed":
      return (
        <span>
          Someone you follow posted{" "}
          <strong className="font-medium">{recipeTitle}</strong>
        </span>
      );
    case "mention":
      return (
        <span>
          <strong className="font-medium">{actorName}</strong> mentioned you
        </span>
      );
    case "system":
      return <span>{payload?.message ?? "System notification"}</span>;
    case "milestone_likes":
      return (
        <span>
          Your recipe <strong className="font-medium">{recipeTitle}</strong> hit
          a new likes milestone!
        </span>
      );
    case "milestone_cooked":
      return (
        <span>
          Your recipe <strong className="font-medium">{recipeTitle}</strong> hit
          a new cooked milestone!
        </span>
      );
    case "weekly_digest":
    case "re_engagement":
    case "welcome":
      return <span>{payload?.message ?? "You have a new notification"}</span>;
    default:
      return <span>You have a new notification</span>;
  }
}

function getNotificationHref(notification: NotificationWithActor): string {
  const actor = notification.actor;
  const payload = notification.payload as Record<string, string> | null;

  switch (notification.type) {
    case "new_follower":
      return actor?.username
        ? ROUTES.PROFILE(actor.username)
        : ROUTES.NOTIFICATIONS;
    case "recipe_like":
    case "recipe_comment":
    case "recipe_remix":
    case "recipe_cooked":
    case "cooked_your_recipe":
    case "recipe_rating":
    case "recipe_reaction":
    case "follow_recipe":
    case "new_from_followed":
      return notification.recipe_id
        ? ROUTES.RECIPE(notification.recipe_id)
        : ROUTES.NOTIFICATIONS;
    case "mention":
      return payload?.recipe_id
        ? ROUTES.RECIPE(payload.recipe_id)
        : ROUTES.NOTIFICATIONS;
    default:
      return ROUTES.NOTIFICATIONS;
  }
}

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const isUnread = !notification.read_at;
  const avatarSrc = getAvatarSrc(notification.actor);
  const initials = getAvatarInitials(notification.actor);
  const href = getNotificationHref(notification);

  function handleClick() {
    if (isUnread && onRead) {
      onRead(notification.id);
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted/60",
        isUnread && "bg-primary/5"
      )}
    >
      {/* Actor avatar */}
      <div className="shrink-0 mt-0.5">
        <Avatar className="h-9 w-9">
          {avatarSrc && (
            <AvatarImage src={avatarSrc} alt={notification.actor?.username ?? ""} />
          )}
          <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug text-foreground">
          <NotificationText notification={notification} />
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>

      {/* Unread dot */}
      {isUnread && (
        <span className="shrink-0 mt-2 h-2 w-2 rounded-full bg-primary" />
      )}
    </Link>
  );
}
