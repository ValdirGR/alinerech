'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'
import { MediaLibraryGrid } from '@/components/admin/media-library-grid'
import type { MediaAssetRecord } from '@/lib/content/types'

type MediaLibraryBrowserProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bucketName: 'site-images' | 'results-images'
  selectedUrl: string | null
  onSelect: (asset: MediaAssetRecord) => void
}

export function MediaLibraryBrowser({
  open,
  onOpenChange,
  bucketName,
  selectedUrl,
  onSelect,
}: MediaLibraryBrowserProps) {
  const [items, setItems] = useState<MediaAssetRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    let isMounted = true
    const supabase = createClient()

    const loadItems = async () => {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('media_assets')
        .select('id, module, bucket_name, file_path, public_url, alt_text, created_at')
        .eq('bucket_name', bucketName)
        .order('created_at', { ascending: false })

      if (!isMounted) {
        return
      }

      if (error) {
        setItems([])
        setIsLoading(false)
        return
      }

      setItems(
        (data ?? []).map((item) => ({
          id: item.id,
          module: item.module,
          bucketName: item.bucket_name,
          filePath: item.file_path,
          publicUrl: item.public_url,
          altText: item.alt_text,
          createdAt: item.created_at,
        }))
      )
      setIsLoading(false)
    }

    void loadItems()

    return () => {
      isMounted = false
    }
  }, [bucketName, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Biblioteca de mídia</DialogTitle>
          <DialogDescription>
            Escolha uma imagem já enviada para o bucket {bucketName}.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-1">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              Carregando imagens...
            </div>
          ) : (
            <MediaLibraryGrid
              items={items}
              selectable
              selectedUrl={selectedUrl}
              onSelect={(asset) => {
                onSelect(asset)
                onOpenChange(false)
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}