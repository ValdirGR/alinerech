import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ClipboardList, Settings, Sparkles, CalendarCheck, Stethoscope } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const facetasRef = useRef<HTMLDivElement>(null);


  const facetasSteps = [
    {
      icon: Search,
      step: '01',
      title: 'Avaliação Clínica',
      description: 'Exame detalhado da saúde bucal, análise do sorriso e discussão das expectativas do paciente.',
      image: '/process-avaliacao.jpg'
    },
    {
      icon: ClipboardList,
      step: '02',
      title: 'Fotos e Planejamento',
      description: 'Registro fotográfico e planejamento estético digital para visualizar o resultado esperado.',
      image: '/process-planejamento.jpg'
    },
    {
      icon: Settings,
      step: '03',
      title: 'Mock-up (Opcional)',
      description: 'Criação de um modelo provisório para o paciente visualizar como ficará o sorriso antes do procedimento.',
      image: '/process-mockup.jpg'
    },
    {
      icon: Stethoscope,
      step: '04',
      title: 'Preparo Mínimo',
      description: 'Quando necessário, preparo superficial e conservador da superfície do dente.',
      image: '/process-preparo.jpg'
    },
    {
      icon: Sparkles,
      step: '05',
      title: 'Aplicação da Resina',
      description: 'Escultura artística da resina composta dente a dente, camada por camada, com cura a luz.',
      image: '/process-aplicacao.jpg'
    },
    {
      icon: CalendarCheck,
      step: '06',
      title: 'Acabamento e Polimento',
      description: 'Ajuste da mordida, polimento para brilho natural e instruções de cuidados pós-procedimento.',
      image: '/process-acabamento.jpg'
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

      const facetasTrigger = ScrollTrigger.create({
        trigger: facetasRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            facetasRef.current?.querySelectorAll('.step-card') || [],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        once: true
      });
      triggers.push(facetasTrigger);


    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="processo"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#F8F9FA] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#000000]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#000000]/10 rounded-full px-4 py-2 mb-6">
            <Settings className="w-4 h-4 text-[#C9A962]" />
            <span className="text-[#000000] text-sm font-medium">Como Funciona</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight">
            O passo a passo do seu{' '}
            <span className="text-[#C9A962]">tratamento</span>
          </h2>

          <p className="text-gray-600 text-lg">
            Conheça cada etapa dos nossos procedimentos. Transparência e clareza 
            para você se sentir seguro em cada momento.
          </p>
        </div>

        {/* Facetas Process */}
        <div ref={facetasRef} className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C9A962] to-[#D4BC7E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#000000]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#000000]">Facetas em Resina</h3>
              <p className="text-gray-500 text-sm">Procedimento completo em uma única consulta</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facetasSteps.map((step, index) => (
              <div 
                key={index}
                className="step-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-transparent to-transparent" />
                  
                  {/* Step Number */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-4xl font-bold text-white/80">
                      {step.step}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[#000000]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-semibold text-[#000000] text-lg mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Quer saber mais detalhes sobre o seu caso específico?
          </p>
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#000000] hover:bg-[#1a1a1a] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            <CalendarCheck className="w-5 h-5" />
            Agendar Avaliação
          </a>
        </div>
      </div>
    </section>
  );
}
