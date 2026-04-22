import Link from "next/link";
import { GitFork, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface Remix {
  id: string;
  title: string;
  photos: string[] | null;
  profiles: { display_name: string | null; username: string | null } | null | unknown;
}

interface RemixSectionProps {
  recipeId: string;
  remixes: Remix[];
}

export function RemixSection({ recipeId, remixes }: RemixSectionProps) {
  if (remixes.length === 0) {
    return (
      <div className="my-6 pt-6 border-t">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <GitFork className="h-4 w-4" />
          <span className="text-sm font-medium">No remixes yet</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`${ROUTES.RECIPE_NEW}?remix=${recipeId}`}>
            🔀 Be the first to remix this recipe
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="my-6 pt-6 border-t">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <GitFork className="h-4 w-4" />
        {remixes.length} Remix{remixes.length !== 1 ? "es" : ""}
      </h3>
      <div className="space-y-2">
        {remixes.map((remix) => {
          const author = remix.profiles as { display_name: string | null; username: string | null } | null;
          return (
            <Link
              key={remix.id}
              href={ROUTES.RECIPE(remix.id)}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{remix.title}</p>
                <p className="text-xs text-muted-foreground">
                  by {author?.display_name ?? author?.username ?? "Anonymous"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
      <Button asChild variant="outline" size="sm" className="mt-3">
        <Link href={`${ROUTES.RECIPE_NEW}?remix=${recipeId}`}>🔀 Remix this recipe</Link>
      </Button>
    </div>
  );
}
