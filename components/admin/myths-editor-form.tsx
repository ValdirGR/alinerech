'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send } from 'lucide-react'
import { publishMyths, saveMythsDraft } from '@/app/actions/admin-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { MythsContent, SectionSnapshot } from '@/lib/content/types'

type MythsEditorFormProps = {
  snapshot: SectionSnapshot<MythsContent>
}

export function MythsEditorForm({ snapshot }: MythsEditorFormProps) {
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
      const result = actionType === 'draft' ? await saveMythsDraft(formData) : await publishMyths()

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
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Header da seção</h2>
            <p className="text-sm text-gray-500">Edite o selo, o título, a descrição e a observação final.</p>
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
              <Textarea id="description" name="description" rows={3} defaultValue={current.description} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="disclaimer">Observação final</Label>
              <Textarea id="disclaimer" name="disclaimer" rows={3} defaultValue={current.disclaimer} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Cards da seção</h2>
            <p className="text-sm text-gray-500">Atualize os oito cards de mito e verdade exibidos no grid.</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {current.items.map((item, index) => (
              <div key={`myth-${index}`} className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`mythType${index}`}>Tipo</Label>
                    <select
                      id={`mythType${index}`}
                      name={`mythType${index}`}
                      defaultValue={item.type}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                    >
                      <option value="mito">Mito</option>
                      <option value="verdade">Verdade</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`mythCategory${index}`}>Categoria</Label>
                    <select
                      id={`mythCategory${index}`}
                      name={`mythCategory${index}`}
                      defaultValue={item.category}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                    >
                      <option value="Facetas">Facetas</option>
                      <option value="Implantes">Implantes</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`mythStatement${index}`}>Afirmação</Label>
                    <Input id={`mythStatement${index}`} name={`mythStatement${index}`} defaultValue={item.statement} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`mythTruth${index}`}>Explicação</Label>
                    <Textarea id={`mythTruth${index}`} name={`mythTruth${index}`} rows={4} defaultValue={item.truth} />
                  </div>
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
            {isPending ? 'Publicando...' : 'Publicar Mito ou Verdade'}
          </Button>
        </div>
      </form>
    </div>
  )
}