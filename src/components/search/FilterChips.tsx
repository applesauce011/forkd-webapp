'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CUISINE_TAGS,
  DIETARY_TAGS,
  ALLERGEN_TAGS,
  MEAL_TYPE_TAGS,
} from '@/lib/constants/tags'
import type { SearchFilters } from '@/components/search/SearchPageClient'

interface FilterChipsProps {
  filters: SearchFilters
  onRemove: (key: keyof SearchFilters, value?: string) => void
  onClearAll: () => void
}

function getLabel(key: keyof SearchFilters, value: string): string {
  switch (key) {
    case 'cuisine':
      return CUISINE_TAGS.find((t) => t.value === value)?.label ?? value
    case 'dietary':
      return DIETARY_TAGS.find((t) => t.value === value)?.label ?? value
    case 'exclude_allergens':
      return `No ${ALLERGEN_TAGS.find((t) => t.value === value)?.label ?? value}`
    case 'meal_types':
      return MEAL_TYPE_TAGS.find((t) => t.value === value)?.label ?? value
    case 'difficulty':
      return value.charAt(0).toUpperCase() + value.slice(1)
    case 'max_cook_time':
      return `≤ ${value} min`
    default:
      return value
  }
}

interface ChipEntry {
  key: keyof SearchFilters
  value: string
  label: string
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  const chips: ChipEntry[] = []

  if (filters.cuisine) {
    chips.push({ key: 'cuisine', value: filters.cuisine, label: getLabel('cuisine', filters.cuisine) })
  }

  if (filters.dietary?.length) {
    for (const v of filters.dietary) {
      chips.push({ key: 'dietary', value: v, label: getLabel('dietary', v) })
    }
  }

  if (filters.exclude_allergens?.length) {
    for (const v of filters.exclude_allergens) {
      chips.push({ key: 'exclude_allergens', value: v, label: getLabel('exclude_allergens', v) })
    }
  }

  if (filters.meal_types?.length) {
    for (const v of filters.meal_types) {
      chips.push({ key: 'meal_types', value: v, label: getLabel('meal_types', v) })
    }
  }

  if (filters.difficulty) {
    chips.push({ key: 'difficulty', value: filters.difficulty, label: getLabel('difficulty', filters.difficulty) })
  }

  if (filters.max_cook_time) {
    chips.push({
      key: 'max_cook_time',
      value: String(filters.max_cook_time),
      label: getLabel('max_cook_time', String(filters.max_cook_time)),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={`${chip.key}-${chip.value}`}
          variant="secondary"
          className="flex items-center gap-1 pr-1 text-xs"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="ml-0.5 rounded-full hover:bg-muted p-0.5"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
