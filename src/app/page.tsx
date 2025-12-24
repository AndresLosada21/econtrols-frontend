import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getResearchLines,
  getHomepageFacultyMembers,
  getHomepageProjects,
  getHomepageAlumni,
} from '@/lib/strapi';
import type { ResearchLineFlat, FacultyMemberFlat, ProjectFlat, AlumnusFlat } from '@/types/strapi';
import Hero from '@/components/sections/Hero';
import ResearchLines from '@/components/sections/ResearchLines';
import { FadeIn } from '@/components/effects/FadeIn';

export default async function Home() {
  // Fetch data from Strapi
  let researchLines: ResearchLineFlat[] = [];
  let facultyMembers: FacultyMemberFlat[] = [];
  let projects: ProjectFlat[] = [];
  let alumni: AlumnusFlat[] = [];

  try {
    [researchLines, facultyMembers, projects, alumni] = await Promise.all([
      getResearchLines(),
      getHomepageFacultyMembers(),
      getHomepageProjects(),
      getHomepageAlumni(),
    ]);
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
  }

  return (
    <>
      {/* Hero Section with entrance animations */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest lowercase">
              {'/// sobre o grupo'}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white font-tech">
              Referência em Controle de Sistemas da Região Norte
            </h3>

            <div className="text-ufam-secondary text-lg leading-relaxed space-y-6 font-light">
              <p>
                O <strong className="text-white">e-Controls</strong> é um grupo de pesquisa da UFAM
                que se destaca como referência nacional em teoria de controle, sistemas tolerantes a
                falhas e verificação formal de software.
              </p>
              <p>
                Com colaborações internacionais estabelecidas com Oxford, Manchester e Cambridge,
                atuamos na fronteira do conhecimento aplicando soluções para a indústria amazônica.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 relative bg-ufam-dark z-10 border-y border-ufam-secondary/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FadeIn delay={0} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                200+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech">
                publicações
              </p>
            </FadeIn>
            <FadeIn delay={100} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                450+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech">
                citações
              </p>
            </FadeIn>
            <FadeIn delay={200} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                25+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech">
                mestres formados
              </p>
            </FadeIn>
            <FadeIn delay={300} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                6+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech">
                parcerias internac.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Research Lines with Horizontal Scroll */}
      <ResearchLines researchLines={researchLines} />

      {/* Projects Preview */}
      <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// projetos'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
                Pesquisa & Desenvolvimento
              </h3>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todos os projetos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.slice(0, 3).map((project, index) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <div className="bg-ufam-bg border border-white/10 p-6 rounded hover:border-ufam-primary/50 transition-all group h-full">
                    <span
                      className={`text-xs font-tech px-2 py-1 rounded mb-4 inline-block ${
                        project.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {project.status === 'active' ? 'em andamento' : 'concluído'}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-3 group-hover:text-ufam-light transition-colors font-tech">
                      {project.title}
                    </h4>
                    <p className="text-ufam-secondary text-sm mb-4">{project.shortDescription}</p>
                    {project.fundingAgency && (
                      <p className="text-xs text-ufam-light font-tech lowercase">
                        {project.fundingAgency}
                      </p>
                    )}
                  </div>
                </FadeIn>
              ))
            ) : (
              <FadeIn className="col-span-full text-center py-12">
                <p className="text-ufam-secondary">Conecte ao Strapi para ver os projetos.</p>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// equipe'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
                Liderança Acadêmica
              </h3>
            </div>
            <Link
              href="/people"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver toda a equipe
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facultyMembers.length > 0 ? (
              facultyMembers.slice(0, 4).map((member, index) => (
                <FadeIn key={member.id} delay={index * 100}>
                  <Link href={`/people/${member.id}`} className="group text-center block">
                    <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-800 aspect-[3/4] border-b-2 border-ufam-primary">
                      {member.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.photoUrl}
                          alt={member.displayName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
                          <span className="text-4xl font-tech text-ufam-primary/50">
                            {member.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-ufam-primary/80 to-transparent p-4">
                        <span className="text-white font-tech text-xs bg-black/50 px-2 py-1 rounded backdrop-blur border border-white/20 lowercase">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-ufam-light transition-colors font-tech">
                      {member.displayName}
                    </h4>
                    {member.specializationAreas && member.specializationAreas.length > 0 && (
                      <p className="text-ufam-secondary text-sm">{member.specializationAreas[0]}</p>
                    )}
                  </Link>
                </FadeIn>
              ))
            ) : (
              <FadeIn className="col-span-full text-center py-12">
                <p className="text-ufam-secondary">
                  Conecte ao Strapi para ver os membros da equipe.
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Alumni Preview */}
      <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// egressos'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">Alumni</h3>
              <p className="text-ufam-secondary mt-2 max-w-xl">
                Nossos egressos atuam em universidades, indústrias e centros de pesquisa ao redor do
                mundo.
              </p>
            </div>
            <Link
              href="/people/alumni"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todos os egressos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumni.length > 0 ? (
              alumni.slice(0, 4).map((alum, index) => (
                <FadeIn key={alum.id} delay={index * 100}>
                  <div className="bg-ufam-bg border border-white/10 p-6 rounded hover:border-ufam-primary/50 transition-all group h-full">
                    <div className="flex items-start gap-4 mb-4">
                      {alum.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={alum.photoUrl}
                          alt={alum.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-ufam-primary/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ufam-primary/20 to-ufam-dark flex items-center justify-center border border-ufam-primary/30">
                          <span className="text-lg font-tech text-ufam-primary/70">
                            {alum.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold font-tech group-hover:text-ufam-light transition-colors truncate">
                          {alum.fullName}
                        </h4>
                        <span className="text-xs font-tech text-ufam-primary lowercase">
                          {alum.degreeLevel} {alum.defenseYear && `• ${alum.defenseYear}`}
                        </span>
                      </div>
                    </div>

                    {alum.currentPosition && (
                      <p className="text-ufam-secondary text-sm mb-2">{alum.currentPosition}</p>
                    )}

                    {alum.currentInstitution && (
                      <p className="text-xs text-ufam-light/70 font-tech lowercase">
                        {alum.currentInstitution}
                      </p>
                    )}

                    {alum.currentSector && (
                      <span
                        className={`text-xs font-tech px-2 py-1 rounded mt-3 inline-block ${
                          alum.currentSector === 'Academia'
                            ? 'bg-blue-500/20 text-blue-400'
                            : alum.currentSector === 'Indústria'
                              ? 'bg-green-500/20 text-green-400'
                              : alum.currentSector === 'Governo'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {alum.currentSector.toLowerCase()}
                      </span>
                    )}
                  </div>
                </FadeIn>
              ))
            ) : (
              <FadeIn className="col-span-full text-center py-12">
                <p className="text-ufam-secondary">Conecte ao Strapi para ver os egressos.</p>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Partners Preview */}
      <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
              {'/// parceiros'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech mb-4">
              Rede de Colaboração Internacional
            </h3>
            <p className="text-ufam-secondary max-w-2xl mx-auto">
              Colaboramos com universidades e centros de pesquisa de excelência ao redor do mundo.
            </p>
          </FadeIn>

          <FadeIn
            delay={200}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60"
          >
            {/* Placeholder logos - will be replaced with real partner logos */}
            {['Oxford', 'Cambridge', 'Manchester', 'TU Delft', 'INRIA'].map((partner) => (
              <div
                key={partner}
                className="text-white/50 font-tech text-lg hover:text-white transition-colors"
              >
                {partner}
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={300} className="text-center mt-8">
            <Link
              href="/partners"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todos os parceiros
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// notícias'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
                Últimas Atualizações
              </h3>
            </div>
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todas as notícias
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <FadeIn className="text-center py-12 text-ufam-secondary">
            <p>Conecte ao Strapi para ver as notícias.</p>
          </FadeIn>
        </div>
      </section>

      {/* Publications Preview */}
      <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// publicações'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
                Produção Científica
              </h3>
            </div>
            <Link
              href="/publications"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todas as publicações
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <FadeIn className="text-center py-12 text-ufam-secondary">
            <p>Conecte ao Strapi para ver as publicações.</p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
