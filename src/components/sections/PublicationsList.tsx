'use client';

import { useState, useMemo } from 'react';
import { Search, Download, Filter, X, BookOpen, Users, FileText, Award } from 'lucide-react';
import Link from 'next/link';
import type { PublicationFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';

interface PublicationsListProps {
  publications: PublicationFlat[];
}

type PublicationType =
  | 'Todos'
  | 'Journal Article'
  | 'Conference Paper'
  | 'Book Chapter'
  | 'Thesis'
  | 'Technical Report';

const typeLabels: Record<PublicationType, string> = {
  Todos: 'Todas',
  'Journal Article': 'Journals',
  'Conference Paper': 'Conferências',
  'Book Chapter': 'Capítulos',
  Thesis: 'Teses',
  'Technical Report': 'Relatórios',
};

function getTypeColor(type: string): string {
  switch (type) {
    case 'Journal Article':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Conference Paper':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Book Chapter':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Thesis':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Technical Report':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'Journal Article':
      return <BookOpen className="w-3 h-3" />;
    case 'Conference Paper':
      return <Users className="w-3 h-3" />;
    case 'Book Chapter':
      return <FileText className="w-3 h-3" />;
    case 'Thesis':
      return <Award className="w-3 h-3" />;
    default:
      return <FileText className="w-3 h-3" />;
  }
}

export function PublicationsList({ publications }: PublicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PublicationType>('Todos');
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [selectedQualis, setSelectedQualis] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique years
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    publications.forEach((p) => {
      if (p.year) uniqueYears.add(p.year);
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [publications]);

  // Get unique Qualis ratings
  const qualisRatings = useMemo(() => {
    const uniqueQualis = new Set<string>();
    publications.forEach((p) => {
      if (p.qualis) uniqueQualis.add(p.qualis);
    });
    return Array.from(uniqueQualis).sort();
  }, [publications]);

  // Get unique publication types
  const pubTypes = useMemo(() => {
    const uniqueTypes = new Set<string>();
    publications.forEach((p) => {
      if (p.publicationType) uniqueTypes.add(p.publicationType);
    });
    return Array.from(uniqueTypes);
  }, [publications]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          pub.title.toLowerCase().includes(query) ||
          pub.authorsText.toLowerCase().includes(query) ||
          pub.journalName?.toLowerCase().includes(query) ||
          pub.conferenceName?.toLowerCase().includes(query) ||
          pub.keywords?.some((k) => k.toLowerCase().includes(query)) ||
          pub.abstract?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (selectedType !== 'Todos' && pub.publicationType !== selectedType) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'Todos' && pub.year !== parseInt(selectedYear)) {
        return false;
      }

      // Qualis filter
      if (selectedQualis !== 'Todos' && pub.qualis !== selectedQualis) {
        return false;
      }

      return true;
    });
  }, [publications, searchQuery, selectedType, selectedYear, selectedQualis]);

  // Group by year for display
  const publicationsByYear = useMemo(() => {
    const grouped = new Map<number, PublicationFlat[]>();
    filteredPublications.forEach((pub) => {
      const year = pub.year;
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(pub);
    });
    return Array.from(grouped.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, pubs]) => ({ year, publications: pubs }));
  }, [filteredPublications]);

  // Stats
  const stats = useMemo(() => {
    const totalCitations = filteredPublications.reduce((acc, p) => acc + (p.citationCount || 0), 0);
    const journals = filteredPublications.filter(
      (p) => p.publicationType === 'Journal Article'
    ).length;
    const conferences = filteredPublications.filter(
      (p) => p.publicationType === 'Conference Paper'
    ).length;
    return { total: filteredPublications.length, totalCitations, journals, conferences };
  }, [filteredPublications]);

  // Export functions
  const exportToCSV = () => {
    const headers = [
      'Título',
      'Autores',
      'Tipo',
      'Ano',
      'Journal/Conferência',
      'DOI',
      'Citações',
      'Qualis',
    ];
    const rows = filteredPublications.map((pub) => [
      pub.title,
      pub.authorsText,
      pub.publicationType,
      pub.year.toString(),
      pub.journalName || pub.conferenceName || '',
      pub.doi || '',
      pub.citationCount?.toString() || '0',
      pub.qualis || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'publicacoes-econtrols.csv';
    link.click();
  };

  const exportToBibTeX = () => {
    const bibtexEntries = filteredPublications
      .filter((pub) => pub.citationBibtex)
      .map((pub) => pub.citationBibtex)
      .join('\n\n');

    if (!bibtexEntries) {
      alert('Nenhuma publicação selecionada possui citação BibTeX disponível.');
      return;
    }

    const blob = new Blob([bibtexEntries], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'publicacoes-econtrols.bib';
    link.click();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('Todos');
    setSelectedYear('Todos');
    setSelectedQualis('Todos');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'Todos' ||
    selectedYear !== 'Todos' ||
    selectedQualis !== 'Todos';

  return (
    <div>
      {/* Stats */}
      <section className="py-8 bg-ufam-dark border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <span className="text-3xl font-bold text-ufam-primary font-tech">{stats.total}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">publicações</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-ufam-light font-tech">
                {stats.totalCitations}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">citações</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-400 font-tech">{stats.journals}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">journals</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-purple-400 font-tech">
                {stats.conferences}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">conferências</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ufam-secondary" />
              <input
                type="text"
                placeholder="Buscar por título, autor, palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ufam-dark border border-white/10 rounded text-white placeholder:text-ufam-secondary/50 focus:outline-none focus:border-ufam-primary/50 font-tech text-sm"
              />
            </div>

            {/* Type Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('Todos')}
                className={`px-3 py-1.5 text-xs font-tech rounded border transition-all ${
                  selectedType === 'Todos'
                    ? 'bg-ufam-primary text-white border-ufam-primary'
                    : 'bg-transparent text-ufam-secondary border-white/10 hover:border-ufam-primary/50'
                }`}
              >
                Todas ({publications.length})
              </button>
              {pubTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as PublicationType)}
                  className={`px-3 py-1.5 text-xs font-tech rounded border transition-all ${
                    selectedType === type
                      ? 'bg-ufam-primary text-white border-ufam-primary'
                      : 'bg-transparent text-ufam-secondary border-white/10 hover:border-ufam-primary/50'
                  }`}
                >
                  {typeLabels[type as PublicationType] || type} (
                  {publications.filter((p) => p.publicationType === type).length})
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-tech rounded border transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/50'
                  : 'bg-transparent text-ufam-secondary border-white/10 hover:border-ufam-primary/50'
              }`}
            >
              <Filter className="w-3 h-3" />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-ufam-primary rounded-full" />}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-ufam-dark rounded border border-white/5">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Year Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs text-ufam-secondary font-tech mb-1.5">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-ufam-bg border border-white/10 rounded text-white font-tech text-sm focus:outline-none focus:border-ufam-primary/50"
                  >
                    <option value="Todos">Todos os Anos</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qualis Filter */}
                {qualisRatings.length > 0 && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs text-ufam-secondary font-tech mb-1.5">
                      Qualis
                    </label>
                    <select
                      value={selectedQualis}
                      onChange={(e) => setSelectedQualis(e.target.value)}
                      className="w-full px-3 py-2 bg-ufam-bg border border-white/10 rounded text-white font-tech text-sm focus:outline-none focus:border-ufam-primary/50"
                    >
                      <option value="Todos">Todos</option>
                      {qualisRatings.map((qualis) => (
                        <option key={qualis} value={qualis}>
                          {qualis}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-tech rounded border border-white/10 text-ufam-secondary hover:border-ufam-primary/50 hover:text-ufam-primary transition-all"
                  >
                    <Download className="w-3 h-3" />
                    CSV
                  </button>
                  <button
                    onClick={exportToBibTeX}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-tech rounded border border-white/10 text-ufam-secondary hover:border-ufam-primary/50 hover:text-ufam-primary transition-all"
                  >
                    <Download className="w-3 h-3" />
                    BibTeX
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-tech text-ufam-secondary hover:text-ufam-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {filteredPublications.length > 0 ? (
        <>
          <div className="container mx-auto px-6 py-4">
            <p className="text-sm text-ufam-secondary font-tech">
              Exibindo {filteredPublications.length} de {publications.length} publicações
            </p>
          </div>

          {/* Publications by Year */}
          {publicationsByYear.map(({ year, publications: yearPubs }, yearIndex) => (
            <section
              key={year}
              className={`py-12 ${yearIndex % 2 === 0 ? 'bg-ufam-bg' : 'bg-ufam-dark'}`}
            >
              <div className="container mx-auto px-6">
                <FadeIn>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl font-bold text-ufam-primary/30 font-tech">
                      {year}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-sm text-ufam-secondary font-tech">
                      {yearPubs.length} {yearPubs.length === 1 ? 'publicação' : 'publicações'}
                    </span>
                  </div>
                </FadeIn>

                <div className="space-y-4">
                  {yearPubs.map((publication, index) => (
                    <FadeIn key={publication.id} delay={Math.min(index * 30, 200)}>
                      <PublicationCard publication={publication} />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      ) : (
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary mb-4">
              Nenhuma publicação encontrada com os filtros selecionados.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-tech text-ufam-primary hover:text-ufam-light transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar Filtros
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

// Publication Card Component
function PublicationCard({ publication }: { publication: PublicationFlat }) {
  const typeColor = getTypeColor(publication.publicationType);

  return (
    <Link
      href={`/publications/${publication.slug || publication.id}`}
      className="block bg-ufam-dark border border-white/5 p-6 rounded hover:border-ufam-primary/30 transition-all group"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1.5 font-tech text-xs px-2 py-0.5 rounded border ${typeColor} mb-2`}
          >
            {getTypeIcon(publication.publicationType)}
            {publication.publicationType}
          </span>

          {/* Title */}
          <h3 className="text-white font-bold group-hover:text-ufam-light transition-colors mb-2 line-clamp-2">
            {publication.title}
          </h3>

          {/* Authors */}
          <p className="text-ufam-secondary text-sm mb-2 line-clamp-1">{publication.authorsText}</p>

          {/* Venue */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-ufam-secondary">
            {publication.journalName && <span className="italic">{publication.journalName}</span>}
            {publication.conferenceName && (
              <span className="italic">{publication.conferenceName}</span>
            )}
            {publication.qualis && (
              <span className="px-2 py-0.5 bg-ufam-primary/20 text-ufam-primary rounded font-tech">
                {publication.qualis}
              </span>
            )}
          </div>
        </div>

        {/* Right side info */}
        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-right">
          <span className="text-2xl font-bold text-ufam-primary/50 font-tech">
            {publication.year}
          </span>
          {publication.citationCount !== undefined && publication.citationCount > 0 && (
            <span className="text-xs text-ufam-secondary font-tech">
              {publication.citationCount} citações
            </span>
          )}
          {publication.doi && <span className="text-xs text-ufam-primary/70 font-tech">DOI</span>}
        </div>
      </div>
    </Link>
  );
}
