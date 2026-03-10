import { MythsEditorForm } from '@/components/admin/myths-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultMythsContent, normalizeMythsContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function MythsAdminPage() {
  const snapshot = await getSectionSnapshot('myths', normalizeMythsContent, defaultMythsContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Mito ou Verdade</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie os cards de objeções e verdades sobre facetas e implantes exibidos na home.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Mito ou Verdade" snapshot={snapshot} />

      <MythsEditorForm snapshot={snapshot} />
    </div>
  )
}