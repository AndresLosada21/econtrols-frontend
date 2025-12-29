import { getNewsItems, getNewsPageSettings, getStrapiMediaUrl } from '@/lib/strapi';
import type { NewsItemFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getNewsPageSettings();

  const seo = pageSettings?.seo;
  const title = seo?.metaTitle || pageSettings?.pageTitle || 'Notícias | e-Controls';
  const description =
    seo?.metaDescription ||
    pageSettings?.pageDescription ||
    'Últimas notícias e atualizações do grupo e-Controls da UFAM.';

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

export default async function NewsPage() {
  const [news, pageSettings] = await Promise.all([getNewsItems(), getNewsPageSettings()]);

  // Labels com fallback
  const labels = {
    pageTitle: pageSettings?.pageTitle || 'Notícias',
    pageDescription:
      pageSettings?.pageDescription ||
      'Acompanhe as últimas novidades, eventos e conquistas do grupo e-Controls.',
    emptyStateMessage: pageSettings?.emptyStateMessage || 'Nenhuma notícia encontrada',
    featuredLabel: pageSettings?.featuredLabel || '/// destaques',
    allNewsLabel: pageSettings?.allNewsLabel || '/// todas as notícias',
    categoriesLabel: pageSettings?.categoriesLabel || 'Categorias',
    readMoreLabel: pageSettings?.readMoreLabel || 'ler mais',
  };

  // Get unique categories
  const categories = [...new Set(news.map((n) => n.category).filter(Boolean))];

  // Featured news (first 2)
  const featuredNews = news.filter((n) => n.isFeatured).slice(0, 2);
  const regularNews = news.filter((n) => !n.isFeatured || !featuredNews.includes(n));

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

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-6 border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-ufam-primary text-white rounded text-sm font-tech lowercase">
                todas
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-white/5 text-ufam-secondary rounded text-sm font-tech lowercase hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-6 tracking-widest lowercase">
                {labels.featuredLabel}
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.map((item, index) => (
                <FadeIn key={item.id} delay={index * 100}>
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="group block bg-ufam-dark border border-white/5 rounded-lg overflow-hidden hover:border-ufam-primary/30 transition-all"
                  >
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-ufam-primary/20 to-ufam-dark" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-tech text-ufam-primary lowercase px-2 py-1 bg-ufam-primary/10 rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-ufam-secondary flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.publishDate &&
                            new Date(item.publishDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-ufam-secondary text-sm line-clamp-2">{item.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-ufam-primary text-sm font-tech mt-4 group-hover:gap-2 transition-all lowercase">
                        {labels.readMoreLabel} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      {regularNews.length > 0 && (
        <section className="py-12 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-6 tracking-widest lowercase">
                {labels.allNewsLabel}
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item, index) => (
                <FadeIn key={item.id} delay={index * 50}>
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="group block bg-ufam-bg border border-white/5 rounded overflow-hidden hover:border-ufam-primary/30 transition-all h-full"
                  >
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-ufam-primary/10 to-ufam-dark" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-tech text-ufam-primary lowercase">
                          {item.category}
                        </span>
                        <span className="text-xs text-ufam-secondary">
                          {item.publishDate &&
                            new Date(item.publishDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h4 className="font-tech font-bold text-white group-hover:text-ufam-light transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-sm text-ufam-secondary mt-2 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {news.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver as notícias.</p>
          </div>
        </section>
      )}
    </main>
  );
}
