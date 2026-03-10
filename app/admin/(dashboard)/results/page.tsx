import { ResultsEditorForm } from '@/components/admin/results-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultResultsContent, normalizeResultsContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function ResultsAdminPage() {
  const snapshot = await getSectionSnapshot('results', normalizeResultsContent, defaultResultsContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Resultados</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o cabeçalho da galeria e as nove imagens exibidas na seção de resultados.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Resultados" snapshot={snapshot} />

      <ResultsEditorForm snapshot={snapshot} />
    </div>
  )
}