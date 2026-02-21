import { AdminLogoutButton } from '@/components/admin-logout-button'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-[#0B3D4C] text-white p-6 shadow-xl z-10 flex flex-col">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                        Aline Rech
                    </h2>
                    <span className="text-sm text-gray-400">Painel Administrativo</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {/* Navegação Futura - Placeholder */}
                    <a href="/admin" className="block px-4 py-3 bg-[#155A6E] rounded-lg text-white font-medium transition-colors">
                        Dashboard
                    </a>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-700">
                    <AdminLogoutButton />
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    )
}
