'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishFeatures, saveFeaturesDraft } from '@/app/actions/admin-content'
import { EditorSection } from '@/components/admin/editor-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FeaturesContent, SectionSnapshot } from '@/lib/content/types'

type FeaturesEditorFormProps = {
  snapshot: SectionSnapshot<FeaturesContent>
}

const iconOptions = [
  { value: 'microscope', label: 'Microscope' },
  { value: 'clock', label: 'Clock' },
  { value: 'users', label: 'Users' },
  { value: 'stethoscope', label: 'Stethoscope' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'shield-check', label: 'Shield Check' },
  { value: 'heart-handshake', label: 'Heart Handshake' },
  { value: 'trending-up', label: 'Trending Up' },
] as const

export function FeaturesEditorForm({ snapshot }: FeaturesEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveFeaturesDraft(formData) : await publishFeatures()

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
          title="Header da seção"
          description="Edite o selo, o título e a descrição dos diferenciais."
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
          </div>
        </EditorSection>

        <EditorSection
          title="Cards de diferenciais"
          description="Atualize os oito cards exibidos no grid principal."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            {current.items.map((item, index) => (
              <div key={`feature-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`featureIcon${index}`}>Ícone</Label>
                  <select
                    id={`featureIcon${index}`}
                    name={`featureIcon${index}`}
                    defaultValue={item.iconKey}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`featureTitle${index}`}>Título</Label>
                  <Input id={`featureTitle${index}`} name={`featureTitle${index}`} defaultValue={item.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`featureDescription${index}`}>Descrição</Label>
                  <Textarea
                    id={`featureDescription${index}`}
                    name={`featureDescription${index}`}
                    rows={3}
                    defaultValue={item.description}
                  />
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection
          title="Indicadores"
          description="Atualize os quatro números destacados abaixo do grid."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {current.stats.map((item, index) => (
              <div key={`stat-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`featureStatValue${index}`}>Valor</Label>
                  <Input id={`featureStatValue${index}`} name={`featureStatValue${index}`} defaultValue={item.value} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`featureStatLabel${index}`}>Legenda</Label>
                  <Input id={`featureStatLabel${index}`} name={`featureStatLabel${index}`} defaultValue={item.label} />
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
            {isPending ? 'Publicando...' : 'Publicar Diferenciais'}
          </Button>
        </div>
      </form>
    </div>
  )
}