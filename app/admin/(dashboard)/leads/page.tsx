import { LeadsTable } from '@/components/admin/leads-table'
import { getLeads } from '@/lib/content/server'

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Leads</h1>
        <p className="mt-2 text-gray-500">
          Lista dos contatos capturados pelo formulário público do site.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}