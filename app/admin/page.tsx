export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0B3D4C]">Visão Geral</h1>
                <p className="text-gray-500 mt-2">
                    Bem-vindo ao Painel Administrativo. Aqui as futuras funcionalidades
                    de gerenciamento da plataforma serão alocadas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover-lift">
                    <h3 className="text-lg font-semibold text-gray-700">Métricas</h3>
                    <p className="text-sm text-gray-500 mt-1">Em breve...</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover-lift">
                    <h3 className="text-lg font-semibold text-gray-700">Acessos</h3>
                    <p className="text-sm text-gray-500 mt-1">Em breve...</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover-lift">
                    <h3 className="text-lg font-semibold text-gray-700">Configurações</h3>
                    <p className="text-sm text-gray-500 mt-1">Em breve...</p>
                </div>
            </div>
        </div>
    )
}
