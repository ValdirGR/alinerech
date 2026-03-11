import { ServicesEditorForm } from '@/components/admin/services-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultServicesContent, normalizeServicesContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function ServicesAdminPage() {
  const snapshot = await getSectionSnapshot('services', normalizeServicesContent, defaultServicesContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Serviços</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o cabeçalho da seção, o bloco de texto destacado, o conteúdo do card, a lista de benefícios e a área expandida.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Serviços" snapshot={snapshot} />

      <ServicesEditorForm snapshot={snapshot} />
    </div>
  )
}