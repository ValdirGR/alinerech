import { ServicesEditorForm } from '@/components/admin/services-editor-form'
import { defaultServicesContent, normalizeServicesContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function ServicesAdminPage() {
  const snapshot = await getSectionSnapshot('services', normalizeServicesContent, defaultServicesContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Serviços</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o cabeçalho da seção, o tratamento principal, a lista de benefícios e o conteúdo expandido.
        </p>
      </div>

      <ServicesEditorForm snapshot={snapshot} />
    </div>
  )
}