import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FeatureRow {
  feature: string;
  free: string | boolean;
  premium: string | boolean;
}

const FEATURES: FeatureRow[] = [
  { feature: "Recipe views per day", free: "15 recipes", premium: "Unlimited" },
  { feature: "Recipe creation", free: true, premium: true },
  { feature: "Feed access", free: "15 recipes", premium: "Unlimited" },
  { feature: "Bookmarks", free: "5 visible", premium: "Unlimited" },
  { feature: "Search results", free: "15 results", premium: "Unlimited + advanced filters" },
  { feature: "Cook Mode", free: "2 sessions", premium: "Unlimited" },
  { feature: "Saved searches", free: false, premium: true },
  { feature: "Creator Stats", free: false, premium: true },
];

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={cn("h-5 w-5 mx-auto", highlight ? "text-orange-500" : "text-green-500")} />
    ) : (
      <X className="h-5 w-5 mx-auto text-muted-foreground/50" />
    );
  }
  return (
    <span className={cn("text-sm", highlight && "font-medium text-orange-600 dark:text-orange-400")}>
      {value}
    </span>
  );
}

export function FeatureTable() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-1/2">
              Feature
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-1/4">
              Free
            </th>
            <th className="text-center px-4 py-3 font-semibold text-orange-600 dark:text-orange-400 w-1/4">
              Premium
            </th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((row, i) => (
            <tr
              key={row.feature}
              className={cn(
                "border-b border-border last:border-0",
                i % 2 === 0 ? "bg-background" : "bg-muted/20"
              )}
            >
              <td className="px-4 py-3 font-medium">{row.feature}</td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.free} />
              </td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.premium} highlight />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
