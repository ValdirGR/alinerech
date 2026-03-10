import { ContactEditorForm } from '@/components/admin/contact-editor-form'
import { SectionSnapshotPreview } from '@/components/admin/section-snapshot-preview'
import { defaultContactContent, normalizeContactContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function ContactAdminPage() {
  const snapshot = await getSectionSnapshot('contact', normalizeContactContent, defaultContactContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Contato</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie CTA, informações de contato e os textos do formulário com fluxo de rascunho e publicação.
        </p>
      </div>

      <SectionSnapshotPreview sectionLabel="Contato" snapshot={snapshot} />

      <ContactEditorForm snapshot={snapshot} />
    </div>
  )
}