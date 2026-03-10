import Link from 'next/link'
import type { SectionActivityRecord } from '@/lib/content/types'

type ActivityFeedProps = {
  items: SectionActivityRecord[]
  compact?: boolean
}

export function ActivityFeed({ items, compact = false }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
        Nenhuma atividade editorial registrada ainda.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-1 font-semibold uppercase tracking-wide ${
                  item.action === 'published'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.actionLabel}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-wide text-gray-600">
                  {item.sectionLabel}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-wide text-gray-500">
                  Versão {item.version}
                </span>
                {!item.isCurrent ? (
                  <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-wide text-gray-500">
                    Histórico
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-[#0B3D4C]">
                <span className="font-semibold">{item.actorName}</span> em{' '}
                {new Date(item.occurredAt).toLocaleString('pt-BR')}
              </p>
            </div>

            {!compact ? (
              <Link
                href={`/admin/${item.sectionKey}`}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-[#0B3D4C] transition-colors hover:border-[#C9A962] hover:bg-[#FFFCF4]"
              >
                Abrir módulo
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}