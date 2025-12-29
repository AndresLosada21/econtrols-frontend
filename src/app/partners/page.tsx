import { getPartners, getPartnerTypes, getPartnersPageSettings } from '@/lib/strapi';
import type { PartnerFlat, PartnerTypeFlat, PartnersPageSettingAttributes } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { ExternalLink, MapPin, Globe } from 'lucide-react';
import { Metadata } from 'next';

// Dynamic metadata based on page settings
export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getPartnersPageSettings();

  return {
    title: pageSettings?.seo?.metaTitle || pageSettings?.pageTitle || 'Parceiros | e-Controls',
    description:
      pageSettings?.seo?.metaDescription ||
      pageSettings?.pageDescription ||
      'Rede de colaboração do grupo e-Controls - universidades, institutos e empresas parceiras.',
  };
}

export default async function PartnersPage() {
  // Fetch all data in parallel
  const [partners, partnerTypes, pageSettings] = await Promise.all([
    getPartners().catch(() => [] as PartnerFlat[]),
    getPartnerTypes().catch(() => [] as PartnerTypeFlat[]),
    getPartnersPageSettings().catch(() => null as PartnersPageSettingAttributes | null),
  ]);

  // Group partners by type ID
  const partnersByType = partners.reduce(
    (acc, partner) => {
      const typeId = partner.type?.id || 0;
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(partner);
      return acc;
    },
    {} as Record<number, PartnerFlat[]>
  );

  // Calculate stats
  const countries = [...new Set(partners.map((p) => p.country).filter(Boolean))];

  // Get top types for stats (ordered by quantity, max 3 that have showInStats=true)
  const typesWithCounts = partnerTypes
    .filter((type) => type.showInStats && partnersByType[type.id]?.length > 0)
    .map((type) => ({
      ...type,
      count: partnersByType[type.id]?.length || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Default values from page settings
  const title = pageSettings?.pageTitle || 'Parceiros';
  const description =
    pageSettings?.pageDescription ||
    'Nossa rede de colaboração inclui universidades de excelência, institutos de pesquisa e parceiros industriais ao redor do mundo.';
  const statsLabelTotal = pageSettings?.statsLabelTotal || 'parceiros';
  const statsLabelCountries = pageSettings?.statsLabelCountries || 'países';
  const globalPresenceTitle = pageSettings?.globalPresenceTitle || 'Presença Global';
  const globalPresenceDescription =
    pageSettings?.globalPresenceDescription?.replace('{countries}', String(countries.length)) ||
    `Colaborações ativas com instituições em ${countries.length} países ao redor do mundo.`;
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver os parceiros.';

  // Partner Card Component
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

  // Section Component - renders a section for a partner type
  const PartnerSection = ({
    type,
    partners,
    isAlternate,
  }: {
    type: PartnerTypeFlat;
    partners: PartnerFlat[];
    isAlternate: boolean;
  }) => (
    <section className={`py-16 ${isAlternate ? 'bg-ufam-dark' : ''}`}>
      <div className="container mx-auto px-6">
        <FadeIn>
          <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
            {type.description || `/// ${type.name.toLowerCase()}`}
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
            {type.sectionTitle || type.name}
          </h3>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">{title}</h1>
            <p className="text-ufam-secondary max-w-2xl">{description}</p>
          </FadeIn>
        </div>
      </section>

      {/* Stats - Dynamic based on partner types */}
      {partners.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* Total Partners */}
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {partners.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">{statsLabelTotal}</p>
              </FadeIn>

              {/* Countries */}
              <FadeIn delay={100} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {countries.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {statsLabelCountries}
                </p>
              </FadeIn>

              {/* Dynamic stats from partner types */}
              {typesWithCounts.map((type, index) => (
                <FadeIn key={type.id} delay={(index + 2) * 100} className="text-center">
                  <span className={`text-3xl font-bold font-tech ${type.color}`}>{type.count}</span>
                  <p className="text-xs text-ufam-secondary font-tech lowercase">
                    {type.statsLabel || type.name.toLowerCase()}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Partner Sections - Ordered by displayOrder */}
      {partnerTypes
        .filter((type) => partnersByType[type.id]?.length > 0)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((type, index) => (
          <PartnerSection
            key={type.id}
            type={type}
            partners={partnersByType[type.id]}
            isAlternate={index % 2 === 1}
          />
        ))}

      {/* World Map Placeholder - Global Presence */}
      {countries.length > 0 && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h3 className="text-lg font-bold text-white font-tech mb-4">{globalPresenceTitle}</h3>
              <p className="text-ufam-secondary mb-8 max-w-xl mx-auto">
                {globalPresenceDescription}
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
      )}

      {/* Empty State */}
      {partners.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">{emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
