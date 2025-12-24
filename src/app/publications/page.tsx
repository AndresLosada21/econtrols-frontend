import { getPublications } from '@/lib/strapi';
import type { PublicationFlat } from '@/types/strapi';
import PublicationCard from '@/components/cards/PublicationCard';
import { FadeIn } from '@/components/effects/FadeIn';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';

export const metadata = {
  title: 'Publicações | e-Controls',
  description: 'Produção científica do grupo e-Controls da UFAM.',
};

export default async function PublicationsPage() {
  let publications: PublicationFlat[] = [];

  try {
    publications = await getPublications();
  } catch (error) {
    console.error('Error fetching publications:', error);
  }

  // Group by type
  const journals = publications.filter((p) => p.publicationType === 'Journal Article');
  const conferences = publications.filter((p) => p.publicationType === 'Conference Paper');
  const bookChapters = publications.filter((p) => p.publicationType === 'Book Chapter');
  const theses = publications.filter((p) => p.publicationType === 'Thesis');

  // Stats
  const totalCitations = publications.reduce((acc, p) => acc + (p.citationCount || 0), 0);
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);

  // Group by year for display
  const publicationsByYear = years.map((year) => ({
    year,
    publications: publications.filter((p) => p.year === year),
  }));

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">
              Publicações
            </h1>
            <p className="text-ufam-secondary max-w-2xl">
              Artigos publicados em periódicos e conferências de alto impacto, contribuindo para o
              avanço do conhecimento em teoria de controle e sistemas.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      {publications.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <FadeIn className="text-center">
                <AnimatedCounter
                  end={publications.length}
                  duration={1500}
                  className="text-3xl font-bold text-ufam-primary font-tech"
                />
                <p className="text-xs text-ufam-secondary font-tech lowercase">publicações</p>
              </FadeIn>
              <FadeIn delay={100} className="text-center">
                <AnimatedCounter
                  end={totalCitations}
                  duration={1500}
                  className="text-3xl font-bold text-ufam-light font-tech"
                />
                <p className="text-xs text-ufam-secondary font-tech lowercase">citações</p>
              </FadeIn>
              <FadeIn delay={200} className="text-center">
                <span className="text-3xl font-bold text-blue-400 font-tech">
                  {journals.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">journals</p>
              </FadeIn>
              <FadeIn delay={300} className="text-center">
                <span className="text-3xl font-bold text-purple-400 font-tech">
                  {conferences.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">conferências</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs - Type based */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-ufam-primary text-white rounded text-sm font-tech lowercase">
              todas ({publications.length})
            </span>
            {journals.length > 0 && (
              <span className="px-4 py-2 bg-white/5 text-ufam-secondary rounded text-sm font-tech lowercase hover:bg-white/10 transition-colors cursor-pointer">
                journals ({journals.length})
              </span>
            )}
            {conferences.length > 0 && (
              <span className="px-4 py-2 bg-white/5 text-ufam-secondary rounded text-sm font-tech lowercase hover:bg-white/10 transition-colors cursor-pointer">
                conferências ({conferences.length})
              </span>
            )}
            {bookChapters.length > 0 && (
              <span className="px-4 py-2 bg-white/5 text-ufam-secondary rounded text-sm font-tech lowercase hover:bg-white/10 transition-colors cursor-pointer">
                capítulos ({bookChapters.length})
              </span>
            )}
            {theses.length > 0 && (
              <span className="px-4 py-2 bg-white/5 text-ufam-secondary rounded text-sm font-tech lowercase hover:bg-white/10 transition-colors cursor-pointer">
                teses ({theses.length})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Publications by Year */}
      {publicationsByYear.map(({ year, publications: yearPubs }, yearIndex) => (
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

      {/* TODO: Google Scholar Link - adicionar URL do perfil do grupo quando disponível */}

      {/* Empty State */}
      {publications.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver as publicações.</p>
          </div>
        </section>
      )}
    </main>
  );
}
