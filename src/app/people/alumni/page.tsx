import { getAlumni } from '@/lib/strapi';
import type { AlumnusFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { getSectorColors } from '@/styles/utils';
import { Linkedin, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Egressos | e-Controls',
  description: 'Egressos do grupo e-Controls - mestres e doutores formados pela UFAM.',
};

export default async function AlumniPage() {
  let alumni: AlumnusFlat[] = [];

  try {
    alumni = await getAlumni();
  } catch (error) {
    console.error('Error fetching alumni:', error);
  }

  // Group by degree level
  const doctors = alumni.filter((a) => a.degreeLevel === 'Doutorado');
  const masters = alumni.filter((a) => a.degreeLevel === 'Mestrado');
  const postdocs = alumni.filter((a) => a.degreeLevel === 'Pós-Doutorado');
  const undergrads = alumni.filter((a) => a.degreeLevel === 'Iniciação Científica');

  // Stats
  const totalAlumni = alumni.length;
  const inAcademia = alumni.filter((a) => a.currentSector === 'Academia').length;
  const inIndustry = alumni.filter((a) => a.currentSector === 'Indústria').length;

  const AlumniCard = ({ alum, index }: { alum: AlumnusFlat; index: number }) => {
    const sectorColors = getSectorColors(alum.currentSector);

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
                {alum.degreeLevel} {alum.defenseYear && `• ${alum.defenseYear}`}
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
            {alum.currentSector && (
              <span
                className={`text-xs font-tech px-2 py-1 rounded ${sectorColors.bg} ${sectorColors.text}`}
              >
                {alum.currentSector.toLowerCase()}
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
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">Egressos</h1>
            <p className="text-ufam-secondary max-w-2xl">
              Nossos egressos atuam em universidades, indústrias e centros de pesquisa ao redor do
              mundo, contribuindo para o avanço da ciência e tecnologia.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      {alumni.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {totalAlumni}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">egressos</p>
              </FadeIn>
              <FadeIn delay={100} className="text-center">
                <span className="text-3xl font-bold text-blue-400 font-tech">{inAcademia}</span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">na academia</p>
              </FadeIn>
              <FadeIn delay={200} className="text-center">
                <span className="text-3xl font-bold text-green-400 font-tech">{inIndustry}</span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">na indústria</p>
              </FadeIn>
              <FadeIn delay={300} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {doctors.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">doutores</p>
              </FadeIn>
              <FadeIn delay={400} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {masters.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">mestres</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// doutorado'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">Doutores</h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Masters */}
      {masters.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// mestrado'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">Mestres</h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masters.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Post-docs */}
      {postdocs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// pós-doutorado'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Pós-Doutores
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postdocs.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Undergrads */}
      {undergrads.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// iniciação científica'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Ex-Bolsistas IC
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {undergrads.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

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
