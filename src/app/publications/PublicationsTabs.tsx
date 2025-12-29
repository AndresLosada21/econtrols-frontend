'use client';

import { useState } from 'react';
import type { PublicationFlat } from '@/types/strapi';
import PublicationCard from '@/components/cards/PublicationCard';
import { FadeIn } from '@/components/effects/FadeIn';

interface TabData {
  type: string;
  label: string;
  count: number;
  color: string; // Cor completa do banco (ex: "bg-blue-500/20 text-blue-400")
}

interface PublicationsByYear {
  year: number;
  publications: PublicationFlat[];
}

interface PublicationsTabsProps {
  tabs: TabData[];
  allLabel: string;
  totalCount: number;
  publications: PublicationFlat[];
  publicationsByYear: PublicationsByYear[];
}

/**
 * Extrai as classes bg e text de uma string de cores
 * Ex: "bg-blue-500/20 text-blue-400" -> { bg: "bg-blue-500/20", text: "text-blue-400" }
 */
function parseColorClasses(colorString: string): { bg: string; text: string } {
  const bgMatch = colorString.match(/bg-[^\s]+/);
  const textMatch = colorString.match(/text-[^\s]+/);
  return {
    bg: bgMatch ? bgMatch[0] : 'bg-slate-500/20',
    text: textMatch ? textMatch[0] : 'text-slate-400',
  };
}

export function PublicationsTabs({
  tabs,
  allLabel,
  totalCount,
  publications,
}: PublicationsTabsProps) {
  // null = "all", string = categoria específica
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Filtra publicações baseado na aba ativa
  // Usa category.name da taxonomia dinâmica
  const filteredPublications = activeTab
    ? publications.filter((p) => {
        const categoryName = p.category?.name;
        return categoryName === activeTab;
      })
    : publications;

  // Agrupa por ano (recalcula quando filtro muda)
  const years = [...new Set(filteredPublications.map((p) => p.year))].sort((a, b) => b - a);
  const filteredByYear = years.map((year) => ({
    year,
    publications: filteredPublications.filter((p) => p.year === year),
  }));

  return (
    <>
      {/* Filter Tabs */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {/* Aba "Todas" */}
            <button
              onClick={() => setActiveTab(null)}
              className={`px-4 py-2 rounded text-sm font-tech lowercase transition-colors ${
                activeTab === null
                  ? 'bg-ufam-primary text-white'
                  : 'bg-white/5 text-ufam-secondary hover:bg-white/10'
              }`}
            >
              {allLabel} ({totalCount})
            </button>

            {/* Abas dinâmicas por categoria - cores do banco de dados */}
            {tabs.map((tab) => {
              const colors = parseColorClasses(tab.color);
              const isActive = activeTab === tab.type;

              return (
                <button
                  key={tab.type}
                  onClick={() => setActiveTab(tab.type)}
                  className={`px-4 py-2 rounded text-sm font-tech lowercase transition-colors ${
                    isActive
                      ? `${colors.bg} ${colors.text} ring-1 ring-current`
                      : 'bg-white/5 text-ufam-secondary hover:bg-white/10'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Publications by Year */}
      {filteredByYear.map(({ year, publications: yearPubs }, yearIndex) => (
        <section
          key={year}
          className={`py-12 ${yearIndex % 2 === 0 ? 'bg-ufam-bg' : 'bg-ufam-dark'}`}
        >
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-ufam-primary/30 font-tech">{year}</span>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-sm text-ufam-secondary font-tech">
                  {yearPubs.length} {yearPubs.length === 1 ? 'publicação' : 'publicações'}
                </span>
              </div>
            </FadeIn>

            <div className="space-y-4">
              {yearPubs.map((publication, index) => (
                <FadeIn key={publication.id} delay={index * 50}>
                  <PublicationCard publication={publication} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Empty state para filtro sem resultados */}
      {filteredPublications.length === 0 && activeTab !== null && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">
              Nenhuma publicação do tipo "
              {tabs.find((t) => t.type === activeTab)?.label || activeTab}" encontrada.
            </p>
            <button
              onClick={() => setActiveTab(null)}
              className="mt-4 px-4 py-2 bg-ufam-primary text-white rounded text-sm font-tech hover:bg-ufam-primary/80 transition-colors"
            >
              Ver todas publicações
            </button>
          </div>
        </section>
      )}
    </>
  );
}
