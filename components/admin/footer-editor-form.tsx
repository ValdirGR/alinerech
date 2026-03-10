'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishFooter, saveFooterDraft } from '@/app/actions/admin-content'
import { AdminImageField } from '@/components/admin/admin-image-field'
import { EditorSection } from '@/components/admin/editor-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FooterContent, SectionSnapshot } from '@/lib/content/types'

type FooterEditorFormProps = {
  snapshot: SectionSnapshot<FooterContent>
}

export function FooterEditorForm({ snapshot }: FooterEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveFooterDraft(formData) : await publishFooter()

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
          title="Marca e textos principais"
          description="Edite a logo, tagline, descricao e textos do rodape inferior."
          defaultOpen
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <AdminImageField
                name="logoUrl"
                label="Logo"
                bucketName="site-images"
                module="footer"
                defaultValue={current.logoUrl}
                altFieldName="logoAlt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoAlt">Alt da logo</Label>
              <Input id="logoAlt" name="logoAlt" defaultValue={current.logoAlt} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={current.tagline} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição institucional</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={current.description} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="copyrightText">Texto de copyright</Label>
              <Input id="copyrightText" name="copyrightText" defaultValue={current.copyrightText} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="madeWithText">Texto final</Label>
              <Input id="madeWithText" name="madeWithText" defaultValue={current.madeWithText} />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Redes sociais"
          description="Defina os tres icones e links do rodape."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {current.socialLinks.map((item, index) => (
              <div key={`social-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`footerSocialIcon${index}`}>Ícone</Label>
                  <select
                    id={`footerSocialIcon${index}`}
                    name={`footerSocialIcon${index}`}
                    defaultValue={item.iconKey}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="mail">E-mail</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`footerSocialHref${index}`}>Link</Label>
                  <Input id={`footerSocialHref${index}`} name={`footerSocialHref${index}`} defaultValue={item.href} />
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection
          title="Links do rodape"
          description="Edite os blocos de links rapidos e servicos."
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quickLinksTitle">Título de links rápidos</Label>
                <Input id="quickLinksTitle" name="quickLinksTitle" defaultValue={current.quickLinksTitle} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {current.quickLinks.map((item, index) => (
                  <div key={`quick-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`footerQuickLabel${index}`}>Rótulo {index + 1}</Label>
                      <Input id={`footerQuickLabel${index}`} name={`footerQuickLabel${index}`} defaultValue={item.label} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`footerQuickHref${index}`}>Link {index + 1}</Label>
                      <Input id={`footerQuickHref${index}`} name={`footerQuickHref${index}`} defaultValue={item.href} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="servicesTitle">Título de serviços</Label>
                <Input id="servicesTitle" name="servicesTitle" defaultValue={current.servicesTitle} />
              </div>
              <div className="grid gap-4">
                {current.serviceLinks.map((item, index) => (
                  <div key={`service-${index}`} className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`footerServiceLabel${index}`}>Rótulo {index + 1}</Label>
                      <Input id={`footerServiceLabel${index}`} name={`footerServiceLabel${index}`} defaultValue={item.label} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`footerServiceHref${index}`}>Link {index + 1}</Label>
                      <Input id={`footerServiceHref${index}`} name={`footerServiceHref${index}`} defaultValue={item.href} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Contato do rodape"
          description="Edite os tres blocos de contato exibidos na coluna final."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactTitle">Título de contato</Label>
              <Input id="contactTitle" name="contactTitle" defaultValue={current.contactTitle} />
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {current.contactItems.map((item, index) => (
                <div key={`contact-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`footerContactIcon${index}`}>Ícone</Label>
                    <select
                      id={`footerContactIcon${index}`}
                      name={`footerContactIcon${index}`}
                      defaultValue={item.iconKey}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                    >
                      <option value="map-pin">Mapa</option>
                      <option value="phone">Telefone</option>
                      <option value="clock">Relógio</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`footerContactTitle${index}`}>Título</Label>
                    <Input id={`footerContactTitle${index}`} name={`footerContactTitle${index}`} defaultValue={item.title} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`footerContactContent${index}`}>Conteúdo</Label>
                    <Textarea
                      id={`footerContactContent${index}`}
                      name={`footerContactContent${index}`}
                      rows={4}
                      defaultValue={item.content}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`footerContactLink${index}`}>Link opcional</Label>
                    <Input id={`footerContactLink${index}`} name={`footerContactLink${index}`} defaultValue={item.link ?? ''} />
                  </div>
                </div>
              ))}
            </div>
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
            {isPending ? 'Publicando...' : 'Publicar Footer'}
          </Button>
        </div>
      </form>
    </div>
  )
}