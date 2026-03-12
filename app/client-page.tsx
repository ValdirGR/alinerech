'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Results } from '@/components/sections/Results';
import { Process } from '@/components/sections/Process';
import { MitoVerdade } from '@/components/sections/MitoVerdade';
import { Features } from '@/components/sections/Features';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import type {
  HeaderContent,
  HeroContent,
  AboutContent,
  ServicesContent,
  ResultsContent,
  ProcessContent,
  MythsContent,
  FeaturesContent,
  TestimonialsContent,
  FAQContent,
  ContactContent,
  FooterContent,
} from '@/lib/content/types';

gsap.registerPlugin(ScrollTrigger);

export type AllSectionsContent = {
  header?: HeaderContent;
  hero?: HeroContent;
  about?: AboutContent;
  services?: ServicesContent;
  results?: ResultsContent;
  process?: ProcessContent;
  myths?: MythsContent;
  features?: FeaturesContent;
  testimonials?: TestimonialsContent;
  faq?: FAQContent;
  contact?: ContactContent;
  footer?: FooterContent;
};

export function ClientPage({ content }: { content: AllSectionsContent }) {
  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header initialContent={content.header} />
      <main>
        <Hero initialContent={content.hero} />
        <About initialContent={content.about} />
        <Services initialContent={content.services} />
        <Results initialContent={content.results} />
        <Process initialContent={content.process} />
        <MitoVerdade initialContent={content.myths} />
        <Features initialContent={content.features} />
        <Testimonials initialContent={content.testimonials} />
        <FAQ initialContent={content.faq} />
        <Contact initialContent={content.contact} />
      </main>
      <Footer initialContent={content.footer} />
      <WhatsAppFloat />
    </div>
  );
}
