import { getProjects } from '@/lib/strapi';
import type { ProjectFlat } from '@/types/strapi';
import ProjectCard from '@/components/cards/ProjectCard';
import { FadeIn } from '@/components/effects/FadeIn';

export const metadata = {
  title: 'Projetos | e-Controls',
  description: 'Projetos de pesquisa e desenvolvimento do grupo e-Controls da UFAM.',
};

export default async function ProjectsPage() {
  let projects: ProjectFlat[] = [];

  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

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

  // Stats
  const agencies = [...new Set(projects.map((p) => p.fundingAgency).filter(Boolean))];

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">Projetos</h1>
            <p className="text-ufam-secondary max-w-2xl">
              Projetos de pesquisa financiados por agências nacionais e internacionais,
              desenvolvendo soluções inovadoras em controle de sistemas.
            </p>
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
                  {agencies.length}
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
                {'/// em andamento'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Projetos Ativos
              </h3>
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
                {'/// planejados'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Próximos Projetos
              </h3>
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
                {'/// concluídos'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Projetos Concluídos
              </h3>
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
      {agencies.length > 0 && (
        <section className="py-16 bg-ufam-dark border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h3 className="text-lg font-bold text-white font-tech mb-6">Agências de Fomento</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {agencies.map((agency, index) => (
                  <FadeIn key={agency} delay={index * 50}>
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded text-sm font-tech text-ufam-secondary">
                      {agency}
                    </span>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver os projetos.</p>
          </div>
        </section>
      )}
    </main>
  );
}
