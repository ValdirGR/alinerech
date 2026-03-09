import { getMediaAssets } from '@/lib/content/server'
import { MediaLibraryGrid } from '@/components/admin/media-library-grid'

export default async function GalleryAdminPage() {
  const items = await getMediaAssets()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Galeria</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Biblioteca de imagens já enviadas ao Supabase Storage para reutilização nos módulos do site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total de mídias</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">{items.length}</p>
          <p className="mt-1 text-sm text-gray-500">Arquivos registrados em media_assets.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Site Images</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
            {items.filter((item) => item.bucketName === 'site-images').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Imagens gerais do site.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Results Images</h3>
          <p className="mt-2 text-3xl font-bold text-[#0B3D4C]">
            {items.filter((item) => item.bucketName === 'results-images').length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Imagens da galeria de resultados.</p>
        </div>
      </div>

      <MediaLibraryGrid items={items} />
    </div>
  )
}