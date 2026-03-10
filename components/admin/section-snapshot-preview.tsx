import type { SectionSnapshot } from '@/lib/content/types'

type SectionSnapshotPreviewProps<TContent> = {
  sectionLabel: string
  snapshot: SectionSnapshot<TContent>
}

type DiffRow = {
  path: string
  label: string
  draftValue: string
  publishedValue: string
  state: 'changed' | 'added' | 'removed' | 'same'
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return 'Não disponível'
  }

  return new Date(value).toLocaleString('pt-BR')
}

const EMPTY_VALUE_LABEL = 'Nao definido'

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const formatPathLabel = (path: string) =>
  path
    .replace(/\[(\d+)\]/g, ' $1')
    .replace(/\./g, ' / ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const stringifyLeafValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE_LABEL
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Nao'
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}

const flattenContent = (value: unknown, basePath = ''): Array<{ path: string; value: string }> => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [{ path: basePath || 'conteudo', value: 'Lista vazia' }]
    }

    return value.flatMap((entry, index) => flattenContent(entry, `${basePath}[${index}]`))
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value)

    if (entries.length === 0) {
      return [{ path: basePath || 'conteudo', value: 'Objeto vazio' }]
    }

    return entries.flatMap(([key, nestedValue]) =>
      flattenContent(nestedValue, basePath ? `${basePath}.${key}` : key),
    )
  }

  return [{ path: basePath || 'conteudo', value: stringifyLeafValue(value) }]
}

const buildDiffRows = (draftContent: unknown, publishedContent: unknown): DiffRow[] => {
  const draftEntries = new Map(flattenContent(draftContent).map((entry) => [entry.path, entry.value]))
  const publishedEntries = new Map(flattenContent(publishedContent).map((entry) => [entry.path, entry.value]))
  const allPaths = Array.from(
    new Set([...Array.from(draftEntries.keys()), ...Array.from(publishedEntries.keys())]),
  ).sort((left, right) => left.localeCompare(right, 'pt-BR'))

  return allPaths.map((path) => {
    const draftValue = draftEntries.get(path) ?? EMPTY_VALUE_LABEL
    const publishedValue = publishedEntries.get(path) ?? EMPTY_VALUE_LABEL

    let state: DiffRow['state'] = 'same'

    if (!publishedEntries.has(path) && draftEntries.has(path)) {
      state = 'added'
    } else if (!draftEntries.has(path) && publishedEntries.has(path)) {
      state = 'removed'
    } else if (draftValue !== publishedValue) {
      state = 'changed'
    }

    return {
      path,
      label: formatPathLabel(path),
      draftValue,
      publishedValue,
      state,
    }
  })
}

const getStateBadgeClassName = (state: DiffRow['state']) => {
  switch (state) {
    case 'added':
      return 'bg-sky-100 text-sky-700'
    case 'removed':
      return 'bg-rose-100 text-rose-700'
    case 'changed':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getStateLabel = (state: DiffRow['state']) => {
  switch (state) {
    case 'added':
      return 'Novo no rascunho'
    case 'removed':
      return 'Removido no rascunho'
    case 'changed':
      return 'Alterado'
    default:
      return 'Sem mudanca'
  }
}

export function SectionSnapshotPreview<TContent>({
  sectionLabel,
  snapshot,
}: SectionSnapshotPreviewProps<TContent>) {
  const diffRows = buildDiffRows(snapshot.draft?.content ?? snapshot.current, snapshot.published?.content ?? snapshot.current)
  const changedRows = diffRows.filter((row) => row.state !== 'same')
  const unchangedRowsCount = diffRows.length - changedRows.length

  return (
    <section className="rounded-2xl border border-[#C9A962]/30 bg-[#FFFCF4] shadow-sm">
      <div className="border-b border-[#C9A962]/20 px-6 py-5">
        <h2 className="text-lg font-semibold text-[#0B3D4C]">Comparativo de versões</h2>
        <p className="mt-1 text-sm text-[#8A6B2F]">
          Confira lado a lado o conteúdo de {sectionLabel} antes de publicar novas alterações.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-gray-600">
            {diffRows.length} campo(s) mapeado(s)
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
            {changedRows.filter((row) => row.state === 'changed').length} alterado(s)
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-700">
            {changedRows.filter((row) => row.state === 'added').length} novo(s)
          </span>
          <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">
            {changedRows.filter((row) => row.state === 'removed').length} removido(s)
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
            {unchangedRowsCount} sem mudanca
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-amber-200 bg-white">
          <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-amber-100 px-2 py-1 font-semibold uppercase tracking-wide text-amber-700">
                Rascunho
              </span>
              <span className="rounded-full bg-white px-2 py-1 font-semibold uppercase tracking-wide text-amber-700">
                {snapshot.draft ? `Versão ${snapshot.draft.version}` : 'Sem rascunho'}
              </span>
            </div>
            <p className="mt-2 text-xs text-amber-700">
              {snapshot.draft
                ? `Atualizado em ${formatDateTime(snapshot.draft.updatedAt)}`
                : 'Nenhuma alteração em rascunho no momento.'}
            </p>
          </div>

          <div className="p-4 text-sm text-[#0B3D4C]">
            {snapshot.draft ? 'Versao em edicao pronta para revisao.' : 'Salve um rascunho para iniciar o comparativo detalhado.'}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white">
          <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold uppercase tracking-wide text-emerald-700">
                Publicado
              </span>
              <span className="rounded-full bg-white px-2 py-1 font-semibold uppercase tracking-wide text-emerald-700">
                {snapshot.published ? `Versão ${snapshot.published.version}` : 'Sem publicação'}
              </span>
            </div>
            <p className="mt-2 text-xs text-emerald-700">
              {snapshot.published
                ? `Publicado em ${formatDateTime(snapshot.published.publishedAt)}`
                : 'O site ainda usa o fallback definido no código.'}
            </p>
          </div>

          <div className="p-4 text-sm text-[#0B3D4C]">
            {snapshot.published ? 'Versao atualmente visivel no site.' : 'Ainda nao existe uma versao publicada para este modulo.'}
          </div>
        </div>
      </div>

      <div className="border-t border-[#C9A962]/20 px-6 py-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0B3D4C]">Diferencas detectadas</h3>
            <p className="text-sm text-gray-500">
              Campos com alteracao entre o rascunho atual e a versao publicada.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">
            {changedRows.length === 0 ? 'Nenhuma diferenca encontrada' : `${changedRows.length} diferenca(s)`}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {changedRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
              O rascunho e a publicacao atual estao alinhados neste momento.
            </div>
          ) : (
            changedRows.map((row) => (
              <div key={row.path} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-[#0B3D4C]">{row.label}</p>
                    <p className="text-xs text-gray-500">{row.path}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStateBadgeClassName(row.state)}`}>
                    {getStateLabel(row.state)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Rascunho</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#0B3D4C]">{row.draftValue}</p>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Publicado</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#0B3D4C]">{row.publishedValue}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}