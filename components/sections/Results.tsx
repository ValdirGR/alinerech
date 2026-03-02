import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Sparkles } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Array com os caminhos reais para as 9 imagens de resultados fornecidas pelo usuário
const resultsData = [
    { id: 1, image: '/results/foto01.jpeg', alt: 'Antes e Depois 1' },
    { id: 2, image: '/results/foto02.jpeg', alt: 'Antes e Depois 2' },
    { id: 3, image: '/results/foto03.jpeg', alt: 'Antes e Depois 3' },
    { id: 4, image: '/results/foto04.jpeg', alt: 'Antes e Depois 4' },
    { id: 5, image: '/results/foto05.jpeg', alt: 'Antes e Depois 5' },
    { id: 6, image: '/results/foto06.jpeg', alt: 'Antes e Depois 6' },
    { id: 7, image: '/results/foto07.jpeg', alt: 'Antes e Depois 7' },
    { id: 8, image: '/results/foto09.jpeg', alt: 'Antes e Depois 8' },
    { id: 9, image: '/results/foto10.jpeg', alt: 'Antes e Depois 9' },
];

export function Results() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

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
            className="relative py-20 sm:py-28 lg:py-32 bg-white overflow-hidden"
        >
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#C9A962]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#000000]/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
                {/* Cabeçalho da Seção */}
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#C9A962]/10 rounded-full px-4 py-2 mb-6">
                        <Camera className="w-4 h-4 text-[#C9A962]" />
                        <span className="text-[#000000] text-sm font-medium">Casos Clínicos</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight">
                        Nossos{' '}
                        <span className="text-[#C9A962]">Resultados</span>
                    </h2>

                    <p className="text-gray-600 text-lg">
                        Veja algumas das incríveis transformações que já realizamos.
                        Sorrisos reais, vidas renovadas e a excelência estética em cada detalhe.
                    </p>
                </div>

                {/* Galeria de Fotos */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {resultsData.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-100 aspect-square"
                        >
                            <img
                                src={item.image}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eeeeee/cccccc?text=Foto+do+Resultado';
                                }}
                            />

                            {/* Tag ANTES - canto superior esquerdo */}
                            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                                <div className="bg-[#000000]/70 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-white font-bold text-sm sm:text-base tracking-wider uppercase block">
                                        Antes
                                    </span>
                                    <span className="text-[#C9A962] text-[10px] sm:text-xs italic block leading-tight">
                                        Situação Inicial
                                    </span>
                                </div>
                            </div>

                            {/* Tag DEPOIS - canto inferior direito */}
                            <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                                <div className="bg-[#C9A962]/90 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-white font-bold text-sm sm:text-base tracking-wider uppercase block text-right">
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
                            <div className="absolute bottom-4 left-4 w-28 h-auto opacity-30 pointer-events-none z-10 mix-blend-overlay">
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
