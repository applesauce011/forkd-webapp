'use client'

import { Lock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useEntitlements } from '@/hooks/useEntitlements'
import {
  CUISINE_TAGS,
  DIETARY_TAGS,
  ALLERGEN_TAGS,
  MEAL_TYPE_TAGS,
} from '@/lib/constants/tags'
import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'
import type { SearchFilters } from '@/components/search/SearchPageClient'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

function toggleArrayValue(arr: string[] | undefined, value: string): string[] {
  const current = arr ?? []
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
}

function MultiCheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <Checkbox
              id={`filter-${opt.value}`}
              checked={selected.includes(opt.value)}
              onCheckedChange={() => onToggle(opt.value)}
            />
            <label
              htmlFor={`filter-${opt.value}`}
              className="text-sm cursor-pointer leading-none"
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
      <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <h3 className="font-semibold text-base flex items-center justify-center gap-1.5">
          <Crown className="h-4 w-4 text-amber-500" />
          Premium Feature
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Advanced search filters are available on the Premium plan. Filter by cuisine, dietary
          needs, allergens, meal type, difficulty, and cook time.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.UPGRADE}>Upgrade to Premium</Link>
      </Button>
    </div>
  )
}

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const entitlements = useEntitlements()

  if (!entitlements.is_premium) {
    return <PremiumGate />
  }

  const update = (partial: Partial<SearchFilters>) => {
    onChange({ ...filters, ...partial })
  }

  const handleReset = () => {
    onChange({})
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Cuisine */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Cuisine</Label>
        <Select
          value={filters.cuisine ?? ''}
          onValueChange={(v) => update({ cuisine: v || undefined })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any cuisine</SelectItem>
            {CUISINE_TAGS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Dietary */}
      <MultiCheckboxGroup
        label="Dietary"
        options={DIETARY_TAGS}
        selected={filters.dietary ?? []}
        onToggle={(v) => update({ dietary: toggleArrayValue(filters.dietary, v) || undefined })}
      />

      <Separator />

      {/* Allergens to exclude */}
      <MultiCheckboxGroup
        label="Exclude allergens"
        options={ALLERGEN_TAGS}
        selected={filters.exclude_allergens ?? []}
        onToggle={(v) =>
          update({
            exclude_allergens: toggleArrayValue(filters.exclude_allergens, v) || undefined,
          })
        }
      />

      <Separator />

      {/* Meal type */}
      <MultiCheckboxGroup
        label="Meal type"
        options={MEAL_TYPE_TAGS}
        selected={filters.meal_types ?? []}
        onToggle={(v) =>
          update({ meal_types: toggleArrayValue(filters.meal_types, v) || undefined })
        }
      />

      <Separator />

      {/* Difficulty */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
        <Select
          value={filters.difficulty ?? ''}
          onValueChange={(v) => update({ difficulty: v || undefined })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any difficulty</SelectItem>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Max cook time */}
      <div>
        <Label htmlFor="max-cook-time" className="text-sm font-medium mb-2 block">
          Max cook time (minutes)
        </Label>
        <Input
          id="max-cook-time"
          type="number"
          min={1}
          max={480}
          placeholder="e.g. 30"
          value={filters.max_cook_time ?? ''}
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value, 10) : undefined
            update({ max_cook_time: val })
          }}
        />
      </div>

      <Separator />

      {/* Reset */}
      <Button variant="outline" className="w-full" onClick={handleReset}>
        Reset all filters
      </Button>
    </div>
  )
}
