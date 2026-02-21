import { 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook,
  Mail,
  Heart
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Processo', href: '#processo' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  const services = [
    { label: 'Facetas em Resina', href: '#servicos' },
    { label: 'Implantes Dentários', href: '#servicos' },
    { label: 'Odontologia Estética', href: '#servicos' },
    { label: 'Avaliação Gratuita', href: '#contato' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B3D4C] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">
                Dra. Aline <span className="text-[#C9A962]">Rech</span>
              </h3>
              <p className="text-white/60 text-sm mt-1">Odontologia Estética</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Transformando sorrisos e vidas através da odontologia estética 
              de excelência. Seu sorriso perfeito começa aqui.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#C9A962] rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#C9A962] rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@draalinerech.com.br"
                className="w-10 h-10 bg-white/10 hover:bg-[#C9A962] rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/70 hover:text-[#C9A962] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(service.href)}
                    className="text-white/70 hover:text-[#C9A962] transition-colors text-sm"
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#C9A962]">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9A962] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Rua Altamiro Guimarães, 189<br />
                  Içara, SC
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C9A962] flex-shrink-0" />
                <a 
                  href="tel:+5548999999999"
                  className="text-white/70 hover:text-[#C9A962] transition-colors text-sm"
                >
                  (48) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C9A962] flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  Seg - Sex: 8h às 18h<br />
                  Sáb: 8h às 12h
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center sm:text-left">
              © {currentYear} Dra. Aline Rech. Todos os direitos reservados.
            </p>
            <p className="text-white/50 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-[#C9A962] fill-[#C9A962]" /> em Içara, SC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
