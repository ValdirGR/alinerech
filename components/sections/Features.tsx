import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Microscope,
  Clock,
  Users,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { defaultFeaturesContent, normalizeFeaturesContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';
import type { FeaturesContent } from '@/lib/content/types';

gsap.registerPlugin(ScrollTrigger);

export function Features({ initialContent }: { initialContent?: FeaturesContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { content } = usePublishedSection({
    sectionKey: 'features',
    fallback: defaultFeaturesContent,
    normalize: normalizeFeaturesContent,
    initialContent,
  });

  const iconMap = {
    microscope: Microscope,
    clock: Clock,
    users: Users,
    stethoscope: Stethoscope,
    sparkles: Sparkles,
    'shield-check': ShieldCheck,
    'heart-handshake': HeartHandshake,
    'trending-up': TrendingUp,
  } as const;

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      // Animação do header
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

      // Animação do grid
      const gridTrigger = ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            gridRef.current?.children || [],
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(gridTrigger);

      // Animação das estatísticas
      const statsTrigger = ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            statsRef.current?.children || [],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(statsTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="diferenciais"
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
            <Sparkles className="w-4 h-4 text-[#C9A962]" />
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

        {/* Features Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {content.items.map((feature, index) => {
            const Icon = iconMap[feature.iconKey];

            return (
            <div
              key={`${feature.title}-${index}`}
              className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-[#C9A962]/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-[#C9A962]/20 group-hover:bg-[#C9A962] rounded-xl flex items-center justify-center mb-4 transition-colors duration-500">
                <Icon className="w-7 h-7 text-[#C9A962] group-hover:text-[#000000] transition-colors duration-500" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          )})}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C9A962] mb-2">
                {stat.value}
              </p>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
