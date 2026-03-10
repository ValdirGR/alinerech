import { redirect } from 'next/navigation'
import { Download, HardDriveDownload, ImageIcon, ShieldCheck } from 'lucide-react'
import { getAdminProfile } from '@/lib/content/server'

const backupCards = [
  {
    title: 'Backup completo',
    description: 'Exporta tabelas do CMS, leads, perfis administrativos e todos os arquivos dos buckets do site.',
    scope: 'full',
    accent: 'border-[#0B3D4C]/20 bg-[#F5FAFB] text-[#0B3D4C]',
    icon: HardDriveDownload,
  },
  {
    title: 'Apenas banco',
    description: 'Gera um ZIP com os dados estruturados do painel: conteúdo, mídia, perfis e leads.',
    scope: 'database',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: ShieldCheck,
  },
  {
    title: 'Apenas storage',
    description: 'Baixa os arquivos atuais dos buckets site-images e results-images com um manifesto de objetos.',
    scope: 'storage',
    accent: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: ImageIcon,
  },
] as const

export default async function AdminBackupsPage() {
  const profile = await getAdminProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/admin')
  }

  const isConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Backups manuais</h1>
        <p className="mt-2 max-w-3xl text-gray-500">
          Gere um backup operacional sob demanda diretamente do painel. A exportação roda no servidor,
          exige perfil <span className="font-semibold text-[#0B3D4C]">admin</span> e faz o download em ZIP para a máquina local.
        </p>
      </div>

      <div className="rounded-2xl border border-[#C9A962]/30 bg-[#FFFCF4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0B3D4C]">Escopo desta etapa</h2>
        <p className="mt-2 text-sm text-[#8A6B2F]">
          Esta versão cobre apenas backup manual e operacional pelo /admin. Não há agendamento automático,
          retenção histórica nem restauração assistida nesta etapa.
        </p>
      </div>

      {!isConfigured ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-900">Configuração pendente</h2>
          <p className="mt-2 text-sm text-red-700">
            Defina a variável <span className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</span> no ambiente do servidor para liberar a exportação.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        {backupCards.map((card) => (
          <div key={card.scope} className={`rounded-2xl border p-6 shadow-sm ${card.accent}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="mt-2 text-sm opacity-80">{card.description}</p>
              </div>
              <card.icon className="h-5 w-5 shrink-0" />
            </div>

            <div className="mt-6">
              <a
                href={isConfigured ? `/admin/backups/download?scope=${card.scope}` : '/admin/backups'}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                  isConfigured
                    ? 'bg-[#0B3D4C] text-white hover:bg-[#155A6E]'
                    : 'cursor-not-allowed bg-gray-300 text-gray-600'
                }`}
                aria-disabled={!isConfigured}
              >
                <Download className="h-4 w-4" />
                Baixar ZIP
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0B3D4C]">O que entra no arquivo</h2>
        <div className="mt-3 grid gap-4 text-sm text-gray-600 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-medium text-[#0B3D4C]">Banco</p>
            <p className="mt-1">site_sections, media_assets, admin_profiles e leads em JSON/CSV.</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-medium text-[#0B3D4C]">Storage</p>
            <p className="mt-1">Todos os arquivos atuais dos buckets site-images e results-images, mais manifesto.</p>
          </div>
        </div>
      </div>
    </div>
  )
}