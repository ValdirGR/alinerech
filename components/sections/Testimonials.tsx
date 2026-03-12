import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { defaultTestimonialsContent, normalizeTestimonialsContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';
import type { TestimonialsContent } from '@/lib/content/types';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials({ initialContent }: { initialContent?: TestimonialsContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { content } = usePublishedSection({
    sectionKey: 'testimonials',
    fallback: defaultTestimonialsContent,
    normalize: normalizeTestimonialsContent,
    initialContent,
  });

  useEffect(() => {
    setCurrentIndex((previousIndex) => {
      if (content.items.length === 0) {
        return 0;
      }

      return previousIndex >= content.items.length ? 0 : previousIndex;
    });
  }, [content.items.length]);

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
    setCurrentIndex((prev) => (prev + 1) % content.items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + content.items.length) % content.items.length);
  };

  const currentItem = content.items[currentIndex] ?? content.items[0];

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
            <span className="text-white text-sm font-medium">{content.badgeText}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {content.titleLead}{' '}
            <span className="text-[#C9A962]">{content.titleHighlight}</span>
          </h2>

          <p className="text-white/70 text-lg">
            {content.description}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div ref={carouselRef} className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A962] rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-[#000000]" />
            </div>

            <div className="grid md:grid-cols-[200px,1fr] gap-8 items-center">
              {/* Patient Image */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={currentItem.imageUrl}
                    alt={currentItem.imageAlt}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#C9A962] shadow-lg mx-auto"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-xs px-3 py-1 rounded-full">
                    {currentItem.procedure}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(currentItem.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#C9A962] fill-[#C9A962]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-white/80 text-lg leading-relaxed mb-6 italic">
                  "{currentItem.text}"
                </p>

                {/* Name */}
                <p className="font-semibold text-white text-lg">
                  {currentItem.name}
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
              className="w-12 h-12 rounded-full border-2 border-white/20 hover:bg-[#C9A962] hover:text-[#000000] hover:border-[#C9A962] transition-all duration-300 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {content.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-[#C9A962] w-8'
                      : 'bg-white/20 hover:bg-white/40'
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-white/20 hover:bg-[#C9A962] hover:text-[#000000] hover:border-[#C9A962] transition-all duration-300 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/10">
          {content.trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-white/60">
              <div className="w-8 h-8 bg-[#000000] rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" />
              </div>
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
