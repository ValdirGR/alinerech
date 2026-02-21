import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, GraduationCap, Heart, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

  const diferenciais = [
    {
      icon: GraduationCap,
      title: 'Formação Especializada',
      description: 'Especialização em Odontologia Estética e Implantodontia'
    },
    {
      icon: Award,
      title: 'Tecnologia Avançada',
      description: 'Equipamentos de última geração para tratamentos precisos'
    },
    {
      icon: Heart,
      title: 'Atendimento Humanizado',
      description: 'Cuidado individualizado para cada paciente'
    },
    {
      icon: Shield,
      title: 'Garantia de Resultado',
      description: 'Compromisso com a excelência e satisfação'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="sobre"
      className="relative py-20 sm:py-28 lg:py-32 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B3D4C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
          {/* Content */}
          <div ref={contentRef}>
            <div className="inline-flex items-center gap-2 bg-[#0B3D4C]/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#C9A962] rounded-full" />
              <span className="text-[#0B3D4C] text-sm font-medium">Conheça a Dra. Aline Rech</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3D4C] mb-6 leading-tight">
              Dedicação e excelência em{' '}
              <span className="text-[#C9A962]">cada sorriso</span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                A Dra. Aline Rech é cirurgiã-dentista com mais de 10 anos de experiência, 
                especializada em odontologia estética e implantodontia. Sua trajetória é 
                marcada pelo compromisso incessante em proporcionar sorrisos naturais e 
                harmoniosos que transformam vidas.
              </p>
              <p>
                Formada por instituições renomadas, a Dra. Aline constantemente se atualiza 
                através de cursos e congressos nacionais e internacionais, trazendo para 
                Içara as técnicas mais modernas e inovadoras do mercado odontológico.
              </p>
              <p>
                Seu consultório foi projetado para oferecer conforto e tecnologia, 
                garantindo que cada paciente tenha uma experiência única e resultados 
                que superem expectativas.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl px-5 py-3">
                <div className="w-10 h-10 bg-[#0B3D4C] rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C9A962]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0B3D4C]">CRO-SC</p>
                  <p className="text-xs text-gray-500">Registro Ativo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl px-5 py-3">
                <div className="w-10 h-10 bg-[#0B3D4C] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#C9A962]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0B3D4C]">Especialista</p>
                  <p className="text-xs text-gray-500">Estética & Implantes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/dra-aline.jpg"
                alt="Dra. Aline Rech"
                className="w-full h-[500px] sm:h-[600px] object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D4C]/40 via-transparent to-transparent" />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#0B3D4C] text-white rounded-2xl p-6 shadow-xl">
              <p className="text-4xl font-bold text-[#C9A962]">+10</p>
              <p className="text-sm text-white/80">Anos de<br/>Experiência</p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-[#C9A962]/30 rounded-full" />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-[#C9A962]/20 rounded-full" />
          </div>
        </div>

        {/* Diferenciais Cards */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diferenciais.map((item, index) => (
            <div 
              key={index}
              className="group bg-[#F8F9FA] hover:bg-[#0B3D4C] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-[#0B3D4C] group-hover:bg-[#C9A962] rounded-xl flex items-center justify-center mb-4 transition-colors duration-500">
                <item.icon className="w-7 h-7 text-[#C9A962] group-hover:text-[#0B3D4C] transition-colors duration-500" />
              </div>
              <h3 className="font-semibold text-[#0B3D4C] group-hover:text-white text-lg mb-2 transition-colors duration-500">
                {item.title}
              </h3>
              <p className="text-gray-600 group-hover:text-white/80 text-sm transition-colors duration-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
