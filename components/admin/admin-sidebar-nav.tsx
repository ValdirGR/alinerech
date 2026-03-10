'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { History, LayoutGrid, FileText, Image as ImageIcon, MessageSquareText, HardDriveDownload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminModules } from '@/lib/content/defaults'
import type { AdminRole } from '@/lib/content/types'

const topLevelLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: MessageSquareText,
  },
  {
    href: '/admin/activity',
    label: 'Histórico',
    icon: History,
  },
]

const adminOnlyLinks = [
  {
    href: '/admin/backups',
    label: 'Backups',
    icon: HardDriveDownload,
  },
]

export function AdminSidebarNav({ role }: { role: AdminRole }) {
  const pathname = usePathname()
  const availableLinks = role === 'admin' ? [...topLevelLinks, ...adminOnlyLinks] : topLevelLinks

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {availableLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-[#155A6E] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          <FileText className="h-3.5 w-3.5" />
          Conteúdo
        </div>
        <div className="space-y-1">
          {adminModules.map((moduleItem) => {
            const href = `/admin/${moduleItem.key}`
            const isActive = pathname === href

            return (
              <Link
                key={moduleItem.key}
                href={href}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-[#155A6E] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-3">
                  <ImageIcon className="h-4 w-4" />
                  {moduleItem.label}
                </span>
                {!moduleItem.implemented ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
                    Em breve
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}