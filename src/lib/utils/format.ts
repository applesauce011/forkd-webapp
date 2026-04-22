import { formatDistanceToNow, format, parseISO } from "date-fns";

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

export function formatDate(dateString: string | null | undefined, fmt = "MMM d, yyyy"): string {
  if (!dateString) return "";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, fmt);
  } catch {
    return "";
  }
}

export function formatCount(n: number | null | undefined): string {
  if (!n) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function formatRating(rating: number | null | undefined): string {
  if (!rating) return "0.0";
  return rating.toFixed(1);
}
