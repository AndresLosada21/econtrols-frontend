'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Settings, Activity, Zap, Code2, Cpu } from 'lucide-react';
import type { ResearchLineFlat } from '@/types/strapi';

// Icon mapping for research lines
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  activity: Activity,
  zap: Zap,
  'code-2': Code2,
  cpu: Cpu,
};

// Fallback data when Strapi is not available
const fallbackResearchLines = [
  {
    id: 1,
    title: 'Teoria de Controle Avançado',
    shortDescription: 'Controle robusto, LMI, fault-tolerant control e ocultação de falhas.',
    icon: 'settings',
  },
  {
    id: 2,
    title: 'Detecção e Diagnóstico',
    shortDescription: 'Supervisão de processos industriais e monitoramento em tempo real.',
    icon: 'activity',
  },
  {
    id: 3,
    title: 'Eletrônica de Potência',
    shortDescription: 'Conversores CC-CC, sistemas fotovoltaicos e cargas de potência constante.',
    icon: 'zap',
  },
  {
    id: 4,
    title: 'Verificação Formal',
    shortDescription: 'Model checking, verificação de redes neurais e ferramenta ESBMC.',
    icon: 'code-2',
  },
  {
    id: 5,
    title: 'Robótica e Indústria 4.0',
    shortDescription: 'VANTs, Digital Twins, Asset Administration Shell e IoT Industrial.',
    icon: 'cpu',
  },
];

interface ResearchCardProps {
  title: string;
  description: string;
  icon?: string;
  index: number;
}

function ResearchCard({ title, description, icon, index }: ResearchCardProps) {
  const IconComponent = icon ? iconMap[icon] || Settings : Settings;

  return (
    <div className="w-[85vw] md:w-[500px] h-[50vh] bg-ufam-dark border border-white/10 p-8 relative flex flex-col justify-end hover:border-ufam-primary/50 transition-all group shrink-0">
      {/* Background Icon */}
      <div className="absolute top-8 right-8 text-white/10 group-hover:text-ufam-primary/20 transition-colors">
        <IconComponent className="w-16 h-16" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-ufam-light transition-colors font-tech">
        {title}
      </h3>
      <p className="text-ufam-secondary text-sm mb-4 leading-relaxed">{description}</p>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 mb-4" />

      {/* Area number */}
      <span className="text-xs font-tech text-ufam-secondary">
        AREA #{String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
}

interface ResearchLinesProps {
  researchLines?: ResearchLineFlat[];
}

export default function ResearchLines({ researchLines }: ResearchLinesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const lines = researchLines?.length ? researchLines : fallbackResearchLines;

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const progressBar = progressRef.current;

      if (!section || !container || !progressBar) return;

      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Check if we're in the section
      if (scrollY >= sectionTop && scrollY <= sectionTop + viewportHeight * 2) {
        // Calculate scroll percentage within section (0 to 1)
        const scrollPercentage = (scrollY - sectionTop) / (viewportHeight * 2);
        const clampedPercentage = Math.max(0, Math.min(1, scrollPercentage));

        // Move container horizontally
        const maxTranslate = container.scrollWidth - window.innerWidth + 80;
        const translateX = -(maxTranslate * clampedPercentage);

        container.style.transform = `translateX(${translateX}px)`;

        // Update progress bar
        progressBar.style.width = `${clampedPercentage * 100}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section ref={sectionRef} id="research" className="h-[300vh] relative bg-ufam-bg z-10">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="absolute top-24 left-6 md:left-20 z-20 pointer-events-none">
          <h2 className="text-6xl md:text-8xl font-black text-white/5 absolute -top-10 -left-4 font-tech">
            PESQUISA
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-white relative font-tech">
            Linhas de Pesquisa
          </h2>
          <p className="font-tech text-ufam-light text-xs mt-2 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            {isMobile ? 'ARRASTE PARA O LADO' : 'SCROLL PARA NAVEGAR'}
          </p>
        </div>

        {/* Cards container */}
        <div
          ref={containerRef}
          className="flex gap-8 pl-6 md:pl-20 items-center w-max transition-transform duration-100 ease-out"
        >
          {lines.map((line, index) => (
            <ResearchCard
              key={line.id}
              title={line.title}
              description={line.shortDescription || ''}
              icon={line.icon}
              index={index}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-10 left-6 md:left-20 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-ufam-primary transition-all duration-100 ease-out"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </section>
  );
}
