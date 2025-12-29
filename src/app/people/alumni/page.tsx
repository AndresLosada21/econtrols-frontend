import { getAlumni, getDegreeLevels, getAlumniSectors, getAlumniPageSettings } from '@/lib/strapi';
import type {
  AlumnusFlat,
  DegreeLevelFlat,
  AlumniSectorFlat,
  AlumniPageSettingAttributes,
} from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { Linkedin, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Egressos | e-Controls',
  description: 'Egressos do grupo e-Controls - mestres e doutores formados pela UFAM.',
};

export default async function AlumniPage() {
  // Fetch all data in parallel
  let alumni: AlumnusFlat[] = [];
  let degreeLevels: DegreeLevelFlat[] = [];
  let sectors: AlumniSectorFlat[] = [];
  let pageSettings: AlumniPageSettingAttributes | null = null;

  try {
    [alumni, degreeLevels, sectors, pageSettings] = await Promise.all([
      getAlumni(),
      getDegreeLevels(),
      getAlumniSectors(),
      getAlumniPageSettings(),
    ]);
  } catch (error) {
    console.error('Error fetching alumni data:', error);
  }

  // Stats: Total + per sector
  const totalAlumni = alumni.length;

  // Calculate stats per sector dynamically
  const sectorStats = sectors.map((sector) => ({
    ...sector,
    count: alumni.filter((a) => a.sector?.id === sector.id).length,
  }));

  // Calculate stats per degree level dynamically
  const degreeStats = degreeLevels.map((level) => ({
    ...level,
    count: alumni.filter((a) => a.degree?.id === level.id).length,
  }));

  // Group alumni by degree level
  const alumniByDegree = degreeLevels
    .map((level) => ({
      level,
      alumni: alumni.filter((a) => a.degree?.id === level.id),
    }))
    .filter((group) => group.alumni.length > 0);

  // Helper to get sector color classes
  const getSectorColorClasses = (color?: string) => {
    if (!color) return { bg: 'bg-gray-400/10', text: 'text-gray-400' };

    // Map Tailwind text colors to bg variations
    const colorMap: Record<string, { bg: string; text: string }> = {
      'text-blue-400': { bg: 'bg-blue-400/10', text: 'text-blue-400' },
      'text-green-400': { bg: 'bg-green-400/10', text: 'text-green-400' },
      'text-purple-400': { bg: 'bg-purple-400/10', text: 'text-purple-400' },
      'text-amber-400': { bg: 'bg-amber-400/10', text: 'text-amber-400' },
      'text-red-400': { bg: 'bg-red-400/10', text: 'text-red-400' },
      'text-cyan-400': { bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
      'text-pink-400': { bg: 'bg-pink-400/10', text: 'text-pink-400' },
      'text-gray-400': { bg: 'bg-gray-400/10', text: 'text-gray-400' },
    };

    return colorMap[color] || { bg: 'bg-gray-400/10', text: color };
  };

  const AlumniCard = ({ alum, index }: { alum: AlumnusFlat; index: number }) => {
    const sectorColors = getSectorColorClasses(alum.sector?.color);

    return (
      <FadeIn delay={index * 50}>
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
                {alum.degree.name} {alum.defenseYear && `• ${alum.defenseYear}`}
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
                className={`text-xs font-tech px-2 py-1 rounded ${sectorColors.bg} ${sectorColors.text}`}
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
  };

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">
              {pageSettings?.pageTitle || 'Egressos'}
            </h1>
            <p className="text-ufam-secondary max-w-2xl">
              {pageSettings?.pageDescription ||
                'Nossos egressos atuam em universidades, indústrias e centros de pesquisa ao redor do mundo, contribuindo para o avanço da ciência e tecnologia.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats - Dynamic from taxonomies */}
      {alumni.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* Total */}
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {totalAlumni}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">egressos</p>
              </FadeIn>

              {/* Per sector - Dynamic loop */}
              {sectorStats
                .filter((s) => s.count > 0)
                .map((sector, index) => {
                  const colorClass = sector.color || 'text-gray-400';
                  return (
                    <FadeIn key={sector.id} delay={(index + 1) * 100} className="text-center">
                      <span className={`text-3xl font-bold font-tech ${colorClass}`}>
                        {sector.count}
                      </span>
                      <p className="text-xs text-ufam-secondary font-tech lowercase">
                        {sector.statsLabel || sector.name.toLowerCase()}
                      </p>
                    </FadeIn>
                  );
                })}

              {/* Per degree level - Dynamic loop */}
              {degreeStats
                .filter((d) => d.count > 0)
                .map((degree, index) => (
                  <FadeIn
                    key={degree.id}
                    delay={(sectorStats.filter((s) => s.count > 0).length + index + 1) * 100}
                    className="text-center"
                  >
                    <span className="text-3xl font-bold text-ufam-light font-tech">
                      {degree.count}
                    </span>
                    <p className="text-xs text-ufam-secondary font-tech lowercase">
                      {degree.pluralName?.toLowerCase() || degree.name.toLowerCase()}
                    </p>
                  </FadeIn>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Alumni sections - Dynamic loop over degree levels */}
      {alumniByDegree.map((group, groupIndex) => (
        <section
          key={group.level.id}
          className={`py-16 ${groupIndex % 2 === 1 ? 'bg-ufam-dark' : ''}`}
        >
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {`/// ${group.level.slug}`}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                {group.level.pluralName || group.level.name}
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.alumni.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Empty State */}
      {alumni.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver os egressos.</p>
          </div>
        </section>
      )}
    </main>
  );
}
