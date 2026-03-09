import type { ReactNode } from 'react'
import type { MediaAssetRecord } from '@/lib/content/types'

type MediaLibraryGridProps = {
  items: MediaAssetRecord[]
  selectable?: boolean
  selectedUrl?: string | null
  onSelect?: (asset: MediaAssetRecord) => void
  showAltText?: boolean
  actionSlot?: (asset: MediaAssetRecord) => ReactNode
}

export function MediaLibraryGrid({
  items,
  selectable = false,
  selectedUrl = null,
  onSelect,
  showAltText = false,
  actionSlot,
}: MediaLibraryGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        Nenhuma imagem registrada ainda.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const isSelected = selectedUrl === item.publicUrl

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item)}
            className={`overflow-hidden rounded-xl border text-left transition-colors ${
              selectable
                ? isSelected
                  ? 'border-[#0B3D4C] bg-[#F3FAFC]'
                  : 'border-gray-200 bg-white hover:border-[#C9A962]'
                : 'border-gray-200 bg-white'
            }`}
            disabled={!selectable}
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={item.publicUrl} alt={item.altText ?? item.module} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                  {item.module}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">{item.bucketName}</span>
              </div>
              <p className="line-clamp-2 text-sm font-medium text-[#0B3D4C]">{item.filePath}</p>
              {showAltText ? (
                <p className="line-clamp-2 text-xs text-gray-500">
                  Alt: {item.altText?.trim() ? item.altText : 'não definido'}
                </p>
              ) : null}
              {item.usedIn.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {item.usedIn.map((usage) => (
                    <span
                      key={usage}
                      className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700"
                    >
                      Em uso: {usage}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString('pt-BR')}
              </p>
              {actionSlot ? <div className="pt-1">{actionSlot(item)}</div> : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}