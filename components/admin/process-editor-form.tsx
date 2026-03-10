'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishProcess, saveProcessDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { EditorSection } from '@/components/admin/editor-section'
import { EditorSectionNav } from '@/components/admin/editor-section-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProcessContent, SectionSnapshot } from '@/lib/content/types'

type ProcessEditorFormProps = {
  snapshot: SectionSnapshot<ProcessContent>
}

export function ProcessEditorForm({ snapshot }: ProcessEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveProcessDraft(formData) : await publishProcess()

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

      <EditorSectionNav
        items={[
          { id: 'process-header', label: 'Header e CTA' },
          { id: 'process-steps', label: 'Etapas' },
        ]}
      />

      <form ref={formRef} className="space-y-8">
        <EditorSection
          sectionId="process-header"
          title="Header e CTA"
          description="Edite a apresentação da seção e a chamada final."
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={current.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="procedureTitle">Título do procedimento</Label>
              <Input id="procedureTitle" name="procedureTitle" defaultValue={current.procedureTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="procedureSubtitle">Subtítulo do procedimento</Label>
              <Input id="procedureSubtitle" name="procedureSubtitle" defaultValue={current.procedureSubtitle} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ctaText">Texto do CTA</Label>
              <Input id="ctaText" name="ctaText" defaultValue={current.ctaText} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ctaLabel">Botão do CTA</Label>
              <Input id="ctaLabel" name="ctaLabel" defaultValue={current.ctaLabel} />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          sectionId="process-steps"
          title="Etapas do processo"
          description="Edite as quatro etapas exibidas no passo a passo."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {current.steps.map((step, index) => (
              <div key={`step-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`processNumber${index}`}>Número {index + 1}</Label>
                  <Input id={`processNumber${index}`} name={`processNumber${index}`} defaultValue={step.step} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`processTitle${index}`}>Título {index + 1}</Label>
                  <Input id={`processTitle${index}`} name={`processTitle${index}`} defaultValue={step.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`processDescription${index}`}>Descrição {index + 1}</Label>
                  <Textarea
                    id={`processDescription${index}`}
                    name={`processDescription${index}`}
                    rows={4}
                    defaultValue={step.description}
                  />
                </div>
                <AdminImageField
                  name={`processImage${index}`}
                  label={`Imagem ${index + 1}`}
                  bucketName="site-images"
                  module="process"
                  defaultValue={step.imageUrl}
                />
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
            {isPending ? 'Publicando...' : 'Publicar Como Funciona'}
          </Button>
        </div>
      </form>
    </div>
  )
}