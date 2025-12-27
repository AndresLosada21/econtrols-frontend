import { Metadata } from 'next';
import Image from 'next/image';
import {
  getProjects,
  getProjectsPageSettings,
  getStrapiMediaUrl,
  getHomepageSettings,
} from '@/lib/strapi';
import type { ProjectFlat } from '@/types/strapi';
import ProjectCard from '@/components/cards/ProjectCard';
import { FadeIn } from '@/components/effects/FadeIn';

// ============================================
// Dynamic SEO Metadata
// ============================================

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getProjectsPageSettings();
  const homepageSettings = await getHomepageSettings();
  const seo = settings?.seo;

  const title = seo?.metaTitle || 'Projetos | e-Controls';
  const description =
    seo?.metaDescription || 'Projetos de pesquisa e desenvolvimento do grupo e-Controls da UFAM.';

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

export default async function ProjectsPage() {
  let projects: ProjectFlat[] = [];
  let pageSettings = null;

  try {
    [projects, pageSettings] = await Promise.all([getProjects(), getProjectsPageSettings()]);
  } catch (error) {
    console.error('Error fetching projects page data:', error);
  }

  // Extract unique funding agencies from all projects
  const allAgencies = projects.flatMap((p) => p.fundingAgencies || []);
  const uniqueAgencies = Array.from(new Map(allAgencies.map((a) => [a.id, a])).values());

  // Group by status
  const activeProjects = projects.filter(
    (p) => p.status === 'Em Andamento' || p.status === 'active'
  );
  const finishedProjects = projects.filter(
    (p) => p.status === 'Concluído' || p.status === 'finished'
  );
  const plannedProjects = projects.filter(
    (p) => p.status === 'Planejado' || p.status === 'planned'
  );

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Projetos';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Projetos de pesquisa financiados por agências nacionais e internacionais, desenvolvendo soluções inovadoras em controle de sistemas.';

  const activeSection = pageSettings?.activeSection || {
    label: '/// em andamento',
    title: 'Projetos Ativos',
    description: '',
  };

  const plannedSection = pageSettings?.plannedSection || {
    label: '/// planejados',
    title: 'Próximos Projetos',
    description: '',
  };

  const finishedSection = pageSettings?.finishedSection || {
    label: '/// concluídos',
    title: 'Projetos Concluídos',
    description: '',
  };

  const agenciesTitle = pageSettings?.agenciesTitle || 'Agências de Fomento';
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver os projetos.';

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
      {projects.length > 0 && (
        <section className="py-8 bg-ufam-dark border-b border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <FadeIn className="text-center">
                <span className="text-3xl font-bold text-ufam-primary font-tech">
                  {projects.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">projetos</p>
              </FadeIn>
              <FadeIn delay={100} className="text-center">
                <span className="text-3xl font-bold text-green-400 font-tech">
                  {activeProjects.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">em andamento</p>
              </FadeIn>
              <FadeIn delay={200} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {finishedProjects.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">concluídos</p>
              </FadeIn>
              <FadeIn delay={300} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {uniqueAgencies.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">agências</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {activeSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {activeSection.title}
              </h3>
              {activeSection.description && (
                <p className="text-ufam-secondary mb-8">{activeSection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planned Projects */}
      {plannedProjects.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {plannedSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {plannedSection.title}
              </h3>
              {plannedSection.description && (
                <p className="text-ufam-secondary mb-8">{plannedSection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plannedProjects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Finished Projects */}
      {finishedProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {finishedSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                {finishedSection.title}
              </h3>
              {finishedSection.description && (
                <p className="text-ufam-secondary mb-8">{finishedSection.description}</p>
              )}
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finishedProjects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Funding Agencies */}
      {uniqueAgencies.length > 0 && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h3 className="text-lg font-bold text-white font-tech mb-6">{agenciesTitle}</h3>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {uniqueAgencies.map((agency, index) => (
                  <FadeIn key={agency.id} delay={index * 50}>
                    {agency.logoUrl ? (
                      <div
                        className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                        title={agency.name}
                      >
                        <Image
                          src={agency.logoUrl}
                          alt={agency.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded text-sm font-tech text-ufam-secondary">
                        {agency.name}
                      </span>
                    )}
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <section className="py-32">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">{emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
