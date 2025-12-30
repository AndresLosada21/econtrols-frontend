import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  GraduationCap,
  Wrench,
  File,
  FolderKanban,
  Tag,
  Newspaper,
  Download,
  Eye,
  Unlock,
  Star,
  Video,
  Database,
  Github,
  Link2,
  Paperclip,
  Building2,
  Hash,
} from 'lucide-react';
import {
  getPublicationBySlug,
  getPublications,
  getStrapiMediaUrl,
  getPublicationsDetailedPageSettings,
} from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { PublicationCitation } from '@/components/ui/PublicationCitation';

// ============================================
// Icon Map - Fallback estático baseado no category.name
// Como o banco não possui campo icon ainda, usamos este mapa
// ============================================
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  'Journal Article': <BookOpen className="w-4 h-4" />,
  'Conference Paper': <Users className="w-4 h-4" />,
  'Book Chapter': <FileText className="w-4 h-4" />,
  Book: <FileText className="w-4 h-4" />,
  'Thesis - PhD': <GraduationCap className="w-4 h-4" />,
  'Thesis - Masters': <GraduationCap className="w-4 h-4" />,
  Thesis: <GraduationCap className="w-4 h-4" />,
  'Technical Report': <File className="w-4 h-4" />,
  'Software/Tool': <Wrench className="w-4 h-4" />,
};

// Cor padrão de fallback caso a categoria não tenha cor definida no banco
const DEFAULT_CATEGORY_COLOR = 'bg-slate-500/20 text-slate-400';

/**
 * Retorna o ícone apropriado para a categoria
 * Prioriza dados dinâmicos quando disponíveis (futuro suporte a icon no banco)
 * Usa fallback estático baseado no nome da categoria
 */
function getCategoryIcon(categoryName: string | undefined): React.ReactNode {
  if (!categoryName) return <FileText className="w-4 h-4" />;
  return CATEGORY_ICON_MAP[categoryName] || <FileText className="w-4 h-4" />;
}

/**
 * Retorna as classes de cor para o badge da categoria
 * Prioriza a cor vinda do banco de dados (taxonomia dinâmica)
 * Usa fallback padrão se a cor não estiver disponível
 */
function getCategoryColor(categoryColor: string | undefined): string {
  if (categoryColor) {
    // A cor do banco já vem no formato correto: "bg-blue-500/20 text-blue-400"
    // Adicionamos border-current para manter consistência visual
    return `${categoryColor} border-current`;
  }
  return `${DEFAULT_CATEGORY_COLOR} border-slate-500/30`;
}

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

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [publication, detailSettings] = await Promise.all([
    getPublicationBySlug(slug),
    getPublicationsDetailedPageSettings(),
  ]);

  if (!publication) {
    notFound();
  }

  // Labels com fallback (data-driven do backend)
  const labels = {
    backButtonText: detailSettings?.backButtonText || 'voltar para publicações',
    abstractLabel: detailSettings?.abstractLabel || '/// abstract',
    abstractTitle: detailSettings?.abstractTitle || 'Resumo',
    authorsLabel: detailSettings?.authorsLabel || '/// autores',
    authorsTitle: detailSettings?.authorsTitle || 'Autores',
    researchLinesLabel: detailSettings?.researchLinesLabel || '/// linha de pesquisa',
    researchLinesTitle: detailSettings?.researchLinesTitle || 'Linha de Pesquisa',
    detailsTitle: detailSettings?.detailsTitle || 'Detalhes',
    awardTitle: detailSettings?.awardTitle || 'Prêmio',
    citationButtonLabel: detailSettings?.citationButtonLabel || 'Citar',
    downloadButtonLabel: detailSettings?.downloadButtonLabel || 'Download PDF',
    relatedTitle: detailSettings?.relatedTitle || 'Leia Também',
    viewAllText: detailSettings?.viewAllText || 'ver todas as publicações',
    doiLabel: detailSettings?.doiLabel || 'DOI',
    // Labels adicionais para novos campos (fallback estático até backend suportar)
    relatedProjectLabel: '/// projeto relacionado',
    relatedProjectTitle: 'Projeto Relacionado',
    keywordsLabel: '/// palavras-chave',
    keywordsTitle: 'Palavras-chave',
    relatedNewsLabel: '/// notícias relacionadas',
    relatedNewsTitle: 'Notícias Relacionadas',
    metricsLabel: '/// métricas',
    downloadsLabel: 'Downloads',
    viewsLabel: 'Visualizações',
    // Labels para campos adicionais data-driven
    openAccessLabel: 'Open Access',
    featuredLabel: 'Destaque',
    linksLabel: '/// links',
    externalLinkLabel: 'Link Externo',
    repositoryLabel: 'Repositório',
    datasetLabel: 'Dataset',
    videoLabel: 'Vídeo',
    supplementaryLabel: '/// materiais suplementares',
    bookTitleLabel: 'Título do Livro',
    publisherLabel: 'Editora',
    issnIsbnLabel: 'ISSN/ISBN',
  };

  // Helper para formatar mês
  const formatMonth = (month: number | undefined): string => {
    if (!month) return '';
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return months[month - 1] || '';
  };

  // Helper para obter URL do PDF (prioriza pdfFile do Strapi, fallback para pdfUrl)
  const getPdfDownloadUrl = (): string | null => {
    if (publication.pdfFile?.data?.attributes?.url) {
      return getStrapiMediaUrl(publication.pdfFile.data.attributes.url) ?? null;
    }
    return publication.pdfUrl || null;
  };

  // Helper para obter URL da cover image
  const getCoverImageUrl = (): string | null => {
    if (publication.coverImage?.data?.attributes?.url) {
      return getStrapiMediaUrl(publication.coverImage.data.attributes.url) ?? null;
    }
    return null;
  };

  const pdfDownloadUrl = getPdfDownloadUrl();
  const coverImageUrl = getCoverImageUrl();

  // Obtém categoria do publication (taxonomia dinâmica)
  // Prioriza dados do banco de dados (data-driven)
  const categoryName = publication.category?.name;
  const categoryColor = publication.category?.color;

  // Cor dinâmica do banco de dados com fallback seguro
  const badgeColorClasses = getCategoryColor(categoryColor);

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.backButtonText}
        </Link>
      </div>

      {/* Header */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cover Image - Data-driven do backend */}
            {coverImageUrl && (
              <FadeIn className="lg:col-span-1">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-ufam-dark border border-white/5">
                  <Image
                    src={coverImageUrl}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </FadeIn>
            )}

            {/* Info */}
            <FadeIn delay={100} className={coverImageUrl ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {/* Badges Row - Type, Open Access, Featured */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Type Badge - Usa taxonomia dinâmica do banco */}
                {categoryName && (
                  <span
                    className={`inline-flex items-center gap-2 font-tech text-xs px-3 py-1 rounded border ${badgeColorClasses}`}
                  >
                    {getCategoryIcon(categoryName)}
                    {categoryName}
                  </span>
                )}

                {/* Open Access Badge - Data-driven */}
                {publication.isOpenAccess && (
                  <span className="inline-flex items-center gap-1.5 font-tech text-xs px-3 py-1 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Unlock className="w-3.5 h-3.5" />
                    {labels.openAccessLabel}
                  </span>
                )}

                {/* Featured Badge - Data-driven */}
                {publication.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 font-tech text-xs px-3 py-1 rounded border bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Star className="w-3.5 h-3.5" />
                    {labels.featuredLabel}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white font-tech mb-4 leading-tight">
                {publication.title}
              </h1>

              {/* Authors */}
              <p className="text-ufam-secondary mb-6">{publication.authorsText}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {/* Year and Month - Data-driven */}
                <div className="flex items-center gap-2 text-ufam-secondary">
                  <Calendar className="w-4 h-4 text-ufam-primary" />
                  <span className="font-tech">
                    {publication.month ? `${formatMonth(publication.month)} ` : ''}
                    {publication.year}
                  </span>
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

                {/* Book Title - Data-driven para Book Chapters */}
                {publication.bookTitle && (
                  <div className="flex items-center gap-2 text-ufam-secondary">
                    <FileText className="w-4 h-4 text-ufam-primary" />
                    <span>{publication.bookTitle}</span>
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
                      {labels.abstractLabel}
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
                      {labels.authorsLabel}
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
                      {labels.researchLinesLabel}
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

              {/* Related Project - Dados dinâmicos do banco */}
              {publication.relatedProject && (
                <FadeIn delay={250}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {labels.relatedProjectLabel}
                    </h2>
                    <Link
                      href={`/projects/${publication.relatedProject.slug}`}
                      className="block p-4 bg-white/5 rounded hover:bg-ufam-primary/10 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <FolderKanban className="w-5 h-5 text-ufam-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-white font-medium group-hover:text-ufam-light transition-colors">
                            {publication.relatedProject.title}
                          </h3>
                          {publication.relatedProject.shortDescription && (
                            <p className="text-ufam-secondary text-sm mt-1 line-clamp-2">
                              {publication.relatedProject.shortDescription}
                            </p>
                          )}
                          <span
                            className={`inline-block mt-2 text-xs font-tech px-2 py-0.5 rounded ${
                              publication.relatedProject.projectStatus.name === 'Em Andamento'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : publication.relatedProject.projectStatus.name === 'Concluído'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {publication.relatedProject.projectStatus.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </FadeIn>
              )}

              {/* Keywords - Dados dinâmicos do banco */}
              {publication.keywords && publication.keywords.length > 0 && (
                <FadeIn delay={300}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {labels.keywordsLabel}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {publication.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded text-sm text-ufam-secondary hover:bg-white/10 transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Related News - Dados dinâmicos do banco */}
              {publication.relatedNews && publication.relatedNews.length > 0 && (
                <FadeIn delay={350}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {labels.relatedNewsLabel}
                    </h2>
                    <div className="space-y-3">
                      {publication.relatedNews.map((news) => (
                        <Link
                          key={news.id}
                          href={`/news/${news.slug}`}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded hover:bg-ufam-primary/10 transition-colors group"
                        >
                          <Newspaper className="w-4 h-4 text-ufam-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium group-hover:text-ufam-light transition-colors line-clamp-2">
                              {news.title}
                            </h4>
                            {news.publishDate && (
                              <p className="text-ufam-secondary text-xs mt-1 font-tech">
                                {new Date(news.publishDate).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
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
                  <h3 className="font-tech text-white font-bold mb-4">{labels.detailsTitle}</h3>
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
                    {/* Publisher - Data-driven */}
                    {publication.publisher && (
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-ufam-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <dt className="text-ufam-secondary">{labels.publisherLabel}</dt>
                          <dd className="text-white font-tech">{publication.publisher}</dd>
                        </div>
                      </div>
                    )}
                    {/* ISSN/ISBN - Data-driven */}
                    {publication.issnIsbn && (
                      <div className="flex items-start gap-2">
                        <Hash className="w-4 h-4 text-ufam-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <dt className="text-ufam-secondary">{labels.issnIsbnLabel}</dt>
                          <dd className="text-white font-tech">{publication.issnIsbn}</dd>
                        </div>
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

              {/* Metrics - Downloads e Views do banco */}
              {(publication.downloadCount !== undefined && publication.downloadCount > 0) ||
              (publication.viewCount !== undefined && publication.viewCount > 0) ? (
                <FadeIn delay={175}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h3 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {labels.metricsLabel}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {publication.downloadCount !== undefined && publication.downloadCount > 0 && (
                        <div className="text-center p-3 bg-white/5 rounded">
                          <Download className="w-5 h-5 text-ufam-primary mx-auto mb-1" />
                          <span className="block text-2xl font-bold text-white font-tech">
                            {publication.downloadCount}
                          </span>
                          <span className="text-xs text-ufam-secondary">
                            {labels.downloadsLabel}
                          </span>
                        </div>
                      )}
                      {publication.viewCount !== undefined && publication.viewCount > 0 && (
                        <div className="text-center p-3 bg-white/5 rounded">
                          <Eye className="w-5 h-5 text-ufam-primary mx-auto mb-1" />
                          <span className="block text-2xl font-bold text-white font-tech">
                            {publication.viewCount}
                          </span>
                          <span className="text-xs text-ufam-secondary">{labels.viewsLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ) : null}

              {/* Award */}
              {publication.awardReceived && (
                <FadeIn delay={200}>
                  <div className="bg-gradient-to-br from-amber-500/20 to-ufam-dark p-6 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <h3 className="font-tech text-amber-400 font-bold">{labels.awardTitle}</h3>
                    </div>
                    <p className="text-white">{publication.awardReceived}</p>
                  </div>
                </FadeIn>
              )}

              {/* Links Section - Data-driven */}
              <FadeIn delay={250}>
                <div className="space-y-3">
                  {/* DOI */}
                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm">{labels.doiLabel}</span>
                      <span className="text-ufam-secondary text-xs group-hover:text-ufam-primary transition-colors flex items-center gap-1">
                        {publication.doi}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  )}

                  {/* External URL - Data-driven */}
                  {publication.externalUrl && (
                    <a
                      href={publication.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        {labels.externalLinkLabel}
                      </span>
                      <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                    </a>
                  )}

                  {/* Repository URL - Data-driven */}
                  {publication.repositoryUrl && (
                    <a
                      href={publication.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        {labels.repositoryLabel}
                      </span>
                      <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                    </a>
                  )}

                  {/* Dataset URL - Data-driven */}
                  {publication.datasetUrl && (
                    <a
                      href={publication.datasetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        {labels.datasetLabel}
                      </span>
                      <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                    </a>
                  )}

                  {/* Video URL - Data-driven */}
                  {publication.videoUrl && (
                    <a
                      href={publication.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
                    >
                      <span className="text-white font-tech text-sm flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        {labels.videoLabel}
                      </span>
                      <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                    </a>
                  )}

                  {/* Citation Component */}
                  <PublicationCitation
                    title={publication.title}
                    bibtex={publication.citationBibtex}
                    apa={publication.citationApa}
                    abnt={publication.citationAbnt}
                  />

                  {/* PDF Download - Prioriza pdfFile do Strapi, fallback para pdfUrl */}
                  {pdfDownloadUrl && (
                    <a
                      href={pdfDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-ufam-primary text-white rounded hover:bg-ufam-primary/80 transition-all font-tech text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {labels.downloadButtonLabel}
                    </a>
                  )}
                </div>
              </FadeIn>

              {/* Supplementary Materials - Data-driven */}
              {publication.supplementaryMaterials?.data && (
                <FadeIn delay={275}>
                  <div className="bg-ufam-dark p-6 rounded-lg border border-white/5">
                    <h3 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
                      {labels.supplementaryLabel}
                    </h3>
                    <a
                      href={
                        getStrapiMediaUrl(publication.supplementaryMaterials.data.attributes.url) ||
                        '#'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded hover:bg-ufam-primary/10 transition-colors group"
                    >
                      <Paperclip className="w-4 h-4 text-ufam-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm group-hover:text-ufam-light transition-colors block truncate">
                          {publication.supplementaryMaterials.data.attributes.name}
                        </span>
                        {publication.supplementaryMaterials.data.attributes.size && (
                          <span className="text-ufam-secondary text-xs font-tech">
                            {(
                              publication.supplementaryMaterials.data.attributes.size / 1024
                            ).toFixed(1)}{' '}
                            KB
                          </span>
                        )}
                      </div>
                      <Download className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors flex-shrink-0" />
                    </a>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
