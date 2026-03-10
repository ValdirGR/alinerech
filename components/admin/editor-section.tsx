'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type EditorSectionProps = {
  sectionId?: string
  title: string
  description: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function EditorSection({
  sectionId,
  title,
  description,
  children,
  defaultOpen = false,
}: EditorSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    if (!sectionId) {
      return
    }

    const syncHashState = () => {
      if (window.location.hash === `#${sectionId}`) {
        setOpen(true)
      }
    }

    syncHashState()
    window.addEventListener('hashchange', syncHashState)

    return () => window.removeEventListener('hashchange', syncHashState)
  }, [sectionId])

  return (
    <Collapsible
      id={sectionId}
      open={open}
      onOpenChange={setOpen}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
        <div>
          <h2 className="text-lg font-semibold text-[#0B3D4C]">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-colors group-hover:border-[#C9A962] group-hover:bg-[#FFFCF4] group-hover:text-[#0B3D4C] group-data-[state=open]:rotate-180">
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-gray-100 px-6 py-6">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}