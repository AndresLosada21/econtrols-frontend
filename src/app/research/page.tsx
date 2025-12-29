import Link from 'next/link';
import { ArrowRight, Beaker } from 'lucide-react';
import { Metadata } from 'next';
import {
  getResearchLines,
  getResearchCategories,
  getResearchPageSettings,
  getHomepageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import type { ResearchLineFlat, ResearchCategoryFlat } from '@/types/strapi';
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
// Helper: Get category-specific styles
// ============================================

function getCategoryStyles(category: ResearchCategoryFlat): {
  bgColor: string;
  iconBg: string;
  iconColor: string;
  linkColor: string;
  badgeColor: string;
} {
  // Map color classes to style configurations
  const colorMap: Record<
    string,
    {
      bgColor: string;
      iconBg: string;
      iconColor: string;
      linkColor: string;
      badgeColor: string;
    }
  > = {
    'text-ufam-light': {
      bgColor: 'bg-ufam-dark',
      iconBg: 'bg-ufam-primary/20 group-hover:bg-ufam-primary/30',
      iconColor: 'text-ufam-primary',
      linkColor: 'text-ufam-primary',
      badgeColor: 'bg-ufam-primary/20 text-ufam-light border-ufam-primary/30',
    },
    'text-blue-400': {
      bgColor: 'bg-ufam-bg',
      iconBg: 'bg-blue-500/20 group-hover:bg-blue-500/30',
      iconColor: 'text-blue-400',
      linkColor: 'text-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    'text-green-400': {
      bgColor: 'bg-ufam-dark',
      iconBg: 'bg-green-500/20 group-hover:bg-green-500/30',
      iconColor: 'text-green-400',
      linkColor: 'text-green-400',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    'text-purple-400': {
      bgColor: 'bg-ufam-dark',
      iconBg: 'bg-purple-500/20 group-hover:bg-purple-500/30',
      iconColor: 'text-purple-400',
      linkColor: 'text-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    'text-amber-400': {
      bgColor: 'bg-ufam-bg',
      iconBg: 'bg-amber-500/20 group-hover:bg-amber-500/30',
      iconColor: 'text-amber-400',
      linkColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  };

  return colorMap[category.color] || colorMap['text-ufam-light'];
}

// ============================================
// Research Page Component
// ============================================

export default async function ResearchPage() {
  let researchLines: ResearchLineFlat[] = [];
  let categories: ResearchCategoryFlat[] = [];
  let pageSettings = null;

  try {
    [researchLines, categories, pageSettings] = await Promise.all([
      getResearchLines(),
      getResearchCategories(),
      getResearchPageSettings(),
    ]);
  } catch (error) {
    console.error('Error fetching research page data:', error);
  }

  // Group lines by category ID
  const linesByCategory = new Map<number, ResearchLineFlat[]>();
  researchLines.forEach((line) => {
    const categoryId = line.category.id;
    if (!linesByCategory.has(categoryId)) {
      linesByCategory.set(categoryId, []);
    }
    linesByCategory.get(categoryId)!.push(line);
  });

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Linhas de Pesquisa';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Nossas áreas de investigação avançam a fronteira do conhecimento em teoria de controle, verificação formal e sistemas ciberfísicos.';

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

      {/* Stats - Dynamic based on categories */}
      {researchLines.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* Total */}
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {researchLines.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">{statsLabelTotal}</p>
              </FadeIn>

              {/* Dynamic category stats */}
              {categories.map((category, index) => {
                const categoryLines = linesByCategory.get(category.id) || [];
                return (
                  <FadeIn key={category.id} delay={(index + 1) * 100} className="text-center">
                    <span className={`text-3xl font-bold font-tech ${category.color}`}>
                      {categoryLines.length}
                    </span>
                    <p className="text-xs text-ufam-secondary font-tech lowercase">
                      {category.statsLabel || category.name.toLowerCase()}
                    </p>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Category Sections */}
      {categories.map((category, categoryIndex) => {
        const categoryLines = linesByCategory.get(category.id) || [];
        if (categoryLines.length === 0) return null;

        const styles = getCategoryStyles(category);
        const isEvenSection = categoryIndex % 2 === 0;

        return (
          <section key={category.id} className={`py-16 ${isEvenSection ? '' : 'bg-ufam-dark'}`}>
            <div className="container mx-auto px-6">
              <FadeIn>
                <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                  {category.description || `/// ${category.name.toLowerCase()}`}
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                  {category.sectionTitle}
                </h3>
              </FadeIn>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {categoryLines.map((line, index) => (
                  <FadeIn key={line.id} delay={index * 100}>
                    <Link
                      href={`/research/${line.slug || line.id}`}
                      className={`group block ${isEvenSection ? 'bg-ufam-dark' : 'bg-ufam-bg'} p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all h-full`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded flex items-center justify-center transition-colors ${styles.iconBg}`}
                        >
                          <Beaker className={`w-6 h-6 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <span
                            className={`text-xs font-tech px-2 py-1 rounded border ${styles.badgeColor}`}
                          >
                            {line.category.name}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                        {line.title}
                      </h4>

                      <p className="text-ufam-secondary text-sm mb-4">{line.shortDescription}</p>

                      <div
                        className={`flex items-center gap-2 ${styles.linkColor} text-sm font-tech group-hover:gap-3 transition-all lowercase`}
                      >
                        {cardDetailText}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        );
      })}

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
