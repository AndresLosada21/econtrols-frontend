import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getHomepageSettings, getResearchLines, getHomepageFacultyMembers } from '@/lib/strapi';
import type {
  ResearchLineFlat,
  FacultyMemberFlat,
  HomepageSettingAttributes,
} from '@/types/strapi';

export default async function Home() {
  // Fetch data from Strapi
  let homepageSettings: HomepageSettingAttributes | null = null;
  let researchLines: ResearchLineFlat[] = [];
  let facultyMembers: FacultyMemberFlat[] = [];

  try {
    [homepageSettings, researchLines, facultyMembers] = await Promise.all([
      getHomepageSettings(),
      getResearchLines(),
      getHomepageFacultyMembers(),
    ]);
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-ufam-bg z-0"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-6 overflow-hidden">
            <p className="font-tech text-ufam-light text-sm md:text-base tracking-[0.2em]">
              :: UNIVERSIDADE FEDERAL DO AMAZONAS ::
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-none font-tech uppercase">
            <span className="block text-ufam-primary">e-Controls</span>
            <span className="block gradient-text">Research Group</span>
          </h1>

          <p className="text-ufam-secondary text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            {homepageSettings?.tagline || 'Excelência em Controle de Sistemas na Amazônia'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#about"
              className="group inline-flex items-center justify-center gap-2 bg-ufam-primary text-white font-tech tracking-wider font-bold px-8 py-4 rounded hover:bg-ufam-light hover:text-ufam-dark transition-all"
            >
              CONHEÇA O GRUPO
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#publications"
              className="inline-flex items-center justify-center gap-2 text-white font-tech tracking-wider font-bold px-8 py-4 rounded border border-white/20 hover:border-ufam-light hover:text-ufam-light transition-all"
            >
              VER PUBLICAÇÕES
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="font-tech text-[10px] tracking-widest text-ufam-secondary">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-ufam-primary to-transparent"></div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
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
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 relative bg-ufam-dark z-10 border-y border-ufam-secondary/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                200+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Publicações
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                450+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Citações
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                25+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Mestres Formados
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-ufam-primary mb-2 font-tech">
                6+
              </div>
              <p className="text-ufam-secondary text-xs md:text-sm font-medium uppercase tracking-wider font-tech">
                Parcerias Internac.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Lines Preview */}
      <section id="research" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// PESQUISA'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
              Linhas de Pesquisa
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchLines.length > 0 ? (
              researchLines.slice(0, 6).map((line, index) => (
                <div
                  key={line.id}
                  className="bg-ufam-dark border border-white/10 p-6 rounded hover:border-ufam-primary/50 transition-all group"
                >
                  <span className="text-xs font-tech text-ufam-secondary mb-4 block">
                    ÁREA #{String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-ufam-light transition-colors font-tech">
                    {line.title}
                  </h4>
                  <p className="text-ufam-secondary text-sm">{line.shortDescription}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-ufam-secondary">
                  Conecte ao Strapi para ver as linhas de pesquisa.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section id="team" className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
              {'/// EQUIPE'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
              Liderança Acadêmica
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facultyMembers.length > 0 ? (
              facultyMembers.slice(0, 4).map((member) => (
                <div key={member.id} className="group text-center">
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
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-ufam-secondary">
                  Conecte ao Strapi para ver os membros da equipe.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Placeholder sections */}
      <section id="projects" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
            {'/// PROJETOS'}
          </h2>
          <h3 className="text-3xl font-bold text-white font-tech mb-8">
            Pesquisa & Desenvolvimento
          </h3>
          <p className="text-ufam-secondary">Seção de projetos será implementada na Sprint 3.</p>
        </div>
      </section>

      <section id="tools" className="py-24 bg-ufam-dark border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
            {'/// SOFTWARE'}
          </h2>
          <h3 className="text-3xl font-bold text-white font-tech mb-8">Ferramentas Open-Source</h3>
          <p className="text-ufam-secondary">Seção de ferramentas será implementada na Sprint 4.</p>
        </div>
      </section>

      <section id="publications" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest">
            {'/// CIÊNCIA'}
          </h2>
          <h3 className="text-3xl font-bold text-white font-tech mb-8">Publicações Recentes</h3>
          <p className="text-ufam-secondary">Seção de publicações será implementada na Sprint 3.</p>
        </div>
      </section>
    </>
  );
}
