import type {
  AboutContent,
  AdminModuleDefinition,
  ContactContent,
  FAQContent,
  FooterContent,
  FeaturesContent,
  HeaderContent,
  HeroContent,
  MythsContent,
  ProcessContent,
  ResultsContent,
  SectionKey,
  ServicesContent,
  TestimonialsContent,
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
    key: 'header',
    label: 'Header',
    description: 'Logo, menu principal e CTA do topo do site.',
    implemented: true,
  },
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
    implemented: true,
  },
  {
    key: 'services',
    label: 'Serviços',
    description: 'Serviço principal com benefícios, blocos e CTA.',
    implemented: true,
  },
  {
    key: 'results',
    label: 'Resultados',
    description: 'Galeria de imagens publicadas na seção de resultados.',
    implemented: true,
  },
  {
    key: 'process',
    label: 'Como Funciona',
    description: 'Passo a passo do tratamento com ordem e imagens.',
    implemented: true,
  },
  {
    key: 'myths',
    label: 'Mito ou Verdade',
    description: 'Cards de objeções, verdades e nota explicativa da seção.',
    implemented: true,
  },
  {
    key: 'features',
    label: 'Diferenciais',
    description: 'Cards de diferenciais e indicadores de confiança da clínica.',
    implemented: true,
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Perguntas e respostas com ordenação e ativação.',
    implemented: true,
  },
  {
    key: 'contact',
    label: 'Contato',
    description: 'Informações de contato, CTA e textos do formulário.',
    implemented: true,
  },
  {
    key: 'testimonials',
    label: 'Depoimentos',
    description: 'Carrossel de depoimentos, avaliações e selos de confiança.',
    implemented: true,
  },
  {
    key: 'gallery',
    label: 'Galeria',
    description: 'Biblioteca de imagens para reutilização no site.',
    implemented: true,
  },
  {
    key: 'footer',
    label: 'Footer',
    description: 'Links, contato, redes sociais e textos do rodapé.',
    implemented: true,
  },
];

export const defaultHeaderContent: HeaderContent = {
  logoUrl: '/logo-aline.png',
  logoAlt: 'Dra. Aline Rech',
  navLinks: [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Processo', href: '#processo' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ],
  ctaLabel: 'Agendar',
  ctaLink: 'https://wa.me/5548996374030',
  mobileTitle: 'Dra. Aline Rech - Odontologia Estética',
  mobileSubtitle: 'Içara, SC',
};

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
    'A Dra. Aline Rech é cirurgiã-dentista com mais de 9 anos de experiência, especializada em odontologia e implantodontia. Sua trajetória é marcada pelo compromisso incessante em proporcionar sorrisos naturais e harmoniosos que transformam vidas.',
    'Formada por instituições renomadas, a Dra. Aline constantemente se atualiza através de cursos e congressos nacionais, trazendo para Içara as técnicas mais modernas e inovadoras do mercado odontológico.',
    'Seu consultório foi projetado para oferecer conforto e tecnologia, garantindo que cada paciente tenha uma experiência única e resultados que superem expectativas.',
  ],
  imageUrl: '/aline02.jpg',
  imageAlt: 'Dra. Aline Rech',
  croTitle: 'CRO 15756-SC',
  croCaption: 'Registro Ativo',
  specialtyTitle: '+ de 25 cursos',
  specialtyCaption: 'Em Ondotologia Estética com enfâse em Facetas',
  experienceValue: '+9',
  experienceLabel: 'Anos de\nExperiência',
  cards: [
    {
      title: 'Formação Especializada',
      description: 'Especialista em Implantodontia + de 25 cursos em facetas de resina composta',
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

export const defaultServicesContent: ServicesContent = {
  badgeText: 'Nossos Tratamentos',
  titleLead: 'Especialidades que',
  titleHighlight: 'transformam vidas',
  description:
    'Oferecemos tratamentos odontológicos de excelência com foco em estética e saúde. Cada procedimento é personalizado para atender às suas necessidades específicas.',
  serviceTitle: 'Facetas em Resina',
  serviceSubtitle: 'Confira os benefícios',
  highlightTitle: 'Transformação imediata do seu sorriso',
  serviceDescription:
    'As facetas em resina são laminados diretos de resina composta aplicados sobre a face do dente. São a solução ideal para quem busca um sorriso perfeito de forma rápida e acessível, corrigindo imperfeições como manchas, espaços entre dentes, dentes desalinhados ou desgastados.',
  imageUrl: '/facetas-resina.jpg',
  imageAlt: 'Facetas em Resina',
  benefits: [
    'Resultado estético em uma única consulta',
    'Geralmente zero desgaste de dente em relação a outras técnicas',
    'Custo mais acessível que facetas cerâmicas',
    'Reparos e ajustes feitos diretamente no consultório',
    'Procedimento minimamente invasivo e reversível',
  ],
  primaryCtaLabel: 'Quero minhas facetas',
  secondaryCtaLabel: 'Saiba mais',
  limitationsTitle: 'Limitações',
  limitations: [
    'Durabilidade média de 5-7 anos',
    'Suscetíveis a manchas e perda de brilho',
    'Contraindicação em bruxismo severo',
    'Não indicado para dentes muito escurecidos',
  ],
  processTitle: 'Como é o Processo',
  processSteps: [
    'Avaliação clínica e planejamento estético',
    'Fotos e possível mock-up',
    'Preparo mínimo (quando necessário)',
    'Escultura da resina dente a dente',
    'Acabamento e polimento final',
  ],
  careTitle: 'Cuidados Após',
  careDescription:
    'Evitar alimentos muito duros, não usar dentes como abridor, manter boa higiene bucal e fazer polimentos periódicos no consultório.',
  careTip:
    'Reduza café, vinho tinto e refrigerantes de cola para manter o brilho por mais tempo.',
};

export const defaultFaqContent: FAQContent = {
  badgeText: 'Tire suas dúvidas',
  titleLead: 'Perguntas',
  titleHighlight: 'Frequentes',
  description:
    'Esclarecemos as principais dúvidas sobre nossos tratamentos para que você tome a melhor decisão com segurança e confiança.',
  categoryTitle: 'Facetas em Resina',
  categoryBadge: 'F',
  items: [
    {
      question: 'O que são facetas de resina?',
      answer:
        'Facetas de resina são laminados diretos de resina composta aplicados sobre a face do dente. São utilizadas para corrigir cor, pequenas fraturas, leves desalinhamentos e formato dos dentes, proporcionando um sorriso mais harmonioso e bonito de forma rápida e acessível.',
    },
    {
      question: 'Quanto tempo dura?',
      answer:
        'A durabilidade média das facetas em resina é de 5 a 7 anos, dependendo dos hábitos do paciente. Fatores como higiene bucal, alimentação, bruxismo e hábitos como roer unhas podem influenciar diretamente na longevidade do tratamento. Com cuidados adequados e manutenção periódica, é possível prolongar bastante a vida útil das facetas.',
    },
    {
      question: 'Vai estragar meus dentes?',
      answer:
        'Não. Na maioria dos casos, o desgaste é zero. Em situações específicas, pode ser necessário um pequeno preparo — sempre mínimo e controlado.',
    },
    {
      question: 'Fica artificial?',
      answer:
        'Quando feitas por um profissional experiente, as facetas em resina ficam extremamente naturais. A resina composta permite personalização da cor, transparência e formato, imitando a aparência dos dentes naturais.',
    },
    {
      question: 'Quais são os cuidados depois?',
      answer:
        'Os cuidados incluem evitar alimentos muito duros ou pegajosos, não usar os dentes como abridor, manter higiene bucal rigorosa, fazer polimentos periódicos e evitar hábitos como roer unhas ou objetos.',
    },
    {
      question: 'Posso fazer se tenho bruxismo?',
      answer:
        'Sim! A resina composta é o material com propriedades mais semelhantes ao dente natural — por isso é excelente para quem tem bruxismo, devolvendo a estrutura perdida pelo desgaste. O uso de placa de proteção noturna é recomendado para preservar o resultado.',
    },
    {
      question: 'Mancha ou fica amarelo com o tempo?',
      answer:
        'Sim, a resina pode perder brilho e pigmentar com o tempo, especialmente com consumo frequente de alimentos e bebidas pigmentantes. Isso pode ser minimizado com higiene adequada e manutenção regular.',
    },
    {
      question: 'Dói para fazer?',
      answer:
        'Geralmente é um procedimento pouco invasivo e praticamente indolor. Na maioria dos casos, não é necessária anestesia, pois o preparo do dente é mínimo ou inexistente.',
    },
    {
      question: 'Qual a diferença para lente de contato ou porcelana?',
      answer:
        'A resina é mais acessível, o procedimento é mais rápido, muitas vezes em uma única consulta, e permite reparos diretos. Já as facetas de porcelana têm maior durabilidade e resistência a manchas, mas exigem mais investimento.',
    },
    {
      question: 'Serve para qualquer caso?',
      answer:
        'Não. Dentes muito escurecidos, desgastes intensos, bruxismo severo ou casos que exigem grandes alterações de posição podem necessitar de outras abordagens. A avaliação clínica é fundamental para indicar o melhor tratamento.',
    },
  ],
  ctaText: 'Ainda tem dúvidas? Entre em contato diretamente pelo WhatsApp.',
  ctaLabel: 'Falar no WhatsApp',
  ctaLink: 'https://wa.me/5548996374030',
};

export const defaultResultsContent: ResultsContent = {
  badgeText: 'Casos Clínicos',
  titleLead: 'Nossos',
  titleHighlight: 'Resultados',
  description:
    'Veja algumas das incríveis transformações que já realizamos. Sorrisos reais, vidas renovadas e a excelência estética em cada detalhe.',
  items: [
    { imageUrl: '/results/foto01.jpeg', alt: 'Antes e Depois 1' },
    { imageUrl: '/results/foto02.jpeg', alt: 'Antes e Depois 2' },
    { imageUrl: '/results/foto03.jpeg', alt: 'Antes e Depois 3' },
    { imageUrl: '/results/foto04.jpeg', alt: 'Antes e Depois 4' },
    { imageUrl: '/results/foto05.jpeg', alt: 'Antes e Depois 5' },
    { imageUrl: '/results/foto06.jpeg', alt: 'Antes e Depois 6' },
    { imageUrl: '/results/foto07.jpeg', alt: 'Antes e Depois 7' },
    { imageUrl: '/results/foto09.jpeg', alt: 'Antes e Depois 8' },
    { imageUrl: '/results/foto10.jpeg', alt: 'Antes e Depois 9' },
  ],
};

export const defaultProcessContent: ProcessContent = {
  badgeText: 'Como Funciona',
  titleLead: 'O passo a passo do seu',
  titleHighlight: 'tratamento',
  description:
    'Conheça cada etapa dos nossos procedimentos. Transparência e clareza para você se sentir seguro em cada momento.',
  procedureTitle: 'Facetas em Resina',
  procedureSubtitle: 'Procedimento completo em uma única consulta',
  steps: [
    {
      step: '01',
      title: 'Avaliação Clínica',
      description: 'Exame detalhado da saúde bucal, análise do sorriso e discussão das expectativas do paciente.',
      imageUrl: '/process-avaliacao02.jpg',
    },
    {
      step: '02',
      title: 'Fotos e Planejamento',
      description: 'Registro fotográfico e planejamento estético digital para visualizar o resultado esperado.',
      imageUrl: '/process-planejamento02.jpg',
    },
    {
      step: '03',
      title: 'Aplicação da Resina',
      description: 'Escultura artística da resina composta dente a dente, camada por camada, com cura a luz.',
      imageUrl: '/process-aplicacao02.jpg',
    },
    {
      step: '04',
      title: 'Acabamento e Polimento',
      description: 'Ajuste da mordida, polimento para brilho natural e instruções de cuidados pós-procedimento.',
      imageUrl: '/process-acabamento03.jpg',
    },
  ],
  ctaText: 'Quer saber mais detalhes sobre o seu caso específico?',
  ctaLabel: 'Agendar Avaliação',
};

export const defaultMythsContent: MythsContent = {
  badgeText: 'Desvendando Mitos',
  titleLead: 'Mito ou',
  titleHighlight: 'Verdade?',
  description:
    'Separamos os principais mitos e verdades sobre facetas e implantes para que você tenha informações claras e tome a melhor decisão.',
  facetasSectionTitle: 'Facetas em Resina',
  implantesSectionTitle: 'Implantes Dentários',
  items: [
    {
      type: 'mito',
      statement: 'Facetas em resina estragam os dentes',
      truth: 'Falso! Na maioria dos casos, o desgaste é zero. Em situações específicas, pode ser necessário um pequeno preparo.',
      category: 'Facetas',
    },
    {
      type: 'mito',
      statement: 'Implante dentário dói muito',
      truth: 'FALSO! A cirurgia é feita com anestesia local e o desconforto pós-operatório é controlável com medicamentos. A maioria dos pacientes se surpreende com a tranquilidade do procedimento.',
      category: 'Implantes',
    },
    {
      type: 'mito',
      statement: 'Facetas de resina duram para sempre',
      truth: 'FALSO! A durabilidade média é de 5-7 anos. Manutenção periódica e bons hábitos são essenciais para prolongar a vida útil.',
      category: 'Facetas',
    },
    {
      type: 'mito',
      statement: 'Implante pode ser rejeitado pelo corpo',
      truth: 'FALSO! O titânio é biocompatível. O que ocorre é falha de osseointegração em raros casos (2-5%), que pode ser corrigida com novo planejamento.',
      category: 'Implantes',
    },
    {
      type: 'mito',
      statement: 'Não posso fazer implante se não tenho osso suficiente',
      truth: 'FALSO! Técnicas modernas de enxerto ósseo e implantes especiais permitem tratamento mesmo em casos de perda óssea avançada.',
      category: 'Implantes',
    },
    {
      type: 'verdade',
      statement: 'Facetas de resina podem manchar com o tempo',
      truth: 'VERDADE! A resina pode pigmentar com alimentos e bebidas. Polimentos periódicos e higiene adequada ajudam a manter a estética.',
      category: 'Facetas',
    },
    {
      type: 'verdade',
      statement: 'Higiene é fundamental para a saúde do implante',
      truth: 'VERDADE! A peri-implantite (inflamação ao redor do implante) pode ser evitada com escovação adequada e consultas de manutenção regulares.',
      category: 'Implantes',
    },
    {
      type: 'mito',
      statement: 'Quem tem bruxismo não pode colocar facetas!',
      truth: 'FALSO! Resina composta e o material com propriedades mais parecidas com o nosso dente natural que existe! Quando bem elaboradaa são as melhores indicações para devolver a estrutura perdida pelo desgaste do bruxismo',
      category: 'Facetas',
    },
  ],
  disclaimer:
    '* As informações acima são baseadas em evidências científicas e experiência clínica. Cada caso é único e deve ser avaliado individualmente durante a consulta.',
};

export const defaultFeaturesContent: FeaturesContent = {
  badgeText: 'Por que nos escolher',
  titleLead: 'O que nos torna',
  titleHighlight: 'diferentes',
  description:
    'Compromisso com a excelência, tecnologia de ponta e um atendimento que coloca você no centro de tudo.',
  items: [
    {
      iconKey: 'microscope',
      title: 'Tecnologia de Ponta',
      description: 'Equipamentos modernos que garantem precisão e conforto em todos os procedimentos.',
    },
    {
      iconKey: 'clock',
      title: 'Agilidade',
      description: 'Procedimentos otimizados para você ter resultado no menor tempo possível.',
    },
    {
      iconKey: 'users',
      title: 'Equipe Especializada',
      description: 'Profissionais altamente qualificados e em constante atualização.',
    },
    {
      iconKey: 'stethoscope',
      title: 'Avaliação Completa',
      description: 'Diagnóstico detalhado com planejamento personalizado para cada caso.',
    },
    {
      iconKey: 'sparkles',
      title: 'Resultados Naturais',
      description: 'Sorrisos harmoniosos que preservam sua identidade e expressão.',
    },
    {
      iconKey: 'shield-check',
      title: 'Protocolos de Segurança',
      description: 'Rigorosa biossegurança e esterilização em todos os procedimentos.',
    },
    {
      iconKey: 'heart-handshake',
      title: 'Acompanhamento',
      description: 'Suporte contínuo antes, durante e após o tratamento.',
    },
    {
      iconKey: 'trending-up',
      title: 'Alta Satisfação',
      description: 'Pacientes que recomendam e voltam para novos tratamentos.',
    },
  ],
  stats: [
    { value: '2.500+', label: 'Pacientes Atendidos' },
    { value: '9+', label: 'Anos de Experiência' },
    { value: '5.0', label: 'Avaliação Média' },
    { value: '98%', label: 'Taxa de Satisfação' },
  ],
};

export const defaultFooterContent: FooterContent = {
  logoUrl: '/logo-aline.png',
  logoAlt: 'Dra. Aline Rech',
  tagline: 'Odontologia Estética',
  description:
    'Transformando sorrisos e vidas através da odontologia estética de excelência. Seu sorriso perfeito começa aqui.',
  socialLinks: [
    { iconKey: 'instagram', href: 'https://instagram.com' },
    { iconKey: 'facebook', href: 'https://facebook.com' },
    { iconKey: 'mail', href: 'mailto:contato@draalinerech.com.br' },
  ],
  quickLinksTitle: 'Links Rápidos',
  quickLinks: [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Processo', href: '#processo' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ],
  servicesTitle: 'Serviços',
  serviceLinks: [
    { label: 'Facetas em Resina', href: '#servicos' },
    { label: 'Odontologia Estética', href: '#servicos' },
    { label: 'Avaliação Gratuita', href: '#contato' },
  ],
  contactTitle: 'Contato',
  contactItems: [
    {
      iconKey: 'map-pin',
      title: 'Endereço',
      content: 'R. Sete de Setembro, 501 - Centro\nIçara - SC, 88820-000',
      link: null,
    },
    {
      iconKey: 'phone',
      title: 'Telefone',
      content: '(48) 99637-4030',
      link: 'tel:+5548996374030',
    },
    {
      iconKey: 'clock',
      title: 'Horário',
      content: 'Seg - Sex: 08:30 às 12:00, 13:30 às 18:00\nSáb - Dom: Fechado',
      link: null,
    },
  ],
  copyrightText: 'Dra. Aline Rech. Todos os direitos reservados.',
  madeWithText: 'Feito com amor em Içara, SC',
};

export const defaultTestimonialsContent: TestimonialsContent = {
  badgeText: 'Depoimentos',
  titleLead: 'O que nossos pacientes',
  titleHighlight: 'dizem',
  description:
    'A satisfação dos nossos pacientes é o nosso maior orgulho. Conheça histórias reais de transformação.',
  items: [
    {
      name: 'Mariana Silva',
      imageUrl: '/paciente-1.jpg',
      imageAlt: 'Mariana Silva',
      rating: 5,
      text: 'Fiz facetas em resina com a Dra. Aline e o resultado superou todas as minhas expectativas. Meu sorriso ficou natural e lindo! O atendimento foi impecável do início ao fim. Recomendo de olhos fechados.',
      procedure: 'Facetas em Resina',
    },
    {
      name: 'Ana Paula',
      imageUrl: '/paciente-3.jpg',
      imageAlt: 'Ana Paula',
      rating: 5,
      text: 'A Dra. Aline tem mãos de fada! Minhas facetas ficaram exatamente como eu sonhava. O consultório é maravilhoso, a equipe é super atenciosa e o resultado é incrível.',
      procedure: 'Facetas em Resina',
    },
  ],
  trustBadges: ['Avaliação 5.0 no Google', '+100 Depoimentos', '98% de Satisfação'],
};

export const sectionLabels: Record<SectionKey, string> = adminModules.reduce(
  (accumulator, moduleItem) => {
    accumulator[moduleItem.key] = moduleItem.label;
    return accumulator;
  },
  {} as Record<SectionKey, string>
);

export const normalizeHeaderContent = (value: unknown): HeaderContent => {
  if (!isRecord(value)) {
    return defaultHeaderContent;
  }

  return {
    ...defaultHeaderContent,
    ...value,
    navLinks: Array.isArray(value.navLinks)
      ? value.navLinks
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const label = typeof item.label === 'string' ? item.label.trim() : '';
            const href = typeof item.href === 'string' ? item.href.trim() : '';

            if (!label || !href) {
              return null;
            }

            return { label, href };
          })
          .filter((item): item is HeaderContent['navLinks'][number] => item !== null)
      : defaultHeaderContent.navLinks,
  };
};

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

export const normalizeServicesContent = (value: unknown): ServicesContent => {
  if (!isRecord(value)) {
    return defaultServicesContent;
  }

  return {
    ...defaultServicesContent,
    ...value,
    benefits: normalizeStringArray(value.benefits, defaultServicesContent.benefits),
    limitations: normalizeStringArray(value.limitations, defaultServicesContent.limitations),
    processSteps: normalizeStringArray(value.processSteps, defaultServicesContent.processSteps),
  };
};

export const normalizeFaqContent = (value: unknown): FAQContent => {
  if (!isRecord(value)) {
    return defaultFaqContent;
  }

  return {
    ...defaultFaqContent,
    ...value,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const question = typeof item.question === 'string' ? item.question.trim() : '';
            const answer = typeof item.answer === 'string' ? item.answer.trim() : '';

            if (!question || !answer) {
              return null;
            }

            return { question, answer };
          })
          .filter((item): item is FAQContent['items'][number] => item !== null)
      : defaultFaqContent.items,
  };
};

export const normalizeResultsContent = (value: unknown): ResultsContent => {
  if (!isRecord(value)) {
    return defaultResultsContent;
  }

  return {
    ...defaultResultsContent,
    ...value,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const imageUrl = typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '';
            const alt = typeof item.alt === 'string' ? item.alt.trim() : '';

            if (!imageUrl || !alt) {
              return null;
            }

            return { imageUrl, alt };
          })
          .filter((item): item is ResultsContent['items'][number] => item !== null)
      : defaultResultsContent.items,
  };
};

export const normalizeProcessContent = (value: unknown): ProcessContent => {
  if (!isRecord(value)) {
    return defaultProcessContent;
  }

  return {
    ...defaultProcessContent,
    ...value,
    steps: Array.isArray(value.steps)
      ? value.steps
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const step = typeof item.step === 'string' ? item.step.trim() : '';
            const title = typeof item.title === 'string' ? item.title.trim() : '';
            const description = typeof item.description === 'string' ? item.description.trim() : '';
            const imageUrl = typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '';

            if (!step || !title || !description || !imageUrl) {
              return null;
            }

            return { step, title, description, imageUrl };
          })
          .filter((item): item is ProcessContent['steps'][number] => item !== null)
      : defaultProcessContent.steps,
  };
};

export const normalizeMythsContent = (value: unknown): MythsContent => {
  if (!isRecord(value)) {
    return defaultMythsContent;
  }

  return {
    ...defaultMythsContent,
    ...value,
    facetasSectionTitle:
      typeof value.facetasSectionTitle === 'string'
        ? value.facetasSectionTitle
        : defaultMythsContent.facetasSectionTitle,
    implantesSectionTitle:
      typeof value.implantesSectionTitle === 'string'
        ? value.implantesSectionTitle
        : defaultMythsContent.implantesSectionTitle,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const type = item.type === 'mito' || item.type === 'verdade' ? item.type : null;
            const category = item.category === 'Facetas' || item.category === 'Implantes' ? item.category : null;
            const statement = typeof item.statement === 'string' ? item.statement.trim() : '';
            const truth = typeof item.truth === 'string' ? item.truth.trim() : '';

            if (!type || !category || !statement || !truth) {
              return null;
            }

            return { type, category, statement, truth };
          })
          .filter((item): item is MythsContent['items'][number] => item !== null)
      : defaultMythsContent.items,
  };
};

export const normalizeFeaturesContent = (value: unknown): FeaturesContent => {
  if (!isRecord(value)) {
    return defaultFeaturesContent;
  }

  return {
    ...defaultFeaturesContent,
    ...value,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const iconKey =
              item.iconKey === 'microscope' ||
              item.iconKey === 'clock' ||
              item.iconKey === 'users' ||
              item.iconKey === 'stethoscope' ||
              item.iconKey === 'sparkles' ||
              item.iconKey === 'shield-check' ||
              item.iconKey === 'heart-handshake' ||
              item.iconKey === 'trending-up'
                ? item.iconKey
                : null;
            const title = typeof item.title === 'string' ? item.title.trim() : '';
            const description = typeof item.description === 'string' ? item.description.trim() : '';

            if (!iconKey || !title || !description) {
              return null;
            }

            return { iconKey, title, description };
          })
          .filter((item): item is FeaturesContent['items'][number] => item !== null)
      : defaultFeaturesContent.items,
    stats: Array.isArray(value.stats)
      ? value.stats
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const valueText = typeof item.value === 'string' ? item.value.trim() : '';
            const label = typeof item.label === 'string' ? item.label.trim() : '';

            if (!valueText || !label) {
              return null;
            }

            return { value: valueText, label };
          })
          .filter((item): item is FeaturesContent['stats'][number] => item !== null)
      : defaultFeaturesContent.stats,
  };
};

export const normalizeFooterContent = (value: unknown): FooterContent => {
  if (!isRecord(value)) {
    return defaultFooterContent;
  }

  return {
    ...defaultFooterContent,
    ...value,
    socialLinks: Array.isArray(value.socialLinks)
      ? value.socialLinks
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const iconKey =
              item.iconKey === 'instagram' || item.iconKey === 'facebook' || item.iconKey === 'mail'
                ? item.iconKey
                : null;
            const href = typeof item.href === 'string' ? item.href.trim() : '';

            if (!iconKey || !href) {
              return null;
            }

            return { iconKey, href };
          })
          .filter((item): item is FooterContent['socialLinks'][number] => item !== null)
      : defaultFooterContent.socialLinks,
    quickLinks: Array.isArray(value.quickLinks)
      ? value.quickLinks
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const label = typeof item.label === 'string' ? item.label.trim() : '';
            const href = typeof item.href === 'string' ? item.href.trim() : '';

            if (!label || !href) {
              return null;
            }

            return { label, href };
          })
          .filter((item): item is FooterContent['quickLinks'][number] => item !== null)
      : defaultFooterContent.quickLinks,
    serviceLinks: Array.isArray(value.serviceLinks)
      ? value.serviceLinks
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const label = typeof item.label === 'string' ? item.label.trim() : '';
            const href = typeof item.href === 'string' ? item.href.trim() : '';

            if (!label || !href) {
              return null;
            }

            return { label, href };
          })
          .filter((item): item is FooterContent['serviceLinks'][number] => item !== null)
      : defaultFooterContent.serviceLinks,
    contactItems: Array.isArray(value.contactItems)
      ? value.contactItems
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const iconKey =
              item.iconKey === 'map-pin' || item.iconKey === 'phone' || item.iconKey === 'clock'
                ? item.iconKey
                : null;
            const title = typeof item.title === 'string' ? item.title.trim() : '';
            const content = typeof item.content === 'string' ? item.content.trim() : '';
            const link = typeof item.link === 'string' && item.link.trim() ? item.link.trim() : null;

            if (!iconKey || !title || !content) {
              return null;
            }

            return { iconKey, title, content, link };
          })
          .filter((item): item is FooterContent['contactItems'][number] => item !== null)
      : defaultFooterContent.contactItems,
  };
};

export const normalizeTestimonialsContent = (value: unknown): TestimonialsContent => {
  if (!isRecord(value)) {
    return defaultTestimonialsContent;
  }

  return {
    ...defaultTestimonialsContent,
    ...value,
    items: Array.isArray(value.items)
      ? value.items
          .map((item) => {
            if (!isRecord(item)) {
              return null;
            }

            const name = typeof item.name === 'string' ? item.name.trim() : '';
            const imageUrl = typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '';
            const imageAlt = typeof item.imageAlt === 'string' ? item.imageAlt.trim() : '';
            const procedure = typeof item.procedure === 'string' ? item.procedure.trim() : '';
            const text = typeof item.text === 'string' ? item.text.trim() : '';
            const rating =
              typeof item.rating === 'number' && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5
                ? item.rating
                : null;

            if (!name || !imageUrl || !imageAlt || !procedure || !text || rating === null) {
              return null;
            }

            return { name, imageUrl, imageAlt, procedure, text, rating };
          })
          .filter((item): item is TestimonialsContent['items'][number] => item !== null)
      : defaultTestimonialsContent.items,
    trustBadges: normalizeStringArray(value.trustBadges, defaultTestimonialsContent.trustBadges),
  };
};