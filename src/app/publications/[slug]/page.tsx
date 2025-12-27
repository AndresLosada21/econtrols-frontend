import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Users,
  ExternalLink,
  Award,
  FileText,
  Quote,
  Beaker,
} from 'lucide-react';
import { getPublicationBySlug, getPublications, getStrapiMediaUrl } from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { PublicationCitation } from '@/components/ui/PublicationCitation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: 'Publicacao nao encontrada | e-Controls',
    };
  }

  const seo = publication.seo;
  const title = seo?.metaTitle || `${publication.title} | Publicacoes | e-Controls`;
  const description =
    seo?.metaDescription ||
    publication.abstract ||
    `${publication.title} - ${publication.authorsText}`;

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
        : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary',
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

export async function generateStaticParams() {
  try {
    const publications = await getPublications();
    return publications.map((pub) => ({
      slug: pub.slug ? String(pub.slug) : String(pub.id),
    }));
  } catch {
    return [];
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Journal Article':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Conference Paper':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Book Chapter':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Thesis':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Technical Report':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'Journal Article':
      return <BookOpen className="w-4 h-4" />;
    case 'Conference Paper':
      return <Users className="w-4 h-4" />;
    case 'Book Chapter':
      return <FileText className="w-4 h-4" />;
    case 'Thesis':
      return <Award className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    notFound();
  }

  const typeColor = getTypeColor(publication.publicationType);

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          voltar para publicacoes
        </Link>
      </div>

      {/* Header */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            {/* Type Badge */}
            <span
              className={`inline-flex items-center gap-2 font-tech text-xs px-3 py-1 rounded mb-4 border ${typeColor}`}
            >
              {getTypeIcon(publication.publicationType)}
              {publication.publicationType}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white font-tech mb-4 leading-tight">
              {publication.title}
            </h1>

            {/* Authors */}
            <p className="text-ufam-secondary mb-6">{publication.authorsText}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {/* Year */}
              <div className="flex items-center gap-2 text-ufam-secondary">
                <Calendar className="w-4 h-4 text-ufam-primary" />
                <span className="font-tech">{publication.year}</span>
              </div>

              {/* Journal/Conference */}
              {publication.journalName && (
                <div className="flex items-center gap-2 text-ufam-secondary">
                  <BookOpen className="w-4 h-4 text-ufam-primary" />
                  <span>{publication.journalName}</span>
                </div>
              )}
              {publication.conferenceName && (
                <div className="flex items-center gap-2 text-ufam-secondary">
                  <Users className="w-4 h-4 text-ufam-primary" />
                  <span>{publication.conferenceName}</span>
                </div>
              )}

              {/* Citations */}
              {publication.citationCount && publication.citationCount > 0 && (
                <div className="flex items-center gap-2 text-ufam-secondary">
                  <Quote className="w-4 h-4 text-ufam-primary" />
                  <span className="font-tech">{publication.citationCount} citacoes</span>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Abstract */}
              {publication.abstract && (
                <FadeIn>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {'/// abstract'}
                    </h2>
                    <p className="text-ufam-secondary leading-relaxed">{publication.abstract}</p>
                  </div>
                </FadeIn>
              )}

              {/* Authors List */}
              {publication.authors && publication.authors.length > 0 && (
                <FadeIn delay={100}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {'/// autores'}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {publication.authors.map((author) => (
                        <Link
                          key={author.id}
                          href={`/people/${author.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded hover:bg-ufam-primary/20 transition-colors group"
                        >
                          {author.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={author.photoUrl}
                              alt={author.displayName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-ufam-primary/30 flex items-center justify-center">
                              <span className="text-xs font-tech text-ufam-primary">
                                {author.displayName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-white group-hover:text-ufam-light transition-colors">
                            {author.displayName}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Research Lines */}
              {publication.researchLine && (
                <FadeIn delay={200}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {'/// linha de pesquisa'}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/research/${publication.researchLine.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded hover:bg-ufam-primary/20 transition-colors group"
                      >
                        <Beaker className="w-4 h-4 text-ufam-primary" />
                        <span className="text-sm text-white group-hover:text-ufam-light transition-colors">
                          {publication.researchLine.title}
                        </span>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Details */}
              <FadeIn delay={150}>
                <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                  <h3 className="font-tech text-white font-bold mb-4">Detalhes</h3>
                  <dl className="space-y-3 text-sm">
                    {publication.volume && (
                      <div>
                        <dt className="text-ufam-secondary">Volume</dt>
                        <dd className="text-white font-tech">{publication.volume}</dd>
                      </div>
                    )}
                    {publication.issue && (
                      <div>
                        <dt className="text-ufam-secondary">Issue</dt>
                        <dd className="text-white font-tech">{publication.issue}</dd>
                      </div>
                    )}
                    {publication.pages && (
                      <div>
                        <dt className="text-ufam-secondary">Paginas</dt>
                        <dd className="text-white font-tech">{publication.pages}</dd>
                      </div>
                    )}
                    {publication.qualis && (
                      <div>
                        <dt className="text-ufam-secondary">Qualis</dt>
                        <dd className="text-white font-tech">{publication.qualis}</dd>
                      </div>
                    )}
                    {publication.quartile && (
                      <div>
                        <dt className="text-ufam-secondary">Quartil</dt>
                        <dd className="text-white font-tech">{publication.quartile}</dd>
                      </div>
                    )}
                    {publication.impactFactor && (
                      <div>
                        <dt className="text-ufam-secondary">Fator de Impacto</dt>
                        <dd className="text-white font-tech">{publication.impactFactor}</dd>
                      </div>
                    )}
                    {publication.publicationStatus && (
                      <div>
                        <dt className="text-ufam-secondary">Status</dt>
                        <dd className="text-white font-tech">{publication.publicationStatus}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </FadeIn>

              {/* Award */}
              {publication.awardReceived && (
                <FadeIn delay={200}>
                  <div className="bg-gradient-to-br from-amber-500/20 to-ufam-dark p-6 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <h3 className="font-tech text-amber-400 font-bold">Premio</h3>
                    </div>
                    <p className="text-white">{publication.awardReceived}</p>
                  </div>
                </FadeIn>
              )}

              {/* Links */}
              <FadeIn delay={250}>
                <div className="space-y-3">
                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm">DOI</span>
                      <span className="text-ufam-secondary text-xs group-hover:text-ufam-primary transition-colors flex items-center gap-1">
                        {publication.doi}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  )}
                  <PublicationCitation
                    title={publication.title}
                    bibtex={publication.citationBibtex}
                    apa={publication.citationApa}
                    abnt={publication.citationAbnt}
                  />
                  {publication.pdfUrl && (
                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-ufam-primary text-white rounded hover:bg-ufam-primary/80 transition-all font-tech text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Download PDF
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
