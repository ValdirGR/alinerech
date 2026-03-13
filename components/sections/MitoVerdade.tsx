import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Check, AlertTriangle } from 'lucide-react';
import { defaultMythsContent, normalizeMythsContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';
import type { MythsContent } from '@/lib/content/types';

gsap.registerPlugin(ScrollTrigger);

export function MitoVerdade({ initialContent }: { initialContent?: MythsContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const facetasRef = useRef<HTMLDivElement>(null);
  const implantesRef = useRef<HTMLDivElement>(null);
  const { content } = usePublishedSection({
    sectionKey: 'myths',
    fallback: defaultMythsContent,
    normalize: normalizeMythsContent,
    initialContent,
  });

  const facetasItems = content.items.filter((item) => item.category === 'Facetas');
  const implantesItems = content.items.filter((item) => item.category === 'Implantes');

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const headerTrigger = ScrollTrigger.create({
        trigger: headerRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            headerRef.current?.children || [],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(headerTrigger);

      const facetasTrigger = ScrollTrigger.create({
        trigger: facetasRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            facetasRef.current?.children || [],
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(facetasTrigger);

      const implantesTrigger = ScrollTrigger.create({
        trigger: implantesRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            implantesRef.current?.children || [],
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(implantesTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mito-verdade"
      className="relative py-20 sm:py-28 lg:py-32 bg-linear-to-br from-[#000000] via-[#0d0d0d] to-[#1a1a1a] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#C9A962] rounded-full blur-[150px] opacity-15" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#C9A962] rounded-full blur-[180px] opacity-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <AlertTriangle className="w-4 h-4 text-[#C9A962]" />
            <span className="text-white/90 text-sm font-medium">{content.badgeText}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {content.titleLead}{' '}
            <span className="text-[#C9A962]">{content.titleHighlight}</span>
          </h2>

          <p className="text-white/70 text-lg">
            {content.description}
          </p>
        </div>

        {/* Facetas Section */}
        {facetasItems.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full bg-[#C9A962]/20 text-[#C9A962]">
                {content.facetasSectionTitle}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div ref={facetasRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {facetasItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-[#C9A962]/30 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.type === 'mito'
                    ? 'bg-red-500/20'
                    : 'bg-green-500/20'
                    }`}>
                    {item.type === 'mito' ? (
                      <X className="w-6 h-6 text-red-400" />
                    ) : (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                  </div>

                  {/* Statement */}
                  <p className="text-white font-medium text-sm mb-3 leading-snug">
                    &ldquo;{item.statement}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 mb-3" />

                  {/* Truth */}
                  <p className="text-white/70 text-xs leading-relaxed">
                    {item.truth}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implantes Section */}
        {implantesItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full bg-blue-400/20 text-blue-300">
                {content.implantesSectionTitle}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div ref={implantesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {implantesItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-blue-400/30 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.type === 'mito'
                    ? 'bg-red-500/20'
                    : 'bg-green-500/20'
                    }`}>
                    {item.type === 'mito' ? (
                      <X className="w-6 h-6 text-red-400" />
                    ) : (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                  </div>

                  {/* Statement */}
                  <p className="text-white font-medium text-sm mb-3 leading-snug">
                    &ldquo;{item.statement}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 mb-3" />

                  {/* Truth */}
                  <p className="text-white/70 text-xs leading-relaxed">
                    {item.truth}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            {content.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
