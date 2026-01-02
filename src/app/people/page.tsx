import { Metadata } from 'next';
import {
  getFacultyMembers,
  getMemberRoles,
  getPeoplePageSettings,
  getHomepageSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';
import type { FacultyMemberFlat, MemberRoleFlat } from '@/types/strapi';
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

// ============================================
// Helper: Group members by role with section info
// ============================================

interface RoleSection {
  role: MemberRoleFlat;
  members: FacultyMemberFlat[];
  sectionTitle: string;
  sectionDescription?: string;
  label: string;
}

function groupMembersByRole(members: FacultyMemberFlat[], roles: MemberRoleFlat[]): RoleSection[] {
  // Sort roles by displayOrder
  const sortedRoles = [...roles].sort((a, b) => a.displayOrder - b.displayOrder);

  // Group members by role, combining roles with same sectionTitle
  const sectionMap = new Map<string, RoleSection>();

  for (const role of sortedRoles) {
    if (role.showInListing === false) continue;

    const sectionKey = role.sectionTitle || role.name;
    const roleMembers = members.filter((m) => m.memberRole.id === role.id);

    if (roleMembers.length === 0) continue;

    if (sectionMap.has(sectionKey)) {
      // Add members to existing section
      const existingSection = sectionMap.get(sectionKey)!;
      existingSection.members.push(...roleMembers);
    } else {
      // Create new section
      sectionMap.set(sectionKey, {
        role,
        members: roleMembers,
        sectionTitle: role.sectionTitle || role.name,
        sectionDescription: role.sectionDescription,
        label: `/// ${(role.sectionTitle || role.name).toLowerCase()}`,
      });
    }
  }

  // Convert to array and sort members within each section
  return Array.from(sectionMap.values()).map((section) => ({
    ...section,
    members: section.members.sort((a, b) => {
      // Sort by displayOrder first, then by name
      const orderDiff = (a.displayOrder || 0) - (b.displayOrder || 0);
      if (orderDiff !== 0) return orderDiff;
      return a.fullName.localeCompare(b.fullName);
    }),
  }));
}

export default async function PeoplePage() {
  let facultyMembers: FacultyMemberFlat[] = [];
  let memberRoles: MemberRoleFlat[] = [];
  let pageSettings = null;

  try {
    [facultyMembers, memberRoles, pageSettings] = await Promise.all([
      getFacultyMembers({ filters: { isActive: { $eq: true } } }),
      getMemberRoles(),
      getPeoplePageSettings(),
    ]);
  } catch (error) {
    console.error('Error fetching people page data:', error);
  }

  // Group members by role dynamically
  const roleSections = groupMembersByRole(facultyMembers, memberRoles);

  // Get dynamic content with fallbacks
  const pageTitle = pageSettings?.pageTitle || 'Nossa Equipe';
  const pageDescription =
    pageSettings?.pageDescription ||
    'Conheça os pesquisadores, professores e colaboradores que integram o grupo e-Controls.';
  const emptyStateMessage =
    pageSettings?.emptyStateMessage || 'Conecte ao Strapi para ver a equipe.';

  // Section Visibility
  const sectionVis = pageSettings?.sectionVisibility;
  const showHeader = sectionVis?.showHeader ?? true;
  const showRoleSections = sectionVis?.showRoleSections ?? true;
  const showAlumniSection = sectionVis?.showAlumniSection ?? true;
  const showEmptyState = sectionVis?.showEmptyState ?? true;

  // Alumni Section
  const alumni = pageSettings?.alumniSection;
  const alumniTitle = alumni?.title ?? 'Egressos';
  const alumniDescription =
    alumni?.description ??
    'Conheça os mestres e doutores formados pelo grupo e-Controls e suas trajetórias profissionais.';
  const alumniButtonText = alumni?.buttonText ?? 'ver egressos';
  const alumniButtonLink = alumni?.buttonLink ?? '/people/alumni';

  // Card Configurations (passed down to FacultyCard)
  const cardVis = pageSettings?.cardVisibility;
  const cardLabels = pageSettings?.cardLabels;
  const cardStyling = pageSettings?.cardStyling;

  // Track section index for alternating backgrounds
  let sectionIndex = 0;
  const getSectionBg = () => {
    const bg = sectionIndex % 2 === 0 ? '' : 'bg-ufam-dark';
    sectionIndex++;
    return bg;
  };

  return (
    <main className="min-h-screen bg-ufam-bg pt-24">
      {/* Header */}
      {showHeader && (
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
      )}

      {/* Dynamic Role Sections */}
      {showRoleSections &&
        roleSections.map((section) => (
          <section key={section.sectionTitle} className={`py-16 ${getSectionBg()}`}>
            <div className="container mx-auto px-6">
              <FadeIn>
                <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                  {section.label}
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-tech mb-8">
                  {section.sectionTitle}
                </h3>
                {section.sectionDescription && (
                  <p className="text-ufam-secondary mb-8">{section.sectionDescription}</p>
                )}
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.members.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 100}>
                    <FacultyCard
                      member={member}
                      index={index}
                      visibility={cardVis}
                      labels={cardLabels}
                      styling={cardStyling}
                    />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        ))}

      {/* Alumni Link */}
      {showAlumniSection && (
        <section className={`py-16 border-t border-white/5 ${getSectionBg()}`}>
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h3 className="text-2xl font-bold text-white font-tech mb-4">{alumniTitle}</h3>
              <p className="text-ufam-secondary mb-6 max-w-xl mx-auto">{alumniDescription}</p>
              <Link
                href={alumniButtonLink}
                className="inline-flex items-center gap-2 bg-ufam-primary text-white px-6 py-3 rounded font-tech text-sm hover:bg-ufam-primary/80 transition-colors lowercase"
              >
                {alumniButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty State */}
      {showEmptyState && facultyMembers.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <p className="text-ufam-secondary">{emptyStateMessage}</p>
          </div>
        </section>
      )}
    </main>
  );
}
