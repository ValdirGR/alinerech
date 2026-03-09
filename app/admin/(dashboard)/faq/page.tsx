import { FaqEditorForm } from '@/components/admin/faq-editor-form'
import { defaultFaqContent, normalizeFaqContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function FaqAdminPage() {
  const snapshot = await getSectionSnapshot('faq', normalizeFaqContent, defaultFaqContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">FAQ</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie a abertura da seção, as perguntas frequentes e o CTA final para WhatsApp.
        </p>
      </div>

      <FaqEditorForm snapshot={snapshot} />
    </div>
  )
}