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
  Target,
  TrendingUp,
  Award,
  BarChart3,
  Github,
  Globe,
  Tag,
} from 'lucide-react';
import { getProjectBySlug, getProjects, getStrapiMediaUrl } from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import { getProjectStatusColors } from '@/styles/utils';
import type { FacultyMemberFlat, ResearchLineFlat, PublicationFlat } from '@/types/strapi';

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

function getStatusIcon(status: string) {
  switch (status) {
    case 'Em Andamento':
    case 'active':
      return <Clock className="w-4 h-4" />;
    case 'Concluido':
    case 'finished':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'Planejado':
    case 'planned':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
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

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const statusColors = getProjectStatusColors(project.status);

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          voltar para projetos
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
                {getStatusIcon(project.status)}
                {project.status}
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
                {project.fundingAgencies && project.fundingAgencies.length > 0 && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <DollarSign className="w-4 h-4 text-ufam-primary" />
                      {project.fundingAgencies.length === 1
                        ? 'Agência de Fomento'
                        : 'Agências de Fomento'}
                    </div>
                    <p className="text-white font-tech">
                      {project.fundingAgencies.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                )}

                {/* Funding Amount */}
                {project.fundingAmount && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <DollarSign className="w-4 h-4 text-ufam-primary" />
                      Financiamento
                    </div>
                    <p className="text-white font-tech">{formatCurrency(project.fundingAmount)}</p>
                  </div>
                )}

                {/* Duration */}
                {(project.startDate || project.endDate) && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Calendar className="w-4 h-4 text-ufam-primary" />
                      Periodo
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
                      Coordenador
                    </div>
                    <Link
                      href={`/people/${project.coordinator.id}`}
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
                      Processo
                    </div>
                    <p className="text-white font-tech">{project.processNumber}</p>
                  </div>
                )}

                {/* Duration Text */}
                {project.duration && (
                  <div className="bg-ufam-dark p-4 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-ufam-secondary text-sm mb-1">
                      <Clock className="w-4 h-4 text-ufam-primary" />
                      Duracao
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
                      Progresso
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
      {project.fullDescription && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// descricao'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Sobre o Projeto</h3>
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
      {project.team && project.team.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// equipe'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Pesquisadores</h3>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {project.team.map((member: FacultyMemberFlat, index: number) => (
                <FadeIn key={member.id} delay={index * 50}>
                  <Link href={`/people/${member.id}`} className="group text-center block">
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
                    <p className="text-xs text-ufam-secondary">{member.role}</p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Lines */}
      {project.researchLines && project.researchLines.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// linhas de pesquisa'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Areas Relacionadas</h3>
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
      {project.objectives && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// objetivos'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Objetivos</h3>
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
      {project.methodology && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// metodologia'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Metodologia</h3>
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
      {project.expectedResults && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// resultados esperados'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Resultados Esperados</h3>
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
      {project.achievedResults && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// resultados alcançados'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                Resultados Alcançados
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
      {project.impactLegacy && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// impacto e legado'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Impacto e Legado</h3>
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

      {/* Keywords */}
      {project.keywords && project.keywords.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// palavras-chave'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Palavras-chave</h3>
            </FadeIn>

            <div className="flex flex-wrap gap-3">
              {project.keywords.map((keyword: string, index: number) => (
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
      {(project.websiteUrl || project.repositoryUrl) && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// links externos'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">Recursos Externos</h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
              {project.websiteUrl && (
                <FadeIn delay={100}>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 bg-ufam-bg border border-white/10 rounded hover:border-ufam-primary/50 transition-all group"
                  >
                    <div className="p-3 bg-ufam-primary/20 rounded">
                      <Globe className="w-6 h-6 text-ufam-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-tech mb-1">Website do Projeto</h4>
                      <p className="text-sm text-ufam-secondary">Acesse o site oficial</p>
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
                    className="flex items-center gap-4 p-6 bg-ufam-bg border border-white/10 rounded hover:border-ufam-primary/50 transition-all group"
                  >
                    <div className="p-3 bg-ufam-primary/20 rounded">
                      <Github className="w-6 h-6 text-ufam-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-tech mb-1">Repositório</h4>
                      <p className="text-sm text-ufam-secondary">Acesse o código fonte</p>
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
      {project.publications && project.publications.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// publicações'}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                Publicações Relacionadas ({project.publications.length})
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
                          <p className="text-xs text-ufam-secondary">citações</p>
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
    </main>
  );
}
