import type {
  AboutContent,
  AdminModuleDefinition,
  ContactContent,
  HeroContent,
  SectionKey,
} from '@/lib/content/types';

const normalizeStringArray = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const adminModules: AdminModuleDefinition[] = [
  {
    key: 'hero',
    label: 'Hero',
    description: 'Título principal, CTAs, vídeo, imagem e estatísticas.',
    implemented: true,
  },
  {
    key: 'about',
    label: 'Sobre',
    description: 'Texto institucional, imagem e cards de diferenciais.',
    implemented: false,
  },
  {
    key: 'services',
    label: 'Serviços',
    description: 'Serviço principal com benefícios, blocos e CTA.',
    implemented: false,
  },
  {
    key: 'results',
    label: 'Resultados',
    description: 'Galeria de imagens publicadas na seção de resultados.',
    implemented: false,
  },
  {
    key: 'process',
    label: 'Como Funciona',
    description: 'Passo a passo do tratamento com ordem e imagens.',
    implemented: false,
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Perguntas e respostas com ordenação e ativação.',
    implemented: false,
  },
  {
    key: 'contact',
    label: 'Contato',
    description: 'Informações de contato, CTA e textos do formulário.',
    implemented: false,
  },
  {
    key: 'gallery',
    label: 'Galeria',
    description: 'Biblioteca de imagens para reutilização no site.',
    implemented: false,
  },
];

export const defaultHeroContent: HeroContent = {
  badgeText: 'Especialista em Odontologia Estética',
  titleLead: 'Transforme seu',
  titleHighlight: 'sorriso',
  titleSecondLead: 'Transforme sua',
  titleSecondHighlight: 'vida',
  description:
    'Facetas em resina com tecnologia de ponta. Resultados naturais que vão além da estética — devolvem sua confiança.',
  primaryCtaLabel: 'Agendar Consulta',
  primaryCtaLink: '#contato',
  secondaryCtaLabel: 'Falar no WhatsApp',
  secondaryCtaLink: 'https://wa.me/5548996374030',
  imageUrl: '/alinevideo02.jpg',
  imageAlt: 'Apresentação Dra Aline Rech',
  videoUrl:
    'https://iframe.mediadelivery.net/embed/604126/2353cb85-56c0-40cc-8ea4-c6944d44cf99?autoplay=1',
  professionalName: 'Dra. Aline Rech',
  professionalSubtitle: 'Cirurgiã-Dentista | CRO 15756-SC',
  trustItems: ['Atendimento Humanizado', 'Tecnologia de Ponta', 'Resultados Garantidos'],
  stats: [
    { label: 'Anos de Experiência', value: '+9' },
    { label: 'Pacientes Atendidos', value: '+2.500' },
    { label: 'Foco em Estética', value: '100%' },
    { label: 'Avaliação dos Pacientes', value: '5.0' },
  ],
};

export const defaultAboutContent: AboutContent = {
  badgeText: 'Conheça a Dra. Aline Rech',
  titleLead: 'Dedicação e excelência em',
  titleHighlight: 'cada sorriso',
  paragraphs: [
    'A Dra. Aline Rech é cirurgiã-dentista com mais de 9 anos de experiência, especializada em odontologia estética e implantodontia. Sua trajetória é marcada pelo compromisso incessante em proporcionar sorrisos naturais e harmoniosos que transformam vidas.',
    'Formada por instituições renomadas, a Dra. Aline constantemente se atualiza através de cursos e congressos nacionais e internacionais, trazendo para Içara as técnicas mais modernas e inovadoras do mercado odontológico.',
    'Seu consultório foi projetado para oferecer conforto e tecnologia, garantindo que cada paciente tenha uma experiência única e resultados que superem expectativas.',
  ],
  imageUrl: '/aline02.jpg',
  imageAlt: 'Dra. Aline Rech',
  croTitle: 'CRO 15756-SC',
  croCaption: 'Registro Ativo',
  specialtyTitle: 'Especialista',
  specialtyCaption: 'Estética & Implantes',
  experienceValue: '+9',
  experienceLabel: 'Anos de\nExperiência',
  cards: [
    {
      title: 'Formação Especializada',
      description: 'Especialização em Odontologia Estética e Implantodontia',
      iconKey: 'graduation-cap',
    },
    {
      title: 'Tecnologia Avançada',
      description: 'Equipamentos de última geração para tratamentos precisos',
      iconKey: 'award',
    },
    {
      title: 'Atendimento Humanizado',
      description: 'Cuidado individualizado para cada paciente',
      iconKey: 'heart',
    },
    {
      title: 'Garantia de Resultado',
      description: 'Compromisso com a excelência e satisfação',
      iconKey: 'shield',
    },
  ],
};

export const defaultContactContent: ContactContent = {
  badgeText: 'Agende sua consulta',
  titleLead: 'Pronto para ter o',
  titleHighlight: 'sorriso dos sonhos?',
  description:
    'Entre em contato e agende sua avaliação gratuita. Vamos juntos planejar a transformação do seu sorriso com o cuidado e a excelência que você merece.',
  whatsappLabel: 'Falar no WhatsApp',
  whatsappLink: 'https://wa.me/5548996374030',
  formTitle: 'Solicite um contato',
  formDescription: 'Preencha o formulário e retornaremos em breve.',
  successTitle: 'Mensagem enviada!',
  successDescription: 'Entraremos em contato em breve.',
  privacyText: 'Ao enviar, você concorda com nossa política de privacidade.',
  infoItems: [
    {
      title: 'Telefone',
      content: '(48) 99637-4030',
      link: 'tel:+5548996374030',
      iconKey: 'phone',
    },
    {
      title: 'Endereço',
      content: 'R. Sete de Setembro, 501 - Centro, Içara - SC, 88820-000',
      link: 'https://maps.google.com',
      iconKey: 'map-pin',
    },
    {
      title: 'Horário de Atendimento',
      content: 'Seg - Sex: 08:30 às 12:00, 13:30 às 18:00 | Sáb - Dom: Fechado',
      link: null,
      iconKey: 'clock',
    },
  ],
};

export const sectionLabels: Record<SectionKey, string> = adminModules.reduce(
  (accumulator, moduleItem) => {
    accumulator[moduleItem.key] = moduleItem.label;
    return accumulator;
  },
  {} as Record<SectionKey, string>
);

export const normalizeHeroContent = (value: unknown): HeroContent => {
  if (!isRecord(value)) {
    return defaultHeroContent;
  }

  return {
    ...defaultHeroContent,
    ...value,
    trustItems: normalizeStringArray(value.trustItems, defaultHeroContent.trustItems),
    stats: Array.isArray(value.stats)
      ? value.stats
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const label = typeof item.label === 'string' ? item.label.trim() : '';
            const valueText = typeof item.value === 'string' ? item.value.trim() : '';

            if (!label || !valueText) {
              return null;
            }

            return { label, value: valueText };
          })
          .filter((item): item is HeroContent['stats'][number] => item !== null)
      : defaultHeroContent.stats,
  };
};

export const normalizeAboutContent = (value: unknown): AboutContent => {
  if (!isRecord(value)) {
    return defaultAboutContent;
  }

  return {
    ...defaultAboutContent,
    ...value,
    paragraphs: normalizeStringArray(value.paragraphs, defaultAboutContent.paragraphs),
    cards: Array.isArray(value.cards)
      ? value.cards
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const title = typeof item.title === 'string' ? item.title.trim() : '';
            const description = typeof item.description === 'string' ? item.description.trim() : '';
            const iconKey =
              item.iconKey === 'graduation-cap' ||
              item.iconKey === 'award' ||
              item.iconKey === 'heart' ||
              item.iconKey === 'shield'
                ? item.iconKey
                : null;

            if (!title || !description || !iconKey) {
              return null;
            }

            return { title, description, iconKey };
          })
          .filter((item): item is AboutContent['cards'][number] => item !== null)
      : defaultAboutContent.cards,
  };
};

export const normalizeContactContent = (value: unknown): ContactContent => {
  if (!isRecord(value)) {
    return defaultContactContent;
  }

  return {
    ...defaultContactContent,
    ...value,
    infoItems: Array.isArray(value.infoItems)
      ? value.infoItems
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const title = typeof item.title === 'string' ? item.title.trim() : '';
            const content = typeof item.content === 'string' ? item.content.trim() : '';
            const link = typeof item.link === 'string' && item.link.trim() ? item.link.trim() : null;
            const iconKey =
              item.iconKey === 'phone' || item.iconKey === 'map-pin' || item.iconKey === 'clock'
                ? item.iconKey
                : null;

            if (!title || !content || !iconKey) {
              return null;
            }

            return { title, content, link, iconKey };
          })
          .filter((item): item is ContactContent['infoItems'][number] => item !== null)
      : defaultContactContent.infoItems,
  };
};