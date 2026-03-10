'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishFaq, saveFaqDraft } from '@/app/actions/admin-content'
import { EditorSection } from '@/components/admin/editor-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FAQContent, SectionSnapshot } from '@/lib/content/types'

type FaqEditorFormProps = {
  snapshot: SectionSnapshot<FAQContent>
}

export function FaqEditorForm({ snapshot }: FaqEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveFaqDraft(formData) : await publishFaq()

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
          title="Header e CTA"
          description="Edite a abertura do FAQ e a chamada final para WhatsApp."
          defaultOpen
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="badgeText">Selo superior</Label>
              <Input id="badgeText" name="badgeText" defaultValue={current.badgeText} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleLead">Título base</Label>
              <Input id="titleLead" name="titleLead" defaultValue={current.titleLead} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleHighlight">Destaque do título</Label>
              <Input id="titleHighlight" name="titleHighlight" defaultValue={current.titleHighlight} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição da seção</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={current.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryTitle">Título da categoria</Label>
              <Input id="categoryTitle" name="categoryTitle" defaultValue={current.categoryTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryBadge">Badge da categoria</Label>
              <Input id="categoryBadge" name="categoryBadge" maxLength={2} defaultValue={current.categoryBadge} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ctaText">Texto do CTA</Label>
              <Input id="ctaText" name="ctaText" defaultValue={current.ctaText} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLabel">Botão do CTA</Label>
              <Input id="ctaLabel" name="ctaLabel" defaultValue={current.ctaLabel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink">Link do CTA</Label>
              <Input id="ctaLink" name="ctaLink" defaultValue={current.ctaLink} />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Perguntas e respostas"
          description="Edite as dez perguntas exibidas na area de duvidas."
        >
          <div className="space-y-4">
            {current.items.map((item, index) => (
              <div key={`faq-${index}`} className="grid gap-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`faqQuestion${index}`}>Pergunta {index + 1}</Label>
                  <Input id={`faqQuestion${index}`} name={`faqQuestion${index}`} defaultValue={item.question} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`faqAnswer${index}`}>Resposta {index + 1}</Label>
                  <Textarea
                    id={`faqAnswer${index}`}
                    name={`faqAnswer${index}`}
                    rows={4}
                    defaultValue={item.answer}
                  />
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
            {isPending ? 'Publicando...' : 'Publicar FAQ'}
          </Button>
        </div>
      </form>
    </div>
  )
}