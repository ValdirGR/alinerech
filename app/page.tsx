'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { MitoVerdade } from '@/components/sections/MitoVerdade';
import { Features } from '@/components/sections/Features';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // Configuração global do GSAP
        gsap.config({
            nullTargetWarn: false,
        });

        // ScrollTrigger padrão
        ScrollTrigger.defaults({
            toggleActions: 'play none none none',
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <Hero />
                <About />
                <Services />
                <Process />
                <MitoVerdade />
                <Features />
                <Testimonials />
                <FAQ />
                <Contact />
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}

export default App;
