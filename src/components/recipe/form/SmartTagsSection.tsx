'use client'

import { useState, useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { RecipeSchema } from '@/hooks/useRecipeForm'
import { useSupabase } from '@/hooks/useSupabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CUISINE_TAGS,
  DIETARY_TAGS,
  ALLERGEN_TAGS,
  MEAL_TYPE_TAGS,
  DISH_TYPE_TAGS,
  COOKING_METHOD_TAGS,
  SPICE_LEVEL_TAGS,
  OCCASION_TAGS,
  MAIN_INGREDIENT_TAGS,
  FLAVOR_NOTE_TAGS,
  getTagLabel,
} from '@/lib/constants/tags'
import { Sparkles, Loader2, RotateCcw, ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import type { RecipeItem } from '@/types/recipe'

interface SmartTagsSectionProps {
  form: UseFormReturn<RecipeSchema>
}

// Tag group definitions for the compact summary + full editor
const TAG_DEFS = [
  { key: 'cuisine_primary' as const, label: 'Cuisine', type: 'single' as const },
  { key: 'meal_types' as const, label: 'Meal Type', type: 'multi' as const, tags: MEAL_TYPE_TAGS },
  { key: 'dish_types' as const, label: 'Dish Type', type: 'multi' as const, tags: DISH_TYPE_TAGS },
  { key: 'methods' as const, label: 'Method', type: 'multi' as const, tags: COOKING_METHOD_TAGS },
  { key: 'dietary' as const, label: 'Dietary', type: 'multi' as const, tags: DIETARY_TAGS },
  { key: 'main_ingredients' as const, label: 'Main Ingredients', type: 'multi' as const, tags: MAIN_INGREDIENT_TAGS },
  { key: 'spice_level' as const, label: 'Spice Level', type: 'single' as const },
  { key: 'occasions' as const, label: 'Occasion', type: 'multi' as const, tags: OCCASION_TAGS },
  { key: 'contains_allergens' as const, label: 'Allergens', type: 'multi' as const, tags: ALLERGEN_TAGS },
  { key: 'flavor_notes' as const, label: 'Flavor Notes', type: 'multi' as const, tags: FLAVOR_NOTE_TAGS },
  { key: 'cuisine_secondary' as const, label: 'Also Cuisine', type: 'multi' as const, tags: CUISINE_TAGS },
]

function TagPill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive leading-none">
          ×
        </button>
      )}
    </span>
  )
}

function MultiTagGroup({
  label, tags, value, onChange,
}: {
  label: string
  tags: { value: string; label: string }[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag.value}
            variant={value.includes(tag.value) ? 'default' : 'outline'}
            className="cursor-pointer select-none text-xs"
            onClick={() => toggle(tag.value)}
          >
            {tag.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function SmartTagsSection({ form }: SmartTagsSectionProps) {
  const { supabase } = useSupabase()
  const { watch, setValue, getValues } = form

  const [suggesting, setSuggesting] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [hasSuggested, setHasSuggested] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const autoTriggeredRef = useRef(false)

  const title = watch('title') ?? ''
  const ingredients = (watch('ingredients') ?? []) as RecipeItem[]
  const ingredientCount = ingredients.filter((i) => i.type === 'item').length

  // Watched tag values for display
  const cuisine_primary = watch('cuisine_primary')
  const cuisine_secondary = watch('cuisine_secondary') ?? []
  const meal_types = watch('meal_types') ?? []
  const dish_types = watch('dish_types') ?? []
  const methods = watch('methods') ?? []
  const dietary = watch('dietary') ?? []
  const contains_allergens = watch('contains_allergens') ?? []
  const main_ingredients = watch('main_ingredients') ?? []
  const spice_level = watch('spice_level')
  const occasions = watch('occasions') ?? []
  const flavor_notes = watch('flavor_notes') ?? []

  const hasAnyTag =
    !!cuisine_primary ||
    meal_types.length > 0 ||
    dish_types.length > 0 ||
    methods.length > 0 ||
    dietary.length > 0 ||
    main_ingredients.length > 0

  const readyForSuggest = title.length >= 3 && ingredientCount >= 2

  // Auto-trigger once when recipe has enough info and no tags yet
  useEffect(() => {
    if (autoTriggeredRef.current) return
    if (!readyForSuggest || hasAnyTag) return
    autoTriggeredRef.current = true
    suggestTags()
  }, [readyForSuggest, hasAnyTag]) // eslint-disable-line react-hooks/exhaustive-deps

  const suggestTags = async () => {
    setSuggesting(true)
    setSuggestError(null)

    const title = getValues('title')
    const ingredients = getValues('ingredients') as RecipeItem[]
    const ingredients_text = ingredients
      .filter((i) => i.type === 'item')
      .map((i) => i.text)
      .join(', ')

    try {
      const { data, error } = await supabase.functions.invoke('smart_tags_suggest_v2', {
        body: { title, ingredients_text },
      })
      if (error) throw new Error(error.message)
      if (data) {
        if (data.cuisine_primary) setValue('cuisine_primary', data.cuisine_primary)
        if (data.cuisine_secondary) setValue('cuisine_secondary', data.cuisine_secondary)
        if (data.dietary) setValue('dietary', data.dietary)
        if (data.contains_allergens) setValue('contains_allergens', data.contains_allergens)
        if (data.meal_types) setValue('meal_types', data.meal_types)
        if (data.dish_types) setValue('dish_types', data.dish_types)
        if (data.methods) setValue('methods', data.methods)
        if (data.spice_level) setValue('spice_level', data.spice_level)
        if (data.occasions) setValue('occasions', data.occasions)
        if (data.main_ingredients) setValue('main_ingredients', data.main_ingredients)
        if (data.flavor_notes) setValue('flavor_notes', data.flavor_notes)
      }
      setHasSuggested(true)
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : 'AI suggestion failed')
    } finally {
      setSuggesting(false)
    }
  }

  // Build compact tag summary
  const summary: { groupLabel: string; tags: string[] }[] = []
  if (cuisine_primary) {
    const label = getTagLabel('cuisine', cuisine_primary)
    summary.push({ groupLabel: 'Cuisine', tags: [label] })
  }
  if (meal_types.length) summary.push({ groupLabel: 'Meal Type', tags: meal_types.map((v) => getTagLabel('meal_types', v)) })
  if (methods.length) summary.push({ groupLabel: 'Method', tags: methods.map((v) => getTagLabel('methods', v)) })
  if (dietary.length) summary.push({ groupLabel: 'Dietary', tags: dietary.map((v) => getTagLabel('dietary', v)) })
  if (main_ingredients.length) summary.push({ groupLabel: 'Main Ingredients', tags: main_ingredients.map((v) => getTagLabel('main_ingredients', v)) })
  if (spice_level) summary.push({ groupLabel: 'Spice', tags: [getTagLabel('spice_level', spice_level)] })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Tags &amp; Categories</h3>
        <div className="flex items-center gap-2">
          {hasSuggested && (
            <button
              type="button"
              onClick={() => setEditOpen((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              {editOpen ? 'Done editing' : 'Edit'}
            </button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={suggestTags}
            disabled={suggesting || !readyForSuggest}
            title={!readyForSuggest ? 'Add a title and at least 2 ingredients first' : undefined}
          >
            {suggesting ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : hasSuggested ? (
              <RotateCcw className="h-4 w-4 mr-1.5" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1.5" />
            )}
            {hasSuggested ? 'Regenerate' : 'Suggest with AI'}
          </Button>
        </div>
      </div>

      {/* Status states */}
      {suggesting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is picking tags based on your recipe…
        </div>
      )}

      {!suggesting && !hasSuggested && !hasAnyTag && (
        <p className="text-sm text-muted-foreground">
          {readyForSuggest
            ? 'Generating tags…'
            : 'Tags will be suggested automatically once you add a title and ingredients.'}
        </p>
      )}

      {suggestError && (
        <p className="text-sm text-destructive">{suggestError}</p>
      )}

      {/* Compact tag summary */}
      {!suggesting && (hasSuggested || hasAnyTag) && !editOpen && (
        <div className="space-y-2">
          {summary.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags yet.</p>
          ) : (
            summary.map((group) => (
              <div key={group.groupLabel} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground w-24 shrink-0">{group.groupLabel}</span>
                <div className="flex flex-wrap gap-1">
                  {group.tags.map((t) => (
                    <TagPill key={t} label={t} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Full edit panel */}
      {editOpen && (
        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
          {/* Cuisine Primary */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Primary Cuisine</p>
            <Select
              value={cuisine_primary ?? ''}
              onValueChange={(v) => setValue('cuisine_primary', v || null)}
            >
              <SelectTrigger className="w-full max-w-xs h-8 text-sm">
                <SelectValue placeholder="Select cuisine…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {CUISINE_TAGS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <MultiTagGroup label="Meal Type" tags={MEAL_TYPE_TAGS} value={meal_types} onChange={(v) => setValue('meal_types', v)} />
          <MultiTagGroup label="Dish Type" tags={DISH_TYPE_TAGS} value={dish_types} onChange={(v) => setValue('dish_types', v)} />
          <MultiTagGroup label="Method" tags={COOKING_METHOD_TAGS} value={methods} onChange={(v) => setValue('methods', v)} />
          <MultiTagGroup label="Dietary" tags={DIETARY_TAGS} value={dietary} onChange={(v) => setValue('dietary', v)} />
          <MultiTagGroup label="Main Ingredients" tags={MAIN_INGREDIENT_TAGS} value={main_ingredients} onChange={(v) => setValue('main_ingredients', v)} />
          <MultiTagGroup label="Allergens" tags={ALLERGEN_TAGS} value={contains_allergens} onChange={(v) => setValue('contains_allergens', v)} />

          {/* Spice Level */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Spice Level</p>
            <Select
              value={spice_level ?? ''}
              onValueChange={(v) => setValue('spice_level', v || null)}
            >
              <SelectTrigger className="w-full max-w-xs h-8 text-sm">
                <SelectValue placeholder="Select spice level…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {SPICE_LEVEL_TAGS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <MultiTagGroup label="Flavor Notes" tags={FLAVOR_NOTE_TAGS} value={flavor_notes} onChange={(v) => setValue('flavor_notes', v)} />
          <MultiTagGroup label="Occasions" tags={OCCASION_TAGS} value={occasions} onChange={(v) => setValue('occasions', v)} />
          <MultiTagGroup label="Also Cuisine" tags={CUISINE_TAGS.filter((t) => t.value !== cuisine_primary)} value={cuisine_secondary} onChange={(v) => setValue('cuisine_secondary', v)} />
        </div>
      )}
    </div>
  )
}
