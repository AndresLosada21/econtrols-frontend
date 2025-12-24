import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getResearchLines,
  getHomepageFacultyMembers,
  getHomepageProjects,
  getHomepageAlumni,
  getFeaturedPublications,
  getPartners,
  getLatestNews,
} from '@/lib/strapi';
import type {
  ResearchLineFlat,
  FacultyMemberFlat,
  ProjectFlat,
  AlumnusFlat,
  PublicationFlat,
  PartnerFlat,
  NewsItemFlat,
} from '@/types/strapi';
import Hero from '@/components/sections/Hero';
import ResearchLines from '@/components/sections/ResearchLines';
import { FadeIn } from '@/components/effects/FadeIn';
import FacultyCard from '@/components/cards/FacultyCard';
import ProjectCard from '@/components/cards/ProjectCard';
import PublicationCard from '@/components/cards/PublicationCard';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { getSectorColors } from '@/styles/utils';

export default async function Home() {
  // Fetch data from Strapi
  let researchLines: ResearchLineFlat[] = [];
  let facultyMembers: FacultyMemberFlat[] = [];
  let projects: ProjectFlat[] = [];
  let alumni: AlumnusFlat[] = [];
  let publications: PublicationFlat[] = [];
  let partners: PartnerFlat[] = [];
  let news: NewsItemFlat[] = [];

  try {
    [researchLines, facultyMembers, projects, alumni, publications, partners, news] =
      await Promise.all([
        getResearchLines(),
        getHomepageFacultyMembers(),
        getHomepageProjects(),
        getHomepageAlumni(),
        getFeaturedPublications(),
        getPartners(),
        getLatestNews(3),
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
              <AnimatedCounter
                end={200}
                suffix="+"
                duration={2000}
                className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech"
                label="publicações"
                labelClassName="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech"
              />
            </FadeIn>
            <FadeIn delay={100} className="text-center">
              <AnimatedCounter
                end={450}
                suffix="+"
                duration={2000}
                delay={200}
                className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech"
                label="citações"
                labelClassName="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech"
              />
            </FadeIn>
            <FadeIn delay={200} className="text-center">
              <AnimatedCounter
                end={25}
                suffix="+"
                duration={2000}
                delay={400}
                className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech"
                label="mestres formados"
                labelClassName="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech"
              />
            </FadeIn>
            <FadeIn delay={300} className="text-center">
              <AnimatedCounter
                end={6}
                suffix="+"
                duration={2000}
                delay={600}
                className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech"
                label="parcerias internac."
                labelClassName="text-ufam-secondary text-xs md:text-sm font-medium lowercase tracking-wider font-tech"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Research Lines with Horizontal Scroll */}
      <ResearchLines researchLines={researchLines} />

      {/* Projects Section - Issue #62 */}
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
              <p className="text-ufam-secondary mt-2 max-w-xl">
                Projetos de pesquisa financiados por agências nacionais e internacionais.
              </p>
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
              projects.slice(0, 6).map((project, index) => (
                <FadeIn key={project.id} delay={index * 100}>
                  <ProjectCard project={project} index={index} />
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

      {/* Team Section - Issue #61 */}
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
              <p className="text-ufam-secondary mt-2 max-w-xl">
                Pesquisadores com formação em universidades de excelência mundial.
              </p>
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
                  <FacultyCard member={member} index={index} />
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

                    {alum.currentSector &&
                      (() => {
                        const sectorColors = getSectorColors(alum.currentSector);
                        return (
                          <span
                            className={`text-xs font-tech px-2 py-1 rounded mt-3 inline-block ${sectorColors.bg} ${sectorColors.text}`}
                          >
                            {alum.currentSector.toLowerCase()}
                          </span>
                        );
                      })()}
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
      <section className="py-24 relative z-10">
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
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {partners.length > 0 ? (
              partners.slice(0, 6).map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  {partner.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-white/50 font-tech text-lg group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  )}
                  <span className="text-xs text-ufam-secondary/50 group-hover:text-ufam-secondary transition-colors">
                    {partner.country}
                  </span>
                </a>
              ))
            ) : (
              <p className="text-ufam-secondary">Conecte ao Strapi para ver os parceiros.</p>
            )}
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

      {/* Publications Section - Issue #63 */}
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
              <p className="text-ufam-secondary mt-2 max-w-xl">
                Artigos publicados em periódicos e conferências de alto impacto.
              </p>
            </div>
            <Link
              href="/publications"
              className="group inline-flex items-center gap-2 text-ufam-primary font-tech text-sm hover:text-ufam-light transition-colors lowercase"
            >
              ver todas as publicações
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <div className="space-y-4">
            {publications.length > 0 ? (
              publications.slice(0, 5).map((publication, index) => (
                <FadeIn key={publication.id} delay={index * 100}>
                  <PublicationCard publication={publication} index={index} />
                </FadeIn>
              ))
            ) : (
              <FadeIn className="text-center py-12">
                <p className="text-ufam-secondary">Conecte ao Strapi para ver as publicações.</p>
              </FadeIn>
            )}
          </div>

          {/* Google Scholar Link */}
          <FadeIn delay={600} className="text-center mt-8">
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-tech text-ufam-secondary hover:text-white border-b border-transparent hover:border-ufam-primary transition-all lowercase"
            >
              ver todas no google scholar →
            </a>
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

          {news.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <FadeIn key={item.id} delay={index * 100}>
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="group block bg-ufam-dark border border-white/5 rounded overflow-hidden hover:border-ufam-primary/30 transition-all"
                  >
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-ufam-primary/20 to-ufam-dark" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-tech text-ufam-primary lowercase">
                          {item.category}
                        </span>
                        <span className="text-xs text-ufam-secondary">
                          {item.publishDate &&
                            new Date(item.publishDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h4 className="font-tech font-bold text-white group-hover:text-ufam-light transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-sm text-ufam-secondary mt-2 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn className="text-center py-12 text-ufam-secondary">
              <p>Conecte ao Strapi para ver as notícias.</p>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
