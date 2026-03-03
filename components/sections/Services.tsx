import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, ArrowRight, ChevronDown, AlertCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedFacetas, setExpandedFacetas] = useState(false);

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

      // Animação dos cards
      const cardsTrigger = ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            cardsRef.current?.children || [],
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
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

  const scrollToContact = () => {
    const element = document.getElementById('contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A962]" />
            <span className="text-white text-sm font-medium">Nossos Tratamentos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Especialidades que{' '}
            <span className="text-[#C9A962]">transformam vidas</span>
          </h2>

          <p className="text-white/70 text-lg">
            Oferecemos tratamentos odontológicos de excelência com foco em estética e saúde.
            Cada procedimento é personalizado para atender às suas necessidades específicas.
          </p>
        </div>

        {/* Services Cards */}
        <div ref={cardsRef} className="space-y-16 lg:space-y-20">
          {/* Facetas em Resina */}
          <div className="bg-white/10 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group m-6 lg:m-8">
                  <img
                    src="/facetas-resina.jpg"
                    alt="Facetas em Resina"
                    className="w-full h-[350px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#000000]/60 via-transparent to-transparent" />


                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 border-4 border-[#C9A962]/30 rounded-full" />
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 lg:pr-12">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Facetas em Resina
                </h3>
                <p className="text-[#C9A962] font-medium text-lg mb-4">
                  Transformação imediata do seu sorriso
                </p>
                <p className="text-white/70 mb-6 leading-relaxed">
                  As facetas em resina são laminados diretos de resina composta aplicados sobre a face do dente.
                  São a solução ideal para quem busca um sorriso perfeito de forma rápida e acessível,
                  corrigindo imperfeições como manchas, espaços entre dentes, dentes desalinhados ou desgastados.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {[
                    'Resultado estético rápido, muitas vezes em uma única consulta',
                    'Menor desgaste de dente em relação a outras técnicas',
                    'Custo mais acessível que facetas cerâmicas',
                    'Reparos e ajustes feitos diretamente no consultório',
                    'Procedimento minimamente invasivo e reversível'
                  ].map((benefit, bIndex) => (
                    <div key={bIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#C9A962] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#000000]" />
                      </div>
                      <span className="text-white/80 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={scrollToContact}
                    className="bg-[#C9A962] hover:bg-[#b8993f] text-[#000000] font-semibold px-6 py-5 rounded-full transition-all duration-300 hover:scale-105 group"
                  >
                    Quero minhas facetas
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setExpandedFacetas(!expandedFacetas)}
                    className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold px-6 py-5 rounded-full transition-all duration-300"
                  >
                    Saiba mais
                    <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${expandedFacetas ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-500 ${expandedFacetas ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t border-white/10 p-6 lg:p-8 bg-white/5">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Limitations */}
                  <div className="bg-amber-950/40 border border-amber-700/30 rounded-2xl p-5">
                    <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Limitações
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Durabilidade média de 5-7 anos',
                        'Suscetíveis a manchas e perda de brilho',
                        'Contraindicação em bruxismo severo',
                        'Não indicado para dentes muito escurecidos'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-amber-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Process */}
                  <div className="bg-blue-950/40 border border-blue-700/30 rounded-2xl p-5">
                    <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Como é o Processo
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Avaliação clínica e planejamento estético',
                        'Fotos e possível mock-up',
                        'Preparo mínimo (quando necessário)',
                        'Escultura da resina dente a dente',
                        'Acabamento e polimento final'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-blue-300 text-sm">
                          <span className="font-semibold text-blue-400">{i + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Care */}
                  <div className="bg-green-950/40 border border-green-700/30 rounded-2xl p-5">
                    <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Cuidados Após
                    </h4>
                    <p className="text-green-300 text-sm leading-relaxed mb-3">
                      Evitar alimentos muito duros, não usar dentes como "abridor",
                      manter boa higiene bucal e fazer polimentos periódicos no consultório.
                    </p>
                    <div className="pt-3 border-t border-green-700/30">
                      <p className="text-green-400 text-xs">
                        <strong>Dica:</strong> Reduza café, vinho tinto e refrigerantes de cola
                        para manter o brilho por mais tempo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
