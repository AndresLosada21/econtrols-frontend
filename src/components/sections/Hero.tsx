'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  groupName?: string;
  tagline?: string;
  institutionalAffiliation?: string;
  department?: string;
  location?: string;
  foundingYear?: string;
  backgroundImageUrl?: string;
}

export default function Hero({
  groupName = 'e-Controls',
  tagline = 'Excelência em Controle de Sistemas na Amazônia',
  institutionalAffiliation = 'Universidade Federal do Amazonas',
  department,
  location,
  foundingYear,
  backgroundImageUrl,
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background image (optional) */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-ufam-bg z-0" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* University tag & Metadata */}
        <div className="flex flex-col items-center gap-2 mb-6 overflow-hidden">
          {/* Institutional Affiliation */}
          <p
            className={`font-tech text-ufam-light text-sm md:text-base tracking-[0.2em] transition-transform duration-700 lowercase ${
              isLoaded ? 'translate-y-0' : 'translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            :: {institutionalAffiliation.toLowerCase()} ::
          </p>

          {/* Department & Location */}
          {(department || location) && (
            <div
              className={`flex items-center gap-3 text-xs md:text-sm font-tech text-ufam-secondary transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              {department && (
                <span className="px-3 py-1 border border-ufam-primary/30 rounded-full bg-ufam-primary/10 backdrop-blur-sm">
                  {department}
                </span>
              )}
              {location && <span className="text-ufam-secondary/70">{location}</span>}
            </div>
          )}
        </div>

        {/* Main title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-none font-tech uppercase">
          {/* Group Name */}
          <div className="overflow-hidden">
            <span
              className={`block text-ufam-primary transition-transform duration-700 ${
                isLoaded ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {groupName}
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
          {tagline}
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
        {/* Founding Year Badge (Optional) */}
        {foundingYear && (
          <div
            className={`absolute bottom-8 right-6 hidden md:block transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="text-right">
              <span className="block text-xs font-tech text-ufam-secondary uppercase tracking-widest mb-1">
                Desde
              </span>
              <span className="text-4xl font-black font-tech text-ufam-primary/20">
                {foundingYear}
              </span>
            </div>
          </div>
        )}
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
