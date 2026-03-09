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
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Entradas recentes</h2>
            <p className="text-sm text-gray-500">Cada envio é salvo com status inicial "novo".</p>
          </div>
          <span className="rounded-full bg-[#0B3D4C] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {leads.length} registros
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="p-10 text-sm text-gray-500">
            Nenhum lead encontrado ainda. Depois que a migration for aplicada e o formulário começar a salvar,
            os contatos aparecerão aqui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Mensagem</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Recebido em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 font-medium text-[#0B3D4C]">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.email || 'Não informado'}</td>
                    <td className="max-w-xs px-6 py-4 text-gray-600">
                      <span className="line-clamp-2">{lead.message || 'Sem mensagem adicional'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(lead.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}