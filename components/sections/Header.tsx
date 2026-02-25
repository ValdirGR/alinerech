import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Processo', href: '#processo' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('#inicio')}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo-aline.png"
                alt="Dra. Aline Rech"
                width={300}
                height={90}
                className={`w-auto object-contain transition-all duration-300 transform origin-left ${isScrolled
                  ? 'h-10 md:h-12'
                  : 'h-16 md:h-20 brightness-0 invert'
                  }`}
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-[#C9A962] ${isScrolled ? 'text-[#000000]' : 'text-white'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button
                onClick={() => window.open('https://wa.me/5548996374030', '_blank')}
                className={`font-semibold px-6 rounded-full transition-all duration-300 ${isScrolled
                  ? 'bg-[#000000] hover:bg-[#1a1a1a] text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30'
                  }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-[#000000]' : 'text-white'
                }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 pt-20">
            <nav className="space-y-2">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-3 text-[#000000] font-medium hover:bg-[#F8F9FA] hover:text-[#C9A962] rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button
                onClick={() => window.open('https://wa.me/5548996374030', '_blank')}
                className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-white font-semibold py-6 rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Agendar pelo WhatsApp
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Dra. Aline Rech - Odontologia Estética
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Içara, SC
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
