'use client'

import { useRef, useState, useCallback } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ImagePlus, X, Upload } from 'lucide-react'
import Image from 'next/image'
import { getRecipePhotoUrl } from '@/lib/utils/image'

interface PhotoUploaderProps {
  recipeId: string
  value: string[]
  onChange: (photos: string[]) => void
}

export function PhotoUploader({ recipeId, value, onChange }: PhotoUploaderProps) {
  const { supabase, user } = useSupabase()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(
    async (file: File) => {
      if (!user) {
        setError('You must be signed in to upload photos.')
        return
      }

      const ext = file.name.split('.').pop() ?? 'jpg'
      const filename = `${Date.now()}.${ext}`
      const path = `${user.id}/${recipeId}/${filename}`

      setUploading(true)
      setProgress(0)
      setError(null)

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 85))
      }, 200)

      const { error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(path, file, { upsert: false })

      clearInterval(progressInterval)

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        setProgress(0)
        return
      }

      setProgress(100)
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 400)

      onChange([...value, path])
    },
    [supabase, user, recipeId, value, onChange]
  )

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      // For now upload first selected file (can extend to multi)
      await uploadFile(files[0])
    },
    [uploadFile]
  )

  const handleRemove = async (path: string) => {
    await supabase.storage.from('recipe-photos').remove([path])
    onChange(value.filter((p) => p !== path))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const primaryPhoto = value[0] ?? null
  const photoUrl = primaryPhoto ? getRecipePhotoUrl(primaryPhoto) : null

  return (
    <div className="space-y-3">
      {photoUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted group">
          <Image
            src={photoUrl}
            alt="Recipe cover photo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <button
            type="button"
            onClick={() => handleRemove(primaryPhoto!)}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-3 w-full aspect-video rounded-lg border-2 border-dashed
            cursor-pointer transition-colors select-none
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-10 w-10" />
            <div className="text-center">
              <p className="text-sm font-medium">Add a cover photo</p>
              <p className="text-xs mt-0.5">Drag &amp; drop or click to browse</p>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Uploading…</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!photoUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Choose photo
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
