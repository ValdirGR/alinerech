import { FeaturesEditorForm } from '@/components/admin/features-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultFeaturesContent, normalizeFeaturesContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function FeaturesAdminPage() {
  const snapshot = await getSectionSnapshot('features', normalizeFeaturesContent, defaultFeaturesContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Diferenciais</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie os cards de diferenciais e os indicadores exibidos na seção de prova institucional.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Diferenciais" snapshot={snapshot} />

      <FeaturesEditorForm snapshot={snapshot} />
    </div>
  )
}