'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishAbout, saveAboutDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { EditorSection } from '@/components/admin/editor-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { AboutContent, SectionSnapshot } from '@/lib/content/types'

type AboutEditorFormProps = {
  snapshot: SectionSnapshot<AboutContent>
}

const aboutCardIcons = [
  { value: 'graduation-cap', label: 'Graduation Cap' },
  { value: 'award', label: 'Award' },
  { value: 'heart', label: 'Heart' },
  { value: 'shield', label: 'Shield' },
] as const

export function AboutEditorForm({ snapshot }: AboutEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveAboutDraft(formData) : await publishAbout()

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
          title="Textos principais"
          description="Controle a narrativa institucional da seção Sobre."
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

            {current.paragraphs.map((paragraph, index) => (
              <div key={`paragraph-${index}`} className="space-y-2 md:col-span-2">
                <Label htmlFor={`paragraph${index}`}>Parágrafo {index + 1}</Label>
                <Textarea
                  id={`paragraph${index}`}
                  name={`paragraph${index}`}
                  rows={4}
                  defaultValue={paragraph}
                />
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection
          title="Imagem e credenciais"
          description="Gerencie a foto principal e os destaques profissionais."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <AdminImageField
                name="imageUrl"
                label="Imagem principal"
                bucketName="site-images"
                module="about"
                defaultValue={current.imageUrl}
                altFieldName="imageAlt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Alt da imagem</Label>
              <Input id="imageAlt" name="imageAlt" defaultValue={current.imageAlt} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="croTitle">Título do CRO</Label>
              <Input id="croTitle" name="croTitle" defaultValue={current.croTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="croCaption">Legenda do CRO</Label>
              <Input id="croCaption" name="croCaption" defaultValue={current.croCaption} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialtyTitle">Título da especialidade</Label>
              <Input id="specialtyTitle" name="specialtyTitle" defaultValue={current.specialtyTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialtyCaption">Legenda da especialidade</Label>
              <Input
                id="specialtyCaption"
                name="specialtyCaption"
                defaultValue={current.specialtyCaption}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceValue">Destaque de experiência</Label>
              <Input id="experienceValue" name="experienceValue" defaultValue={current.experienceValue} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLabel">Legenda de experiência</Label>
              <Textarea
                id="experienceLabel"
                name="experienceLabel"
                rows={3}
                defaultValue={current.experienceLabel}
              />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Cards de diferenciais"
          description="Mantenha os quatro cards exibidos na seção."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {current.cards.map((card, index) => (
              <div key={`card-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`cardTitle${index}`}>Título {index + 1}</Label>
                  <Input id={`cardTitle${index}`} name={`cardTitle${index}`} defaultValue={card.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cardDescription${index}`}>Descrição {index + 1}</Label>
                  <Textarea
                    id={`cardDescription${index}`}
                    name={`cardDescription${index}`}
                    rows={3}
                    defaultValue={card.description}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cardIcon${index}`}>Ícone {index + 1}</Label>
                  <select
                    id={`cardIcon${index}`}
                    name={`cardIcon${index}`}
                    defaultValue={card.iconKey}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    {aboutCardIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
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
            {isPending ? 'Publicando...' : 'Publicar Sobre'}
          </Button>
        </div>
      </form>
    </div>
  )
}