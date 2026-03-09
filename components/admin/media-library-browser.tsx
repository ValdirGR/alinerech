'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { MediaLibraryGrid } from '@/components/admin/media-library-grid'
import type { MediaAssetRecord } from '@/lib/content/types'

const INITIAL_PAGE_SIZE = 12
const PAGE_SIZE = 12

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
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE)
  const deferredSearch = useDeferredValue(search)

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
          usedIn: [],
        }))
      )
      setVisibleCount(INITIAL_PAGE_SIZE)
      setIsLoading(false)
    }

    void loadItems()

    return () => {
      isMounted = false
    }
  }, [bucketName, open])

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE)
  }, [deferredSearch])

  const filteredItems = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return items
    }

    return items.filter((item) => {
      return (
        item.filePath.toLowerCase().includes(normalizedSearch) ||
        item.module.toLowerCase().includes(normalizedSearch) ||
        item.publicUrl.toLowerCase().includes(normalizedSearch) ||
        (item.altText ?? '').toLowerCase().includes(normalizedSearch)
      )
    })
  }, [deferredSearch, items])

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  )

  const hasMoreItems = visibleItems.length < filteredItems.length

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
          <div className="mb-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por arquivo, módulo ou alt"
            />
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              Carregando imagens...
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Mostrando {visibleItems.length} de {filteredItems.length} imagem(ns).
              </p>

              <MediaLibraryGrid
                items={visibleItems}
                selectable
                selectedUrl={selectedUrl}
                onSelect={(asset) => {
                  onSelect(asset)
                  onOpenChange(false)
                }}
              />

              {hasMoreItems ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((currentCount) => currentCount + PAGE_SIZE)}
                    className="rounded-md border border-input px-4 py-2 text-sm font-medium text-[#0B3D4C] transition-colors hover:bg-gray-50"
                  >
                    Carregar mais 12 imagens
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}