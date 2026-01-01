'use client';

import { useState, useMemo } from 'react';
import { Search, Download, Filter, X, ExternalLink, Linkedin } from 'lucide-react';
import type { AlumnusFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';

interface AlumniListProps {
  alumni: AlumnusFlat[];
}

type DegreeLevel = 'Todos' | 'Doutorado' | 'Mestrado' | 'Pós-Doutorado' | 'Iniciação Científica';
type SectorFilter = 'Todos' | 'Academia' | 'Indústria' | 'Governo' | 'Empreendedorismo';

const degreeLevelLabels: Record<DegreeLevel, string> = {
  Todos: 'Todos',
  Doutorado: 'Doutores',
  Mestrado: 'Mestres',
  'Pós-Doutorado': 'Pós-Doutores',
  'Iniciação Científica': 'IC',
};

export function AlumniList({ alumni }: AlumniListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<DegreeLevel>('Todos');
  const [selectedSector, setSelectedSector] = useState<SectorFilter>('Todos');
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique years from alumni
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    alumni.forEach((a) => {
      if (a.defenseYear) uniqueYears.add(a.defenseYear);
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [alumni]);

  // Get unique sectors from alumni
  const sectors = useMemo(() => {
    const uniqueSectors = new Set<string>();
    alumni.forEach((a) => {
      if (a.currentSector) uniqueSectors.add(a.currentSector);
    });
    return Array.from(uniqueSectors);
  }, [alumni]);

  // Filter alumni
  const filteredAlumni = useMemo(() => {
    return alumni.filter((alum) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          alum.fullName.toLowerCase().includes(query) ||
          alum.thesisTitle?.toLowerCase().includes(query) ||
          alum.advisor?.toLowerCase().includes(query) ||
          alum.currentInstitution?.toLowerCase().includes(query) ||
          alum.currentPosition?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Degree filter
      // Fallback to legacy field if relation is missing (during migration)
      const degreeName = alum.degree?.name;
      if (selectedDegree !== 'Todos' && degreeName !== selectedDegree) {
        return false;
      }

      // Sector filter
      // Fallback to legacy field if relation is missing (during migration)
      const sectorName = alum.sector?.name;
      if (selectedSector !== 'Todos' && sectorName !== selectedSector) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'Todos' && alum.defenseYear !== parseInt(selectedYear)) {
        return false;
      }

      return true;
    });
  }, [alumni, searchQuery, selectedDegree, selectedSector, selectedYear]);

  // Stats
  const stats = useMemo(() => {
    // Helper to check sector safely
    const checkSector = (a: AlumnusFlat, sector: string) => a.sector?.name === sector;

    // Helper to check degree safely
    const checkDegree = (a: AlumnusFlat, degree: string) => a.degree?.name === degree;

    const inAcademia = filteredAlumni.filter((a) => checkSector(a, 'Academia')).length;
    const inIndustry = filteredAlumni.filter((a) => checkSector(a, 'Indústria')).length;
    const doctors = filteredAlumni.filter((a) => checkDegree(a, 'Doutorado')).length;
    const masters = filteredAlumni.filter((a) => checkDegree(a, 'Mestrado')).length;
    return { inAcademia, inIndustry, doctors, masters, total: filteredAlumni.length };
  }, [filteredAlumni]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Nível',
      'Ano de Defesa',
      'Título da Tese/Dissertação',
      'Orientador',
      'Posição Atual',
      'Instituição Atual',
      'Setor',
      'LinkedIn',
      'Lattes',
    ];

    const rows = filteredAlumni.map((alum) => [
      alum.fullName,
      alum.degree?.name || '',
      alum.defenseYear?.toString() || '',
      alum.thesisTitle || '',
      alum.advisor || '',
      alum.currentPosition || '',
      alum.currentInstitution || '',
      alum.sector?.name || '',
      alum.linkedinUrl || '',
      alum.lattesUrl || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'egressos-econtrols.csv';
    link.click();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDegree('Todos');
    setSelectedSector('Todos');
    setSelectedYear('Todos');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedDegree !== 'Todos' ||
    selectedSector !== 'Todos' ||
    selectedYear !== 'Todos';

  return (
    <div>
      {/* Stats */}
      <section className="py-8 bg-ufam-dark border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <span className="text-3xl font-bold text-ufam-primary font-tech">{stats.total}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">egressos</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-400 font-tech">{stats.inAcademia}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">na academia</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-green-400 font-tech">
                {stats.inIndustry}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">na indústria</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-ufam-light font-tech">{stats.doctors}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">doutores</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-ufam-light font-tech">{stats.masters}</span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">mestres</p>
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
                placeholder="Buscar por nome, tese, orientador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ufam-dark border border-white/10 rounded text-white placeholder:text-ufam-secondary/50 focus:outline-none focus:border-ufam-primary/50 font-tech text-sm"
              />
            </div>

            {/* Degree Tabs */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(degreeLevelLabels) as DegreeLevel[]).map((degree) => (
                <button
                  key={degree}
                  onClick={() => setSelectedDegree(degree)}
                  className={`px-3 py-1.5 text-xs font-tech rounded border transition-all ${
                    selectedDegree === degree
                      ? 'bg-ufam-primary text-white border-ufam-primary'
                      : 'bg-transparent text-ufam-secondary border-white/10 hover:border-ufam-primary/50'
                  }`}
                >
                  {degreeLevelLabels[degree]}
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

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-tech rounded border border-white/10 text-ufam-secondary hover:border-ufam-primary/50 hover:text-ufam-primary transition-all"
            >
              <Download className="w-3 h-3" />
              Exportar CSV
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-ufam-dark rounded border border-white/5">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Sector Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs text-ufam-secondary font-tech mb-1.5">
                    Setor Atual
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value as SectorFilter)}
                    className="w-full px-3 py-2 bg-ufam-bg border border-white/10 rounded text-white font-tech text-sm focus:outline-none focus:border-ufam-primary/50"
                  >
                    <option value="Todos">Todos os Setores</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs text-ufam-secondary font-tech mb-1.5">
                    Ano de Defesa
                  </label>
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

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-tech text-ufam-secondary hover:text-ufam-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {filteredAlumni.length > 0 ? (
            <>
              <p className="text-sm text-ufam-secondary mb-6 font-tech">
                Exibindo {filteredAlumni.length} de {alumni.length} egressos
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alum, index) => (
                  <AlumniCard key={alum.id} alum={alum} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-ufam-secondary mb-4">
                Nenhum egresso encontrado com os filtros selecionados.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-tech text-ufam-primary hover:text-ufam-light transition-colors"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Where Are They Now */}
      <section className="py-12 bg-ufam-dark border-t border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
              {'/// onde estão agora'}
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
              Destinos dos Nossos Egressos
            </h3>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Academia */}
            <FadeIn delay={100}>
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-lg">🎓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-tech font-bold">Academia</h4>
                    <p className="text-xs text-blue-400 font-tech">{stats.inAcademia} egressos</p>
                  </div>
                </div>
                <p className="text-sm text-ufam-secondary">
                  Professores e pesquisadores em universidades no Brasil e exterior.
                </p>
              </div>
            </FadeIn>

            {/* Industry */}
            <FadeIn delay={200}>
              <div className="p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-lg">🏭</span>
                  </div>
                  <div>
                    <h4 className="text-white font-tech font-bold">Indústria</h4>
                    <p className="text-xs text-green-400 font-tech">{stats.inIndustry} egressos</p>
                  </div>
                </div>
                <p className="text-sm text-ufam-secondary">
                  Engenheiros e desenvolvedores em empresas de tecnologia.
                </p>
              </div>
            </FadeIn>

            {/* Government */}
            <FadeIn delay={300}>
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 text-lg">🏛️</span>
                  </div>
                  <div>
                    <h4 className="text-white font-tech font-bold">Governo</h4>
                    <p className="text-xs text-purple-400 font-tech">
                      {alumni.filter((a) => a.sector?.name === 'Governo').length} egressos
                    </p>
                  </div>
                </div>
                <p className="text-sm text-ufam-secondary">
                  Servidores e técnicos em instituições públicas.
                </p>
              </div>
            </FadeIn>

            {/* Entrepreneurship */}
            <FadeIn delay={400}>
              <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-lg">🚀</span>
                  </div>
                  <div>
                    <h4 className="text-white font-tech font-bold">Empreendedorismo</h4>
                    <p className="text-xs text-amber-400 font-tech">
                      {alumni.filter((a) => a.sector?.name === 'Empreendedorismo').length} egressos
                    </p>
                  </div>
                </div>
                <p className="text-sm text-ufam-secondary">
                  Fundadores de startups e empresas de tecnologia.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

// Alumni Card Component
function AlumniCard({ alum, index }: { alum: AlumnusFlat; index: number }) {
  return (
    <FadeIn delay={Math.min(index * 30, 300)}>
      <div className="bg-ufam-dark border border-white/5 p-6 rounded hover:border-ufam-primary/30 transition-all group h-full">
        <div className="flex items-start gap-4 mb-4">
          {alum.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={alum.photoUrl}
              alt={alum.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-ufam-primary/30 group-hover:border-ufam-primary transition-colors"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ufam-primary/20 to-ufam-dark flex items-center justify-center border-2 border-ufam-primary/30">
              <span className="text-xl font-tech text-ufam-primary/70">
                {alum.fullName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold font-tech group-hover:text-ufam-light transition-colors">
              {alum.fullName}
            </h4>
            <span className="text-xs font-tech text-ufam-primary lowercase">
              {alum.degree?.name} {alum.defenseYear && `• ${alum.defenseYear}`}
            </span>
          </div>
        </div>

        {alum.thesisTitle && (
          <p className="text-ufam-secondary/70 text-xs mb-3 line-clamp-2 italic">
            &ldquo;{alum.thesisTitle}&rdquo;
          </p>
        )}

        {alum.advisor && (
          <p className="text-xs text-ufam-secondary mb-3">
            Orientador: <span className="text-ufam-light">{alum.advisor}</span>
          </p>
        )}

        {alum.currentPosition && (
          <p className="text-ufam-secondary text-sm mb-1">{alum.currentPosition}</p>
        )}

        {alum.currentInstitution && (
          <p className="text-xs text-ufam-light/70 font-tech lowercase mb-3">
            {alum.currentInstitution}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {alum.sector && (
            <span
              className={`text-xs font-tech px-2 py-1 rounded ${alum.sector.color || 'bg-gray-500/20 text-gray-400'}`}
            >
              {alum.sector.name.toLowerCase()}
            </span>
          )}

          <div className="flex gap-2">
            {alum.linkedinUrl && (
              <a
                href={alum.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-ufam-secondary hover:text-ufam-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {alum.lattesUrl && (
              <a
                href={alum.lattesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-ufam-secondary hover:text-ufam-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
