'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { publishSectionDraft, requireAdminAccess, upsertSectionDraft } from '@/lib/content/server'
import type { ActionResult, HeroContent } from '@/lib/content/types'

const heroSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira linha do título.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque da primeira linha.'),
  titleSecondLead: z.string().trim().min(1, 'Informe a segunda linha do título.'),
  titleSecondHighlight: z.string().trim().min(1, 'Informe o destaque da segunda linha.'),
  description: z.string().trim().min(1, 'Informe a descrição.'),
  primaryCtaLabel: z.string().trim().min(1, 'Informe o texto do CTA principal.'),
  primaryCtaLink: z.string().trim().min(1, 'Informe o link do CTA principal.'),
  secondaryCtaLabel: z.string().trim().min(1, 'Informe o texto do CTA secundário.'),
  secondaryCtaLink: z.string().trim().min(1, 'Informe o link do CTA secundário.'),
  imageUrl: z.string().trim().min(1, 'Informe a imagem principal.'),
  imageAlt: z.string().trim().min(1, 'Informe o alt da imagem.'),
  videoUrl: z.string().trim().min(1, 'Informe a URL do vídeo.'),
  professionalName: z.string().trim().min(1, 'Informe o nome profissional.'),
  professionalSubtitle: z.string().trim().min(1, 'Informe o subtítulo profissional.'),
  trustItems: z.array(z.string().trim().min(1)).min(3).max(3),
  stats: z.array(
    z.object({
      label: z.string().trim().min(1),
      value: z.string().trim().min(1),
    })
  ).min(4).max(4),
})

const getHeroContentFromFormData = (formData: FormData): HeroContent => {
  const trustItems = [0, 1, 2].map((index) => String(formData.get(`trustItem${index}`) ?? ''))
  const stats = [0, 1, 2, 3].map((index) => ({
    label: String(formData.get(`statLabel${index}`) ?? ''),
    value: String(formData.get(`statValue${index}`) ?? ''),
  }))

  return heroSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    titleSecondLead: formData.get('titleSecondLead'),
    titleSecondHighlight: formData.get('titleSecondHighlight'),
    description: formData.get('description'),
    primaryCtaLabel: formData.get('primaryCtaLabel'),
    primaryCtaLink: formData.get('primaryCtaLink'),
    secondaryCtaLabel: formData.get('secondaryCtaLabel'),
    secondaryCtaLink: formData.get('secondaryCtaLink'),
    imageUrl: formData.get('imageUrl'),
    imageAlt: formData.get('imageAlt'),
    videoUrl: formData.get('videoUrl'),
    professionalName: formData.get('professionalName'),
    professionalSubtitle: formData.get('professionalSubtitle'),
    trustItems,
    stats,
  })
}

const getActionErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? 'Dados inválidos.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro inesperado.'
}

export async function saveHeroDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getHeroContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'hero',
      content,
      userId: user.id,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/hero')

    return {
      success: true,
      message: 'Rascunho do Hero salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishHero(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('hero', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/hero')

    return {
      success: true,
      message: 'Hero publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}