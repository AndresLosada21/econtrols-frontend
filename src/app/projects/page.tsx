import { Metadata } from 'next';
import Image from 'next/image';
import {
  getProjects,
  getProjectsPageSettings,
  getProjectStatuses,
  getStrapiMediaUrl,
  getHomepageSettings,
} from '@/lib/strapi';
import type { ProjectFlat, ProjectStatusFlat, PartnerFlat } from '@/types/strapi';
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

// ============================================
// Helper: Generate section labels from status
// ============================================

function generateSectionLabel(statusName: string): string {
  const labelMap: Record<string, string> = {
    'Em Andamento': '/// em andamento',
    Planejado: '/// planejados',
    Concluído: '/// concluídos',
    Pausado: '/// pausados',
  };
  return labelMap[statusName] || `/// ${statusName.toLowerCase()}`;
}

function generateSectionTitle(statusName: string): string {
  const titleMap: Record<string, string> = {
    'Em Andamento': 'Projetos Ativos',
    Planejado: 'Próximos Projetos',
    Concluído: 'Projetos Concluídos',
    Pausado: 'Projetos Pausados',
  };
  return titleMap[statusName] || `Projetos ${statusName}`;
}

// ============================================
// Helper: Get section background
// ============================================

function getSectionBg(index: number): string {
  // Alternate backgrounds for visual distinction
  return index % 2 === 0 ? '' : 'bg-ufam-dark';
}

// ============================================
// Helper: Get stats color by status
// ============================================

function getStatsColor(statusName: string): string {
  const colorMap: Record<string, string> = {
    'Em Andamento': 'text-green-400',
    Planejado: 'text-blue-400',
    Concluído: 'text-gray-400',
    Pausado: 'text-amber-400',
  };
  return colorMap[statusName] || 'text-ufam-light';
}

/**
 * Extrai agências de fomento únicas dos projetos
 */
function getUniqueFundingAgencies(projects: ProjectFlat[]): PartnerFlat[] {
  const agencyMap = new Map<number, PartnerFlat>();

  projects.forEach((project) => {
    if (project.fundingAgencyPartners && project.fundingAgencyPartners.length > 0) {
      project.fundingAgencyPartners.forEach((partner) => {
        if (!agencyMap.has(partner.id)) {
          agencyMap.set(partner.id, partner);
        }
      });
    }
  });

  return Array.from(agencyMap.values());
}

export default async function ProjectsPage() {
  let projects: ProjectFlat[] = [];
  let pageSettings = null;
  let allStatuses: ProjectStatusFlat[] = [];

  try {
    [projects, pageSettings, allStatuses] = await Promise.all([
      getProjects(),
      getProjectsPageSettings(),
      getProjectStatuses(),
    ]);
  } catch (error) {
    console.error('Error fetching projects page data:', error);
  }

  // Extract unique funding agencies from all projects (novo modelo unificado)
  const uniqueAgencies = getUniqueFundingAgencies(projects);

  // ============================================
  // Dynamic Grouping by Status (Taxonomia Dinâmica)
  // ============================================

  // Group projects by their projectStatus
  const projectsByStatus = new Map<string, ProjectFlat[]>();

  projects.forEach((project) => {
    // Use projectStatus.name (obrigatório após migração)
    const statusKey = project.projectStatus.name;

    if (!projectsByStatus.has(statusKey)) {
      projectsByStatus.set(statusKey, []);
    }
    projectsByStatus.get(statusKey)!.push(project);
  });

  // Create ordered sections based on available statuses
  // Use status data from the API if available, otherwise create from project data
  const orderedStatuses =
    allStatuses.length > 0
      ? allStatuses.filter((s) => projectsByStatus.has(s.name)) // Only show statuses with projects
      : Array.from(projectsByStatus.keys())
          .map((name) => {
            // Find the status info from a project that has it
            const project = projects.find((p) => p.projectStatus?.name === name);
            return (
              project?.projectStatus || {
                id: 0,
                name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                displayOrder: 999,
              }
            );
          })
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Projetos';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Projetos de pesquisa financiados por agências nacionais e internacionais, desenvolvendo soluções inovadoras em controle de sistemas.';

  const agenciesTitle = pageSettings?.agenciesTitle || 'Agências de Fomento';
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver os projetos.';

  // Legacy section settings for backwards compatibility
  const legacySections: Record<string, { label: string; title: string; description: string }> = {
    'Em Andamento': pageSettings?.activeSection || {
      label: '/// em andamento',
      title: 'Projetos Ativos',
      description: '',
    },
    Planejado: pageSettings?.plannedSection || {
      label: '/// planejados',
      title: 'Próximos Projetos',
      description: '',
    },
    Concluído: pageSettings?.finishedSection || {
      label: '/// concluídos',
      title: 'Projetos Concluídos',
      description: '',
    },
  };

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
              {orderedStatuses.slice(0, 3).map((status, index) => {
                const count = projectsByStatus.get(status.name)?.length || 0;
                return (
                  <FadeIn key={status.name} delay={(index + 1) * 100} className="text-center">
                    <span className={`text-3xl font-bold font-tech ${getStatsColor(status.name)}`}>
                      {count}
                    </span>
                    <p className="text-xs text-ufam-secondary font-tech lowercase">
                      {status.name.toLowerCase()}
                    </p>
                  </FadeIn>
                );
              })}
              <FadeIn delay={400} className="text-center">
                <span className="text-3xl font-bold text-ufam-light font-tech">
                  {uniqueAgencies.length}
                </span>
                <p className="text-xs text-ufam-secondary font-tech lowercase">agências</p>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sections by Status (Taxonomia Dinâmica) */}
      {orderedStatuses.map((status, sectionIndex) => {
        const statusProjects = projectsByStatus.get(status.name) || [];
        if (statusProjects.length === 0) return null;

        // Try to get legacy section settings, otherwise generate from status
        const legacySection = legacySections[status.name];
        const sectionLabel = legacySection?.label || generateSectionLabel(status.name);
        const sectionTitle = legacySection?.title || generateSectionTitle(status.name);
        // Use status.description from DB if available, otherwise legacy description
        const sectionDescription = status.description || legacySection?.description || '';

        return (
          <section key={status.name} className={`py-16 ${getSectionBg(sectionIndex)}`}>
            <div className="container mx-auto px-6">
              <FadeIn>
                <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                  {sectionLabel}
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-2">
                  {sectionTitle}
                </h3>
                {sectionDescription && (
                  <p className="text-ufam-secondary mb-8">{sectionDescription}</p>
                )}
              </FadeIn>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusProjects.map((project, index) => (
                  <FadeIn key={project.id} delay={index * 100}>
                    <ProjectCard project={project} index={index} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        );
      })}

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
