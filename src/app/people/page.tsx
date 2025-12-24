import { getFacultyMembers } from '@/lib/strapi';
import type { FacultyMemberFlat } from '@/types/strapi';
import FacultyCard from '@/components/cards/FacultyCard';
import { FadeIn } from '@/components/effects/FadeIn';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Equipe | e-Controls',
  description: 'Conheça os pesquisadores do grupo e-Controls da UFAM.',
};

export default async function PeoplePage() {
  let facultyMembers: FacultyMemberFlat[] = [];

  try {
    facultyMembers = await getFacultyMembers({
      filters: { isActive: { $eq: true } },
    });
  } catch (error) {
    console.error('Error fetching faculty members:', error);
  }

  // Group by role
  const leaders = facultyMembers.filter((m) => m.role === 'Líder' || m.role === 'Co-líder');
  const researchers = facultyMembers.filter(
    (m) => m.role === 'Pesquisador Permanente' || m.role === 'Pesquisador Colaborador'
  );
  const postdocs = facultyMembers.filter((m) => m.role === 'Pós-Doc');

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      <section className="py-16 border-b border-white/5">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-tech mb-4">Equipe</h1>
            <p className="text-ufam-secondary max-w-2xl">
              Pesquisadores com formação em universidades de excelência mundial, dedicados ao avanço
              da teoria de controle e suas aplicações.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Leaders Section */}
      {leaders.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// liderança'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Coordenação do Grupo
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((member, index) => (
                <FadeIn key={member.id} delay={index * 100}>
                  <FacultyCard member={member} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Researchers Section */}
      {researchers.length > 0 && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// pesquisadores'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Pesquisadores Permanentes
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {researchers.map((member, index) => (
                <FadeIn key={member.id} delay={index * 100}>
                  <FacultyCard member={member} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Post-docs Section */}
      {postdocs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// pós-doutorado'}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                Pesquisadores Pós-Doc
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {postdocs.map((member, index) => (
                <FadeIn key={member.id} delay={index * 100}>
                  <FacultyCard member={member} index={index} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alumni Link */}
      <section className="py-16 bg-ufam-dark border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h3 className="text-2xl font-bold text-white font-tech mb-4">Egressos</h3>
            <p className="text-ufam-secondary mb-6 max-w-xl mx-auto">
              Conheça os mestres e doutores formados pelo grupo e-Controls e suas trajetórias
              profissionais.
            </p>
            <Link
              href="/people/alumni"
              className="inline-flex items-center gap-2 bg-ufam-primary text-white px-6 py-3 rounded font-tech text-sm hover:bg-ufam-primary/80 transition-colors lowercase"
            >
              ver egressos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Empty State */}
      {facultyMembers.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">Conecte ao Strapi para ver a equipe.</p>
          </div>
        </section>
      )}
    </main>
  );
}
