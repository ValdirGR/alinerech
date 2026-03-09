import Link from 'next/link'
import { getDashboardModuleSummaries, getLeads } from '@/lib/content/server'

export default async function AdminDashboardPage() {
    const [modules, leads] = await Promise.all([getDashboardModuleSummaries(), getLeads()])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#0B3D4C]">Visão Geral</h1>
                <p className="mt-2 text-gray-500">
                    Gerencie rascunhos, publicações e acompanhe os leads capturados pelo site.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">Módulos do site</h3>
                    <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">{modules.length}</p>
                    <p className="mt-1 text-sm text-gray-500">Estrutura preparada para edição modular.</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">Leads recebidos</h3>
                    <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">{leads.length}</p>
                    <p className="mt-1 text-sm text-gray-500">Contatos salvos pelo formulário público.</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">Fluxo editorial</h3>
                    <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
                        {modules.filter((moduleItem) => moduleItem.hasDraft).length}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Módulos com rascunho pendente.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-[#C9A962]/30 bg-[#FFFCF4] p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0B3D4C]">Biblioteca de mídia</h2>
                        <p className="mt-1 text-sm text-[#8A6B2F]">
                            Imagens enviadas agora podem ser reutilizadas nos formulários do painel.
                        </p>
                    </div>
                    <Link
                        href="/admin/gallery"
                        className="inline-flex items-center justify-center rounded-full bg-[#0B3D4C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#155A6E]"
                    >
                        Abrir Galeria
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0B3D4C]">Status por módulo</h2>
                        <p className="text-sm text-gray-500">Rascunhos e publicações atualmente carregados no CMS.</p>
                    </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                    {modules.map((moduleItem) => (
                        <Link
                            key={moduleItem.key}
                            href={`/admin/${moduleItem.key}`}
                            className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-[#C9A962] hover:bg-[#FFFCF4]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-[#0B3D4C]">{moduleItem.label}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{moduleItem.description}</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                    {moduleItem.implemented ? 'Ativo' : 'Planejado'}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                <span className={`rounded-full px-2 py-1 ${moduleItem.hasPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {moduleItem.hasPublished ? 'Publicado' : 'Sem publicação'}
                                </span>
                                <span className={`rounded-full px-2 py-1 ${moduleItem.hasDraft ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {moduleItem.hasDraft ? 'Com rascunho' : 'Sem rascunho'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}