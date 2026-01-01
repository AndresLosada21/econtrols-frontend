import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Beaker,
  Code,
  GraduationCap,
  Briefcase,
  Trophy,
  UserCheck,
  Globe,
  Info,
} from 'lucide-react';
import {
  getFacultyMemberBySlug,
  getFacultyMembers,
  getPeopleDetailedPageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import { FadeIn } from '@/components/effects/FadeIn';

// Social Icons
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GoogleScholarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5 12 0z" />
    </svg>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
  );
}

function LattesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1 4v8h2V6h-2zm0 10v2h2v-2h-2z" />
    </svg>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getFacultyMemberBySlug(slug);

  if (!member) {
    return {
      title: 'Pesquisador não encontrado | e-Controls',
    };
  }

  const seo = member.seo;
  const title = seo?.metaTitle || `${member.displayName} | e-Controls`;
  const description =
    seo?.metaDescription ||
    member.shortBio ||
    `${member.displayName} - ${member.memberRole.name} no grupo e-Controls da UFAM.`;

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
      type: (seo?.ogType as 'profile') || 'profile',
      locale: seo?.ogLocale || 'pt_BR',
      images: seo?.ogImage?.data?.attributes?.url
        ? [{ url: getStrapiMediaUrl(seo.ogImage.data.attributes.url) || '' }]
        : member.photoUrl
          ? [{ url: member.photoUrl }]
          : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary',
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

export async function generateStaticParams() {
  try {
    const members = await getFacultyMembers();
    return members
      .filter((member) => member.slug)
      .map((member) => ({
        slug: member.slug!,
      }));
  } catch {
    return [];
  }
}

export default async function FacultyMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const [member, detailSettings] = await Promise.all([
    getFacultyMemberBySlug(slug),
    getPeopleDetailedPageSettings(),
  ]);

  if (!member) {
    notFound();
  }

  // Get labels with comprehensive fallbacks
  const labels = {
    backButtonText: detailSettings?.backButtonText || 'voltar para equipe',
    bioLabel: detailSettings?.bioLabel || '/// biografia',
    bioTitle: detailSettings?.bioTitle || 'Sobre',
    contactsLabel: detailSettings?.contactsLabel || '/// contatos',
    contactsTitle: detailSettings?.contactsTitle || 'Informações de Contato',
    metricsLabel: detailSettings?.metricsLabel || '/// métricas',
    metricsTitle: detailSettings?.metricsTitle || 'Métricas de Impacto',
    hIndexTooltip:
      detailSettings?.hIndexTooltip || 'Índice H: mede produtividade e impacto das publicações',
    citationsLabel: detailSettings?.citationsLabel || 'Citações',
    publicationsCountLabel: detailSettings?.publicationsCountLabel || 'Publicações',
    educationLabel: detailSettings?.educationLabel || '/// formação',
    educationTitle: detailSettings?.educationTitle || 'Formação Acadêmica',
    researchLinesLabel: detailSettings?.researchLinesLabel || '/// atuação',
    researchLinesTitle: detailSettings?.researchLinesTitle || 'Linhas de Pesquisa',
    projectsLabel: detailSettings?.projectsLabel || '/// projetos',
    projectsTitle: detailSettings?.projectsTitle || 'Projetos de Pesquisa',
    coordinatedProjectsLabel: detailSettings?.coordinatedProjectsLabel || 'Coordenados',
    participatingProjectsLabel: detailSettings?.participatingProjectsLabel || 'Participante',
    publicationsLabel: detailSettings?.publicationsLabel || '/// publicações',
    publicationsTitle: detailSettings?.publicationsTitle || 'Produção Científica',
    publicationsEmptyState:
      detailSettings?.publicationsEmptyState || 'Nenhuma publicação cadastrada.',
    adviseesLabel: detailSettings?.adviseesLabel || '/// orientações',
    adviseesTitle: detailSettings?.adviseesTitle || 'Orientações',
    currentAdviseesLabel: detailSettings?.currentAdviseesLabel || 'Em Andamento',
    completedAdviseesLabel: detailSettings?.completedAdviseesLabel || 'Concluídas',
    expectedDefenseLabel: detailSettings?.expectedDefenseLabel || 'Defesa prevista',
    currentPositionLabel: detailSettings?.currentPositionLabel || 'Posição atual',
    teachingLabel: detailSettings?.teachingLabel || '/// ensino',
    teachingTitle: detailSettings?.teachingTitle || 'Disciplinas Ministradas',
    graduateCoursesLabel: detailSettings?.graduateCoursesLabel || 'Graduação',
    postgraduateCoursesLabel: detailSettings?.postgraduateCoursesLabel || 'Pós-Graduação',
    awardsLabel: detailSettings?.awardsLabel || '/// prêmios',
    awardsTitle: detailSettings?.awardsTitle || 'Prêmios e Distinções',
    issuerLabel: detailSettings?.issuerLabel || 'Instituição',
    institutionalLabel: detailSettings?.institutionalLabel || '/// posições',
    institutionalTitle: detailSettings?.institutionalTitle || 'Posições Institucionais',
    collaborationsLabel: detailSettings?.collaborationsLabel || '/// colaborações',
    collaborationsTitle: detailSettings?.collaborationsTitle || 'Colaborações Internacionais',
    viewProfileLabel: detailSettings?.viewProfileLabel || 'Ver perfil completo',
    websiteLabel: detailSettings?.websiteLabel || 'Website',
  };

  // Helper to check if section should be visible
  const showSection = (sectionName: keyof typeof member, hasContent: boolean) => {
    const toggleKey =
      `show${sectionName.charAt(0).toUpperCase()}${sectionName.slice(1)}` as keyof typeof member;
    const toggle = member[toggleKey];
    return hasContent && (toggle === undefined || toggle === true);
  };

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors font-tech text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.backButtonText}
        </Link>
      </div>

      {/* Header Section */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Photo */}
            <FadeIn className="md:col-span-1">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-ufam-dark border-b-4 border-ufam-primary">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.displayName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
                    <span className="text-8xl font-tech text-ufam-primary/50">
                      {member.displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Info */}
            <FadeIn delay={100} className="md:col-span-2">
              {/* Role Badge - usando cores dinâmicas da taxonomia */}
              <span
                className={`inline-block font-tech text-xs px-3 py-1 rounded mb-4 lowercase border ${member.memberRole.color}`}
              >
                {member.memberRole.name}
              </span>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-tech mb-2">
                {member.fullName}
              </h1>

              {/* Specialization Areas */}
              {member.specializationAreas && member.specializationAreas.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.specializationAreas.map((area: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs font-tech text-ufam-secondary bg-white/5 px-2 py-1 rounded"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              {/* Short Bio */}
              {member.shortBio && (
                <p className="text-ufam-secondary leading-relaxed mb-6">{member.shortBio}</p>
              )}

              {/* Academic Metrics */}
              {(member.hIndex || member.totalPublications || member.googleScholarCitations) && (
                <div>
                  <h3 className="font-tech text-ufam-primary text-xs mb-3 tracking-widest lowercase">
                    {labels.metricsLabel}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {member.hIndex && (
                      <div className="bg-ufam-dark p-4 rounded border border-white/5 group relative">
                        <Award className="w-5 h-5 text-ufam-primary mb-2" />
                        <span className="text-2xl font-bold text-white font-tech">
                          {member.hIndex}
                        </span>
                        <p className="text-xs text-ufam-secondary font-tech">h-index</p>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-ufam-dark border border-ufam-primary/50 rounded text-xs text-ufam-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <Info className="w-3 h-3 inline mr-1 text-ufam-primary" />
                          {labels.hIndexTooltip}
                        </div>
                      </div>
                    )}
                    {member.totalPublications && (
                      <div className="bg-ufam-dark p-4 rounded border border-white/5">
                        <BookOpen className="w-5 h-5 text-ufam-primary mb-2" />
                        <span className="text-2xl font-bold text-white font-tech">
                          {member.totalPublications}
                        </span>
                        <p className="text-xs text-ufam-secondary font-tech lowercase">
                          {labels.publicationsCountLabel}
                        </p>
                      </div>
                    )}
                    {member.googleScholarCitations && (
                      <div className="bg-ufam-dark p-4 rounded border border-white/5">
                        <Users className="w-5 h-5 text-ufam-primary mb-2" />
                        <span className="text-2xl font-bold text-white font-tech">
                          {member.googleScholarCitations}
                        </span>
                        <p className="text-xs text-ufam-secondary font-tech lowercase">
                          {labels.citationsLabel}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Phone */}
              <div>
                <h3 className="font-tech text-ufam-primary text-xs mb-3 tracking-widest lowercase">
                  {labels.contactsLabel}
                </h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-ufam-secondary hover:text-ufam-primary transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <span className="inline-flex items-center gap-2 text-ufam-secondary text-sm">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Academic & Social Links */}
              <div className="flex flex-wrap gap-3">
                {member.googleScholarUrl && (
                  <a
                    href={member.googleScholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <GoogleScholarIcon className="w-4 h-4" />
                    Google Scholar
                  </a>
                )}
                {member.lattesUrl && (
                  <a
                    href={member.lattesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <LattesIcon className="w-4 h-4" />
                    Lattes
                  </a>
                )}
                {member.orcidUrl && (
                  <a
                    href={member.orcidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <OrcidIcon className="w-4 h-4" />
                    ORCID
                  </a>
                )}
                {member.researchGateUrl && (
                  <a
                    href={member.researchGateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    ResearchGate
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {member.personalWebsite && (
                  <a
                    href={member.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all text-sm text-ufam-secondary hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {labels.websiteLabel}
                  </a>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Biography */}
      {showSection('biography' as any, !!member.biography) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.bioLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">{labels.bioTitle}</h3>
            </FadeIn>

            <FadeIn delay={100}>
              <div
                className="prose prose-invert max-w-none text-ufam-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.biography! }}
              />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Academic Formation */}
      {showSection(
        'education' as any,
        !!(member.academicFormation && member.academicFormation.length > 0)
      ) && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.educationLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.educationTitle}
              </h3>
            </FadeIn>

            <div className="space-y-6">
              {member.academicFormation?.map((edu, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-ufam-bg p-6 rounded border border-white/5">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-6 h-6 text-ufam-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                        <p className="text-ufam-secondary mb-2">{edu.institution}</p>
                        <div className="flex items-center gap-4 text-xs text-ufam-secondary">
                          {edu.year && <span className="text-ufam-primary">{edu.year}</span>}
                          {edu.field && <span>{edu.field}</span>}
                          {edu.details && <span>{edu.details}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Lines */}
      {showSection(
        'researchLines' as any,
        !!(member.researchLines && member.researchLines.length > 0)
      ) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.researchLinesLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.researchLinesTitle}
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {member.researchLines?.map((line, index) => (
                <FadeIn key={line.id} delay={index * 100}>
                  <Link
                    href={`/research/${line.slug}`}
                    className="group block bg-ufam-dark p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all"
                  >
                    <Beaker className="w-8 h-8 text-ufam-primary mb-4" />
                    <h4 className="text-lg font-bold text-white font-tech group-hover:text-ufam-light transition-colors mb-2">
                      {line.title}
                    </h4>
                    <p className="text-sm text-ufam-secondary line-clamp-2">
                      {line.shortDescription}
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects - Separated by Coordinator/Participant */}
      {showSection(
        'projects' as any,
        !!(member.coordinatedProjects || member.participatingProjects)
      ) && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.projectsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.projectsTitle}
              </h3>
            </FadeIn>

            {/* Coordinated Projects */}
            {member.coordinatedProjects && member.coordinatedProjects.length > 0 && (
              <div className="mb-12">
                <FadeIn>
                  <h4 className="text-lg font-bold text-white font-tech mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-ufam-primary" />
                    {labels.coordinatedProjectsLabel}
                  </h4>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-6">
                  {member.coordinatedProjects.map((project, index) => (
                    <FadeIn key={project.id} delay={index * 100}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block bg-ufam-bg p-6 rounded border border-ufam-primary/20 hover:border-ufam-primary/50 transition-all group"
                      >
                        <h5 className="text-white font-bold mb-2 group-hover:text-ufam-light transition-colors">
                          {project.title}
                        </h5>
                        <p className="text-sm text-ufam-secondary line-clamp-2">
                          {project.shortDescription}
                        </p>
                        {project.projectStatus && (
                          <span
                            className={`inline-block mt-3 text-xs px-2 py-1 rounded border ${project.projectStatus.color}`}
                          >
                            {project.projectStatus.name}
                          </span>
                        )}
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}

            {/* Participating Projects */}
            {member.participatingProjects && member.participatingProjects.length > 0 && (
              <div>
                <FadeIn>
                  <h4 className="text-lg font-bold text-white font-tech mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-ufam-primary" />
                    {labels.participatingProjectsLabel}
                  </h4>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-6">
                  {member.participatingProjects.map((project, index) => (
                    <FadeIn key={project.id} delay={index * 100}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block bg-ufam-bg p-6 rounded border border-white/5 hover:border-ufam-primary/30 transition-all group"
                      >
                        <h5 className="text-white font-bold mb-2 group-hover:text-ufam-light transition-colors">
                          {project.title}
                        </h5>
                        <p className="text-sm text-ufam-secondary line-clamp-2">
                          {project.shortDescription}
                        </p>
                        {project.projectStatus && (
                          <span
                            className={`inline-block mt-3 text-xs px-2 py-1 rounded border ${project.projectStatus.color}`}
                          >
                            {project.projectStatus.name}
                          </span>
                        )}
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Publications */}
      {showSection(
        'publications' as any,
        !!(member.publications && member.publications.length > 0)
      ) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.publicationsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.publicationsTitle}
              </h3>
            </FadeIn>

            {member.publications && member.publications.length > 0 ? (
              <>
                <div className="space-y-4">
                  {member.publications.slice(0, 10).map((pub, index) => (
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
                              <p className="text-xs text-ufam-secondary lowercase">
                                {labels.citationsLabel}
                              </p>
                            </div>
                          )}
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>

                {member.publications.length > 10 && (
                  <FadeIn delay={500}>
                    <div className="text-center mt-8">
                      <Link
                        href="/publications"
                        className="inline-flex items-center gap-2 text-ufam-primary hover:text-ufam-light transition-colors font-tech text-sm"
                      >
                        {labels.viewProfileLabel}
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </FadeIn>
                )}
              </>
            ) : (
              <p className="text-ufam-secondary text-center py-8">
                {labels.publicationsEmptyState}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Advisees (Orientações) */}
      {showSection(
        'advisees' as any,
        !!(member.currentGraduateAdvisees || member.completedAdvisees)
      ) && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.adviseesLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.adviseesTitle}
              </h3>
            </FadeIn>

            {/* Current Advisees */}
            {member.currentGraduateAdvisees && member.currentGraduateAdvisees.length > 0 && (
              <div className="mb-12">
                <FadeIn>
                  <h4 className="text-lg font-bold text-white font-tech mb-6 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-ufam-primary" />
                    {labels.currentAdviseesLabel}
                  </h4>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-6">
                  {member.currentGraduateAdvisees.map((advisee, index) => (
                    <FadeIn key={index} delay={index * 100}>
                      <div className="bg-ufam-bg p-6 rounded border border-white/5">
                        <h5 className="text-white font-bold mb-1">{advisee.name}</h5>
                        <p className="text-sm text-ufam-secondary mb-3">
                          {advisee.topic || 'Sem tema definido'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-ufam-secondary">
                          <span className="text-ufam-primary">{advisee.level}</span>
                          {advisee.year && (
                            <span>
                              {labels.expectedDefenseLabel}: {advisee.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Advisees */}
            {member.completedAdvisees && member.completedAdvisees.length > 0 && (
              <div>
                <FadeIn>
                  <h4 className="text-lg font-bold text-white font-tech mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-ufam-primary" />
                    {labels.completedAdviseesLabel}
                  </h4>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-6">
                  {member.completedAdvisees.map((advisee, index) => (
                    <FadeIn key={index} delay={index * 100}>
                      <div className="bg-ufam-bg p-6 rounded border border-white/5">
                        <h5 className="text-white font-bold mb-1">{advisee.name}</h5>
                        <p className="text-sm text-ufam-secondary mb-3">
                          {advisee.title || 'Sem título'}
                        </p>
                        <div className="flex flex-col gap-2 text-xs text-ufam-secondary">
                          <div className="flex items-center gap-4">
                            <span className="text-ufam-primary">{advisee.level}</span>
                            {advisee.year && <span>{advisee.year}</span>}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Teaching */}
      {showSection(
        'teaching' as any,
        !!(member.teachingGraduate || member.teachingPostgraduate)
      ) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.teachingLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.teachingTitle}
              </h3>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Graduate Courses */}
              {member.teachingGraduate &&
                Array.isArray(member.teachingGraduate) &&
                member.teachingGraduate.length > 0 && (
                  <FadeIn delay={100}>
                    <div>
                      <h4 className="text-lg font-bold text-white font-tech mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-ufam-primary" />
                        {labels.graduateCoursesLabel}
                      </h4>
                      <ul className="space-y-3">
                        {member.teachingGraduate.map((course: string, index: number) => (
                          <li
                            key={index}
                            className="text-ufam-secondary pl-4 border-l-2 border-ufam-primary/30"
                          >
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                )}

              {/* Postgraduate Courses */}
              {member.teachingPostgraduate &&
                Array.isArray(member.teachingPostgraduate) &&
                member.teachingPostgraduate.length > 0 && (
                  <FadeIn delay={200}>
                    <div>
                      <h4 className="text-lg font-bold text-white font-tech mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-ufam-primary" />
                        {labels.postgraduateCoursesLabel}
                      </h4>
                      <ul className="space-y-3">
                        {member.teachingPostgraduate.map((course: string, index: number) => (
                          <li
                            key={index}
                            className="text-ufam-secondary pl-4 border-l-2 border-ufam-primary/30"
                          >
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Awards and Distinctions */}
      {showSection(
        'awards' as any,
        !!(member.awardsDistinctions && member.awardsDistinctions.length > 0)
      ) && (
        <section className="py-16 bg-ufam-dark">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.awardsLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">{labels.awardsTitle}</h3>
            </FadeIn>

            <div className="space-y-6">
              {member.awardsDistinctions?.map((award, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-ufam-bg p-6 rounded border border-white/5">
                    <div className="flex items-start gap-4">
                      <Trophy className="w-6 h-6 text-ufam-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{award.title}</h4>
                        {award.event && (
                          <p className="text-sm text-ufam-secondary mb-2">
                            {labels.issuerLabel}: {award.event}
                          </p>
                        )}
                        {award.year && (
                          <span className="text-xs text-ufam-primary">{award.year}</span>
                        )}
                        {award.description && (
                          <p className="text-xs text-ufam-secondary mt-1 italic">
                            {award.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institutional Positions */}
      {showSection(
        'institutionalPositions' as any,
        !!(
          member.institutionalPositions &&
          Array.isArray(member.institutionalPositions) &&
          member.institutionalPositions.length > 0
        )
      ) && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {labels.institutionalLabel}
              </h2>
              <h3 className="text-2xl font-bold text-white font-tech mb-8">
                {labels.institutionalTitle}
              </h3>
            </FadeIn>

            <div className="space-y-4">
              {member.institutionalPositions?.map((position: string, index: number) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-ufam-dark p-6 rounded border border-white/5">
                    <div className="flex items-start gap-4">
                      <Briefcase className="w-6 h-6 text-ufam-primary flex-shrink-0 mt-1" />
                      <p className="flex-1 text-ufam-secondary">{position}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* International Collaborations */}
      {showSection('collaborations' as any, !!member.internationalCollaborations) && (
        <section className="py-16 bg-ufam-dark">
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
              <div className="bg-ufam-bg p-8 rounded border border-white/5">
                <Globe className="w-8 h-8 text-ufam-primary mb-4" />
                <div
                  className="prose prose-invert max-w-none text-ufam-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.internationalCollaborations! }}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </main>
  );
}
