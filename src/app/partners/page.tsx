import {
  getPartners,
  getPartnerTypes,
  getPartnersPageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import type {
  PartnerFlat,
  PartnerTypeFlat,
  PartnersPageSettingAttributes,
  CollaboratorFlat,
  FundedProject,
} from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import {
  ExternalLink,
  MapPin,
  Globe,
  Calendar,
  FileText,
  Briefcase,
  Users,
  FolderGit2,
  TrendingUp,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

// Dynamic metadata based on page settings
export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getPartnersPageSettings();

  const seo = pageSettings?.seo;
  const title = seo?.metaTitle || pageSettings?.pageTitle || 'Parceiros | e-Controls';
  const description =
    seo?.metaDescription ||
    pageSettings?.pageDescription ||
    'Rede de colaboração do grupo e-Controls - universidades, institutos e empresas parceiras.';

  return {
    title,
    description,
    keywords: seo?.keywords,
    robots: seo?.metaRobots,
    alternates: {
      canonical: seo?.canonicalURL,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: seo?.ogUrl,
      type: (seo?.ogType as 'website') || 'website',
      locale: seo?.ogLocale || 'pt_BR',
      images: seo?.ogImage?.data?.attributes?.url
        ? [{ url: getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '' }]
        : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: seo?.twitterImage?.data?.attributes?.url
        ? [getStrapiMediaUrl(seo.twitterImage.data.attributes.url) || '']
        : seo?.ogImage?.data?.attributes?.url
          ? [getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '']
          : [],
    },
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

  // ============================================
  // Page Settings - All values from backend with fallbacks
  // ============================================

  // Text content
  const title = pageSettings?.pageTitle || 'Parceiros';
  const description =
    pageSettings?.pageDescription ||
    'Nossa rede de colaboração inclui universidades de excelência, institutos de pesquisa e parceiros industriais ao redor do mundo.';
  const globalPresenceTitle = pageSettings?.globalPresenceTitle || 'Presença Global';
  const globalPresenceDescription =
    pageSettings?.globalPresenceDescription?.replace('{countries}', String(countries.length)) ||
    `Colaborações ativas com instituições em ${countries.length} países ao redor do mundo.`;
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver os parceiros.';

  // Section Visibility (with fallbacks to old structure for backward compatibility)
  const sectionVis = pageSettings?.sectionVisibility;
  const showHeader = sectionVis?.showHeader ?? true;
  const showStats = sectionVis?.showStats ?? true;
  const showPartnerSections = sectionVis?.showPartnerSections ?? true;
  const showGlobalPresence = sectionVis?.showGlobalPresence ?? true;

  // Card Visibility (with fallbacks to old structure for backward compatibility)
  const cardVis = pageSettings?.cardVisibility;
  const showDescription = cardVis?.showDescription ?? pageSettings?.showDescription ?? true;
  const showState = cardVis?.showState ?? pageSettings?.showState ?? true;
  const showCity = cardVis?.showCity ?? pageSettings?.showCity ?? true;
  const showCollaborationType =
    cardVis?.showCollaborationType ?? pageSettings?.showCollaborationType ?? true;
  const showCollaborationArea =
    cardVis?.showCollaborationArea ?? pageSettings?.showCollaborationArea ?? true;
  const showStartDate = cardVis?.showStartDate ?? pageSettings?.showStartDate ?? true;
  const showJointPublications =
    cardVis?.showJointPublications ?? pageSettings?.showJointPublications ?? true;
  const showCustomColorTheme =
    cardVis?.showCustomColorTheme ?? pageSettings?.showCustomColorTheme ?? true;
  const showCollaborators = cardVis?.showCollaborators ?? pageSettings?.showCollaborators ?? true;
  const showRelatedProjects =
    cardVis?.showRelatedProjects ?? pageSettings?.showRelatedProjects ?? true;
  const showFundedProjects =
    cardVis?.showFundedProjects ?? pageSettings?.showFundedProjects ?? true;
  const showLogo = cardVis?.showLogo ?? true;
  const showLocation = cardVis?.showLocation ?? true;
  const showWebsiteLink = cardVis?.showWebsiteLink ?? true;

  // Card Labels (with fallbacks to old structure for backward compatibility)
  const labels = pageSettings?.cardLabels;
  const collaborationTypeLabel =
    labels?.collaborationTypeLabel ?? pageSettings?.collaborationTypeLabel ?? 'Tipo de Colaboração';
  const startDateLabel = labels?.startDateLabel ?? pageSettings?.startDateLabel ?? 'Desde';
  const collaborationAreaLabel =
    labels?.collaborationAreaLabel ??
    pageSettings?.collaborationAreaLabel ??
    'Áreas de Colaboração';
  const publicationsLabel =
    labels?.publicationsLabel ?? pageSettings?.publicationsLabel ?? 'publicações';
  const publicationLabel =
    labels?.publicationLabel ?? pageSettings?.publicationLabel ?? 'publicação';
  const collaboratorsLabel =
    labels?.collaboratorsLabel ?? pageSettings?.collaboratorsLabel ?? 'Colaboradores';
  const projectsLabel = labels?.projectsLabel ?? pageSettings?.projectsLabel ?? 'Projetos';
  const fundedProjectsLabel =
    labels?.fundedProjectsLabel ?? pageSettings?.fundedProjectsLabel ?? 'Projetos Financiados';

  // Card Styling (with fallbacks to old structure for backward compatibility)
  const cardStyle = pageSettings?.cardStyling;
  const cardBackgroundColor =
    cardStyle?.cardBackgroundColor ?? pageSettings?.cardBackgroundColor ?? 'bg-ufam-dark';
  const cardBorderColor =
    cardStyle?.cardBorderColor ?? pageSettings?.cardBorderColor ?? 'border-white/5';
  const cardHoverBorderColor =
    cardStyle?.cardHoverBorderColor ??
    pageSettings?.cardHoverBorderColor ??
    'hover:border-ufam-primary/30';
  const titleColor = cardStyle?.titleColor ?? pageSettings?.titleColor ?? 'text-white';
  const titleHoverColor =
    cardStyle?.titleHoverColor ?? pageSettings?.titleHoverColor ?? 'group-hover:text-ufam-light';
  const locationColor =
    cardStyle?.locationColor ?? pageSettings?.locationColor ?? 'text-ufam-secondary';
  const descriptionColor =
    cardStyle?.descriptionColor ?? pageSettings?.descriptionColor ?? 'text-ufam-secondary';
  const iconColor = cardStyle?.iconColor ?? pageSettings?.iconColor ?? 'text-ufam-primary/70';
  const tagBackgroundColor =
    cardStyle?.tagBackgroundColor ?? pageSettings?.tagBackgroundColor ?? 'bg-ufam-primary/10';
  const tagTextColor = cardStyle?.tagTextColor ?? pageSettings?.tagTextColor ?? 'text-ufam-primary';
  const customThemeGradientFrom =
    cardStyle?.customThemeGradientFrom ??
    pageSettings?.customThemeGradientFrom ??
    'from-ufam-primary';
  const customThemeGradientTo =
    cardStyle?.customThemeGradientTo ?? pageSettings?.customThemeGradientTo ?? 'to-ufam-dark';

  // Stats Styling (with fallbacks to old structure for backward compatibility)
  const statsStyle = pageSettings?.statsStyling;
  const statsLabelTotal =
    statsStyle?.statsLabelTotal ?? pageSettings?.statsLabelTotal ?? 'parceiros';
  const statsLabelCountries =
    statsStyle?.statsLabelCountries ?? pageSettings?.statsLabelCountries ?? 'países';
  const statsTotalColor =
    statsStyle?.statsTotalColor ?? pageSettings?.statsTotalColor ?? 'text-ufam-primary';
  const statsCountriesColor =
    statsStyle?.statsCountriesColor ?? pageSettings?.statsCountriesColor ?? 'text-ufam-light';
  const countryTagBackground =
    statsStyle?.countryTagBackground ?? pageSettings?.countryTagBackground ?? 'bg-white/5';
  const countryTagBorder =
    statsStyle?.countryTagBorder ?? pageSettings?.countryTagBorder ?? 'border-white/10';
  const countryTagText =
    statsStyle?.countryTagText ?? pageSettings?.countryTagText ?? 'text-ufam-secondary';

  // ============================================
  // Helper Functions
  // ============================================

  const formatStartDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  // ============================================
  // Collaborator Badge Component
  // ============================================
  const CollaboratorBadge = ({ collaborator }: { collaborator: CollaboratorFlat }) => (
    <div className="flex items-center gap-2 text-xs">
      {collaborator.photoUrl ? (
        <img
          src={collaborator.photoUrl}
          alt={collaborator.fullName}
          className="w-6 h-6 rounded-full object-cover bg-white/5"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-ufam-primary/20 flex items-center justify-center">
          <span className="text-ufam-primary text-xs font-bold">
            {collaborator.fullName.charAt(0)}
          </span>
        </div>
      )}
      <span className={descriptionColor}>{collaborator.fullName}</span>
      {collaborator.title && <span className="text-ufam-primary/60">- {collaborator.title}</span>}
    </div>
  );

  // ============================================
  // Partner Card Component - 100% Data-Driven
  // ============================================
  const PartnerCard = ({ partner, index }: { partner: PartnerFlat; index: number }) => {
    // Check if any extra info should be shown based on toggles AND data availability
    const hasExtraInfo =
      (showDescription && partner.description) ||
      (showCollaborationType && partner.collaborationType) ||
      (showCollaborationArea && partner.collaborationArea) ||
      (showStartDate && partner.startDate) ||
      (showJointPublications && partner.jointPublications && partner.jointPublications > 0);

    const hasCollaborators =
      showCollaborators && partner.collaborators && partner.collaborators.length > 0;
    const hasProjects = showRelatedProjects && partner.projects && partner.projects.length > 0;
    const hasFundedProjects =
      showFundedProjects && partner.fundedProjects && partner.fundedProjects.length > 0;

    // Build location string
    const locationParts: string[] = [];
    if (partner.city && showCity) locationParts.push(partner.city);
    if (partner.state && showState) locationParts.push(partner.state);
    if (partner.country) locationParts.push(partner.country);
    const locationString = locationParts.join(', ');

    // Determine card background classes
    const getCardBackgroundClass = () => {
      if (showCustomColorTheme && partner.colorTheme) {
        // Parse colorTheme like "from-emerald-900 to-black"
        const colors = partner.colorTheme.split(' ');
        if (colors.length >= 2) {
          return `bg-gradient-to-br ${colors[0]} ${colors[1]}`;
        }
        return `bg-gradient-to-br ${partner.colorTheme} ${customThemeGradientTo}`;
      }
      return cardBackgroundColor;
    };

    return (
      <FadeIn delay={index * 50}>
        <div
          className={`group block ${getCardBackgroundClass()} border ${cardBorderColor} p-6 rounded ${cardHoverBorderColor} transition-all h-full`}
        >
          {/* Header with logo and name */}
          <div className="flex items-start gap-4">
            {showLogo &&
              (partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-16 h-16 object-contain bg-white/5 rounded p-2 group-hover:bg-white/10 transition-colors"
                />
              ) : (
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${customThemeGradientFrom} ${customThemeGradientTo} rounded flex items-center justify-center`}
                >
                  <Globe className={`w-8 h-8 ${iconColor}`} />
                </div>
              ))}

            <div className="flex-1 min-w-0">
              <h4
                className={`font-tech font-bold ${titleColor} ${titleHoverColor} transition-colors mb-1`}
              >
                {partner.name}
              </h4>
              {showLocation && locationString && (
                <div className={`flex items-center gap-1 text-xs ${locationColor}`}>
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{locationString}</span>
                </div>
              )}
            </div>

            {showWebsiteLink && partner.websiteUrl && (
              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-4 h-4 ${locationColor} group-hover:text-ufam-primary transition-colors shrink-0`}
              >
                <ExternalLink />
              </a>
            )}
          </div>

          {/* Extra info section - Only shown if toggles are enabled AND data exists */}
          {hasExtraInfo && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              {/* Description */}
              {showDescription && partner.description && (
                <p className={`text-xs ${descriptionColor} line-clamp-2`}>{partner.description}</p>
              )}

              {/* Collaboration Type */}
              {showCollaborationType && partner.collaborationType && (
                <div className="flex items-center gap-2 text-xs">
                  <Briefcase className={`w-3 h-3 ${iconColor}`} />
                  <span className={descriptionColor}>
                    {collaborationTypeLabel}: {partner.collaborationType}
                  </span>
                </div>
              )}

              {/* Collaboration Area */}
              {showCollaborationArea && partner.collaborationArea && (
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className={`w-3 h-3 ${iconColor}`} />
                  <span className={descriptionColor}>
                    {collaborationAreaLabel}: {partner.collaborationArea}
                  </span>
                </div>
              )}

              {/* Start date and publications */}
              <div className="flex items-center gap-4 text-xs">
                {showStartDate && partner.startDate && (
                  <div className={`flex items-center gap-1 ${descriptionColor}`}>
                    <Calendar className={`w-3 h-3 ${iconColor}`} />
                    <span>
                      {startDateLabel} {formatStartDate(partner.startDate)}
                    </span>
                  </div>
                )}
                {showJointPublications &&
                  partner.jointPublications &&
                  partner.jointPublications > 0 && (
                    <div className={`flex items-center gap-1 ${descriptionColor}`}>
                      <FileText className={`w-3 h-3 ${iconColor}`} />
                      <span>
                        {partner.jointPublications}{' '}
                        {partner.jointPublications === 1 ? publicationLabel : publicationsLabel}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Collaborators Section */}
          {hasCollaborators && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1 text-xs mb-2">
                <Users className={`w-3 h-3 ${iconColor}`} />
                <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                  {collaboratorsLabel}
                </span>
              </div>
              <div className="space-y-1">
                {partner.collaborators!.slice(0, 3).map((collaborator) => (
                  <CollaboratorBadge key={collaborator.id} collaborator={collaborator} />
                ))}
                {partner.collaborators!.length > 3 && (
                  <p className={`text-xs ${descriptionColor} italic`}>
                    +{partner.collaborators!.length - 3} mais...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Related Projects Section */}
          {hasProjects && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1 text-xs mb-2">
                <FolderGit2 className={`w-3 h-3 ${iconColor}`} />
                <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                  {projectsLabel}
                </span>
              </div>
              <div className="space-y-1">
                {partner.projects!.slice(0, 2).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className={`block text-xs ${descriptionColor} hover:text-ufam-primary transition-colors truncate`}
                  >
                    • {project.title}
                  </Link>
                ))}
                {partner.projects!.length > 2 && (
                  <p className={`text-xs ${descriptionColor} italic`}>
                    +{partner.projects!.length - 2} projetos...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Funded Projects Section */}
          {hasFundedProjects && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1 text-xs mb-2">
                <TrendingUp className={`w-3 h-3 ${iconColor}`} />
                <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                  {fundedProjectsLabel}
                </span>
              </div>
              <div className="space-y-1">
                {partner.fundedProjects!.slice(0, 2).map((fp, idx) => (
                  <div key={idx} className="text-xs">
                    <span className={descriptionColor}>{fp.projectTitle}</span>
                    {fp.amount && (
                      <span className="text-ufam-primary ml-1">{formatCurrency(fp.amount)}</span>
                    )}
                    {fp.year && <span className="text-ufam-secondary ml-1">({fp.year})</span>}
                  </div>
                ))}
                {partner.fundedProjects!.length > 2 && (
                  <p className={`text-xs ${descriptionColor} italic`}>
                    +{partner.fundedProjects!.length - 2} financiamentos...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    );
  };

  // ============================================
  // Section Component - renders a section for a partner type
  // ============================================
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
          <h2
            className={`font-tech ${type.color || 'text-ufam-primary'} text-sm mb-2 tracking-widest lowercase`}
          >
            {type.description || `/// ${type.name.toLowerCase()}`}
          </h2>
          <h3 className={`text-2xl md:text-3xl font-bold ${titleColor} font-tech mb-8`}>
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
      {showHeader && (
        <section className="py-16 border-b border-white/5">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h1 className={`text-4xl md:text-5xl font-bold ${titleColor} font-tech mb-4`}>
                {title}
              </h1>
              <p className={`${descriptionColor} max-w-2xl`}>{description}</p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Stats - Dynamic based on partner types */}
      {showStats && partners.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* Total Partners */}
              <FadeIn className="text-center">
                <span className={`text-3xl font-bold ${statsTotalColor} font-tech`}>
                  {partners.length}
                </span>
                <p className={`text-xs ${locationColor} font-tech lowercase`}>{statsLabelTotal}</p>
              </FadeIn>

              {/* Countries */}
              <FadeIn delay={100} className="text-center">
                <span className={`text-3xl font-bold ${statsCountriesColor} font-tech`}>
                  {countries.length}
                </span>
                <p className={`text-xs ${locationColor} font-tech lowercase`}>
                  {statsLabelCountries}
                </p>
              </FadeIn>

              {/* Dynamic stats from partner types */}
              {typesWithCounts.map((type, index) => (
                <FadeIn key={type.id} delay={(index + 2) * 100} className="text-center">
                  <span className={`text-3xl font-bold font-tech ${type.color}`}>{type.count}</span>
                  <p className={`text-xs ${locationColor} font-tech lowercase`}>
                    {type.statsLabel || type.name.toLowerCase()}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Partner Sections - Ordered by displayOrder */}
      {showPartnerSections &&
        partnerTypes
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
      {showGlobalPresence && countries.length > 0 && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h3 className={`text-lg font-bold ${titleColor} font-tech mb-4`}>
                {globalPresenceTitle}
              </h3>
              <p className={`${descriptionColor} mb-8 max-w-xl mx-auto`}>
                {globalPresenceDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {countries.map((country, index) => (
                  <FadeIn key={country} delay={index * 30}>
                    <span
                      className={`px-3 py-1 ${countryTagBackground} border ${countryTagBorder} rounded text-xs font-tech ${countryTagText}`}
                    >
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
            <p className={descriptionColor}>{emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
