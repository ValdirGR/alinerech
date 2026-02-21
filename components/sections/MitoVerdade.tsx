import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Check, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function MitoVerdade() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const mitos = [
    {
      type: 'mito',
      statement: 'Facetas em resina estragam os dentes',
      truth: 'FALSO! O desgaste é mínimo e planejado para preservar a estrutura dental. Na maioria dos casos, o preparo é conservador ou até inexistente.',
      category: 'Facetas'
    },
    {
      type: 'mito',
      statement: 'Implante dentário dói muito',
      truth: 'FALSO! A cirurgia é feita com anestesia local e o desconforto pós-operatório é controlável com medicamentos. A maioria dos pacientes se surpreende com a tranquilidade do procedimento.',
      category: 'Implantes'
    },
    {
      type: 'mito',
      statement: 'Facetas de resina duram para sempre',
      truth: 'FALSO! A durabilidade média é de 5-7 anos. Manutenção periódica e bons hábitos são essenciais para prolongar a vida útil.',
      category: 'Facetas'
    },
    {
      type: 'mito',
      statement: 'Implante pode ser rejeitado pelo corpo',
      truth: 'FALSO! O titânio é biocompatível. O que ocorre é falha de osseointegração em raros casos (2-5%), que pode ser corrigida com novo planejamento.',
      category: 'Implantes'
    },
    {
      type: 'mito',
      statement: 'Não posso fazer implante se não tenho osso suficiente',
      truth: 'FALSO! Técnicas modernas de enxerto ósseo e implantes especiais permitem tratamento mesmo em casos de perda óssea avançada.',
      category: 'Implantes'
    },
    {
      type: 'verdade',
      statement: 'Facetas de resina podem manchar com o tempo',
      truth: 'VERDADE! A resina pode pigmentar com alimentos e bebidas. Polimentos periódicos e higiene adequada ajudam a manter a estética.',
      category: 'Facetas'
    },
    {
      type: 'verdade',
      statement: 'Higiene é fundamental para a saúde do implante',
      truth: 'VERDADE! A peri-implantite (inflamação ao redor do implante) pode ser evitada com escovação adequada e consultas de manutenção regulares.',
      category: 'Implantes'
    },
    {
      type: 'verdade',
      statement: 'Bruxismo pode prejudicar facetas em resina',
      truth: 'VERDADE! Ranger os dentes pode danificar as facetas. O uso de placa de proteção noturna é essencial para pacientes com bruxismo.',
      category: 'Facetas'
    }
  ];

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

      const cardsTrigger = ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            cardsRef.current?.children || [],
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
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
      id="mito-verdade"
      className="relative py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-[#0B3D4C] via-[#0F4A5C] to-[#155A6E] overflow-hidden"
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
            <span className="text-white/90 text-sm font-medium">Desvendando Mitos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Mito ou{' '}
            <span className="text-[#C9A962]">Verdade</span>?
          </h2>

          <p className="text-white/70 text-lg">
            Separamos os principais mitos e verdades sobre facetas e implantes 
            para que você tenha informações claras e tome a melhor decisão.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mitos.map((item, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-[#C9A962]/30 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Category Badge */}
              <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 ${
                item.category === 'Facetas' 
                  ? 'bg-[#C9A962]/20 text-[#C9A962]' 
                  : 'bg-blue-400/20 text-blue-300'
              }`}>
                {item.category}
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                item.type === 'mito' 
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
                "{item.statement}"
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

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            * As informações acima são baseadas em evidências científicas e experiência clínica. 
            Cada caso é único e deve ser avaliado individualmente durante a consulta.
          </p>
        </div>
      </div>
    </section>
  );
}
