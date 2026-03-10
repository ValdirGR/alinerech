import type { SectionSnapshot } from '@/lib/content/types'

type SectionSnapshotPreviewProps<TContent> = {
  sectionLabel: string
  snapshot: SectionSnapshot<TContent>
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return 'Não disponível'
  }

  return new Date(value).toLocaleString('pt-BR')
}

const formatContent = (value: unknown) => JSON.stringify(value, null, 2)

export function SectionSnapshotPreview<TContent>({
  sectionLabel,
  snapshot,
}: SectionSnapshotPreviewProps<TContent>) {
  return (
    <section className="rounded-2xl border border-[#C9A962]/30 bg-[#FFFCF4] shadow-sm">
      <div className="border-b border-[#C9A962]/20 px-6 py-5">
        <h2 className="text-lg font-semibold text-[#0B3D4C]">Comparativo de versões</h2>
        <p className="mt-1 text-sm text-[#8A6B2F]">
          Confira lado a lado o conteúdo de {sectionLabel} antes de publicar novas alterações.
        </p>
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

          <div className="max-h-[28rem] overflow-auto p-4">
            {snapshot.draft ? (
              <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-[#0B3D4C]">
                {formatContent(snapshot.draft.content)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">Salve um rascunho para visualizar o comparativo.</p>
            )}
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

          <div className="max-h-[28rem] overflow-auto p-4">
            {snapshot.published ? (
              <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-[#0B3D4C]">
                {formatContent(snapshot.published.content)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">Ainda não existe uma versão publicada para este módulo.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}