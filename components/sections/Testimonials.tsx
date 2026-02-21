import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Mariana Silva',
      image: '/paciente-1.jpg',
      rating: 5,
      text: 'Fiz facetas em resina com a Dra. Aline e o resultado superou todas as minhas expectativas. Meu sorriso ficou natural e lindo! O atendimento foi impecável do início ao fim. Recomendo de olhos fechados.',
      procedure: 'Facetas em Resina'
    },
    {
      name: 'Carlos Eduardo',
      image: '/paciente-2.jpg',
      rating: 5,
      text: 'Depois de anos com medo de dentista, encontrei na Dra. Aline uma profissional que me transmitiu total confiança. Meus implantes ficaram perfeitos e recuperei minha autoestima.',
      procedure: 'Implantes Dentários'
    },
    {
      name: 'Ana Paula',
      image: '/paciente-3.jpg',
      rating: 5,
      text: 'A Dra. Aline tem mãos de fada! Minhas facetas ficaram exatamente como eu sonhava. O consultório é maravilhoso, a equipe é super atenciosa e o resultado é incrível.',
      procedure: 'Facetas em Resina'
    }
  ];

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

      // Animação do carousel
      const carouselTrigger = ScrollTrigger.create({
        trigger: carouselRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            carouselRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(carouselTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      ref={sectionRef}
      id="depoimentos"
      className="relative py-20 sm:py-28 lg:py-32 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B3D4C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0B3D4C]/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
            <span className="text-[#0B3D4C] text-sm font-medium">Depoimentos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3D4C] mb-6 leading-tight">
            O que nossos pacientes{' '}
            <span className="text-[#C9A962]">dizem</span>
          </h2>

          <p className="text-gray-600 text-lg">
            A satisfação dos nossos pacientes é o nosso maior orgulho. 
            Conheça histórias reais de transformação.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div ref={carouselRef} className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-[#F8F9FA] rounded-3xl p-8 sm:p-12 shadow-xl relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A962] rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-[#0B3D4C]" />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] gap-8 items-center">
              {/* Patient Image */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#C9A962] shadow-lg mx-auto"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0B3D4C] text-white text-xs px-3 py-1 rounded-full">
                    {testimonials[currentIndex].procedure}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#C9A962] fill-[#C9A962]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Name */}
                <p className="font-semibold text-[#0B3D4C] text-lg">
                  {testimonials[currentIndex].name}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-[#0B3D4C]/20 hover:bg-[#0B3D4C] hover:text-white hover:border-[#0B3D4C] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#C9A962] w-8' 
                      : 'bg-[#0B3D4C]/20 hover:bg-[#0B3D4C]/40'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-[#0B3D4C]/20 hover:bg-[#0B3D4C] hover:text-white hover:border-[#0B3D4C] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-[#0B3D4C] rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
            </div>
            <span className="text-sm">Avaliação 5.0 no Google</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-[#0B3D4C] rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
            </div>
            <span className="text-sm">+100 Depoimentos</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-[#0B3D4C] rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
            </div>
            <span className="text-sm">98% de Satisfação</span>
          </div>
        </div>
      </div>
    </section>
  );
}
