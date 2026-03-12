'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { publishSectionDraft, requireAdminAccess, upsertSectionDraft } from '@/lib/content/server'
import type {
  AboutContent,
  ActionResult,
  ContactContent,
  FAQContent,
  FooterContent,
  FeaturesContent,
  HeaderContent,
  HeroContent,
  MythsContent,
  ProcessContent,
  ResultsContent,
  ServicesContent,
  TestimonialsContent,
} from '@/lib/content/types'

const navigationLinkSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
})

const headerSchema = z.object({
  logoUrl: z.string().trim().min(1, 'Informe a logo.'),
  logoAlt: z.string().trim().min(1, 'Informe o alt da logo.'),
  navLinks: z.array(navigationLinkSchema).min(6).max(6),
  ctaLabel: z.string().trim().min(1, 'Informe o CTA principal.'),
  ctaLink: z.string().trim().min(1, 'Informe o link do CTA principal.'),
  mobileTitle: z.string().trim().min(1, 'Informe o título do menu mobile.'),
  mobileSubtitle: z.string().trim().min(1, 'Informe o subtítulo do menu mobile.'),
})

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

const aboutCardIconSchema = z.enum(['graduation-cap', 'award', 'heart', 'shield'])

const aboutSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  paragraphs: z.array(z.string().trim().min(1)).min(3).max(3),
  imageUrl: z.string().trim().min(1, 'Informe a imagem principal.'),
  imageAlt: z.string().trim().min(1, 'Informe o alt da imagem.'),
  croTitle: z.string().trim().min(1, 'Informe o titulo do CRO.'),
  croCaption: z.string().trim().min(1, 'Informe a legenda do CRO.'),
  specialtyTitle: z.string().trim().min(1, 'Informe o titulo da especialidade.'),
  specialtyCaption: z.string().trim().min(1, 'Informe a legenda da especialidade.'),
  experienceValue: z.string().trim().min(1, 'Informe o destaque de experiencia.'),
  experienceLabel: z.string().trim().min(1, 'Informe a legenda de experiencia.'),
  cards: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        iconKey: aboutCardIconSchema,
      })
    )
    .min(4)
    .max(4),
})

const contactInfoIconSchema = z.enum(['phone', 'map-pin', 'clock'])

const contactSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao.'),
  whatsappLabel: z.string().trim().min(1, 'Informe o texto do WhatsApp.'),
  whatsappLink: z.string().trim().min(1, 'Informe o link do WhatsApp.'),
  formTitle: z.string().trim().min(1, 'Informe o titulo do formulario.'),
  formDescription: z.string().trim().min(1, 'Informe a descricao do formulario.'),
  successTitle: z.string().trim().min(1, 'Informe o titulo de sucesso.'),
  successDescription: z.string().trim().min(1, 'Informe a descricao de sucesso.'),
  privacyText: z.string().trim().min(1, 'Informe o texto de privacidade.'),
  infoItems: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        content: z.string().trim().min(1),
        link: z.string().trim().nullable(),
        iconKey: contactInfoIconSchema,
      })
    )
    .min(3)
    .max(3),
})

const servicesSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  serviceTitle: z.string().trim().min(1, 'Informe o titulo do serviço.'),
  serviceSubtitle: z.string().trim().min(1, 'Informe o subtitulo do serviço.'),
  highlightTitle: z.string().trim().min(1, 'Informe o título do bloco destacado.'),
  serviceDescription: z.string().trim().min(1, 'Informe a descrição do serviço.'),
  imageUrl: z.string().trim().min(1, 'Informe a imagem do serviço.'),
  imageAlt: z.string().trim().min(1, 'Informe o alt da imagem.'),
  benefits: z.array(z.string().trim().min(1)).min(5).max(5),
  primaryCtaLabel: z.string().trim().min(1, 'Informe o CTA principal.'),
  secondaryCtaLabel: z.string().trim().min(1, 'Informe o CTA secundário.'),
  limitationsTitle: z.string().trim().min(1, 'Informe o título de limitações.'),
  limitations: z.array(z.string().trim().min(1)).min(4).max(4),
  processTitle: z.string().trim().min(1, 'Informe o título do processo.'),
  processSteps: z.array(z.string().trim().min(1)).min(5).max(5),
  careTitle: z.string().trim().min(1, 'Informe o título dos cuidados.'),
  careDescription: z.string().trim().min(1, 'Informe a descrição dos cuidados.'),
  careTip: z.string().trim().min(1, 'Informe a dica final.'),
})

const faqSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  categoryTitle: z.string().trim().min(1, 'Informe o título da categoria.'),
  categoryBadge: z.string().trim().min(1, 'Informe o badge da categoria.').max(2),
  items: z
    .array(
      z.object({
        question: z.string().trim().min(1),
        answer: z.string().trim().min(1),
      })
    )
    .min(10)
    .max(10),
  ctaText: z.string().trim().min(1, 'Informe o texto do CTA.'),
  ctaLabel: z.string().trim().min(1, 'Informe o botão do CTA.'),
  ctaLink: z.string().trim().min(1, 'Informe o link do CTA.'),
})

const resultsSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  items: z
    .array(
      z.object({
        imageUrl: z.string().trim().min(1),
        alt: z.string().trim().min(1),
      })
    )
    .min(9)
    .max(9),
})

const processSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  procedureTitle: z.string().trim().min(1, 'Informe o título do procedimento.'),
  procedureSubtitle: z.string().trim().min(1, 'Informe o subtítulo do procedimento.'),
  steps: z
    .array(
      z.object({
        step: z.string().trim().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        imageUrl: z.string().trim().min(1),
      })
    )
    .min(4)
    .max(4),
  ctaText: z.string().trim().min(1, 'Informe o texto do CTA.'),
  ctaLabel: z.string().trim().min(1, 'Informe o botão do CTA.'),
})

const mythItemSchema = z.object({
  type: z.enum(['mito', 'verdade']),
  statement: z.string().trim().min(1),
  truth: z.string().trim().min(1),
  category: z.enum(['Facetas', 'Implantes']),
})

const mythsSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  items: z.array(mythItemSchema).min(8).max(8),
  disclaimer: z.string().trim().min(1, 'Informe a observação final.'),
})

const featureItemIconSchema = z.enum([
  'microscope',
  'clock',
  'users',
  'stethoscope',
  'sparkles',
  'shield-check',
  'heart-handshake',
  'trending-up',
])

const footerSocialLinkSchema = z.object({
  iconKey: z.enum(['instagram', 'facebook', 'mail']),
  href: z.string().trim().min(1),
})

const footerContactItemSchema = z.object({
  iconKey: z.enum(['map-pin', 'phone', 'clock']),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  link: z.string().trim().nullable(),
})

const footerSchema = z.object({
  logoUrl: z.string().trim().min(1, 'Informe a logo.'),
  logoAlt: z.string().trim().min(1, 'Informe o alt da logo.'),
  tagline: z.string().trim().min(1, 'Informe a tagline.'),
  description: z.string().trim().min(1, 'Informe a descrição do rodapé.'),
  socialLinks: z.array(footerSocialLinkSchema).min(3).max(3),
  quickLinksTitle: z.string().trim().min(1, 'Informe o título dos links rápidos.'),
  quickLinks: z.array(navigationLinkSchema).min(6).max(6),
  servicesTitle: z.string().trim().min(1, 'Informe o título de serviços.'),
  serviceLinks: z.array(navigationLinkSchema).min(3).max(3),
  contactTitle: z.string().trim().min(1, 'Informe o título de contato.'),
  contactItems: z.array(footerContactItemSchema).min(3).max(3),
  copyrightText: z.string().trim().min(1, 'Informe o texto de copyright.'),
  madeWithText: z.string().trim().min(1, 'Informe o texto final do rodapé.'),
})

const featuresSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  items: z
    .array(
      z.object({
        iconKey: featureItemIconSchema,
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      })
    )
    .min(8)
    .max(8),
  stats: z
    .array(
      z.object({
        value: z.string().trim().min(1),
        label: z.string().trim().min(1),
      })
    )
    .min(4)
    .max(4),
})

const testimonialsSchema = z.object({
  badgeText: z.string().trim().min(1, 'Informe o selo superior.'),
  titleLead: z.string().trim().min(1, 'Informe a primeira parte do titulo.'),
  titleHighlight: z.string().trim().min(1, 'Informe o destaque do titulo.'),
  description: z.string().trim().min(1, 'Informe a descricao da seção.'),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        imageUrl: z.string().trim().min(1),
        imageAlt: z.string().trim().min(1),
        rating: z.number().int().min(1).max(5),
        text: z.string().trim().min(1),
        procedure: z.string().trim().min(1),
      })
    )
    .min(2)
    .max(2),
  trustBadges: z.array(z.string().trim().min(1)).min(3).max(3),
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

const getHeaderContentFromFormData = (formData: FormData): HeaderContent => {
  const navLinks = Array.from({ length: 6 }, (_, index) => ({
    label: String(formData.get(`headerNavLabel${index}`) ?? ''),
    href: String(formData.get(`headerNavHref${index}`) ?? ''),
  }))

  return headerSchema.parse({
    logoUrl: formData.get('logoUrl'),
    logoAlt: formData.get('logoAlt'),
    navLinks,
    ctaLabel: formData.get('ctaLabel'),
    ctaLink: formData.get('ctaLink'),
    mobileTitle: formData.get('mobileTitle'),
    mobileSubtitle: formData.get('mobileSubtitle'),
  })
}

const getAboutContentFromFormData = (formData: FormData): AboutContent => {
  const paragraphs = [0, 1, 2].map((index) => String(formData.get(`paragraph${index}`) ?? ''))
  const cards = [0, 1, 2, 3].map((index) => ({
    title: String(formData.get(`cardTitle${index}`) ?? ''),
    description: String(formData.get(`cardDescription${index}`) ?? ''),
    iconKey: String(formData.get(`cardIcon${index}`) ?? ''),
  }))

  return aboutSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    paragraphs,
    imageUrl: formData.get('imageUrl'),
    imageAlt: formData.get('imageAlt'),
    croTitle: formData.get('croTitle'),
    croCaption: formData.get('croCaption'),
    specialtyTitle: formData.get('specialtyTitle'),
    specialtyCaption: formData.get('specialtyCaption'),
    experienceValue: formData.get('experienceValue'),
    experienceLabel: formData.get('experienceLabel'),
    cards,
  })
}

const getContactContentFromFormData = (formData: FormData): ContactContent => {
  const infoItems = [0, 1, 2].map((index) => {
    const rawLink = String(formData.get(`infoLink${index}`) ?? '').trim()

    return {
      title: String(formData.get(`infoTitle${index}`) ?? ''),
      content: String(formData.get(`infoContent${index}`) ?? ''),
      link: rawLink || null,
      iconKey: String(formData.get(`infoIcon${index}`) ?? ''),
    }
  })

  return contactSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    whatsappLabel: formData.get('whatsappLabel'),
    whatsappLink: formData.get('whatsappLink'),
    formTitle: formData.get('formTitle'),
    formDescription: formData.get('formDescription'),
    successTitle: formData.get('successTitle'),
    successDescription: formData.get('successDescription'),
    privacyText: formData.get('privacyText'),
    infoItems,
  })
}

const getServicesContentFromFormData = (formData: FormData): ServicesContent => {
  const benefits = [0, 1, 2, 3, 4].map((index) => String(formData.get(`benefit${index}`) ?? ''))
  const limitations = [0, 1, 2, 3].map((index) => String(formData.get(`limitation${index}`) ?? ''))
  const processSteps = [0, 1, 2, 3, 4].map((index) => String(formData.get(`processStep${index}`) ?? ''))

  return servicesSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    serviceTitle: formData.get('serviceTitle'),
    serviceSubtitle: formData.get('serviceSubtitle'),
    highlightTitle: formData.get('highlightTitle'),
    serviceDescription: formData.get('serviceDescription'),
    imageUrl: formData.get('imageUrl'),
    imageAlt: formData.get('imageAlt'),
    benefits,
    primaryCtaLabel: formData.get('primaryCtaLabel'),
    secondaryCtaLabel: formData.get('secondaryCtaLabel'),
    limitationsTitle: formData.get('limitationsTitle'),
    limitations,
    processTitle: formData.get('processTitle'),
    processSteps,
    careTitle: formData.get('careTitle'),
    careDescription: formData.get('careDescription'),
    careTip: formData.get('careTip'),
  })
}

const getFaqContentFromFormData = (formData: FormData): FAQContent => {
  const items = Array.from({ length: 10 }, (_, index) => ({
    question: String(formData.get(`faqQuestion${index}`) ?? ''),
    answer: String(formData.get(`faqAnswer${index}`) ?? ''),
  }))

  return faqSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    categoryTitle: formData.get('categoryTitle'),
    categoryBadge: formData.get('categoryBadge'),
    items,
    ctaText: formData.get('ctaText'),
    ctaLabel: formData.get('ctaLabel'),
    ctaLink: formData.get('ctaLink'),
  })
}

const getResultsContentFromFormData = (formData: FormData): ResultsContent => {
  const items = Array.from({ length: 9 }, (_, index) => ({
    imageUrl: String(formData.get(`resultImage${index}`) ?? ''),
    alt: String(formData.get(`resultAlt${index}`) ?? ''),
  }))

  return resultsSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    items,
  })
}

const getProcessContentFromFormData = (formData: FormData): ProcessContent => {
  const steps = Array.from({ length: 4 }, (_, index) => ({
    step: String(formData.get(`processNumber${index}`) ?? ''),
    title: String(formData.get(`processTitle${index}`) ?? ''),
    description: String(formData.get(`processDescription${index}`) ?? ''),
    imageUrl: String(formData.get(`processImage${index}`) ?? ''),
  }))

  return processSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    procedureTitle: formData.get('procedureTitle'),
    procedureSubtitle: formData.get('procedureSubtitle'),
    steps,
    ctaText: formData.get('ctaText'),
    ctaLabel: formData.get('ctaLabel'),
  })
}

const getMythsContentFromFormData = (formData: FormData): MythsContent => {
  const items = Array.from({ length: 8 }, (_, index) => ({
    type: String(formData.get(`mythType${index}`) ?? ''),
    statement: String(formData.get(`mythStatement${index}`) ?? ''),
    truth: String(formData.get(`mythTruth${index}`) ?? ''),
    category: String(formData.get(`mythCategory${index}`) ?? ''),
  }))

  return mythsSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    items,
    disclaimer: formData.get('disclaimer'),
  })
}

const getFeaturesContentFromFormData = (formData: FormData): FeaturesContent => {
  const items = Array.from({ length: 8 }, (_, index) => ({
    iconKey: String(formData.get(`featureIcon${index}`) ?? ''),
    title: String(formData.get(`featureTitle${index}`) ?? ''),
    description: String(formData.get(`featureDescription${index}`) ?? ''),
  }))

  const stats = Array.from({ length: 4 }, (_, index) => ({
    value: String(formData.get(`featureStatValue${index}`) ?? ''),
    label: String(formData.get(`featureStatLabel${index}`) ?? ''),
  }))

  return featuresSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    items,
    stats,
  })
}

const getFooterContentFromFormData = (formData: FormData): FooterContent => {
  const socialLinks = Array.from({ length: 3 }, (_, index) => ({
    iconKey: String(formData.get(`footerSocialIcon${index}`) ?? ''),
    href: String(formData.get(`footerSocialHref${index}`) ?? ''),
  }))

  const quickLinks = Array.from({ length: 6 }, (_, index) => ({
    label: String(formData.get(`footerQuickLabel${index}`) ?? ''),
    href: String(formData.get(`footerQuickHref${index}`) ?? ''),
  }))

  const serviceLinks = Array.from({ length: 3 }, (_, index) => ({
    label: String(formData.get(`footerServiceLabel${index}`) ?? ''),
    href: String(formData.get(`footerServiceHref${index}`) ?? ''),
  }))

  const contactItems = Array.from({ length: 3 }, (_, index) => {
    const rawLink = String(formData.get(`footerContactLink${index}`) ?? '').trim()

    return {
      iconKey: String(formData.get(`footerContactIcon${index}`) ?? ''),
      title: String(formData.get(`footerContactTitle${index}`) ?? ''),
      content: String(formData.get(`footerContactContent${index}`) ?? ''),
      link: rawLink || null,
    }
  })

  return footerSchema.parse({
    logoUrl: formData.get('logoUrl'),
    logoAlt: formData.get('logoAlt'),
    tagline: formData.get('tagline'),
    description: formData.get('description'),
    socialLinks,
    quickLinksTitle: formData.get('quickLinksTitle'),
    quickLinks,
    servicesTitle: formData.get('servicesTitle'),
    serviceLinks,
    contactTitle: formData.get('contactTitle'),
    contactItems,
    copyrightText: formData.get('copyrightText'),
    madeWithText: formData.get('madeWithText'),
  })
}

const getTestimonialsContentFromFormData = (formData: FormData): TestimonialsContent => {
  const items = Array.from({ length: 2 }, (_, index) => ({
    name: String(formData.get(`testimonialName${index}`) ?? ''),
    imageUrl: String(formData.get(`testimonialImage${index}`) ?? ''),
    imageAlt: String(formData.get(`testimonialImageAlt${index}`) ?? ''),
    rating: Number(formData.get(`testimonialRating${index}`) ?? 0),
    text: String(formData.get(`testimonialText${index}`) ?? ''),
    procedure: String(formData.get(`testimonialProcedure${index}`) ?? ''),
  }))

  const trustBadges = Array.from({ length: 3 }, (_, index) =>
    String(formData.get(`testimonialBadge${index}`) ?? '')
  )

  return testimonialsSchema.parse({
    badgeText: formData.get('badgeText'),
    titleLead: formData.get('titleLead'),
    titleHighlight: formData.get('titleHighlight'),
    description: formData.get('description'),
    items,
    trustBadges,
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

export async function saveHeaderDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getHeaderContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'header',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/header')

    return {
      success: true,
      message: 'Rascunho do Header salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishHeader(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('header', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/header')

    return {
      success: true,
      message: 'Header publicado com sucesso.',
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

export async function saveAboutDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getAboutContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'about',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/about')

    return {
      success: true,
      message: 'Rascunho do Sobre salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishAbout(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('about', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/about')

    return {
      success: true,
      message: 'Sobre publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveContactDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getContactContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'contact',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/contact')

    return {
      success: true,
      message: 'Rascunho do Contato salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishContact(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('contact', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/contact')

    return {
      success: true,
      message: 'Contato publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveServicesDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getServicesContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'services',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/services')

    return {
      success: true,
      message: 'Rascunho de Serviços salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishServices(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('services', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/services')

    return {
      success: true,
      message: 'Serviços publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveFaqDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getFaqContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'faq',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/faq')

    return {
      success: true,
      message: 'Rascunho do FAQ salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishFaq(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('faq', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/faq')

    return {
      success: true,
      message: 'FAQ publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveResultsDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getResultsContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'results',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/results')

    return {
      success: true,
      message: 'Rascunho de Resultados salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishResults(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('results', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/results')

    return {
      success: true,
      message: 'Resultados publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveProcessDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getProcessContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'process',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/process')

    return {
      success: true,
      message: 'Rascunho de Como Funciona salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishProcess(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('process', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/process')

    return {
      success: true,
      message: 'Como Funciona publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveMythsDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getMythsContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'myths',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/myths')

    return {
      success: true,
      message: 'Rascunho de Mito ou Verdade salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishMyths(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('myths', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/myths')

    return {
      success: true,
      message: 'Mito ou Verdade publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveFeaturesDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getFeaturesContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'features',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/features')

    return {
      success: true,
      message: 'Rascunho de Diferenciais salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishFeatures(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('features', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/features')

    return {
      success: true,
      message: 'Diferenciais publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveFooterDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getFooterContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'footer',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/footer')

    return {
      success: true,
      message: 'Rascunho do Footer salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishFooter(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('footer', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/footer')

    return {
      success: true,
      message: 'Footer publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function saveTestimonialsDraft(formData: FormData): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()
    const content = getTestimonialsContentFromFormData(formData)

    await upsertSectionDraft({
      sectionKey: 'testimonials',
      content,
      userId: user.id,
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/testimonials')

    return {
      success: true,
      message: 'Rascunho de Depoimentos salvo com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}

export async function publishTestimonials(): Promise<ActionResult> {
  try {
    const { user } = await requireAdminAccess()

    await publishSectionDraft('testimonials', user.id)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/testimonials')

    return {
      success: true,
      message: 'Depoimentos publicado com sucesso.',
    }
  } catch (error) {
    return {
      success: false,
      message: getActionErrorMessage(error),
    }
  }
}