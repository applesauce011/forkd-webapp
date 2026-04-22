'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Controller } from 'react-hook-form'

import { useRecipeForm, type RecipeSchema } from '@/hooks/useRecipeForm'
import type { UseFormReturn } from 'react-hook-form'
import { useDraftRecipe } from '@/hooks/useDraftRecipe'
import { createRecipe, updateRecipe } from '@/actions/recipe'
import type { RecipeFormValues } from '@/types/recipe'
import { ROUTES } from '@/lib/constants/routes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { DraftBanner } from './DraftBanner'
import { PhotoUploader } from './PhotoUploader'
import { IngredientsEditor } from './IngredientsEditor'
import { InstructionsEditor } from './InstructionsEditor'
import { SmartTagsSection } from './SmartTagsSection'
import { RecipePreview } from './RecipePreview'
import { Eye, Send, Save, GitFork } from 'lucide-react'

interface RecipeFormProps {
  initialValues?: Partial<RecipeFormValues>
  recipeId?: string
  remixedFrom?: string
  parentTitle?: string
}

export function RecipeForm({
  initialValues,
  recipeId: existingRecipeId,
  remixedFrom,
  parentTitle,
}: RecipeFormProps) {
  const router = useRouter()
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useDraftRecipe()

  // Stable recipe ID — either the existing one (edit) or a new UUID
  const recipeIdRef = useRef<string>(existingRecipeId ?? crypto.randomUUID())
  const recipeId = recipeIdRef.current

  // Draft state
  const [draftVisible, setDraftVisible] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState<string | undefined>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const schemaInitialValues: Partial<RecipeSchema> | undefined = initialValues
    ? {
        ...initialValues,
        parent_id: initialValues.parent_id,
      }
    : remixedFrom
    ? { parent_id: remixedFrom }
    : undefined

  const form = useRecipeForm(schemaInitialValues) as unknown as UseFormReturn<RecipeSchema>
  const { handleSubmit, control, watch, formState: { errors }, setValue, reset } = form

  // Auto-save draft (debounced 2s)
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formValues = watch()

  useEffect(() => {
    if (existingRecipeId) return // Don't auto-draft in edit mode
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(() => {
      saveDraft(formValues as Partial<RecipeFormValues>, recipeId)
    }, 2000)
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues)])

  // Check for draft on mount
  useEffect(() => {
    if (existingRecipeId) return
    if (hasDraft()) {
      const draft = loadDraft()
      if (draft) {
        setDraftSavedAt(draft.savedAt)
        setDraftVisible(true)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResumeDraft = useCallback(() => {
    const draft = loadDraft()
    if (!draft) return
    const { savedAt, recipeId: draftRecipeId, ...values } = draft
    reset({ ...schemaInitialValues, ...values } as RecipeSchema)
    if (draftRecipeId) {
      recipeIdRef.current = draftRecipeId
    }
    setDraftVisible(false)
    toast.success('Draft resumed')
  }, [loadDraft, reset, schemaInitialValues])

  const handleDiscardDraft = useCallback(() => {
    clearDraft()
    setDraftVisible(false)
    toast.success('Draft discarded')
  }, [clearDraft])

  const onSubmit = async (data: RecipeSchema, asDraft = false) => {
    setSubmitting(true)

    const payload: RecipeFormValues = {
      ...data,
      visibility: asDraft ? 'private' : (data.visibility ?? 'public'),
      instructions: data.instructions ?? [],
      ingredients: data.ingredients ?? [],
      photos: data.photos ?? [],
      servings: data.servings ?? null,
      prep_time_minutes: data.prep_time_minutes ?? null,
      cook_time_minutes: data.cook_time_minutes ?? null,
      difficulty: data.difficulty ?? null,
      cuisine_primary: data.cuisine_primary ?? null,
      cuisine_secondary: data.cuisine_secondary ?? [],
      dietary: data.dietary ?? [],
      contains_allergens: data.contains_allergens ?? [],
      meal_types: data.meal_types ?? [],
      dish_types: data.dish_types ?? [],
      main_ingredients: data.main_ingredients ?? [],
      methods: data.methods ?? [],
      spice_level: data.spice_level ?? null,
      flavor_notes: data.flavor_notes ?? [],
      occasions: data.occasions ?? [],
      parent_id: data.parent_id ?? null,
    }

    try {
      if (existingRecipeId) {
        const result = await updateRecipe(existingRecipeId, payload)
        if (result.error) {
          toast.error(result.error)
          setSubmitting(false)
          return
        }
        clearDraft()
        toast.success('Recipe updated!')
        router.push(ROUTES.RECIPE(existingRecipeId))
      } else {
        const result = await createRecipe({ ...payload, id: recipeId })
        if ('error' in result) {
          toast.error(result.error)
          setSubmitting(false)
          return
        }
        clearDraft()
        toast.success(asDraft ? 'Draft saved!' : 'Recipe published!')
        router.push(ROUTES.RECIPE(result.id))
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const handlePublish = handleSubmit((data) => onSubmit(data, false))
  const handleSaveDraftSubmit = handleSubmit((data) => onSubmit(data, true))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      {/* Remix banner */}
      {remixedFrom && parentTitle && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <GitFork className="h-4 w-4 text-primary shrink-0" />
          <span>
            Remixing:{' '}
            <a href={ROUTES.RECIPE(remixedFrom)} className="font-medium text-primary hover:underline">
              {parentTitle}
            </a>
          </span>
        </div>
      )}

      {/* Draft banner */}
      <DraftBanner
        hasDraft={draftVisible}
        savedAt={draftSavedAt}
        onResume={handleResumeDraft}
        onDiscard={handleDiscardDraft}
      />

      <form onSubmit={handlePublish} className="space-y-8">
        {/* Cover photo */}
        <section className="space-y-2">
          <Label>Cover Photo</Label>
          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <PhotoUploader
                recipeId={recipeId}
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </section>

        <Separator />

        {/* Title */}
        <section className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Give your recipe a name…"
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
        </section>

        <Separator />

        {/* Time, servings, difficulty */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Details</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="prep_time">Prep (min)</Label>
              <Controller
                control={control}
                name="prep_time_minutes"
                render={({ field }) => (
                  <Input
                    id="prep_time"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cook_time">Cook (min)</Label>
              <Controller
                control={control}
                name="cook_time_minutes"
                render={({ field }) => (
                  <Input
                    id="cook_time"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="servings">Servings</Label>
              <Controller
                control={control}
                name="servings"
                render={({ field }) => (
                  <Input
                    id="servings"
                    type="number"
                    min={1}
                    placeholder="4"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Ingredients */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">
            Ingredients <span className="text-destructive">*</span>
          </h2>
          <Controller
            control={control}
            name="ingredients"
            render={({ field }) => (
              <IngredientsEditor
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
          {errors.ingredients && (
            <p className="text-sm text-destructive">
              {typeof errors.ingredients.message === 'string'
                ? errors.ingredients.message
                : 'At least one ingredient is required'}
            </p>
          )}
        </section>

        <Separator />

        {/* Instructions */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">
            Instructions <span className="text-destructive">*</span>
          </h2>
          <Controller
            control={control}
            name="instructions"
            render={({ field }) => (
              <InstructionsEditor
                value={(field.value ?? []) as import('@/types/recipe').RecipeItem[]}
                onChange={field.onChange}
              />
            )}
          />
          {errors.instructions && (
            <p className="text-sm text-destructive">
              {typeof errors.instructions.message === 'string'
                ? errors.instructions.message
                : 'At least one step is required'}
            </p>
          )}
        </section>

        <Separator />

        {/* Tags */}
        <section>
          <SmartTagsSection form={form} />
        </section>

        <Separator />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!existingRecipeId && (
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={handleSaveDraftSubmit}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button type="submit" disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            {submitting
              ? 'Saving…'
              : existingRecipeId
              ? 'Save Changes'
              : 'Publish'}
          </Button>
        </div>
      </form>

      {/* Preview sheet */}
      <RecipePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        values={formValues as RecipeSchema}
      />
    </div>
  )
}
