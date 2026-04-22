'use client'

import { useCallback, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { RecipeItem } from '@/types/recipe'
import { GripVertical, Trash2, Heading } from 'lucide-react'

type ItemWithId = RecipeItem & { id: string }

interface SortableRowProps {
  item: ItemWithId
  index: number
  inputRef: (el: HTMLInputElement | null) => void
  onChange: (text: string) => void
  onDelete: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

function SortableRow({ item, index, inputRef, onChange, onDelete, onKeyDown }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const isHeading = item.type === 'heading'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 group ${
        isHeading ? 'bg-muted/50 border-border/50' : 'bg-background border-border'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground shrink-0 transition-colors"
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {isHeading && (
        <Heading className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}

      <input
        ref={inputRef}
        value={item.text}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={isHeading ? 'Section name…' : `Ingredient ${index + 1}`}
        className={`flex-1 bg-transparent border-0 outline-none text-sm min-w-0 placeholder:text-muted-foreground/50 ${
          isHeading ? 'font-semibold text-foreground/80' : ''
        }`}
      />

      <button
        type="button"
        onClick={onDelete}
        tabIndex={-1}
        className="shrink-0 text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

interface IngredientsEditorProps {
  value: RecipeItem[]
  onChange: (items: RecipeItem[]) => void
}

function ensureId(item: RecipeItem): ItemWithId {
  if (item.type === 'item') return item
  return { ...item, id: (item as ItemWithId).id ?? crypto.randomUUID() }
}

export function IngredientsEditor({ value, onChange }: IngredientsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const items = value.map(ensureId)

  const focusAt = (index: number) => {
    requestAnimationFrame(() => inputRefs.current[index]?.focus())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const next: ItemWithId = { type: 'item', text: '', id: crypto.randomUUID() }
      const updated = [...items]
      updated.splice(index + 1, 0, next)
      onChange(updated)
      focusAt(index + 1)
    } else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault()
      onChange(items.filter((_, i) => i !== index))
      focusAt(Math.max(0, index - 1))
    }
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIdx = items.findIndex((i) => i.id === active.id)
      const newIdx = items.findIndex((i) => i.id === over.id)
      if (oldIdx !== -1 && newIdx !== -1) onChange(arrayMove(items, oldIdx, newIdx))
    },
    [items, onChange]
  )

  const addIngredient = () => {
    const next: ItemWithId = { type: 'item', text: '', id: crypto.randomUUID() }
    onChange([...items, next])
    focusAt(items.length)
  }

  const addSection = () => {
    const next = { type: 'heading', text: '', id: crypto.randomUUID() } as ItemWithId
    onChange([...items, next])
    focusAt(items.length)
  }

  const updateItem = (index: number, text: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], text }
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    focusAt(Math.max(0, index - 1))
  }

  return (
    <div className="space-y-1.5">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.length === 0 ? (
            <button
              type="button"
              onClick={addIngredient}
              className="w-full rounded-lg border border-dashed border-border py-5 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
            >
              Click to add your first ingredient
            </button>
          ) : (
            <div className="space-y-1">
              {items.map((item, index) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  index={index}
                  inputRef={(el) => { inputRefs.current[index] = el }}
                  onChange={(text) => updateItem(index, text)}
                  onDelete={() => removeItem(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-3 pt-1 pl-1">
        <button
          type="button"
          onClick={addIngredient}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-primary font-bold mr-1">+</span>Add ingredient
        </button>
        <span className="text-border">·</span>
        <button
          type="button"
          onClick={addSection}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Heading className="h-3.5 w-3.5" />Add section
        </button>
      </div>
    </div>
  )
}
