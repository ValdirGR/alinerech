'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishHeader, saveHeaderDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { EditorSection } from '@/components/admin/editor-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { HeaderContent, SectionSnapshot } from '@/lib/content/types'

type HeaderEditorFormProps = {
  snapshot: SectionSnapshot<HeaderContent>
}

export function HeaderEditorForm({ snapshot }: HeaderEditorFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const current = snapshot.current

  const runAction = (actionType: 'draft' | 'publish') => {
    if (!formRef.current) {
      return
    }

    const formData = new FormData(formRef.current)

    startTransition(async () => {
      const result = actionType === 'draft' ? await saveHeaderDraft(formData) : await publishHeader()

      setMessage(result.message)
      setIsError(!result.success)

      if (result.success) {
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Publicado</p>
          <p className="mt-2 text-sm font-semibold text-[#0B3D4C]">
            {snapshot.published ? `Versão ${snapshot.published.version}` : 'Nenhuma publicação ainda'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {snapshot.published?.publishedAt
              ? `Publicado em ${new Date(snapshot.published.publishedAt).toLocaleString('pt-BR')}`
              : 'O site ainda usa o fallback do código.'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Rascunho atual</p>
          <p className="mt-2 text-sm font-semibold text-[#0B3D4C]">
            {snapshot.draft ? `Versão ${snapshot.draft.version}` : 'Nenhum rascunho salvo'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {snapshot.draft?.updatedAt
              ? `Atualizado em ${new Date(snapshot.draft.updatedAt).toLocaleString('pt-BR')}`
              : 'Salve alterações para criar o primeiro rascunho.'}
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-[#C9A962] bg-[#FFF8E8] p-5 shadow-sm">
          <p className="text-sm text-[#8A6B2F]">Fluxo editorial</p>
          <p className="mt-2 text-sm font-semibold text-[#0B3D4C]">Rascunho e publicação</p>
          <p className="mt-1 text-xs text-[#8A6B2F]">
            O site público só reflete o que estiver publicado. Salvar não altera o site até publicar.
          </p>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            isError
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message}
        </div>
      ) : null}

      <form ref={formRef} className="space-y-8">
        <EditorSection
          title="Logo e CTA"
          description="Controle a identidade visual e o botão principal do topo."
          defaultOpen
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <AdminImageField
                name="logoUrl"
                label="Logo"
                bucketName="site-images"
                module="header"
                defaultValue={current.logoUrl}
                altFieldName="logoAlt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoAlt">Alt da logo</Label>
              <Input id="logoAlt" name="logoAlt" defaultValue={current.logoAlt} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLabel">Texto do CTA</Label>
              <Input id="ctaLabel" name="ctaLabel" defaultValue={current.ctaLabel} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ctaLink">Link do CTA</Label>
              <Input id="ctaLink" name="ctaLink" defaultValue={current.ctaLink} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileTitle">Título do menu mobile</Label>
              <Input id="mobileTitle" name="mobileTitle" defaultValue={current.mobileTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileSubtitle">Subtítulo do menu mobile</Label>
              <Input id="mobileSubtitle" name="mobileSubtitle" defaultValue={current.mobileSubtitle} />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Links do menu"
          description="Atualize os seis links de navegacao do desktop e mobile."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {current.navLinks.map((item, index) => (
              <div key={`header-link-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`headerNavLabel${index}`}>Rótulo {index + 1}</Label>
                  <Input id={`headerNavLabel${index}`} name={`headerNavLabel${index}`} defaultValue={item.label} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`headerNavHref${index}`}>Âncora/link {index + 1}</Label>
                  <Input id={`headerNavHref${index}`} name={`headerNavHref${index}`} defaultValue={item.href} />
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => runAction('draft')}>
            <Save className="h-4 w-4" />
            {isPending ? 'Salvando...' : 'Salvar rascunho'}
          </Button>
          <Button
            type="button"
            disabled={isPending || !snapshot.draft}
            className="bg-[#0B3D4C] text-white hover:bg-[#155A6E]"
            onClick={() => runAction('publish')}
          >
            <Send className="h-4 w-4" />
            {isPending ? 'Publicando...' : 'Publicar Header'}
          </Button>
        </div>
      </form>
    </div>
  )
}