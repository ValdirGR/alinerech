import { FooterEditorForm } from '@/components/admin/footer-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultFooterContent, normalizeFooterContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function FooterAdminPage() {
  const snapshot = await getSectionSnapshot('footer', normalizeFooterContent, defaultFooterContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Footer</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie a identidade, os links, o contato e os textos finais do rodapé.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Footer" snapshot={snapshot} />

      <FooterEditorForm snapshot={snapshot} />
    </div>
  )
}