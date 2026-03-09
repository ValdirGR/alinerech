import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, GraduationCap, Heart, Shield } from 'lucide-react';
import { defaultAboutContent, normalizeAboutContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  'graduation-cap': GraduationCap,
  award: Award,
  heart: Heart,
  shield: Shield,
};

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { content } = usePublishedSection({
    sectionKey: 'about',
    fallback: defaultAboutContent,
    normalize: normalizeAboutContent,
  });
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      // Animação do conteúdo
      const contentTrigger = ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current?.children || [],
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(contentTrigger);

      // Animação da imagem
      const imageTrigger = ScrollTrigger.create({
        trigger: imageRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            imageRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(imageTrigger);

      // Animação dos cards
      const cardsTrigger = ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            cardsRef.current?.children || [],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(cardsTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
          {/* Content */}
          <div ref={contentRef}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#C9A962] rounded-full" />
              <span className="text-white text-sm font-medium">{content.badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {content.titleLead}{' '}
              <span className="text-[#C9A962]">{content.titleHighlight}</span>
            </h2>

            <div className="space-y-4 text-white/70 leading-relaxed">
              {content.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
                <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C9A962]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{content.croTitle}</p>
                  <p className="text-xs text-white/60">{content.croCaption}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
                <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#C9A962]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{content.specialtyTitle}</p>
                  <p className="text-xs text-white/60">{content.specialtyCaption}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={content.imageUrl}
                alt={content.imageAlt}
                className="w-full h-[500px] sm:h-[600px] object-cover object-top"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#000000]/40 via-transparent to-transparent" />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#000000] text-white rounded-2xl p-6 shadow-xl">
              <p className="text-4xl font-bold text-[#C9A962]">{content.experienceValue}</p>
              <p className="text-sm text-white/80">
                {content.experienceLabel.split('\n').map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < content.experienceLabel.split('\n').length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-[#C9A962]/30 rounded-full" />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-[#C9A962]/20 rounded-full" />
          </div>
        </div>

        {/* Diferenciais Cards */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.cards.map((item, index) => {
            const Icon = iconMap[item.iconKey];

            return (
              <div
                key={`${item.title}-${index}`}
                className="group bg-white/10 hover:bg-[#C9A962]/20 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-white/10 hover:border-[#C9A962]/30"
              >
                <div className="w-14 h-14 bg-white/10 group-hover:bg-[#C9A962] rounded-xl flex items-center justify-center mb-4 transition-colors duration-500">
                  <Icon className="w-7 h-7 text-[#C9A962] group-hover:text-[#000000] transition-colors duration-500" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-white text-lg mb-2 transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-white/60 group-hover:text-white/80 text-sm transition-colors duration-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
