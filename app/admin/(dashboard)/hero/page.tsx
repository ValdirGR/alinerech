import { HeroEditorForm } from '@/components/admin/hero-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultHeroContent, normalizeHeroContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function HeroAdminPage() {
  const snapshot = await getSectionSnapshot('hero', normalizeHeroContent, defaultHeroContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Hero</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o topo do site com fluxo de rascunho e publicação. O site público só utiliza a versão publicada.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Hero" snapshot={snapshot} />

      <HeroEditorForm snapshot={snapshot} />
    </div>
  )
}