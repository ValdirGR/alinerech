'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishContact, saveContactDraft } from '@/app/actions/admin-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContactContent, SectionSnapshot } from '@/lib/content/types'

type ContactEditorFormProps = {
  snapshot: SectionSnapshot<ContactContent>
}

const contactInfoIcons = [
  { value: 'phone', label: 'Phone' },
  { value: 'map-pin', label: 'Map Pin' },
  { value: 'clock', label: 'Clock' },
] as const

export function ContactEditorForm({ snapshot }: ContactEditorFormProps) {
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
        actionType === 'draft' ? await saveContactDraft(formData) : await publishContact()

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
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Textos principais</h2>
            <p className="text-sm text-gray-500">Edite o título, CTA e mensagens principais da seção.</p>
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={current.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappLabel">Texto do botão WhatsApp</Label>
              <Input id="whatsappLabel" name="whatsappLabel" defaultValue={current.whatsappLabel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappLink">Link do botão WhatsApp</Label>
              <Input id="whatsappLink" name="whatsappLink" defaultValue={current.whatsappLink} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Formulário</h2>
            <p className="text-sm text-gray-500">Controle os textos do formulário e da confirmação.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="formTitle">Título do formulário</Label>
              <Input id="formTitle" name="formTitle" defaultValue={current.formTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formDescription">Descrição do formulário</Label>
              <Input id="formDescription" name="formDescription" defaultValue={current.formDescription} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="successTitle">Título de sucesso</Label>
              <Input id="successTitle" name="successTitle" defaultValue={current.successTitle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="successDescription">Descrição de sucesso</Label>
              <Input
                id="successDescription"
                name="successDescription"
                defaultValue={current.successDescription}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="privacyText">Texto de privacidade</Label>
              <Textarea id="privacyText" name="privacyText" rows={3} defaultValue={current.privacyText} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Blocos de informação</h2>
            <p className="text-sm text-gray-500">Mantenha os três itens de contato exibidos no site.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {current.infoItems.map((item, index) => (
              <div key={`info-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`infoTitle${index}`}>Título {index + 1}</Label>
                  <Input id={`infoTitle${index}`} name={`infoTitle${index}`} defaultValue={item.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`infoContent${index}`}>Conteúdo {index + 1}</Label>
                  <Textarea
                    id={`infoContent${index}`}
                    name={`infoContent${index}`}
                    rows={4}
                    defaultValue={item.content}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`infoLink${index}`}>Link {index + 1}</Label>
                  <Input
                    id={`infoLink${index}`}
                    name={`infoLink${index}`}
                    defaultValue={item.link ?? ''}
                    placeholder="Opcional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`infoIcon${index}`}>Ícone {index + 1}</Label>
                  <select
                    id={`infoIcon${index}`}
                    name={`infoIcon${index}`}
                    defaultValue={item.iconKey}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    {contactInfoIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
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
            {isPending ? 'Publicando...' : 'Publicar Contato'}
          </Button>
        </div>
      </form>
    </div>
  )
}