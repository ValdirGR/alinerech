import { notFound } from 'next/navigation'
import { ModulePlaceholder } from '@/components/admin/module-placeholder'
import { adminModules } from '@/lib/content/defaults'

type ModulePlaceholderPageProps = {
  params: Promise<{ module: string }>
}

export default async function ModulePlaceholderPage({ params }: ModulePlaceholderPageProps) {
  const { module } = await params
  const moduleItem = adminModules.find((item) => item.key === module)

  if (!moduleItem) {
    notFound()
  }

  return <ModulePlaceholder moduleItem={moduleItem} />
}