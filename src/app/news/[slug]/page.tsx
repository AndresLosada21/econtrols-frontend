import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import {
  getNewsItems,
  getNewsItemBySlug,
  getStrapiMediaUrl,
  getNewsDetailedPageSettings,
} from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { ShareButton } from '@/components/ui/ShareButton';
// getNewsCategoryColors removido - agora usa newsCategory.color do banco

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsItemBySlug(slug);

  if (!news) {
    return {
      title: 'Noticia nao encontrada | e-Controls',
    };
  }

  const seo = news.seo;
  const title = seo?.metaTitle || `${news.title} | Noticias | e-Controls`;
  const description =
    seo?.metaDescription || news.excerpt || news.summary || `${news.title} - e-Controls UFAM`;

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
      type: (seo?.ogType as 'article') || 'article',
      locale: seo?.ogLocale || 'pt_BR',
      images: seo?.ogImage?.data?.attributes?.url
        ? [{ url: getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '' }]
        : news.coverImageUrl
          ? [{ url: news.coverImageUrl }]
          : [],
      publishedTime: news.publishDate,
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: seo?.twitterImage?.data?.attributes?.url
        ? [getStrapiMediaUrl(seo.twitterImage.data.attributes.url) || '']
        : seo?.ogImage?.data?.attributes?.url
          ? [getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '']
          : news.coverImageUrl
            ? [news.coverImageUrl]
            : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const newsItems = await getNewsItems();
    return newsItems.map((item) => ({
      slug: item.slug ? String(item.slug) : String(item.id),
    }));
  } catch {
    return [];
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [news, detailSettings] = await Promise.all([
    getNewsItemBySlug(slug),
    getNewsDetailedPageSettings(),
  ]);

  if (!news) {
    notFound();
  }

  // Labels com fallback
  const labels = {
    backButtonText: detailSettings?.backButtonText || 'voltar para notícias',
    relatedTitle: detailSettings?.relatedTitle || 'Leia Também',
    shareTitle: detailSettings?.shareTitle || 'Compartilhar',
    tagsLabel: detailSettings?.tagsLabel || 'Tags',
    viewAllText: detailSettings?.viewAllText || 'ver todas as notícias',
  };

  // Get related news (same category, exclude current)
  let relatedNews: Awaited<ReturnType<typeof getNewsItems>> = [];
  try {
    const allNews = await getNewsItems({ pagination: { pageSize: 4 } });
    relatedNews = allNews.filter((n) => n.slug !== news.slug).slice(0, 3);
  } catch {
    // Ignore errors
  }

  const categoryColor =
    news.newsCategory?.color || 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30';
  const categoryName = news.newsCategory?.name || 'Geral';

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.backButtonText}
        </Link>
      </div>

      {/* Article */}
      <article className="pb-16">
        {/* Header */}
        <header className="py-8 border-b border-white/5">
          <div className="container mx-auto px-6">
            <FadeIn>
              {/* Category */}
              <span
                className={`inline-block font-tech text-xs px-3 py-1 rounded mb-4 border ${categoryColor}`}
              >
                {categoryName}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-tech mb-6 leading-tight">
                {news.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-ufam-secondary">
                {/* Date */}
                {news.publishDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ufam-primary" />
                    <time dateTime={news.publishDate}>{formatDate(news.publishDate)}</time>
                  </div>
                )}

                {/* Author */}
                {news.author && (
                  <Link
                    href={`/people/${news.author.id}`}
                    className="flex items-center gap-2 hover:text-ufam-primary transition-colors"
                  >
                    <User className="w-4 h-4 text-ufam-primary" />
                    {news.author.displayName}
                  </Link>
                )}

                {/* Share Button */}
                <ShareButton title={news.title} />
              </div>
            </FadeIn>
          </div>
        </header>

        {/* Cover Image */}
        {news.coverImageUrl && (
          <FadeIn delay={100}>
            <div className="container mx-auto px-6 py-8">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={news.coverImageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </FadeIn>
        )}

        {/* Content */}
        <FadeIn delay={200}>
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {/* Excerpt/Lead */}
              {news.excerpt && (
                <p className="text-xl text-ufam-light leading-relaxed mb-8 font-medium">
                  {news.excerpt}
                </p>
              )}

              {/* Main Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div
                  className="text-ufam-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Tags */}
              {news.tags && Array.isArray(news.tags) && news.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-ufam-primary" />
                    {news.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/5 rounded text-sm text-ufam-secondary font-tech"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// mais noticias'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Leia Tambem</h3>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((item, index) => (
                <FadeIn key={item.id} delay={index * 100}>
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="group block bg-ufam-bg border border-white/5 rounded overflow-hidden hover:border-ufam-primary/30 transition-all"
                  >
                    {item.coverImageUrl ? (
                      <div className="relative aspect-video">
                        <Image
                          src={item.coverImageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-ufam-primary/10 to-ufam-dark" />
                    )}
                    <div className="p-4">
                      <span className="text-xs font-tech text-ufam-primary lowercase mb-2 block">
                        {item.newsCategory?.name || 'Geral'}
                      </span>
                      <h4 className="font-tech font-bold text-white group-hover:text-ufam-light transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      {item.publishDate && (
                        <p className="text-xs text-ufam-secondary mt-2">
                          {formatDate(item.publishDate)}
                        </p>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={400}>
              <div className="text-center mt-8">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-ufam-primary hover:text-ufam-light transition-colors font-tech text-sm"
                >
                  {labels.viewAllText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </main>
  );
}
