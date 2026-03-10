import { ActivityFeed } from '@/components/admin/activity-feed'
import { getSectionActivity } from '@/lib/content/server'

export default async function ActivityAdminPage() {
  const activityItems = await getSectionActivity(40)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B3D4C]">Histórico editorial</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Acompanhe os últimos rascunhos salvos e publicações registradas pelo CMS.
        </p>
      </div>

      <ActivityFeed items={activityItems} />
    </div>
  )
}