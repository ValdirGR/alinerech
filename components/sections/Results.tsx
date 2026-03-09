import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { defaultResultsContent, normalizeResultsContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';

gsap.registerPlugin(ScrollTrigger);

export function Results() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const { content } = usePublishedSection({
        sectionKey: 'results',
        fallback: defaultResultsContent,
        normalize: normalizeResultsContent,
    });

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

            // Animação da galeria de fotos
            const gridTrigger = ScrollTrigger.create({
                trigger: gridRef.current,
                start: 'top 75%',
                onEnter: () => {
                    gsap.fromTo(
                        gridRef.current?.children || [],
                        { opacity: 0, scale: 0.9, y: 30 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' }
                    );
                },
                once: true
            });
            triggers.push(gridTrigger);
        }, sectionRef);

        return () => {
            triggers.forEach(t => t.kill());
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="resultados"
            className="relative py-20 sm:py-28 lg:py-32 bg-[#0A0A0A] overflow-hidden"
        >
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#C9A962]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
                {/* Cabeçalho da Seção */}
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                        <Camera className="w-4 h-4 text-[#C9A962]" />
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

                {/* Galeria de Fotos */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {content.items.map((item, index) => (
                        <div
                            key={`${item.imageUrl}-${index}`}
                            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/10 aspect-square"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eeeeee/cccccc?text=Foto+do+Resultado';
                                }}
                            />

                            {/* Tag ANTES - canto superior esquerdo */}
                            <div className="absolute top-3 left-3 z-20 pointer-events-none">
                                <div className="bg-[#000000]/70 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                    <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase block">
                                        Antes
                                    </span>
                                    <span className="text-[#C9A962] text-[10px] sm:text-xs italic block leading-tight">
                                        Situação Inicial
                                    </span>
                                </div>
                            </div>

                            {/* Tag DEPOIS - canto inferior direito */}
                            <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
                                <div className="bg-[#C9A962]/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                    <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase block text-right">
                                        Depois
                                    </span>
                                    <span className="text-white/80 text-[10px] sm:text-xs italic block leading-tight text-right">
                                        Resultado Final
                                    </span>
                                </div>
                            </div>

                            {/* Overlay suave inferior */}
                            <div className="absolute inset-0 bg-linear-to-t from-[#000000]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Marca d'água */}
                            <div className="absolute bottom-4 left-4 w-28 h-auto opacity-60 pointer-events-none z-10 mix-blend-overlay">
                                <Image
                                    src="/logo-aline.png"
                                    alt="Marca d'água"
                                    width={112}
                                    height={34}
                                    className="w-full h-auto brightness-0 invert"
                                />
                            </div>

                            {/* Ícone de destaque ao passar o mouse */}
                            <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                <Sparkles className="w-5 h-5 text-[#C9A962]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
