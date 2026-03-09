'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { MediaLibraryGrid } from '@/components/admin/media-library-grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import type { MediaAssetRecord } from '@/lib/content/types'

const INITIAL_PAGE_SIZE = 12
const PAGE_SIZE = 12

type MediaLibraryManagerProps = {
  initialItems: MediaAssetRecord[]
}

export function MediaLibraryManager({ initialItems }: MediaLibraryManagerProps) {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [bucketFilter, setBucketFilter] = useState<'all' | 'site-images' | 'results-images'>('all')
  const [moduleFilter, setModuleFilter] = useState<'all' | string>('all')
  const [usageFilter, setUsageFilter] = useState<'all' | 'unused' | 'draft' | 'published' | 'in-use'>('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const deferredSearch = useDeferredValue(search)

  const moduleOptions = useMemo(() => {
    const modules = Array.from(new Set(items.map((item) => item.module))).sort((left, right) =>
      left.localeCompare(right)
    )

    return modules
  }, [items])

  const filteredItems = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase()

    return items.filter((item) => {
      const matchesBucket = bucketFilter === 'all' || item.bucketName === bucketFilter
      const matchesModule = moduleFilter === 'all' || item.module === moduleFilter
      const matchesUsage =
        usageFilter === 'all' ||
        (usageFilter === 'unused' && item.usedIn.length === 0) ||
        (usageFilter === 'in-use' && item.usedIn.length > 0) ||
        (usageFilter === 'draft' && item.usedIn.some((usage) => usage.status === 'draft')) ||
        (usageFilter === 'published' && item.usedIn.some((usage) => usage.status === 'published'))
      const matchesSearch =
        !normalizedSearch ||
        item.filePath.toLowerCase().includes(normalizedSearch) ||
        item.module.toLowerCase().includes(normalizedSearch) ||
        item.publicUrl.toLowerCase().includes(normalizedSearch) ||
        (item.altText ?? '').toLowerCase().includes(normalizedSearch)

      return matchesBucket && matchesModule && matchesUsage && matchesSearch
    })
  }, [bucketFilter, deferredSearch, items, moduleFilter, usageFilter])

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE)
  }, [deferredSearch, bucketFilter, moduleFilter, usageFilter])

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  )

  const hasMoreItems = visibleItems.length < filteredItems.length

  const updateAltText = (assetId: string, altText: string) => {
    startTransition(async () => {
      setMessage(null)
      setIsError(false)

      const supabase = createClient()
      const normalizedAltText = altText.trim()
      const { error } = await supabase
        .from('media_assets')
        .update({ alt_text: normalizedAltText || null })
        .eq('id', assetId)

      if (error) {
        setIsError(true)
        setMessage(error.message)
        return
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === assetId
            ? {
                ...item,
                altText: normalizedAltText || null,
              }
            : item
        )
      )

      setMessage('Alt text atualizado com sucesso.')
    })
  }

  const deleteAsset = (asset: MediaAssetRecord) => {
    if (asset.usedIn.length > 0) {
      setIsError(true)
      setMessage(
        `A mídia está em uso: ${asset.usedIn.map((usage) => usage.label).join(', ')}. Remova a referência antes de excluir.`
      )
      return
    }

    const confirmed = window.confirm('Excluir esta mídia da biblioteca e do storage?')

    if (!confirmed) {
      return
    }

    startTransition(async () => {
      setMessage(null)
      setIsError(false)

      const supabase = createClient()

      const { error: storageError } = await supabase.storage.from(asset.bucketName).remove([asset.filePath])

      if (storageError) {
        setIsError(true)
        setMessage(storageError.message)
        return
      }

      const { error: dbError } = await supabase.from('media_assets').delete().eq('id', asset.id)

      if (dbError) {
        setIsError(true)
        setMessage(dbError.message)
        return
      }

      setItems((currentItems) => currentItems.filter((item) => item.id !== asset.id))
      setMessage('Mídia excluída com sucesso.')
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total de mídias</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">{items.length}</p>
          <p className="mt-1 text-sm text-gray-500">Arquivos registrados em media_assets.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Site Images</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
            {items.filter((item) => item.bucketName === 'site-images').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Imagens gerais do site.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Results Images</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
            {items.filter((item) => item.bucketName === 'results-images').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Imagens da galeria de resultados.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Mídias em uso</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
            {items.filter((item) => item.usedIn.length > 0).length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Com referência em rascunho ou publicado.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="mediaSearch">Buscar</Label>
            <Input
              id="mediaSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Arquivo, módulo ou alt"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaBucket">Bucket</Label>
            <select
              id="mediaBucket"
              value={bucketFilter}
              onChange={(event) => setBucketFilter(event.target.value as typeof bucketFilter)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >
              <option value="all">Todos</option>
              <option value="site-images">site-images</option>
              <option value="results-images">results-images</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaModule">Módulo</Label>
            <select
              id="mediaModule"
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >
              <option value="all">Todos</option>
              {moduleOptions.map((moduleItem) => (
                <option key={moduleItem} value={moduleItem}>
                  {moduleItem}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaUsage">Uso</Label>
            <select
              id="mediaUsage"
              value={usageFilter}
              onChange={(event) => setUsageFilter(event.target.value as typeof usageFilter)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >
              <option value="all">Todos</option>
              <option value="in-use">Em uso</option>
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
              <option value="unused">Sem uso</option>
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Mostrando {visibleItems.length} de {filteredItems.length} mídia(s) com os filtros atuais.
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            isError
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message}
        </div>
      ) : null}

      <MediaLibraryGrid
        items={visibleItems}
        showAltText
        actionSlot={(asset) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`alt-${asset.id}`}>Alt text</Label>
              <Input
                id={`alt-${asset.id}`}
                defaultValue={asset.altText ?? ''}
                placeholder="Descreva a imagem"
                onBlur={(event) => updateAltText(asset.id, event.target.value)}
                disabled={isPending}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              disabled={isPending || asset.usedIn.length > 0}
              onClick={() => deleteAsset(asset)}
            >
              <Trash2 className="h-4 w-4" />
              {asset.usedIn.length > 0 ? 'Mídia em uso' : 'Excluir mídia'}
            </Button>
          </div>
        )}
      />

      {hasMoreItems ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleCount((currentCount) => currentCount + PAGE_SIZE)}
          >
            Carregar mais 12 imagens
          </Button>
        </div>
      ) : null}
    </div>
  )
}