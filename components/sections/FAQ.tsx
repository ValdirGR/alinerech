import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [openFacetas, setOpenFacetas] = useState<number | null>(0);


  const faqFacetas = [
    {
      question: 'O que são facetas de resina?',
      answer: 'Facetas de resina são laminados diretos de resina composta aplicados sobre a face do dente. São utilizadas para corrigir cor, pequenas fraturas, leves desalinhamentos e formato dos dentes, proporcionando um sorriso mais harmonioso e bonito de forma rápida e acessível.'
    },
    {
      question: 'Quanto tempo dura?',
      answer: 'A durabilidade média das facetas em resina é de 5 a 7 anos, dependendo dos hábitos do paciente. Fatores como higiene bucal, alimentação, bruxismo ( ranger de dentes ) e hábitos como roer unhas podem influenciar diretamente na longevidade do tratamento. Com cuidados adequados e manutenção periódica, é possível prolongar bastante a vida útil das facetas.'
    },
    {
      question: 'Vai estragar meus dentes?',
      answer: 'Não! Na maioria dos casos, o desgaste é mínimo e planejado para preservar o máximo de estrutura dental saudável. Diferente de outras técnicas, as facetas em resina exigem pouquíssimo preparo do dente, mantendo sua integridade. O procedimento é conservador e reversível na maioria das situações.'
    },
    {
      question: 'Fica artificial?',
      answer: 'Quando feitas por um profissional experiente, as facetas em resina ficam extremamente naturais. A resina composta permite personalização da cor, transparência e formato, imitando perfeitamente a aparência dos dentes naturais. O segredo está no planejamento estético detalhado e na habilidade do dentista na escultura dente a dente.'
    },
    {
      question: 'Quais são os cuidados depois?',
      answer: 'Os cuidados incluem: evitar alimentos muito duros ou pegajosos, não usar os dentes como "abridor" de pacotes ou garrafas, manter uma higiene bucal rigorosa com escovação e fio dental, fazer polimentos periódicos no consultório e evitar hábitos como roer unhas ou objetos. Recomenda-se também reduzir o consumo de alimentos pigmentantes como café, vinho tinto e refrigerantes de cola.'
    },
    {
      question: 'Posso fazer se tenho bruxismo?',
      answer: 'O bruxismo ( ranger de dentes ) é uma contraindicação relativa. Em casos leves a moderados, é possível realizar o procedimento desde que o paciente use uma placa de proteção noturna (placa oclusal) para proteger as facetas. Em casos severos de bruxismo, pode ser recomendada outra abordagem estética, como facetas cerâmicas, que oferecem maior resistência.'
    },
    {
      question: 'Mancha ou fica amarelo com o tempo?',
      answer: 'Sim, a resina pode perder brilho e pigmentar com o tempo, especialmente com o consumo frequente de alimentos e bebidas pigmentantes. Porém, isso pode ser minimizado com higiene adequada, polimentos periódicos no consultório e eventual repolimento ou reparo quando necessário. A manutenção regular é fundamental para preservar a estética.'
    },
    {
      question: 'Dói para fazer?',
      answer: 'Geralmente é um procedimento pouco invasivo e praticamente indolor. Na maioria dos casos, não é necessária anestesia, pois o preparo do dente é mínimo ou inexistente. Quando há necessidade de algum preparo mais específico, a anestesia local é aplicada e o paciente não sente dor durante o procedimento.'
    },
    {
      question: 'Qual a diferença para lente de contato/porcelana?',
      answer: 'A resina é mais acessível financeiramente, o procedimento é mais rápido ( muitas vezes em uma única consulta ), é reversível e permite reparos diretos no consultório. Já as facetas de porcelana ( lentes de contato dental ) têm maior durabilidade ( 10-15 anos ), são mais resistentes a manchas, mas exigem desgaste dental maior, mais consultas e investimento mais elevado.'
    },
    {
      question: 'Serve para qualquer caso?',
      answer: 'Não. Dentes muito escurecidos, desgastes intensos, bruxismo severo ou casos que exigem grandes alterações de posição podem necessitar de outras abordagens, como facetas cerâmicas, clareamento dental associado, ortodontia ou coroas. A avaliação clínica é fundamental para indicar o melhor tratamento para cada caso.'
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

      const contentTrigger = ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(contentTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-20 sm:py-28 lg:py-32 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#000000]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#000000]/10 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-[#C9A962]" />
            <span className="text-[#000000] text-sm font-medium">Tire suas dúvidas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight">
            Perguntas{' '}
            <span className="text-[#C9A962]">Frequentes</span>
          </h2>

          <p className="text-gray-600 text-lg">
            Esclarecemos as principais dúvidas sobre nossos tratamentos para que você
            tome a melhor decisão com segurança e confiança.
          </p>
        </div>

        {/* FAQ Content */}
        <div ref={contentRef} className="max-w-3xl mx-auto">
          {/* Facetas FAQ */}
          <div>
            <div className="bg-linear-to-r from-[#000000] to-[#1a1a1a] rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-[#C9A962] rounded-lg flex items-center justify-center">
                  <span className="text-[#000000] font-bold">F</span>
                </span>
                Facetas em Resina
              </h3>
            </div>

            <div className="space-y-3">
              {faqFacetas.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#F8F9FA] rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFacetas(openFacetas === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[#000000]/5 transition-colors"
                  >
                    <span className="font-medium text-[#000000] pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C9A962] shrink-0 transition-transform duration-300 ${openFacetas === index ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFacetas === index ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ainda tem dúvidas? Entre em contato diretamente pelo WhatsApp.
          </p>
          <a
            href="https://wa.me/5548996374030"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
