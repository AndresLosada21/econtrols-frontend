import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Beaker,
  Users,
  FolderKanban,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Building,
  Factory,
  Award,
  Tag,
} from 'lucide-react';
import {
  getResearchLineBySlug,
  getResearchLines,
  getStrapiMediaUrl,
  getResearchDetailedPageSettings,
} from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';
import ProjectCard from '@/components/cards/ProjectCard';
import type {
  FacultyMemberFlat,
  ProjectFlat,
  PublicationFlat,
  ResearchCategoryFlat,
} from '@/types/strapi';

// ============================================
// Helper: Get category-specific badge colors
// ============================================

function getCategoryBadgeColors(category: ResearchCategoryFlat): string {
  const colorMap: Record<string, string> = {
    'text-ufam-light': 'bg-ufam-primary/20 text-ufam-light border-ufam-primary/30',
    'text-blue-400': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'text-green-400': 'bg-green-500/20 text-green-400 border-green-500/30',
    'text-purple-400': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'text-amber-400': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'text-red-400': 'bg-red-500/20 text-red-400 border-red-500/30',
    'text-cyan-400': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return colorMap[category.color] || 'bg-ufam-primary/20 text-ufam-light border-ufam-primary/30';
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // Agora retorna ResearchLineDetail que TEM o campo seo
  const researchLine = await getResearchLineBySlug(slug);

  if (!researchLine) {
    return {
      title: 'Linha de pesquisa não encontrada | e-Controls',
    };
  }

  const seo = researchLine.seo; // TypeScript reconhece este campo agora!

  // Fallback to defaults if SEO data is missing
  const title = seo.metaTitle || `${researchLine.title} | Pesquisa | e-Controls`;
  const description = seo.metaDescription || researchLine.shortDescription;

  return {
    title,
    description,
    keywords: seo.keywords,
    robots: seo.metaRobots,
    alternates: {
      canonical: seo.canonicalURL,
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: seo.ogUrl,
      type: (seo.ogType as 'website') || 'website',
      locale: seo.ogLocale || 'pt_BR',
      images: seo.ogImage?.data?.attributes?.url
        ? [{ url: getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '' }]
        : [],
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      images: seo.twitterImage?.data?.attributes?.url
        ? [getStrapiMediaUrl(seo.twitterImage.data.attributes.url) || '']
        : seo.ogImage?.data?.attributes?.url
          ? [getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '']
          : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const researchLines = await getResearchLines();
    return researchLines.map((line) => ({
      slug: line.slug ? String(line.slug) : String(line.id),
    }));
  } catch {
    return [];
  }
}

export default async function ResearchLineDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Buscar linha de pesquisa e settings em paralelo
  const [researchLine, detailedSettings] = await Promise.all([
    getResearchLineBySlug(slug),
    getResearchDetailedPageSettings(),
  ]);

  if (!researchLine) {
    notFound();
  }

  // Criar objeto de labels com fallback completo
  const labels = {
    backButtonText: detailedSettings?.backButtonText || 'voltar para pesquisa',
    descriptionLabel: detailedSettings?.descriptionLabel || '/// descrição',
    descriptionTitle: detailedSettings?.descriptionTitle || 'Sobre a Linha de Pesquisa',
    teamLabel: detailedSettings?.teamLabel || '/// equipe',
    teamTitle: detailedSettings?.teamTitle || 'Pesquisadores',
    projectsLabel: detailedSettings?.projectsLabel || '/// projetos',
    projectsTitle: detailedSettings?.projectsTitle || 'Projetos Relacionados',
    keywordsLabel: detailedSettings?.keywordsLabel || '/// palavras-chave',
    keywordsTitle: detailedSettings?.keywordsTitle || 'Palavras-Chave',
    applicationsLabel: detailedSettings?.applicationsLabel || '/// aplicações',
    applicationsTitle: detailedSettings?.applicationsTitle || 'Aplicações Práticas',
    publicationsLabel: detailedSettings?.publicationsLabel || '/// publicações',
    publicationsTitle: detailedSettings?.publicationsTitle || 'Publicações Recentes',
    teachingLabel: detailedSettings?.teachingLabel || '/// ensino',
    teachingTitle: detailedSettings?.teachingTitle || 'Disciplinas e Cursos',
    collaborationsLabel: detailedSettings?.collaborationsLabel || '/// colaborações',
    collaborationsTitle: detailedSettings?.collaborationsTitle || 'Colaborações Externas',
    facilitiesLabel: detailedSettings?.facilitiesLabel || '/// infraestrutura',
    facilitiesTitle: detailedSettings?.facilitiesTitle || 'Infraestrutura',
    ctaTitle: detailedSettings?.ctaTitle || 'Interessado nesta linha de pesquisa?',
    ctaDescription:
      detailedSettings?.ctaDescription || 'Entre em contato com nossa equipe para saber mais.',
    ctaButtonLabel: detailedSettings?.ctaButtonLabel || 'entrar em contato',
  };

  const categoryColor = getCategoryBadgeColors(researchLine.category);

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.backButtonText}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 border-b border-white/5 overflow-hidden">
        {/* Background Image */}
        {researchLine.imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={researchLine.imageUrl}
              alt={researchLine.title}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ufam-bg via-ufam-bg/95 to-ufam-bg/80" />
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-2 font-tech text-xs px-3 py-1 rounded mb-4 border ${categoryColor}`}
            >
              <Beaker className="w-4 h-4" />
              {researchLine.category.name}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white font-tech mb-4">
              {researchLine.title}
            </h1>

            {/* Short Description */}
            <p className="text-xl text-ufam-secondary max-w-3xl">{researchLine.shortDescription}</p>
          </FadeIn>
        </div>
      </section>

      {/* Full Description */}
      {researchLine.fullDescription && (
        <section className="py-16">
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
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap text-lg">
                  {researchLine.fullDescription}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Faculty Members */}
      {researchLine.facultyMembers && researchLine.facultyMembers.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.teamLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.teamTitle} ({researchLine.facultyMembers.length})
              </h3>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {researchLine.facultyMembers?.map((member: FacultyMemberFlat, index: number) => (
                <FadeIn key={member.id} delay={index * 50}>
                  <Link href={`/people/${member.id}`} className="group text-center block">
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-ufam-bg border-2 border-white/10 group-hover:border-ufam-primary/50 transition-all">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
                          <span className="text-3xl font-tech text-ufam-primary/50">
                            {member.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-tech text-white group-hover:text-ufam-light transition-colors mb-1">
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

      {/* Projects */}
      {researchLine.projects && researchLine.projects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.projectsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.projectsTitle} ({researchLine.projects.length})
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchLine.projects?.map((project: ProjectFlat, index: number) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Keywords */}
      {researchLine.keywords && researchLine.keywords.length > 0 && (
        <section className="py-16 bg-ufam-dark">
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
              {researchLine.keywords.map((keyword: string, index: number) => (
                <FadeIn key={index} delay={index * 50}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-ufam-bg border border-white/10 rounded text-ufam-secondary font-tech text-sm">
                    <Tag className="w-4 h-4 text-ufam-primary" />
                    {keyword}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Practical Applications */}
      {researchLine.practicalApplications && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.applicationsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.applicationsTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {researchLine.practicalApplications}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Teaching Courses */}
      {researchLine.teachingCourses && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.teachingLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.teachingTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {researchLine.teachingCourses}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* External Collaborations */}
      {researchLine.externalCollaborations && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.collaborationsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.collaborationsTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {researchLine.externalCollaborations}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Facilities */}
      {researchLine.facilities && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.facilitiesLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.facilitiesTitle}
              </h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="prose prose-invert max-w-none">
                <div className="text-ufam-secondary leading-relaxed whitespace-pre-wrap">
                  {researchLine.facilities}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Publications */}
      {researchLine.publications && researchLine.publications.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.publicationsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.publicationsTitle} ({researchLine.publications.length})
              </h3>
            </FadeIn>

            <div className="space-y-4">
              {researchLine.publications.map((pub: PublicationFlat, index: number) => (
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

      {/* Stats Summary */}
      <section className="py-12 bg-ufam-dark border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12">
            <FadeIn className="text-center">
              <Users className="w-8 h-8 text-ufam-primary mx-auto mb-2" />
              <span className="text-3xl font-bold text-white font-tech">
                {researchLine.facultyMembers?.length || 0}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">pesquisadores</p>
            </FadeIn>
            <FadeIn delay={100} className="text-center">
              <FolderKanban className="w-8 h-8 text-ufam-primary mx-auto mb-2" />
              <span className="text-3xl font-bold text-white font-tech">
                {researchLine.projects?.length || 0}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">projetos</p>
            </FadeIn>
            <FadeIn delay={200} className="text-center">
              <BookOpen className="w-8 h-8 text-ufam-primary mx-auto mb-2" />
              <span className="text-3xl font-bold text-white font-tech">
                {researchLine.publications?.length || 0}
              </span>
              <p className="text-xs text-ufam-secondary font-tech lowercase">publicacoes</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h3 className="text-xl font-bold text-white font-tech mb-4">{labels.ctaTitle}</h3>
            <p className="text-ufam-secondary mb-6 max-w-xl mx-auto">{labels.ctaDescription}</p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-ufam-primary text-white px-6 py-3 rounded font-tech text-sm hover:bg-ufam-primary/80 transition-colors lowercase"
            >
              {labels.ctaButtonLabel}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
