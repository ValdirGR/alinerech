import { HeaderEditorForm } from '@/components/admin/header-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultHeaderContent, normalizeHeaderContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function HeaderAdminPage() {
  const snapshot = await getSectionSnapshot('header', normalizeHeaderContent, defaultHeaderContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Header</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie a logo, o menu principal e o CTA do topo do site.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Header" snapshot={snapshot} />

      <HeaderEditorForm snapshot={snapshot} />
    </div>
  )
}