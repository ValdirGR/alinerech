import type { MediaAssetRecord } from '@/lib/content/types'

type MediaLibraryGridProps = {
  items: MediaAssetRecord[]
  selectable?: boolean
  selectedUrl?: string | null
  onSelect?: (asset: MediaAssetRecord) => void
}

export function MediaLibraryGrid({
  items,
  selectable = false,
  selectedUrl = null,
  onSelect,
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
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}