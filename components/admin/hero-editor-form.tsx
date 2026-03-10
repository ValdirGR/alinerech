'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishHero, saveHeroDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { EditorSection } from '@/components/admin/editor-section'
import { EditorSectionNav } from '@/components/admin/editor-section-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { HeroContent, SectionSnapshot } from '@/lib/content/types'

type HeroEditorFormProps = {
  snapshot: SectionSnapshot<HeroContent>
}

export function HeroEditorForm({ snapshot }: HeroEditorFormProps) {
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
      const result =
        actionType === 'draft' ? await saveHeroDraft(formData) : await publishHero()

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
          { id: 'hero-copy', label: 'Textos' },
          { id: 'hero-media', label: 'Acoes e midia' },
          { id: 'hero-trust', label: 'Confianca' },
          { id: 'hero-stats', label: 'Estatisticas' },
        ]}
      />

      <form ref={formRef} className="space-y-8">
        <EditorSection
          sectionId="hero-copy"
          title="Textos principais"
          description="Controle o destaque textual do Hero."
          defaultOpen
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="badgeText">Selo superior</Label>
              <Input id="badgeText" name="badgeText" defaultValue={current.badgeText} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleLead">Título linha 1</Label>
              <Input id="titleLead" name="titleLead" defaultValue={current.titleLead} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleHighlight">Destaque linha 1</Label>
              <Input id="titleHighlight" name="titleHighlight" defaultValue={current.titleHighlight} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleSecondLead">Título linha 2</Label>
              <Input id="titleSecondLead" name="titleSecondLead" defaultValue={current.titleSecondLead} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleSecondHighlight">Destaque linha 2</Label>
              <Input
                id="titleSecondHighlight"
                name="titleSecondHighlight"
                defaultValue={current.titleSecondHighlight}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={current.description} />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          sectionId="hero-media"
          title="Ações e mídia"
          description="Links, vídeo e imagem principal do topo."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryCtaLabel">CTA principal</Label>
              <Input id="primaryCtaLabel" name="primaryCtaLabel" defaultValue={current.primaryCtaLabel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCtaLink">Link CTA principal</Label>
              <Input id="primaryCtaLink" name="primaryCtaLink" defaultValue={current.primaryCtaLink} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryCtaLabel">CTA secundário</Label>
              <Input id="secondaryCtaLabel" name="secondaryCtaLabel" defaultValue={current.secondaryCtaLabel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryCtaLink">Link CTA secundário</Label>
              <Input id="secondaryCtaLink" name="secondaryCtaLink" defaultValue={current.secondaryCtaLink} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="videoUrl">URL do vídeo embed</Label>
              <Input id="videoUrl" name="videoUrl" defaultValue={current.videoUrl} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <AdminImageField
                name="imageUrl"
                label="Imagem principal"
                bucketName="site-images"
                module="hero"
                defaultValue={current.imageUrl}
                altFieldName="imageAlt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Alt da imagem</Label>
              <Input id="imageAlt" name="imageAlt" defaultValue={current.imageAlt} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionalName">Nome profissional</Label>
              <Input id="professionalName" name="professionalName" defaultValue={current.professionalName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionalSubtitle">Subtítulo profissional</Label>
              <Input
                id="professionalSubtitle"
                name="professionalSubtitle"
                defaultValue={current.professionalSubtitle}
              />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          sectionId="hero-trust"
          title="Itens de confiança"
          description="Tres bullets que aparecem abaixo dos botoes."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {current.trustItems.map((item, index) => (
              <div key={`trust-${index}`} className="space-y-2">
                <Label htmlFor={`trustItem${index}`}>Item {index + 1}</Label>
                <Input id={`trustItem${index}`} name={`trustItem${index}`} defaultValue={item} />
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection
          sectionId="hero-stats"
          title="Estatísticas"
          description="Mantenha o layout atual de quatro metricas."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {current.stats.map((stat, index) => (
              <div key={`stat-${index}`} className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`statValue${index}`}>Valor {index + 1}</Label>
                  <Input id={`statValue${index}`} name={`statValue${index}`} defaultValue={stat.value} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`statLabel${index}`}>Legenda {index + 1}</Label>
                  <Input id={`statLabel${index}`} name={`statLabel${index}`} defaultValue={stat.label} />
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
            {isPending ? 'Publicando...' : 'Publicar Hero'}
          </Button>
        </div>
      </form>
    </div>
  )
}