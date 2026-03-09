export type SectionKey =
  | 'hero'
  | 'about'
  | 'services'
  | 'results'
  | 'process'
  | 'faq'
  | 'contact'
  | 'gallery';

export type SectionStatus = 'draft' | 'published';

export type AdminRole = 'admin' | 'editor';

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  titleSecondLead: string;
  titleSecondHighlight: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  professionalName: string;
  professionalSubtitle: string;
  trustItems: string[];
  stats: HeroStat[];
}

export interface AboutCard {
  title: string;
  description: string;
  iconKey: 'graduation-cap' | 'award' | 'heart' | 'shield';
}

export interface AboutContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  croTitle: string;
  croCaption: string;
  specialtyTitle: string;
  specialtyCaption: string;
  experienceValue: string;
  experienceLabel: string;
  cards: AboutCard[];
}

export interface ContactInfoItem {
  title: string;
  content: string;
  link: string | null;
  iconKey: 'phone' | 'map-pin' | 'clock';
}

export interface ContactContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  whatsappLabel: string;
  whatsappLink: string;
  formTitle: string;
  formDescription: string;
  successTitle: string;
  successDescription: string;
  privacyText: string;
  infoItems: ContactInfoItem[];
}

export interface ServicesContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  serviceTitle: string;
  serviceSubtitle: string;
  serviceDescription: string;
  imageUrl: string;
  imageAlt: string;
  benefits: string[];
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  limitationsTitle: string;
  limitations: string[];
  processTitle: string;
  processSteps: string[];
  careTitle: string;
  careDescription: string;
  careTip: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  categoryTitle: string;
  categoryBadge: string;
  items: FAQItem[];
  ctaText: string;
  ctaLabel: string;
  ctaLink: string;
}

export interface ResultItem {
  imageUrl: string;
  alt: string;
}

export interface ResultsContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  items: ResultItem[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ProcessContent {
  badgeText: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  procedureTitle: string;
  procedureSubtitle: string;
  steps: ProcessStep[];
  ctaText: string;
  ctaLabel: string;
}

export interface MediaAssetRecord {
  id: string;
  module: string;
  bucketName: string;
  filePath: string;
  publicUrl: string;
  altText: string | null;
  createdAt: string;
}

export interface SiteSectionRecord<TContent> {
  id: string;
  sectionKey: SectionKey;
  status: SectionStatus;
  version: number;
  content: TContent;
  isCurrent: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface SectionSnapshot<TContent> {
  draft: SiteSectionRecord<TContent> | null;
  published: SiteSectionRecord<TContent> | null;
  current: TContent;
}

export interface AdminModuleDefinition {
  key: SectionKey;
  label: string;
  description: string;
  implemented: boolean;
}

export interface DashboardModuleSummary extends AdminModuleDefinition {
  hasPublished: boolean;
  hasDraft: boolean;
  publishedAt: string | null;
  draftUpdatedAt: string | null;
}

export interface LeadInput {
  name: string;
  phone: string;
  email: string;
  message: string;
  source?: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  status: 'new' | 'in_contact' | 'converted' | 'archived';
  createdAt: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
}