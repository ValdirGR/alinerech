'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishServices, saveServicesDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { SectionSnapshot, ServicesContent } from '@/lib/content/types'

type ServicesEditorFormProps = {
  snapshot: SectionSnapshot<ServicesContent>
}

export function ServicesEditorForm({ snapshot }: ServicesEditorFormProps) {
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
        actionType === 'draft' ? await saveServicesDraft(formData) : await publishServices()

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
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Header e serviço principal</h2>
            <p className="text-sm text-gray-500">Edite a abertura da seção e o destaque do tratamento principal.</p>
          </div>

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
              <Textarea id="description" name="description" rows={3} defaultValue={current.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceTitle">Título do serviço</Label>
              <Input id="serviceTitle" name="serviceTitle" defaultValue={current.serviceTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceSubtitle">Subtítulo do serviço</Label>
              <Input id="serviceSubtitle" name="serviceSubtitle" defaultValue={current.serviceSubtitle} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="serviceDescription">Descrição do serviço</Label>
              <Textarea
                id="serviceDescription"
                name="serviceDescription"
                rows={5}
                defaultValue={current.serviceDescription}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <AdminImageField
                name="imageUrl"
                label="Imagem principal"
                bucketName="site-images"
                module="services"
                defaultValue={current.imageUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Alt da imagem</Label>
              <Input id="imageAlt" name="imageAlt" defaultValue={current.imageAlt} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Benefícios e CTAs</h2>
            <p className="text-sm text-gray-500">Mantenha a lista de benefícios e os dois botões do card.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {current.benefits.map((benefit, index) => (
              <div key={`benefit-${index}`} className="space-y-2">
                <Label htmlFor={`benefit${index}`}>Benefício {index + 1}</Label>
                <Input id={`benefit${index}`} name={`benefit${index}`} defaultValue={benefit} />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="primaryCtaLabel">CTA principal</Label>
              <Input id="primaryCtaLabel" name="primaryCtaLabel" defaultValue={current.primaryCtaLabel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryCtaLabel">CTA secundário</Label>
              <Input id="secondaryCtaLabel" name="secondaryCtaLabel" defaultValue={current.secondaryCtaLabel} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Conteúdo expandido</h2>
            <p className="text-sm text-gray-500">Edite limitações, processo e orientações após o procedimento.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="limitationsTitle">Título de limitações</Label>
                <Input id="limitationsTitle" name="limitationsTitle" defaultValue={current.limitationsTitle} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {current.limitations.map((item, index) => (
                  <div key={`limitation-${index}`} className="space-y-2">
                    <Label htmlFor={`limitation${index}`}>Limitação {index + 1}</Label>
                    <Input id={`limitation${index}`} name={`limitation${index}`} defaultValue={item} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processTitle">Título do processo</Label>
                <Input id="processTitle" name="processTitle" defaultValue={current.processTitle} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {current.processSteps.map((item, index) => (
                  <div key={`process-${index}`} className="space-y-2">
                    <Label htmlFor={`processStep${index}`}>Etapa {index + 1}</Label>
                    <Input id={`processStep${index}`} name={`processStep${index}`} defaultValue={item} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="careTitle">Título dos cuidados</Label>
                <Input id="careTitle" name="careTitle" defaultValue={current.careTitle} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="careTip">Dica final</Label>
                <Input id="careTip" name="careTip" defaultValue={current.careTip} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="careDescription">Descrição dos cuidados</Label>
                <Textarea
                  id="careDescription"
                  name="careDescription"
                  rows={4}
                  defaultValue={current.careDescription}
                />
              </div>
            </div>
          </div>
        </section>

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
            {isPending ? 'Publicando...' : 'Publicar Serviços'}
          </Button>
        </div>
      </form>
    </div>
  )
}