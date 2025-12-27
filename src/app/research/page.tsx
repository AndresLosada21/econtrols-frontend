import Link from 'next/link';
import { ArrowRight, Beaker } from 'lucide-react';
import { Metadata } from 'next';
import {
  getResearchLines,
  getResearchPageSettings,
  getHomepageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import type { ResearchLineFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';

// ============================================
// Dynamic SEO Metadata
// ============================================

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResearchPageSettings();
  const homepageSettings = await getHomepageSettings();
  const seo = settings?.seo;

  // Fallback to defaults if SEO data is missing
  const title = seo?.metaTitle || 'Pesquisa | e-Controls';
  const description = seo?.metaDescription || 'Linhas de pesquisa do grupo e-Controls da UFAM.';

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
        : homepageSettings?.defaultSeo?.ogImage?.data?.attributes?.url
          ? [
              {
                url:
                  getStrapiMediaUrl(homepageSettings.defaultSeo.ogImage.data.attributes.url) || '',
              },
            ]
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

// ============================================
// Helper Functions
// ============================================

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Principal':
      return 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30';
    case 'Secundária':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Emergente':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-white/10 text-white border-white/20';
  }
}

// ============================================
// Research Page Component
// ============================================

export default async function ResearchPage() {
  let researchLines: ResearchLineFlat[] = [];
  let pageSettings = null;

  try {
    [researchLines, pageSettings] = await Promise.all([
      getResearchLines(),
      getResearchPageSettings(),
    ]);
  } catch (error) {
    console.error('Error fetching research page data:', error);
  }

  // Group by category
  const principalLines = researchLines.filter((l) => l.category === 'Principal');
  const secondaryLines = researchLines.filter((l) => l.category === 'Secundária');
  const emergentLines = researchLines.filter((l) => l.category === 'Emergente');

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Linhas de Pesquisa';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Nossas áreas de investigação avançam a fronteira do conhecimento em teoria de controle, verificação formal e sistemas ciberfísicos.';

  const principalSection = pageSettings?.principalSection || {
    label: '/// principais',
    title: 'Áreas Principais de Pesquisa',
    description: 'Nossas principais áreas de expertise consolidadas ao longo de anos de pesquisa.',
  };

  const secondarySection = pageSettings?.secondarySection || {
    label: '/// secundárias',
    title: 'Áreas Secundárias',
    description: 'Áreas de pesquisa que complementam e fortalecem nossas linhas principais.',
  };

  const emergentSection = pageSettings?.emergentSection || {
    label: '/// emergentes',
    title: 'Áreas Emergentes',
    description: 'Novas áreas de investigação com alto potencial de impacto.',
  };

  const ctaSection = pageSettings?.ctaSection || {
    label: '/// publicações',
    title: 'Interessado em colaborar?',
    description:
      'Entre em contato para saber mais sobre oportunidades de pesquisa, colaboração e financiamento.',
  };

  const ctaButton = pageSettings?.ctaButton || {
    label: 'entrar em contato',
    url: '/#contact',
    isExternal: false,
    variant: 'primary' as const,
    isVisible: true,
  };

  // Get UI text labels with fallbacks
  const statsLabelTotal = pageSettings?.statsLabelTotal || 'linhas de pesquisa';
  const statsLabelPrincipal = pageSettings?.statsLabelPrincipal || 'principais';
  const statsLabelSecondary = pageSettings?.statsLabelSecondary || 'secundárias';
  const statsLabelEmergent = pageSettings?.statsLabelEmergent || 'emergentes';
  const cardDetailText = pageSettings?.cardDetailText || 'ver detalhes';
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver as linhas de pesquisa.';

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">
              {pageTitle}
            </h1>
            <p className="text-ufam-secondary max-w-2xl">{pageDescription}</p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      {researchLines.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {researchLines.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">{statsLabelTotal}</p>
              </FadeIn>
              <FadeIn delay={100} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {principalLines.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {statsLabelPrincipal}
                </p>
              </FadeIn>
              <FadeIn delay={200} className="text-center">
                <span className="text-3xl font-bold text-blue-400 font-tech">
                  {secondaryLines.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {statsLabelSecondary}
                </p>
              </FadeIn>
              <FadeIn delay={300} className="text-center">
                <span className="text-3xl font-bold text-green-400 font-tech">
                  {emergentLines.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {statsLabelEmergent}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Principal Lines */}
      {principalLines.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {principalSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {principalSection.title}
              </h3>
              {principalSection.description && (
                <p className="text-ufam-secondary mb-8 max-w-2xl">{principalSection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principalLines.map((line, index) => (
                <FadeIn key={line.id} delay={index * 100}>
                  <Link
                    href={`/research/${line.slug || line.id}`}
                    className="group block bg-ufam-dark p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded bg-ufam-primary/20 flex items-center justify-center group-hover:bg-ufam-primary/30 transition-colors">
                        <Beaker className="w-6 h-6 text-ufam-primary" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-xs font-tech px-2 py-1 rounded border ${getCategoryColor(line.category)}`}
                        >
                          {line.category}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                      {line.title}
                    </h4>

                    <p className="text-ufam-secondary text-sm mb-4">{line.shortDescription}</p>

                    <div className="flex items-center gap-2 text-ufam-primary text-sm font-tech group-hover:gap-3 transition-all lowercase">
                      {cardDetailText}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secondary Lines */}
      {secondaryLines.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {secondarySection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {secondarySection.title}
              </h3>
              {secondarySection.description && (
                <p className="text-ufam-secondary mb-8 max-w-2xl">{secondarySection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryLines.map((line, index) => (
                <FadeIn key={line.id} delay={index * 100}>
                  <Link
                    href={`/research/${line.slug || line.id}`}
                    className="group block bg-ufam-bg p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <Beaker className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-xs font-tech px-2 py-1 rounded border ${getCategoryColor(line.category)}`}
                        >
                          {line.category}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                      {line.title}
                    </h4>

                    <p className="text-ufam-secondary text-sm mb-4">{line.shortDescription}</p>

                    <div className="flex items-center gap-2 text-blue-400 text-sm font-tech group-hover:gap-3 transition-all lowercase">
                      {cardDetailText}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergent Lines */}
      {emergentLines.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {emergentSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {emergentSection.title}
              </h3>
              {emergentSection.description && (
                <p className="text-ufam-secondary mb-8 max-w-2xl">{emergentSection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergentLines.map((line, index) => (
                <FadeIn key={line.id} delay={index * 100}>
                  <Link
                    href={`/research/${line.slug || line.id}`}
                    className="group block bg-ufam-dark p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <Beaker className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-xs font-tech px-2 py-1 rounded border ${getCategoryColor(line.category)}`}
                        >
                          {line.category}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                      {line.title}
                    </h4>

                    <p className="text-ufam-secondary text-sm mb-4">{line.shortDescription}</p>

                    <div className="flex items-center gap-2 text-green-400 text-sm font-tech group-hover:gap-3 transition-all lowercase">
                      {cardDetailText}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {ctaButton.isVisible && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              {ctaSection.label && (
                <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                  {ctaSection.label}
                </h2>
              )}
              <h3 className="text-xl font-bold text-white font-tech mb-4">{ctaSection.title}</h3>
              {ctaSection.description && (
                <p className="text-ufam-secondary mb-6 max-w-xl mx-auto">
                  {ctaSection.description}
                </p>
              )}
              <Link
                href={ctaButton.url}
                target={ctaButton.isExternal ? '_blank' : undefined}
                rel={ctaButton.isExternal ? 'noopener noreferrer' : undefined}
                className={`inline-flex items-center gap-2 ${
                  ctaButton.variant === 'primary'
                    ? 'bg-ufam-primary text-white hover:bg-ufam-primary/80'
                    : ctaButton.variant === 'secondary'
                      ? 'bg-ufam-dark text-white hover:bg-ufam-dark/80'
                      : 'border border-ufam-primary text-ufam-primary hover:bg-ufam-primary/10'
                } px-6 py-3 rounded font-tech text-sm transition-colors lowercase`}
              >
                {ctaButton.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty State */}
      {researchLines.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">{emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
