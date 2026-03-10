import { AboutEditorForm } from '@/components/admin/about-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultAboutContent, normalizeAboutContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function AboutAdminPage() {
  const snapshot = await getSectionSnapshot('about', normalizeAboutContent, defaultAboutContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Sobre</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie a apresentação institucional, os diferenciais e a imagem principal com fluxo de rascunho e publicação.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Sobre" snapshot={snapshot} />

      <AboutEditorForm snapshot={snapshot} />
    </div>
  )
}