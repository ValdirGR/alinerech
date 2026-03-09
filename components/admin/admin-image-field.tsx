'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { ImagePlus, Images, Loader2, Upload } from 'lucide-react'
import { MediaLibraryBrowser } from '@/components/admin/media-library-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

type AdminImageFieldProps = {
  name: string
  label: string
  bucketName: 'site-images' | 'results-images'
  module: string
  defaultValue: string
  helperText?: string
}

const sanitizeFileName = (fileName: string) => fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')

export function AdminImageField({
  name,
  label,
  bucketName,
  module,
  defaultValue,
  helperText,
}: AdminImageFieldProps) {
  const [value, setValue] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)
    setMessage(null)
    setIsError(false)

    try {
      const supabase = createClient()
      const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
      const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ''))
      const filePath = `${module}/${Date.now()}-${safeName}.${extension}`

      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: insertError } = await supabase.from('media_assets').insert({
        module,
        bucket_name: bucketName,
        file_path: filePath,
        public_url: publicUrl,
      })

      if (insertError) {
        console.error('Failed to register media asset:', insertError.message)
      }

      setValue(publicUrl)
      setMessage('Imagem enviada com sucesso.')
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : 'Falha ao enviar imagem.')
    } finally {
      setIsUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} value={value} onChange={(event) => setValue(event.target.value)} />
      </div>

      {helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        {value ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={value} alt={label} className="h-40 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400">
            <ImagePlus className="h-8 w-8" />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`${name}-upload`}
          />
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()}>
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? 'Enviando...' : 'Enviar imagem'}
          </Button>
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => setIsLibraryOpen(true)}>
            <Images className="h-4 w-4" />
            Escolher da biblioteca
          </Button>
          <span className="text-xs text-gray-500">Bucket: {bucketName}</span>
        </div>

        {message ? (
          <div
            className={`rounded-lg border px-3 py-2 text-xs ${
              isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message}
          </div>
        ) : null}
      </div>

      <MediaLibraryBrowser
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        bucketName={bucketName}
        selectedUrl={value}
        onSelect={(asset) => {
          setValue(asset.publicUrl)
          setMessage('Imagem selecionada da biblioteca.')
          setIsError(false)
        }}
      />
    </div>
  )
}