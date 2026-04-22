import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "cuisine" | "dietary" | "allergen" | "meal" | "method" | "default";

const variantColors: Record<BadgeVariant, string> = {
  cuisine: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  dietary: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  allergen: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  meal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  method: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  default: "bg-muted text-muted-foreground",
};

interface RecipeBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function RecipeBadge({ label, variant = "default", className }: RecipeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", variantColors[variant], className)}
    >
      {label}
    </Badge>
  );
}
