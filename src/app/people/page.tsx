import { Metadata } from 'next';
import {
  getFacultyMembers,
  getPeoplePageSettings,
  getHomepageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import type { FacultyMemberFlat } from '@/types/strapi';
import FacultyCard from '@/components/cards/FacultyCard';
import { FadeIn } from '@/components/effects/FadeIn';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// ============================================
// Dynamic SEO Metadata
// ============================================

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPeoplePageSettings();
  const homepageSettings = await getHomepageSettings();
  const seo = settings?.seo;

  const title = seo?.metaTitle || 'Equipe | e-Controls';
  const description =
    seo?.metaDescription || 'Conheça os pesquisadores do grupo e-Controls da UFAM.';

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

export default async function PeoplePage() {
  let facultyMembers: FacultyMemberFlat[] = [];
  let pageSettings = null;

  try {
    [facultyMembers, pageSettings] = await Promise.all([
      getFacultyMembers({ filters: { isActive: { $eq: true } } }),
      getPeoplePageSettings(),
    ]);
  } catch (error) {
    console.error('Error fetching people page data:', error);
  }

  // Group by role
  const leaders = facultyMembers.filter((m) => m.role === 'Líder' || m.role === 'Co-líder');
  const researchers = facultyMembers.filter(
    (m) => m.role === 'Pesquisador Permanente' || m.role === 'Pesquisador Colaborador'
  );
  const postdocs = facultyMembers.filter((m) => m.role === 'Pós-Doc');

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Nossa Equipe';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Conheça os pesquisadores, professores e colaboradores que integram o grupo e-Controls.';

  const leadersSection = pageSettings?.leadersSection || {
    label: '/// liderança',
    title: 'Líderes do Grupo',
    description: '',
  };

  const researchersSection = pageSettings?.researchersSection || {
    label: '/// pesquisadores',
    title: 'Pesquisadores Permanentes',
    description: '',
  };

  const postdocsSection = pageSettings?.postdocsSection || {
    label: '/// pós-doutorandos',
    title: 'Pós-Doutorandos',
    description: '',
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

      {/* Leaders Section */}
      {leaders.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {leadersSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                {leadersSection.title}
              </h3>
              {leadersSection.description && (
                <p className="text-ufam-secondary mb-8">{leadersSection.description}</p>
              )}
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
                {researchersSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                {researchersSection.title}
              </h3>
              {researchersSection.description && (
                <p className="text-ufam-secondary mb-8">{researchersSection.description}</p>
              )}
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
                {postdocsSection.label}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                {postdocsSection.title}
              </h3>
              {postdocsSection.description && (
                <p className="text-ufam-secondary mb-8">{postdocsSection.description}</p>
              )}
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
