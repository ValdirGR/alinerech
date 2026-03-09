import { getMediaAssets } from '@/lib/content/server'
import { MediaLibraryManager } from '@/components/admin/media-library-manager'

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

      <MediaLibraryManager initialItems={items} />
    </div>
  )
}