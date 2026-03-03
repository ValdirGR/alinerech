import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Phone, Calendar, ChevronRight, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação do conteúdo
      gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3
        }
      );

      // Animação da imagem
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out'
        }
      );

      // Animação das estatísticas
      gsap.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.8
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#000000] via-[#0d0d0d] to-[#1a1a1a]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#C9A962] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C9A962] rounded-full blur-[150px] opacity-15" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-36 pb-16 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-[#C9A962]" />
              <span className="text-white/90 text-sm font-medium">Especialista em Odontologia Estética</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none tracking-tight mb-8">
              Transforme seu{' '}
              <span className="text-[#C9A962]">sorriso</span>
              <br />
              Transforme sua{' '}
              <span className="text-[#C9A962]">vida</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Facetas em resina com tecnologia de ponta.
              Resultados naturais que vão além da estética — devolvem sua confiança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                onClick={() => scrollToSection('contato')}
                className="bg-[#C9A962] hover:bg-[#D4BC7E] text-[#000000] font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#C9A962]/30"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://wa.me/5548996374030', '_blank')}
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C9A962] rounded-full" />
                <span>Atendimento Humanizado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C9A962] rounded-full" />
                <span>Tecnologia de Ponta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C9A962] rounded-full" />
                <span>Resultados Garantidos</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative order-1 lg:order-2">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group">
                  <img
                    src="/alinevideo02.jpg"
                    alt="Apresentação Dra Aline Rech"
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#000000]/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:bg-black/40" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-2xl">
                    <p className="text-white bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 transform transition-transform duration-300 group-hover:-translate-y-1 border border-white/20">
                      Assistir Apresentação
                    </p>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-transform duration-300 group-hover:scale-110 shadow-2xl">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C9A962] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,169,98,0.5)]">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#000000] ml-2" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl z-20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#C9A962] rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[#000000]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#000000]">Dra. Aline Rech</p>
                        <p className="text-sm text-gray-600">Cirurgiã-Dentista | CRO 15756-SC</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#C9A962] ml-auto transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[90vw] p-0 overflow-hidden bg-transparent border-none shadow-none [&>button]:text-white [&>button]:bg-black/40 hover:[&>button]:bg-black/60 [&>button]:rounded-full [&>button]:p-2 [&>button]:w-10 [&>button]:h-10 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button>svg]:w-6 [&>button>svg]:h-6">
                <DialogTitle className="sr-only">Vídeo de Apresentação</DialogTitle>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/604126/2353cb85-56c0-40cc-8ea4-c6944d44cf99?autoplay=1"
                    loading="lazy"
                    className="border-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Decorative Ring */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-[#C9A962]/30 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-4 border-[#C9A962]/20 rounded-full" />
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/10"
        >
          {[
            { number: '+9', label: 'Anos de Experiência' },
            { number: '+2.500', label: 'Pacientes Atendidos' },
            { number: '100%', label: 'Foco em Estética' },
            { number: '5.0', label: 'Avaliação dos Pacientes' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-[#C9A962] mb-1">{stat.number}</p>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
