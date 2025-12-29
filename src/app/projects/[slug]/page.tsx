import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Beaker,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  BarChart3,
  Github,
  Globe,
  Tag,
} from 'lucide-react';
import {
  getProjectBySlug,
  getProjects,
  getProjectsDetailedPageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import type {
  FacultyMemberFlat,
  ResearchLineFlat,
  PublicationFlat,
  ProjectDetail,
  PartnerFlat,
} from '@/types/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Projeto nao encontrado | e-Controls',
    };
  }

  const seo = project.seo;
  const title = seo?.metaTitle || `${project.title} | Projetos | e-Controls`;
  const description =
    seo?.metaDescription ||
    project.summary ||
    project.shortDescription ||
    `Projeto ${project.title} do grupo e-Controls da UFAM.`;

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
        : project.featuredImageUrl
          ? [{ url: project.featuredImageUrl }]
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
          : project.featuredImageUrl
            ? [project.featuredImageUrl]
            : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug ? String(project.slug) : String(project.id),
    }));
  } catch {
    return [];
  }
}

/**
 * Extrai as classes de cor do campo color do projectStatus
 */
function parseStatusColor(colorString: string): {
  bg: string;
  text: string;
  border: string;
} {
  const classes = colorString.split(' ');

  const bg = classes.find((c) => c.startsWith('bg-')) || 'bg-gray-500/20';
  const text = classes.find((c) => c.startsWith('text-')) || 'text-gray-400';
  const border = classes.find((c) => c.startsWith('border-')) || 'border-gray-500/30';

  return { bg, text, border };
}

/**
 * Obtém as cores do status do projeto (Taxonomia Dinâmica)
 */
function getStatusColorClasses(project: ProjectDetail): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const { bg, text, border } = parseStatusColor(project.projectStatus.color);
  return {
    bg,
    text,
    border,
    label: project.projectStatus.name,
  };
}

/**
 * Retorna o ícone apropriado para o status
 */
function getStatusIcon(statusName: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'Em Andamento': <Clock className="w-4 h-4" />,
    active: <Clock className="w-4 h-4" />,
    Concluído: <CheckCircle2 className="w-4 h-4" />,
    finished: <CheckCircle2 className="w-4 h-4" />,
    Planejado: <AlertCircle className="w-4 h-4" />,
    planned: <AlertCircle className="w-4 h-4" />,
    Pausado: <PauseCircle className="w-4 h-4" />,
    paused: <PauseCircle className="w-4 h-4" />,
  };

  return iconMap[statusName] || <Clock className="w-4 h-4" />;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Obtém as agências de fomento do projeto
 */
function getProjectFundingAgencies(project: ProjectDetail): PartnerFlat[] {
  if (project.fundingAgencyPartners && project.fundingAgencyPartners.length > 0) {
    return project.fundingAgencyPartners;
  }

  return [];
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, detailSettings] = await Promise.all([
    getProjectBySlug(slug),
    getProjectsDetailedPageSettings(),
  ]);

  if (!project) {
    notFound();
  }

  // Cores dinâmicas do status (taxonomia dinâmica)
  const statusColors = getStatusColorClasses(project);
  const statusName = project.projectStatus.name;

  // Obtém agências de fomento (novo modelo unificado)
  const fundingAgencies = getProjectFundingAgencies(project);

  // Labels da API com fallbacks
  const labels = {
    backButtonText: detailSettings?.backButtonText || 'voltar para projetos',
    descriptionLabel: detailSettings?.descriptionLabel || '/// descrição',
    descriptionTitle: detailSettings?.descriptionTitle || 'Sobre o Projeto',
    objectivesLabel: detailSettings?.objectivesLabel || '/// objetivos',
    objectivesTitle: detailSettings?.objectivesTitle || 'Objetivos',
    methodologyLabel: detailSettings?.methodologyLabel || '/// metodologia',
    methodologyTitle: detailSettings?.methodologyTitle || 'Metodologia',
    teamLabel: detailSettings?.teamLabel || '/// equipe',
    teamTitle: detailSettings?.teamTitle || 'Equipe',
    researchLinesLabel: detailSettings?.researchLinesLabel || '/// linhas de pesquisa',
    researchLinesTitle: detailSettings?.researchLinesTitle || 'Linhas de Pesquisa',
    expectedResultsLabel: detailSettings?.expectedResultsLabel || '/// resultados esperados',
    expectedResultsTitle: detailSettings?.expectedResultsTitle || 'Resultados Esperados',
    achievedResultsLabel: detailSettings?.achievedResultsLabel || '/// resultados alcançados',
    achievedResultsTitle: detailSettings?.achievedResultsTitle || 'Resultados Alcançados',
    impactLabel: detailSettings?.impactLabel || '/// impacto e legado',
    impactTitle: detailSettings?.impactTitle || 'Impacto e Legado',
    publicationsLabel: detailSettings?.publicationsLabel || '/// publicações',
    publicationsTitle: detailSettings?.publicationsTitle || 'Publicações',
    linksLabel: detailSettings?.linksLabel || '/// links externos',
    linksTitle: detailSettings?.linksTitle || 'Links Externos',
    keywordsLabel: detailSettings?.keywordsLabel || '/// palavras-chave',
    keywordsTitle: detailSettings?.keywordsTitle || 'Palavras-Chave',
    fundingAgencyLabel: detailSettings?.fundingAgencyLabel || 'Agência de Fomento',
    fundingAmountLabel: detailSettings?.fundingAmountLabel || 'Valor',
    periodLabel: detailSettings?.periodLabel || 'Período',
    coordinatorLabel: detailSettings?.coordinatorLabel || 'Coordenador',
    processLabel: detailSettings?.processLabel || 'Processo',
    durationLabel: detailSettings?.durationLabel || 'Duração',
    progressLabel: detailSettings?.progressLabel || 'Progresso',
    websiteLabel: detailSettings?.websiteLabel || 'Website do Projeto',
    websiteDescription: detailSettings?.websiteDescription || 'Acesse o site oficial',
    repositoryLabel: detailSettings?.repositoryLabel || 'Repositório',
    repositoryDescription: detailSettings?.repositoryDescription || 'Acesse o código fonte',
    partnersLabel: detailSettings?.partnersLabel || '/// parceiros',
    partnersTitle: detailSettings?.partnersTitle || 'Parceiros',
    galleryLabel: detailSettings?.galleryLabel || '/// galeria',
    galleryTitle: detailSettings?.galleryTitle || 'Galeria',
    citationsLabel: detailSettings?.citationsLabel || 'citações',
  };

  // Visibility toggles com default true
  const show = {
    description: project.showDescription !== false,
    objectives: project.showObjectives !== false,
    methodology: project.showMethodology !== false,
    expectedResults: project.showExpectedResults !== false,
    achievedResults: project.showAchievedResults !== false,
    impactLegacy: project.showImpactLegacy !== false,
    team: project.showTeam !== false,
    researchLines: project.showResearchLines !== false,
    publications: project.showPublications !== false,
    funding: project.showFunding !== false,
    gallery: project.showGallery !== false,
    links: project.showLinks !== false,
    keywords: project.showKeywords !== false,
    partners: project.showPartners !== false,
  };

  // Verifica se há conteúdo para exibir em cada seção
  const hasDescription = show.description && project.fullDescription;
  const hasObjectives = show.objectives && project.objectives;
  const hasMethodology = show.methodology && project.methodology;
  const hasExpectedResults = show.expectedResults && project.expectedResults;
  const hasAchievedResults = show.achievedResults && project.achievedResults;
  const hasImpactLegacy = show.impactLegacy && project.impactLegacy;
  const hasTeam = show.team && project.team && project.team.length > 0;
  const hasResearchLines =
    show.researchLines && project.researchLines && project.researchLines.length > 0;
  const hasPublications =
    show.publications && project.publications && project.publications.length > 0;
  // Usa a nova variável fundingAgencies (unificada)
  const hasFunding = show.funding && fundingAgencies.length > 0;
  const hasLinks = show.links && (project.websiteUrl || project.repositoryUrl);
  const hasKeywords = show.keywords && project.keywords && project.keywords.length > 0;
  // Filtra partners que NÃO são funding agencies para evitar duplicação
  const nonFundingPartners =
    project.partners?.filter((p) => p.type?.slug !== 'funding-agency') || [];
  const hasPartners = show.partners && nonFundingPartners.length > 0;
  const hasGallery = show.gallery && project.gallery?.data && project.gallery.data.length > 0;

  let sectionIndex = 0;
  const getSectionBg = () => {
    const bg = sectionIndex % 2 === 0 ? '' : 'bg-ufam-dark';
    sectionIndex++;
    return bg;
  };

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/projects"
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
            {/* Featured Image */}
            <FadeIn className="lg:col-span-1">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-ufam-dark border border-white/5">
                {project.featuredImageUrl ? (
                  <Image
                    src={project.featuredImageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
                    <Beaker className="w-16 h-16 text-ufam-primary/50" />
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Info */}
            <FadeIn delay={100} className="lg:col-span-2">
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-2 font-tech text-xs px-3 py-1 rounded mb-4 lowercase ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
              >
                {getStatusIcon(statusName)}
                {statusColors.label}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-tech mb-4">
                {project.title}
              </h1>

              {/* Short Description */}
              {project.shortDescription && (
                <p className="text-ufam-secondary text-lg mb-6">{project.shortDescription}</p>
              )}

              {/* Project Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Funding Agencies */}
                {hasFunding && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <DollarSign className="w-4 h-4 text-ufam-primary" />
                      {fundingAgencies.length === 1
                        ? labels.fundingAgencyLabel
                        : labels.fundingAgencyLabel + 's'}
                    </div>
                    <p className="text-white font-tech">
                      {fundingAgencies.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                )}

                {/* Funding Amount */}
                {show.funding && project.fundingAmount && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <DollarSign className="w-4 h-4 text-ufam-primary" />
                      {labels.fundingAmountLabel}
                    </div>
                    <p className="text-white font-tech">{formatCurrency(project.fundingAmount)}</p>
                  </div>
                )}

                {/* Duration */}
                {(project.startDate || project.endDate) && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Calendar className="w-4 h-4 text-ufam-primary" />
                      {labels.periodLabel}
                    </div>
                    <p className="text-white font-tech">
                      {project.startDate && formatDate(project.startDate)}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && formatDate(project.endDate)}
                    </p>
                  </div>
                )}

                {/* Coordinator */}
                {project.coordinator && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Users className="w-4 h-4 text-ufam-primary" />
                      {labels.coordinatorLabel}
                    </div>
                    <Link
                      href={`/people/${project.coordinator.slug || project.coordinator.id}`}
                      className="text-white font-tech hover:text-ufam-primary transition-colors"
                    >
                      {project.coordinator.displayName}
                    </Link>
                  </div>
                )}

                {/* Process Number */}
                {project.processNumber && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Tag className="w-4 h-4 text-ufam-primary" />
                      {labels.processLabel}
                    </div>
                    <p className="text-white font-tech">{project.processNumber}</p>
                  </div>
                )}

                {/* Duration Text */}
                {project.duration && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Clock className="w-4 h-4 text-ufam-primary" />
                      {labels.durationLabel}
                    </div>
                    <p className="text-white font-tech">{project.duration}</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {project.progressPercentage !== undefined && project.progressPercentage !== null && (
                <div className="bg-ufam-dark p-4 rounded border border-white/5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm">
                      <BarChart3 className="w-4 h-4 text-ufam-primary" />
                      {labels.progressLabel}
                    </div>
                    <span className="text-ufam-primary font-tech">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-ufam-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ufam-primary to-ufam-light transition-all duration-1000"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Full Description */}
      {hasDescription && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.descriptionLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.descriptionTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.fullDescription}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Team */}
      {hasTeam && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.teamLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">{labels.teamTitle}</h3>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {project.team.map((member: FacultyMemberFlat, index: number) => (
                <FadeIn key={member.id} delay={index * 50}>
                  <Link
                    href={`/people/${member.slug || member.id}`}
                    className="group text-center block"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-ufam-bg border-2 border-white/10 group-hover:border-ufam-primary/50 transition-all">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
                          <span className="text-2xl font-tech text-ufam-primary/50">
                            {member.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-tech text-white group-hover:text-ufam-light transition-colors">
                      {member.displayName}
                    </p>
                    <p className="text-xs text-ufam-secondary">{member.memberRole.name}</p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Lines */}
      {hasResearchLines && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.researchLinesLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.researchLinesTitle}
              </h3>
            </FadeIn>

            <div className="flex flex-wrap gap-4">
              {project.researchLines.map((line: ResearchLineFlat, index: number) => (
                <FadeIn key={line.id} delay={index * 100}>
                  <Link
                    href={`/research/${line.slug}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 transition-all"
                  >
                    <Beaker className="w-5 h-5 text-ufam-primary" />
                    <span className="text-white font-tech group-hover:text-ufam-light transition-colors">
                      {line.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Objectives */}
      {hasObjectives && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.objectivesLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.objectivesTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.objectives}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Methodology */}
      {hasMethodology && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.methodologyLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.methodologyTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.methodology}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Expected Results */}
      {hasExpectedResults && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.expectedResultsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.expectedResultsTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.expectedResults}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Achieved Results */}
      {hasAchievedResults && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.achievedResultsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.achievedResultsTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.achievedResults}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Impact & Legacy */}
      {hasImpactLegacy && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.impactLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">{labels.impactTitle}</h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {project.impactLegacy}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Partners */}
      {hasPartners && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.partnersLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.partnersTitle}
              </h3>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {nonFundingPartners.map((partner: PartnerFlat, index: number) => (
                <FadeIn key={partner.id} delay={index * 50}>
                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-center block"
                    >
                      <div className="relative h-16 mx-auto mb-3 rounded overflow-hidden bg-ufam-dark border border-white/10 group-hover:border-ufam-primary/50 transition-all p-4">
                        {partner.logoUrl ? (
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-tech text-ufam-secondary">
                              {partner.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-tech text-white group-hover:text-ufam-light transition-colors">
                        {partner.name}
                      </p>
                    </a>
                  ) : (
                    <div className="text-center">
                      <div className="relative h-16 mx-auto mb-3 rounded overflow-hidden bg-ufam-dark border border-white/10 p-4">
                        {partner.logoUrl ? (
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-tech text-ufam-secondary">
                              {partner.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-tech text-white">{partner.name}</p>
                    </div>
                  )}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Keywords */}
      {hasKeywords && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.keywordsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.keywordsTitle}
              </h3>
            </FadeIn>

            <div className="flex flex-wrap gap-3">
              {project.keywords!.map((keyword: string, index: number) => (
                <FadeIn key={index} delay={index * 50}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-ufam-dark border border-white/10 rounded text-ufam-secondary font-tech text-sm">
                    <Tag className="w-4 h-4 text-ufam-primary" />
                    {keyword}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* External Links */}
      {hasLinks && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.linksLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">{labels.linksTitle}</h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
              {project.websiteUrl && (
                <FadeIn delay={100}>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 transition-all group"
                  >
                    <div className="p-3 bg-ufam-primary/20 rounded">
                      <Globe className="w-6 h-6 text-ufam-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-tech mb-1">{labels.websiteLabel}</h4>
                      <p className="text-sm text-ufam-secondary">{labels.websiteDescription}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                  </a>
                </FadeIn>
              )}

              {project.repositoryUrl && (
                <FadeIn delay={200}>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 transition-all group"
                  >
                    <div className="p-3 bg-ufam-primary/20 rounded">
                      <Github className="w-6 h-6 text-ufam-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-tech mb-1">{labels.repositoryLabel}</h4>
                      <p className="text-sm text-ufam-secondary">{labels.repositoryDescription}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-ufam-secondary group-hover:text-ufam-primary transition-colors" />
                  </a>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Publications */}
      {hasPublications && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.publicationsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.publicationsTitle} ({project.publications.length})
              </h3>
            </FadeIn>

            <div className="space-y-4">
              {project.publications.map((pub: PublicationFlat, index: number) => (
                <FadeIn key={pub.id} delay={index * 50}>
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="block bg-ufam-dark p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-ufam-light transition-colors mb-2">
                          {pub.title}
                        </h4>
                        <p className="text-sm text-ufam-secondary">{pub.authorsText}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-ufam-secondary">
                          <span className="text-ufam-primary">{pub.year}</span>
                          {pub.journalName && <span>{pub.journalName}</span>}
                          {pub.conferenceName && <span>{pub.conferenceName}</span>}
                        </div>
                      </div>
                      {pub.citationCount && pub.citationCount > 0 && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-ufam-primary font-tech">
                            {pub.citationCount}
                          </span>
                          <p className="text-xs text-ufam-secondary">{labels.citationsLabel}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {hasGallery && (
        <section className={`py-16 ${getSectionBg()}`}>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.galleryLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.galleryTitle}
              </h3>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.gallery!.data!.map((item: any, index: number) => (
                <FadeIn key={item.id} delay={index * 50}>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-ufam-dark border border-white/5 hover:border-ufam-primary/30 transition-all">
                    <Image
                      src={getStrapiMediaUrl(item.attributes?.url) || ''}
                      alt={
                        item.attributes?.alternativeText || `${project.title} - imagem ${index + 1}`
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
