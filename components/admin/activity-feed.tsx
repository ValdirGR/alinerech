"use client"

import { useDeferredValue, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SectionActivityRecord } from '@/lib/content/types'

type ActivityFeedProps = {
  items: SectionActivityRecord[]
  compact?: boolean
  enableFilters?: boolean
}

const ALL_FILTER_VALUE = '__all__'

export function ActivityFeed({
  items,
  compact = false,
  enableFilters = false,
}: ActivityFeedProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionFilter, setSectionFilter] = useState(ALL_FILTER_VALUE)
  const [actionFilter, setActionFilter] = useState(ALL_FILTER_VALUE)
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const normalizedSearchTerm = deferredSearchTerm.trim().toLocaleLowerCase('pt-BR')
  const sectionOptions = Array.from(new Map(items.map((item) => [item.sectionKey, item.sectionLabel])).entries())
  const filteredItems = items.filter((item) => {
    if (sectionFilter !== ALL_FILTER_VALUE && item.sectionKey !== sectionFilter) {
      return false
    }

    if (actionFilter !== ALL_FILTER_VALUE && item.action !== actionFilter) {
      return false
    }

    if (!normalizedSearchTerm) {
      return true
    }

    const searchableContent = [
      item.actorName,
      item.sectionLabel,
      item.actionLabel,
      `versao ${item.version}`,
      new Date(item.occurredAt).toLocaleString('pt-BR'),
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR')

    return searchableContent.includes(normalizedSearchTerm)
  })

  const publishedCount = filteredItems.filter((item) => item.action === 'published').length
  const draftCount = filteredItems.length - publishedCount

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
        Nenhuma atividade editorial registrada ainda.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {enableFilters ? (
        <div className="rounded-2xl border border-gray-200 bg-[#FFFCF4] p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr),220px,220px,auto]">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por módulo, ação, responsável ou versão"
              className="bg-white"
            />

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos os módulos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Todos os módulos</SelectItem>
                {sectionOptions.map(([sectionKey, sectionLabel]) => (
                  <SelectItem key={sectionKey} value={sectionKey}>
                    {sectionLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todas as ações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Todas as ações</SelectItem>
                <SelectItem value="draft_saved">Rascunhos salvos</SelectItem>
                <SelectItem value="published">Publicações</SelectItem>
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSectionFilter(ALL_FILTER_VALUE)
                setActionFilter(ALL_FILTER_VALUE)
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-[#0B3D4C] transition-colors hover:border-[#C9A962] hover:bg-white"
            >
              Limpar filtros
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-gray-600">
              {filteredItems.length} registro(s)
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
              {publishedCount} publicação(ões)
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
              {draftCount} rascunho(s)
            </span>
          </div>
        </div>
      ) : null}

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
          Nenhum registro corresponde aos filtros aplicados.
        </div>
      ) : null}

      {filteredItems.map((item) => (
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