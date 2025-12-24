'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-ufam-bg z-0" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* University tag */}
        <div className="inline-block mb-6 overflow-hidden">
          <p
            className={`font-tech text-ufam-light text-sm md:text-base tracking-[0.2em] transition-transform duration-700 lowercase ${
              isLoaded ? 'translate-y-0' : 'translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            :: universidade federal do amazonas ::
          </p>
        </div>

        {/* Main title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-none font-tech uppercase">
          {/* e-Controls */}
          <div className="overflow-hidden">
            <span
              className={`block text-ufam-primary transition-transform duration-700 ${
                isLoaded ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              e-Controls
            </span>
          </div>
          {/* Research Group with gradient */}
          <div className="overflow-hidden">
            <span
              className={`block bg-gradient-to-r from-ufam-light via-white to-ufam-secondary bg-clip-text text-transparent transition-transform duration-700 ${
                isLoaded ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              Research Group
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-ufam-secondary text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          Excelência em Controle de Sistemas na Amazônia
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <Link
            href="#about"
            className="group inline-flex items-center justify-center gap-2 bg-ufam-primary text-white font-tech tracking-wider font-bold px-8 py-4 rounded hover:bg-ufam-light hover:text-ufam-dark transition-all lowercase"
          >
            conheça o grupo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/publications"
            className="inline-flex items-center justify-center gap-2 text-white font-tech tracking-wider font-bold px-8 py-4 rounded border border-white/20 hover:border-ufam-light hover:text-ufam-light transition-all lowercase"
          >
            ver publicações
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
        <span className="font-tech text-[10px] tracking-widest text-ufam-secondary lowercase">
          scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-ufam-primary to-transparent" />
      </div>
    </header>
  );
}
