import { useEffect, useRef, useState, useTransition } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitLead } from '@/app/actions/leads';
import { defaultContactContent, normalizeContactContent } from '@/lib/content/defaults';
import { usePublishedSection } from '@/lib/content/use-published-section';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  phone: Phone,
  'map-pin': MapPin,
  clock: Clock,
};

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const { content } = usePublishedSection({
    sectionKey: 'contact',
    fallback: defaultContactContent,
    normalize: normalizeContactContent,
  });

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

      // Animação do formulário
      const formTrigger = ScrollTrigger.create({
        trigger: formRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            formRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(formTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitLead(payload);
      setSubmitMessage(result.message);

      if (!result.success) {
        setIsSubmitted(false);
        return;
      }

      setIsSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="relative py-20 sm:py-28 lg:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C9A962]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Content */}
          <div ref={contentRef}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-[#C9A962]" />
              <span className="text-white text-sm font-medium">{content.badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {content.titleLead}{' '}
              <span className="text-[#C9A962]">{content.titleHighlight}</span>
            </h2>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {content.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {content.infoItems.map((item, index) => {
                const Icon = iconMap[item.iconKey];

                return (
                  <div
                    key={`${item.title}-${index}`}
                  className="flex items-start gap-4 bg-white/10 border border-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#000000] rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#C9A962]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-white/60 hover:text-[#C9A962] transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-white/60">{item.content}</p>
                    )}
                  </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={content.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{content.whatsappLabel}</span>
            </a>
          </div>

          {/* Form */}
          <div ref={formRef}>
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-2">{content.formTitle}</h3>
              <p className="text-white/60 mb-6">{content.formDescription}</p>

              {submitMessage && !isSubmitted ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitMessage}
                </div>
              ) : null}

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#C9A962] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-[#000000]" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{content.successTitle}</h4>
                  <p className="text-white/60">{content.successDescription}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-white font-medium">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A962] focus:ring-[#C9A962] rounded-xl"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-white font-medium">
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(48) 99637-4030"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A962] focus:ring-[#C9A962] rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white font-medium">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A962] focus:ring-[#C9A962] rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white font-medium">
                      Mensagem
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Conte-nos como podemos ajudar..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C9A962] focus:ring-[#C9A962] rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#C9A962] hover:bg-[#b8993f] text-[#000000] font-semibold py-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isPending ? 'Enviando...' : 'Enviar mensagem'}
                  </Button>

                  <p className="text-xs text-white/40 text-center">
                    {content.privacyText}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
