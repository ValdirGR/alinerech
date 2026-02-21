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

gsap.registerPlugin(ScrollTrigger);

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

  const features = [
    {
      icon: Microscope,
      title: 'Tecnologia de Ponta',
      description: 'Equipamentos modernos que garantem precisão e conforto em todos os procedimentos.'
    },
    {
      icon: Clock,
      title: 'Agilidade',
      description: 'Procedimentos otimizados para você ter resultado no menor tempo possível.'
    },
    {
      icon: Users,
      title: 'Equipe Especializada',
      description: 'Profissionais altamente qualificados e em constante atualização.'
    },
    {
      icon: Stethoscope,
      title: 'Avaliação Completa',
      description: 'Diagnóstico detalhado com planejamento personalizado para cada caso.'
    },
    {
      icon: Sparkles,
      title: 'Resultados Naturais',
      description: 'Sorrisos harmoniosos que preservam sua identidade e expressão.'
    },
    {
      icon: ShieldCheck,
      title: 'Protocolos de Segurança',
      description: 'Rigorosa biossegurança e esterilização em todos os procedimentos.'
    },
    {
      icon: HeartHandshake,
      title: 'Acompanhamento',
      description: 'Suporte contínuo antes, durante e após o tratamento.'
    },
    {
      icon: TrendingUp,
      title: 'Alta Satisfação',
      description: 'Pacientes que recomendam e voltam para novos tratamentos.'
    }
  ];

  const stats = [
    { value: '2.500+', label: 'Pacientes Atendidos' },
    { value: '10+', label: 'Anos de Experiência' },
    { value: '5.0', label: 'Avaliação Média' },
    { value: '98%', label: 'Taxa de Satisfação' }
  ];

  return (
    <section 
      ref={sectionRef}
      id="diferenciais"
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
            <Sparkles className="w-4 h-4 text-[#C9A962]" />
            <span className="text-white/90 text-sm font-medium">Por que nos escolher</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            O que nos torna{' '}
            <span className="text-[#C9A962]">diferentes</span>
          </h2>

          <p className="text-white/70 text-lg">
            Compromisso com a excelência, tecnologia de ponta e um atendimento 
            que coloca você no centro de tudo.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-[#C9A962]/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-[#C9A962]/20 group-hover:bg-[#C9A962] rounded-xl flex items-center justify-center mb-4 transition-colors duration-500">
                <feature.icon className="w-7 h-7 text-[#C9A962] group-hover:text-[#0B3D4C] transition-colors duration-500" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          {stats.map((stat, index) => (
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
