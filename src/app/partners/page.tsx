import { getPartners } from '@/lib/strapi';
import type { PartnerFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { ExternalLink, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Parceiros | e-Controls',
  description:
    'Rede de colaboração do grupo e-Controls - universidades, institutos e empresas parceiras.',
};

export default async function PartnersPage() {
  let partners: PartnerFlat[] = [];

  try {
    partners = await getPartners();
  } catch (error) {
    console.error('Error fetching partners:', error);
  }

  // Group by type
  const internationalUniversities = partners.filter(
    (p) => p.partnerType === 'International University'
  );
  const nationalUniversities = partners.filter((p) => p.partnerType === 'National University');
  const researchInstitutes = partners.filter((p) => p.partnerType === 'Research Institute');
  const industrialPartners = partners.filter((p) => p.partnerType === 'Industrial Partner');
  const fundingAgencies = partners.filter((p) => p.partnerType === 'Funding Agency');

  // Stats
  const countries = [...new Set(partners.map((p) => p.country).filter(Boolean))];

  const PartnerCard = ({ partner, index }: { partner: PartnerFlat; index: number }) => (
    <FadeIn delay={index * 50}>
      <a
        href={partner.websiteUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-ufam-dark border border-white/5 p-6 rounded hover:border-ufam-primary/30 transition-all h-full"
      >
        <div className="flex items-start gap-4">
          {partner.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="w-16 h-16 object-contain bg-white/5 rounded p-2 group-hover:bg-white/10 transition-colors"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-ufam-primary/20 to-ufam-dark rounded flex items-center justify-center">
              <Globe className="w-8 h-8 text-ufam-primary/50" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-tech font-bold text-white group-hover:text-ufam-light transition-colors mb-1">
              {partner.name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-ufam-secondary">
              <MapPin className="w-3 h-3" />
              {partner.city && `${partner.city}, `}
              {partner.country}
            </div>
          </div>

          {partner.websiteUrl && (
            <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors shrink-0" />
          )}
        </div>
      </a>
    </FadeIn>
  );

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">Parceiros</h1>
            <p className="text-ufam-secondary max-w-2xl">
              Nossa rede de colaboração inclui universidades de excelência, institutos de pesquisa e
              parceiros industriais ao redor do mundo.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      {partners.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {partners.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">parceiros</p>
              </FadeIn>
              <FadeIn delay={100} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {countries.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">países</p>
              </FadeIn>
              <FadeIn delay={200} className="text-center">
                <span className="text-3xl font-bold text-blue-400 font-tech">
                  {internationalUniversities.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">internacionais</p>
              </FadeIn>
              <FadeIn delay={300} className="text-center">
                <span className="text-3xl font-bold text-green-400 font-tech">
                  {industrialPartners.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">indústrias</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* International Universities */}
      {internationalUniversities.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// universidades internacionais'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Colaborações Internacionais
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internationalUniversities.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* National Universities */}
      {nationalUniversities.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// universidades nacionais'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Parcerias Nacionais
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nationalUniversities.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Institutes */}
      {researchInstitutes.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// institutos de pesquisa'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Centros de Pesquisa
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchInstitutes.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industrial Partners */}
      {industrialPartners.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// parceiros industriais'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Indústria e Empresas
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industrialPartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Funding Agencies */}
      {fundingAgencies.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// agências de fomento'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Financiadores
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fundingAgencies.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* World Map Placeholder */}
      <section className="py-16 bg-ufam-dark border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h3 className="text-lg font-bold text-white font-tech mb-4">Presença Global</h3>
            <p className="text-ufam-secondary mb-8 max-w-xl mx-auto">
              Colaborações ativas com instituições em {countries.length} países ao redor do mundo.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {countries.map((country, index) => (
                <FadeIn key={country} delay={index * 30}>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-tech text-ufam-secondary">
                    {country}
                  </span>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Empty State */}
      {partners.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver os parceiros.</p>
          </div>
        </section>
      )}
    </main>
  );
}
