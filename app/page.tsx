import { getCurrentSection } from '@/lib/content/server';
import {
  normalizeHeaderContent,
  normalizeHeroContent,
  normalizeAboutContent,
  normalizeServicesContent,
  normalizeResultsContent,
  normalizeProcessContent,
  normalizeMythsContent,
  normalizeFeaturesContent,
  normalizeTestimonialsContent,
  normalizeFaqContent,
  normalizeContactContent,
  normalizeFooterContent,
} from '@/lib/content/defaults';
import { ClientPage, type AllSectionsContent } from './client-page';

export default async function Page() {
  const [
    header,
    hero,
    about,
    services,
    results,
    process,
    myths,
    features,
    testimonials,
    faq,
    contact,
    footer,
  ] = await Promise.all([
    getCurrentSection('header', 'published', normalizeHeaderContent),
    getCurrentSection('hero', 'published', normalizeHeroContent),
    getCurrentSection('about', 'published', normalizeAboutContent),
    getCurrentSection('services', 'published', normalizeServicesContent),
    getCurrentSection('results', 'published', normalizeResultsContent),
    getCurrentSection('process', 'published', normalizeProcessContent),
    getCurrentSection('myths', 'published', normalizeMythsContent),
    getCurrentSection('features', 'published', normalizeFeaturesContent),
    getCurrentSection('testimonials', 'published', normalizeTestimonialsContent),
    getCurrentSection('faq', 'published', normalizeFaqContent),
    getCurrentSection('contact', 'published', normalizeContactContent),
    getCurrentSection('footer', 'published', normalizeFooterContent),
  ]);

  const content: AllSectionsContent = {
    header: header?.content,
    hero: hero?.content,
    about: about?.content,
    services: services?.content,
    results: results?.content,
    process: process?.content,
    myths: myths?.content,
    features: features?.content,
    testimonials: testimonials?.content,
    faq: faq?.content,
    contact: contact?.content,
    footer: footer?.content,
  };

  return <ClientPage content={content} />;
}
