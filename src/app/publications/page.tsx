import { getPublications, getPublicationsPageSettings, getStrapiMediaUrl } from '@/lib/strapi';
import type { PublicationFlat, PublicationsPageSettingAttributes } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { Metadata } from 'next';
import { PublicationsTabs } from './PublicationsTabs';

export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getPublicationsPageSettings();

  const seo = pageSettings?.seo;
  const title = seo?.metaTitle || pageSettings?.pageTitle || 'Publicações | e-Controls';
  const description =
    seo?.metaDescription ||
    pageSettings?.pageDescription ||
    'Produção científica do grupo e-Controls da UFAM.';

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

// ============================================
// TAXONOMIA DINAMICA - Tipos e Helpers
// ============================================

/**
 * Agrupa publicações por categoria/tipo dinamicamente
 * Usa category.name da taxonomia dinâmica
 */
function groupPublicationsByCategory(
  publications: PublicationFlat[]
): Record<string, PublicationFlat[]> {
  return publications.reduce(
    (groups, publication) => {
      // Usa category.name da taxonomia dinâmica
      const categoryName = publication.category?.name || 'Outros';
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(publication);
      return groups;
    },
    {} as Record<string, PublicationFlat[]>
  );
}

/**
 * Extrai todas as categorias únicas presentes nos dados
 * Retorna objeto com name e color para cada categoria
 */
function getAvailableCategories(
  publications: PublicationFlat[]
): Array<{ name: string; color: string }> {
  const categoryMap = new Map<string, string>();

  publications.forEach((pub) => {
    const name = pub.category?.name || 'Outros';
    // Usa cor do banco de dados
    const color = pub.category?.color || 'bg-slate-500/20 text-slate-400';
    if (!categoryMap.has(name)) {
      categoryMap.set(name, color);
    }
  });

  return Array.from(categoryMap.entries()).map(([name, color]) => ({ name, color }));
}

/**
 * Mapeamento de tipo para label do Strapi
 * Se o tipo não tiver um label configurado, usa o próprio tipo formatado
 */
function getTypeLabel(
  type: string,
  pageSettings: PublicationsPageSettingAttributes | null
): string {
  // Mapa de tipos conhecidos para chaves de label do Strapi
  const labelKeyMap: Record<string, keyof PublicationsPageSettingAttributes> = {
    'Journal Article': 'journalsTabLabel',
    'Conference Paper': 'conferencesTabLabel',
    'Book Chapter': 'chaptersTabLabel',
    Thesis: 'thesesTabLabel',
    'Thesis - PhD': 'thesesTabLabel',
    'Thesis - Masters': 'thesesTabLabel',
  };

  const labelKey = labelKeyMap[type];

  // Se tiver label configurado no Strapi, usa ele
  if (labelKey && pageSettings?.[labelKey]) {
    return pageSettings[labelKey] as string;
  }

  // Fallback: usa o próprio nome da categoria
  return type;
}

/**
 * Extrai a classe de cor de texto de uma string de classes Tailwind
 * Ex: "bg-blue-500/20 text-blue-400" -> "text-blue-400"
 */
function extractTextColor(colorClasses: string): string {
  const match = colorClasses.match(/text-[a-z]+-\d+/);
  return match ? match[0] : 'text-slate-400';
}

/**
 * Gera estatísticas dinâmicas baseadas nas categorias com mais publicações
 */
function generateDynamicStats(
  groupedPublications: Record<string, PublicationFlat[]>,
  categories: Array<{ name: string; color: string }>,
  pageSettings: PublicationsPageSettingAttributes | null
): Array<{ type: string; count: number; label: string; colorClass: string }> {
  // Ordena as categorias por quantidade de publicações (decrescente)
  const sortedCategories = categories
    .map((cat) => ({
      ...cat,
      count: groupedPublications[cat.name]?.length || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4); // Pega as 4 categorias com mais publicações

  return sortedCategories.map((cat) => {
    // Mapa de tipos conhecidos para labels de stats do Strapi
    const statsLabelMap: Record<string, keyof PublicationsPageSettingAttributes> = {
      'Journal Article': 'journalsLabel',
      'Conference Paper': 'conferencesLabel',
    };

    const labelKey = statsLabelMap[cat.name];
    const label =
      (labelKey && (pageSettings?.[labelKey] as string)) || getTypeLabel(cat.name, pageSettings);

    return {
      type: cat.name,
      count: cat.count,
      label: label.toLowerCase(),
      colorClass: extractTextColor(cat.color),
    };
  });
}

export default async function PublicationsPage() {
  const [publications, pageSettings] = await Promise.all([
    getPublications(),
    getPublicationsPageSettings(),
  ]);

  // Labels com fallback
  const labels = {
    pageTitle: pageSettings?.pageTitle || 'Publicações',
    pageDescription:
      pageSettings?.pageDescription ||
      'Artigos publicados em periódicos e conferências de alto impacto',
    emptyStateMessage: pageSettings?.emptyStateMessage || 'Nenhuma publicação encontrada',
    totalLabel: pageSettings?.totalLabel || 'publicações',
    citationsLabel: pageSettings?.citationsLabel || 'citações',
    allTabLabel: pageSettings?.allTabLabel || 'todas',
  };

  // ============================================
  // AGRUPAMENTO DINAMICO POR CATEGORIA
  // ============================================

  // Extrai categorias únicas com suas cores (do banco de dados)
  const availableCategories = getAvailableCategories(publications);

  // Agrupa publicações por categoria
  const groupedByCategory = groupPublicationsByCategory(publications);

  // Ordena categorias por quantidade (decrescente)
  const sortedCategories = availableCategories.sort(
    (a, b) => (groupedByCategory[b.name]?.length || 0) - (groupedByCategory[a.name]?.length || 0)
  );

  // Gera stats dinâmicos (top 4 categorias)
  const dynamicStats = generateDynamicStats(groupedByCategory, sortedCategories, pageSettings);

  // Stats gerais
  const totalCitations = publications.reduce((acc, p) => acc + (p.citationCount || 0), 0);
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);

  // Group by year for display
  const publicationsByYear = years.map((year) => ({
    year,
    publications: publications.filter((p) => p.year === year),
  }));

  // Prepara dados para o componente de tabs (client component)
  // Usa as cores diretamente do banco de dados
  const tabsData = sortedCategories.map((cat) => ({
    type: cat.name,
    label: getTypeLabel(cat.name, pageSettings),
    count: groupedByCategory[cat.name]?.length || 0,
    color: cat.color, // Cor completa do banco (ex: "bg-blue-500/20 text-blue-400")
  }));

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">
              {labels.pageTitle}
            </h1>
            <p className="text-ufam-secondary max-w-2xl">{labels.pageDescription}</p>
          </FadeIn>
        </div>
      </section>

      {/* Stats - Dinâmicos */}
      {publications.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* Total de publicações */}
              <FadeIn className="text-center">
                <AnimatedCounter
                  end={publications.length}
                  duration={1500}
                  className="text-3xl font-bold text-ufam-primary font-tech"
                />
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {labels.totalLabel}
                </p>
              </FadeIn>

              {/* Total de citações */}
              <FadeIn delay={100} className="text-center">
                <AnimatedCounter
                  end={totalCitations}
                  duration={1500}
                  className="text-3xl font-bold text-ufam-light font-tech"
                />
                <p className="text-xs text-ufam-secondary font-tech lowercase">
                  {labels.citationsLabel}
                </p>
              </FadeIn>

              {/* Stats dinâmicos por categoria (top 4) */}
              {dynamicStats.map((stat, index) => (
                <FadeIn key={stat.type} delay={200 + index * 100} className="text-center">
                  <span className={`text-3xl font-bold font-tech ${stat.colorClass}`}>
                    {stat.count}
                  </span>
                  <p className="text-xs text-ufam-secondary font-tech lowercase">{stat.label}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs - Dinâmicas (Client Component) */}
      <PublicationsTabs
        tabs={tabsData}
        allLabel={labels.allTabLabel}
        totalCount={publications.length}
        publications={publications}
        publicationsByYear={publicationsByYear}
      />

      {/* Empty State */}
      {publications.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">{labels.emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
