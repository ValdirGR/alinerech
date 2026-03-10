import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Mail,
  Heart
} from 'lucide-react';
import Image from 'next/image';
import { defaultFooterContent, normalizeFooterContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = usePublishedSection({
    sectionKey: 'footer',
    fallback: defaultFooterContent,
    normalize: normalizeFooterContent,
  });

  const socialIconMap = {
    instagram: Instagram,
    facebook: Facebook,
    mail: Mail,
  } as const;

  const contactIconMap = {
    'map-pin': MapPin,
    phone: Phone,
    clock: Clock,
  } as const;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#000000] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Image
                src={content.logoUrl}
                alt={content.logoAlt}
                width={264}
                height={84}
                className="h-14 md:h-16 w-auto object-contain mb-3 brightness-0 invert"
              />
              <p className="text-white/60 text-sm mt-1">{content.tagline}</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {content.description}
            </p>
            <div className="flex gap-3">
              {content.socialLinks.map((item, index) => {
                const Icon = socialIconMap[item.iconKey];

                return (
                  <a
                    key={`${item.iconKey}-${index}`}
                    href={item.href}
                    target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="w-10 h-10 bg-white/10 hover:bg-[#C9A962] rounded-lg flex items-center justify-center transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">{content.quickLinksTitle}</h4>
            <ul className="space-y-3">
              {content.quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/70 hover:text-[#C9A962] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">{content.servicesTitle}</h4>
            <ul className="space-y-3">
              {content.serviceLinks.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(service.href)}
                    className="text-white/70 hover:text-[#C9A962] transition-colors text-sm"
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">{content.contactTitle}</h4>
            <ul className="space-y-4">
              {content.contactItems.map((item, index) => {
                const Icon = contactIconMap[item.iconKey];
                const lines = item.content.split('\n');

                return (
                  <li key={`${item.iconKey}-${index}`} className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 text-[#C9A962] shrink-0 ${item.iconKey === 'map-pin' ? 'mt-0.5' : ''}`} />
                    {item.link ? (
                      <a href={item.link} className="text-white/70 hover:text-[#C9A962] transition-colors text-sm">
                        {lines.map((line, lineIndex) => (
                          <span key={lineIndex} className="block">{line}</span>
                        ))}
                      </a>
                    ) : (
                      <span className="text-white/70 text-sm">
                        {lines.map((line, lineIndex) => (
                          <span key={lineIndex} className="block">{line}</span>
                        ))}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center sm:text-left">
              © {currentYear} {content.copyrightText}
            </p>
            <p className="text-white/50 text-sm flex items-center gap-1">
              {content.madeWithText.includes('amor') ? 'Feito com ' : ''}
              <Heart className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
              <span>{content.madeWithText.replace('Feito com amor ', '').replace('Feito com ', '')}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
