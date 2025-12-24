import { getResearchLines, getHomepageFacultyMembers } from '@/lib/strapi';
import type { ResearchLineFlat, FacultyMemberFlat } from '@/types/strapi';
import Hero from '@/components/sections/Hero';
import ResearchLines from '@/components/sections/ResearchLines';
import { FadeIn } from '@/components/effects/FadeIn';

export default async function Home() {
  // Fetch data from Strapi
  let researchLines: ResearchLineFlat[] = [];
  let facultyMembers: FacultyMemberFlat[] = [];

  try {
    [researchLines, facultyMembers] = await Promise.all([
      getResearchLines(),
      getHomepageFacultyMembers(),
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
            <h2 className="font-tech text-ufam-primary text-sm mb-4 tracking-widest">
              {'/// SOBRE O GRUPO'}
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
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Publicações
              </p>
            </FadeIn>
            <FadeIn delay={100} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                450+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Citações
              </p>
            </FadeIn>
            <FadeIn delay={200} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                25+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Mestres Formados
              </p>
            </FadeIn>
            <FadeIn delay={300} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                6+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Parcerias Internac.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Research Lines with Horizontal Scroll */}
      <ResearchLines researchLines={researchLines} />

      {/* Team Preview */}
      <section id="team" className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// EQUIPE'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
              Liderança Acadêmica
            </h3>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facultyMembers.length > 0 ? (
              facultyMembers.slice(0, 4).map((member, index) => (
                <FadeIn key={member.id} delay={index * 100} className="group text-center">
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
                      <span className="text-white font-tech text-xs bg-black/50 px-2 py-1 rounded backdrop-blur border border-white/20">
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

      {/* Placeholder sections */}
      <section id="projects" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// PROJETOS'}
            </h2>
            <h3 className="text-3xl font-bold text-white font-tech mb-8">
              Pesquisa & Desenvolvimento
            </h3>
            <p className="text-ufam-secondary">Seção de projetos será implementada na Sprint 3.</p>
          </FadeIn>
        </div>
      </section>

      <section id="tools" className="py-24 bg-ufam-dark border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// SOFTWARE'}
            </h2>
            <h3 className="text-3xl font-bold text-white font-tech mb-8">
              Ferramentas Open-Source
            </h3>
            <p className="text-ufam-secondary">
              Seção de ferramentas será implementada na Sprint 4.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="publications" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// CIÊNCIA'}
            </h2>
            <h3 className="text-3xl font-bold text-white font-tech mb-8">Publicações Recentes</h3>
            <p className="text-ufam-secondary">
              Seção de publicações será implementada na Sprint 3.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
