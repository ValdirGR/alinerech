import type { AdminModuleDefinition, DashboardModuleSummary } from '@/lib/content/types'

type ModulePlaceholderProps = {
  moduleItem: AdminModuleDefinition | DashboardModuleSummary
}

export function ModulePlaceholder({ moduleItem }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">{moduleItem.label}</h1>
        <p className="mt-2 max-w-2xl text-gray-500">{moduleItem.description}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-[#C9A962] bg-[#FFF8E8] p-8">
        <h2 className="text-lg font-semibold text-[#0B3D4C]">Módulo em preparação</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A6B2F]">
          A fundação do CMS já está sendo criada. Este módulo ainda não recebeu o formulário de edição,
          mas já está previsto no fluxo de rascunho/publicação e na navegação do painel.
        </p>
      </div>
    </div>
  )
}