import { TestimonialsEditorForm } from '@/components/admin/testimonials-editor-form'
import { defaultTestimonialsContent, normalizeTestimonialsContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function TestimonialsAdminPage() {
  const snapshot = await getSectionSnapshot(
    'testimonials',
    normalizeTestimonialsContent,
    defaultTestimonialsContent
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Depoimentos</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o carrossel de prova social, as imagens dos pacientes e os selos de confiança da seção.
        </p>
      </div>

      <TestimonialsEditorForm snapshot={snapshot} />
    </div>
  )
}