import { redirect } from 'next/navigation'
import { AdminLogoutButton } from '@/components/admin-logout-button'
import { AdminSidebarNav } from '@/components/admin/admin-sidebar-nav'
import { getAdminProfile } from '@/lib/content/server'

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getAdminProfile()

    if (!profile) {
        redirect('/admin/login')
    }

    return (
        <div className="admin-shell min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-[#0B3D4C] text-white p-5 shadow-xl z-10 flex flex-col">
                <div className="mb-7">
                    <h2 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                        Aline Rech
                    </h2>
                    <span className="text-sm text-gray-400">Painel Administrativo</span>
                    <div className="mt-3 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-gray-200">
                        <p className="font-medium text-white">{profile.fullName}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-300">{profile.role}</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto pr-1">
                    <AdminSidebarNav role={profile.role} />
                </nav>

                <div className="mt-auto pt-5 border-t border-gray-700">
                    <AdminLogoutButton />
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    )
}