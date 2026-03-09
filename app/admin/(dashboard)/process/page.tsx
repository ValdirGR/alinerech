import { ProcessEditorForm } from '@/components/admin/process-editor-form'
import { defaultProcessContent, normalizeProcessContent } from '@/lib/content/defaults'
import { getSectionSnapshot } from '@/lib/content/server'

export default async function ProcessAdminPage() {
  const snapshot = await getSectionSnapshot('process', normalizeProcessContent, defaultProcessContent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Como Funciona</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Gerencie o cabeçalho, o procedimento principal, as quatro etapas e o CTA final da seção.
        </p>
      </div>

      <ProcessEditorForm snapshot={snapshot} />
    </div>
  )
}