import Link from 'next/link'

type EditorSectionNavItem = {
  id: string
  label: string
}

type EditorSectionNavProps = {
  items: EditorSectionNavItem[]
}

export function EditorSectionNav({ items }: EditorSectionNavProps) {
  return (
    <div className="rounded-2xl border border-[#C9A962]/30 bg-[#FFFCF4] p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8A6B2F]">Navegação do editor</h2>
          <p className="mt-1 text-sm text-gray-500">Acesse rapidamente cada bloco do formulário.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            scroll
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#0B3D4C] transition-colors hover:border-[#C9A962] hover:bg-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}