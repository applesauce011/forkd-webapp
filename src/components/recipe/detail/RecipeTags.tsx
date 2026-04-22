"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RecipeBadge } from "@/components/shared/RecipeBadge";
import { getTagLabel } from "@/lib/constants/tags";
import type React from "react";

interface RecipeTagsProps {
  recipe: {
    cuisine_primary: string | null;
    cuisine_secondary: string[] | null;
    dietary: string[] | null;
    contains_allergens: string[] | null;
    meal_types: string[] | null;
    dish_types: string[] | null;
    methods: string[] | null;
    spice_level: string | null;
    occasions: string[] | null;
    main_ingredients: string[] | null;
  };
}

interface TagGroup {
  label: string;
  tags: { value: string; variant: React.ComponentProps<typeof RecipeBadge>["variant"]; label: string }[];
}

function buildGroups(recipe: RecipeTagsProps["recipe"]): { pinned: TagGroup[]; extra: TagGroup[] } {
  const pinned: TagGroup[] = [
    {
      label: "Cuisine",
      tags: [
        ...(recipe.cuisine_primary
          ? [{ value: recipe.cuisine_primary, variant: "cuisine" as const, label: getTagLabel("cuisine", recipe.cuisine_primary) }]
          : []),
        ...(recipe.cuisine_secondary?.map((v) => ({ value: v, variant: "cuisine" as const, label: getTagLabel("cuisine", v) })) ?? []),
      ],
    },
    {
      label: "Meal Type",
      tags: recipe.meal_types?.map((v) => ({ value: v, variant: "meal" as const, label: getTagLabel("meal_types", v) })) ?? [],
    },
    {
      label: "Main Ingredient",
      tags: recipe.main_ingredients?.map((v) => ({ value: v, variant: "default" as const, label: getTagLabel("main_ingredients", v) })) ?? [],
    },
    {
      label: "Method",
      tags: recipe.methods?.map((v) => ({ value: v, variant: "method" as const, label: getTagLabel("methods", v) })) ?? [],
    },
  ].filter((g) => g.tags.length > 0);

  const extra: TagGroup[] = [
    {
      label: "Dietary",
      tags: recipe.dietary?.map((v) => ({ value: v, variant: "dietary" as const, label: getTagLabel("dietary", v) })) ?? [],
    },
    {
      label: "Allergens",
      tags:
        recipe.contains_allergens?.map((v) => ({
          value: v,
          variant: "allergen" as const,
          label: `Contains ${getTagLabel("contains_allergens", v)}`,
        })) ?? [],
    },
    {
      label: "Dish Type",
      tags: recipe.dish_types?.map((v) => ({ value: v, variant: "default" as const, label: getTagLabel("dish_types", v) })) ?? [],
    },
    {
      label: "Spice Level",
      tags: recipe.spice_level
        ? [{ value: recipe.spice_level, variant: "default" as const, label: getTagLabel("spice_level", recipe.spice_level) }]
        : [],
    },
    {
      label: "Occasion",
      tags: recipe.occasions?.map((v) => ({ value: v, variant: "default" as const, label: getTagLabel("occasions", v) })) ?? [],
    },
  ].filter((g) => g.tags.length > 0);

  return { pinned, extra };
}

const VISIBLE_TAG_COUNT = 6;

export function RecipeTags({ recipe }: RecipeTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const { pinned, extra } = buildGroups(recipe);

  const allGroups = [...pinned, ...extra];
  const allTags = allGroups.flatMap((g) => g.tags);

  if (allTags.length === 0) return null;

  // Build visible groups respecting the tag count limit
  let shown = 0;
  const visibleGroups: TagGroup[] = [];

  for (const group of allGroups) {
    if (!expanded && shown >= VISIBLE_TAG_COUNT) break;
    const tagsToShow = expanded ? group.tags : group.tags.slice(0, VISIBLE_TAG_COUNT - shown);
    if (tagsToShow.length > 0) {
      visibleGroups.push({ ...group, tags: tagsToShow });
      shown += tagsToShow.length;
    }
  }

  const hiddenCount = allTags.length - shown;

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {visibleGroups.map((group) => (
          <div key={group.label} className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium shrink-0">{group.label}:</span>
            {group.tags.map((tag) => (
              <RecipeBadge key={tag.value} label={tag.label} variant={tag.variant} />
            ))}
          </div>
        ))}
        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground border rounded-full px-2.5 py-1 transition-colors"
          >
            <ChevronDown className="h-3 w-3" />
            +{hiddenCount} more
          </button>
        )}
        {expanded && allTags.length > VISIBLE_TAG_COUNT && (
          <button
            onClick={() => setExpanded(false)}
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground border rounded-full px-2.5 py-1 transition-colors"
          >
            <ChevronUp className="h-3 w-3" />
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
