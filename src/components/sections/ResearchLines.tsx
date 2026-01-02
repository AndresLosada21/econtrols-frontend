'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Settings,
  Activity,
  Zap,
  Code2,
  Cpu,
  Brain,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import type { ResearchLineFlat } from '@/types/strapi';

// Icon mapping for research lines (fallback when no image)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  activity: Activity,
  zap: Zap,
  'code-2': Code2,
  code: Code2,
  cpu: Cpu,
  brain: Brain,
  shield: Shield,
};

// Default icons based on keywords in title (smart fallback)
function getDefaultIcon(title: string): React.ComponentType<{ className?: string }> {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('controle')) return Settings;
  if (titleLower.includes('verificação') || titleLower.includes('formal')) return Code2;
  if (titleLower.includes('potência') || titleLower.includes('energia')) return Zap;
  if (titleLower.includes('robótica') || titleLower.includes('indústria')) return Cpu;
  if (titleLower.includes('detecção') || titleLower.includes('diagnóstico')) return Activity;
  if (titleLower.includes('inteligência') || titleLower.includes('neural')) return Brain;
  if (titleLower.includes('segurança') || titleLower.includes('cyber')) return Shield;
  return Settings;
}

// Default category for fallback data
const defaultCategory = {
  id: 1,
  name: 'Principal',
  slug: 'principal',
  sectionTitle: 'Áreas Principais de Pesquisa',
  displayOrder: 1,
  color: 'text-ufam-light',
  isActive: true,
};

// Fallback data when Strapi is not available
const fallbackResearchLines: ResearchLineFlat[] = [
  {
    id: 1,
    title: 'Teoria de Controle Avançado',
    slug: 'controle-avancado',
    shortDescription: 'Controle robusto, LMI, fault-tolerant control e ocultação de falhas.',
    category: defaultCategory,
    iconName: 'settings',
    isActive: true,
  },
  {
    id: 2,
    title: 'Detecção e Diagnóstico',
    slug: 'deteccao-diagnostico',
    shortDescription: 'Supervisão de processos industriais e monitoramento em tempo real.',
    category: defaultCategory,
    iconName: 'activity',
    isActive: true,
  },
  {
    id: 3,
    title: 'Eletrônica de Potência',
    slug: 'eletronica-potencia',
    shortDescription: 'Conversores CC-CC, sistemas fotovoltaicos e cargas de potência constante.',
    category: defaultCategory,
    iconName: 'zap',
    isActive: true,
  },
  {
    id: 4,
    title: 'Verificação Formal',
    slug: 'verificacao-formal',
    shortDescription: 'Model checking, verificação de redes neurais e ferramenta ESBMC.',
    category: defaultCategory,
    iconName: 'code-2',
    isActive: true,
  },
  {
    id: 5,
    title: 'Robótica e Indústria 4.0',
    slug: 'robotica-industria',
    shortDescription: 'VANTs, Digital Twins, Asset Administration Shell e IoT Industrial.',
    category: defaultCategory,
    iconName: 'cpu',
    isActive: true,
  },
];

interface ResearchCardProps {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  iconName?: string;
  index: number;
}

function ResearchCard({ title, description, slug, imageUrl, iconName, index }: ResearchCardProps) {
  const IconComponent = iconName
    ? iconMap[iconName] || getDefaultIcon(title)
    : getDefaultIcon(title);

  return (
    <Link
      href={`/research/${slug}`}
      className="w-[85vw] md:w-[500px] h-[50vh] bg-ufam-dark border border-white/10 relative flex flex-col justify-end 
                hover:border-ufam-primary/50 transition-all group shrink-0 overflow-hidden cursor-pointer"
    >
      {/* Background: Image or Icon */}
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ufam-dark via-ufam-dark/80 to-transparent" />
        </>
      ) : (
        <div className="absolute top-8 right-8 text-white/10 group-hover:text-ufam-primary/20 transition-colors">
          <IconComponent className="w-16 h-16" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Small icon indicator when image is present */}
        {imageUrl && (
          <div className="mb-4 text-ufam-primary/60 group-hover:text-ufam-primary transition-colors">
            <IconComponent className="w-8 h-8" />
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-ufam-light transition-colors font-tech">
          {title}
        </h3>
        <p className="text-ufam-secondary text-sm mb-4 leading-relaxed">{description}</p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-4 group-hover:bg-ufam-primary/30 transition-colors" />

        {/* Footer with click indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech text-ufam-secondary lowercase">
            area #{String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-2 text-ufam-primary text-sm font-tech group-hover:text-ufam-light transition-colors">
            explorar
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-ufam-primary/0 group-hover:bg-ufam-primary/10 transition-colors duration-300" />
    </Link>
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

  // Use Strapi data if available, otherwise fallback
  // NOTE: In production, you should remove fallbackResearchLines and handle empty state gracefully
  // For now, fallbacks are used only in development or when Strapi is unavailable
  const isDevelopment = process.env.NODE_ENV === 'development';
  const lines = researchLines?.length ? researchLines : isDevelopment ? fallbackResearchLines : [];

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

  // Empty state for production when no research lines are available
  if (lines.length === 0) {
    return (
      <section id="research" className="py-24 relative bg-ufam-bg z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-tech mb-4">
            Linhas de Pesquisa
          </h2>
          <p className="text-ufam-secondary">
            Conecte ao Strapi para visualizar as linhas de pesquisa.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="research" className="h-[300vh] relative bg-ufam-bg z-10">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="absolute top-24 left-6 md:left-20 z-20 pointer-events-none">
          <h2 className="text-6xl md:text-8xl font-black text-white/5 absolute -top-10 -left-4 font-tech lowercase">
            pesquisa
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-white relative font-tech">
            Linhas de Pesquisa
          </h2>
          <p className="font-tech text-ufam-light text-xs mt-2 flex items-center gap-2 lowercase">
            <ArrowRight className="w-4 h-4" />
            {isMobile ? 'arraste para o lado' : 'scroll para navegar'}
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
              slug={line.slug || String(line.id)}
              imageUrl={line.imageUrl}
              iconName={line.iconName || line.icon}
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
