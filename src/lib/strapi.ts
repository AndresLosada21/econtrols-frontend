import qs from 'qs';
import type {
  StrapiResponse,
  StrapiData,
  FacultyMemberAttributes,
  ResearchLineAttributes,
  ResearchCategoryAttributes,
  ProjectAttributes,
  PublicationAttributes,
  PublicationCategoryAttributes,
  ProjectStatusAttributes,
  MemberRoleAttributes,
  PartnerTypeAttributes,
  NewsItemAttributes,
  NewsCategoryAttributes,
  SoftwareToolAttributes,
  PartnerAttributes,
  CollaboratorAttributes,
  AlumnusAttributes,
  DegreeLevelAttributes,
  AlumniSectorAttributes,
  AlumniPageSettingAttributes,
  TagAttributes,
  DashboardMetricAttributes,
  HomepageSettingAttributes,
  ResearchPageSettingAttributes,
  ResearchPageSetting,
  ProjectsPageSettingAttributes,
  ProjectsPageSetting,
  PeoplePageSettingAttributes,
  PeoplePageSetting,
  PeopleDetailedPageSettingAttributes,
  PeopleDetailedPageSetting,
  ProjectsDetailedPageSettingAttributes,
  ProjectsDetailedPageSetting,
  ResearchDetailedPageSettingAttributes,
  ResearchDetailedPageSetting,
  PublicationsPageSettingAttributes,
  PublicationsPageSetting,
  PublicationsDetailedPageSettingAttributes,
  PublicationsDetailedPageSetting,
  NewsPageSettingAttributes,
  NewsPageSetting,
  NewsDetailedPageSettingAttributes,
  NewsDetailedPageSetting,
  PartnersPageSettingAttributes,
  PartnersPageSetting,
  FacultyMemberFlat,
  FacultyMemberDetail,
  ResearchLineFlat,
  ResearchLineDetail,
  ResearchCategoryFlat,
  ProjectFlat,
  ProjectDetail,
  PublicationFlat,
  PublicationDetail,
  PublicationCategoryFlat,
  ProjectStatusFlat,
  MemberRoleFlat,
  PartnerTypeFlat,
  NewsItemFlat,
  NewsItemDetail,
  NewsCategoryFlat,
  SoftwareToolFlat,
  PartnerFlat,
  AlumnusFlat,
  DegreeLevelFlat,
  AlumniSectorFlat,
  CollaboratorFlat,
  FundedProject,
} from '@/types/strapi';

// ============================================
// Configuration
// ============================================

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// ============================================
// Base Fetch Function
// ============================================

interface FetchOptions {
  populate?: string | object;
  filters?: object;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  fields?: string[];
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { populate, filters, sort, pagination, fields } = options;

  const queryParams = qs.stringify(
    {
      populate: populate || '*',
      filters,
      sort,
      pagination,
      fields,
    },
    { encodeValuesOnly: true }
  );

  const url = `${STRAPI_URL}/api/${endpoint}${queryParams ? `?${queryParams}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    console.error(`Strapi API Error: ${response.status} - ${response.statusText}`);
    throw new Error(`Failed to fetch data from Strapi: ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// Helper: Get Image URL
// ============================================

export function getStrapiMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// ============================================
// Flatten Functions
// ============================================

export function flattenFacultyMember(data: StrapiData<FacultyMemberAttributes>): FacultyMemberFlat {
  const { id, attributes } = data;

  // Flatten memberRole - OBRIGATÓRIO (Taxonomia Dinâmica)
  // Se não existir no banco, usa fallback padrão
  const memberRoleData = attributes.memberRole?.data;
  const memberRole = memberRoleData
    ? {
        id: memberRoleData.id,
        name: memberRoleData.attributes.name,
        slug: memberRoleData.attributes.slug,
        color: memberRoleData.attributes.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        displayOrder: memberRoleData.attributes.displayOrder || 0,
        description: memberRoleData.attributes.description,
        showInListing: memberRoleData.attributes.showInListing,
        sectionTitle: memberRoleData.attributes.sectionTitle,
        sectionDescription: memberRoleData.attributes.sectionDescription,
      }
    : {
        // Fallback para membros sem role definido
        id: 0,
        name: 'Sem Papel',
        slug: 'sem-papel',
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        displayOrder: 999,
      };

  return {
    id,
    slug: attributes.slug,
    fullName: attributes.fullName,
    displayName: attributes.displayName,
    memberRole,
    email: attributes.email,
    phone: attributes.phone,
    room: attributes.room,
    bio: attributes.bio,
    shortBio: attributes.shortBio,
    hIndex: attributes.hIndex,
    totalPublications: attributes.totalPublications,
    totalCitations: attributes.totalCitations,
    specializationAreas: attributes.specializationAreas,
    googleScholarUrl: attributes.googleScholarUrl,
    lattesUrl: attributes.lattesUrl,
    orcidUrl: attributes.orcidUrl,
    linkedinUrl: attributes.linkedinUrl,
    personalWebsite: attributes.personalWebsite,
    showOnHomepage: attributes.showOnHomepage,
    displayOrder: attributes.displayOrder,
    isActive: attributes.isActive,
    photoUrl: getStrapiMediaUrl(attributes.photo?.data?.attributes?.url),
    researchLines: attributes.researchLines?.data?.map(flattenResearchLine) || [],
  };
}

export function flattenResearchLine(data: StrapiData<ResearchLineAttributes>): ResearchLineFlat {
  const { id, attributes } = data;
  // Suporta tanto 'image' quanto 'featuredImage' do Strapi
  const imageUrl =
    getStrapiMediaUrl(attributes.featuredImage?.data?.attributes?.url) ||
    getStrapiMediaUrl(attributes.image?.data?.attributes?.url);

  // Flatten category - OBRIGATÓRIO (Taxonomia Dinâmica)
  // Se não existir no banco, usa fallback padrão
  const categoryData = attributes.category?.data;
  const category = categoryData
    ? {
        id: categoryData.id,
        name: categoryData.attributes.name,
        slug: categoryData.attributes.slug,
        sectionTitle: categoryData.attributes.sectionTitle || categoryData.attributes.name,
        description: categoryData.attributes.description,
        statsLabel: categoryData.attributes.statsLabel,
        displayOrder: categoryData.attributes.displayOrder || 0,
        color: categoryData.attributes.color || 'text-ufam-light',
        isActive: categoryData.attributes.isActive ?? true,
      }
    : {
        // Fallback para linhas sem categoria definida
        id: 0,
        name: 'Principal',
        slug: 'principal',
        sectionTitle: 'Áreas Principais de Pesquisa',
        description: '/// principais',
        statsLabel: 'principais',
        displayOrder: 1,
        color: 'text-ufam-light',
        isActive: true,
      };

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    fullDescription: attributes.fullDescription,
    category,
    icon: attributes.icon,
    iconName: attributes.iconName,
    isActive: attributes.isActive,
    displayOrder: attributes.displayOrder,
    imageUrl,
  };
}

export function flattenProject(data: StrapiData<ProjectAttributes>): ProjectFlat {
  const { id, attributes } = data;

  // Flatten projectStatus - OBRIGATÓRIO (Taxonomia Dinâmica)
  // Se não existir no banco, usa fallback padrão
  const projectStatusData = attributes.projectStatus?.data;
  const projectStatus = projectStatusData
    ? {
        id: projectStatusData.id,
        name: projectStatusData.attributes.name,
        slug: projectStatusData.attributes.slug,
        color:
          projectStatusData.attributes.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        displayOrder: projectStatusData.attributes.displayOrder || 0,
        description: projectStatusData.attributes.description,
        sectionLabel: projectStatusData.attributes.sectionLabel,
        sectionTitle: projectStatusData.attributes.sectionTitle,
        isActive: projectStatusData.attributes.isActive ?? true,
      }
    : {
        // Fallback para projetos sem status definido
        id: 0,
        name: 'Sem Status',
        slug: 'sem-status',
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        displayOrder: 999,
        description: '',
        sectionLabel: '',
        sectionTitle: 'Projetos',
        isActive: true,
      };

  // Flatten relatedPartners e filtra por funding-agency
  const allPartners = attributes.relatedPartners?.data?.map(flattenPartner) || [];
  const fundingAgencyPartners = allPartners.filter((p) => p.type?.slug === 'funding-agency');

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    startDate: attributes.startDate,
    endDate: attributes.endDate,
    showOnHomepage: attributes.showOnHomepage,
    displayOrder: attributes.displayOrder,
    featuredImageUrl: getStrapiMediaUrl(attributes.featuredImage?.data?.attributes?.url),
    fundingAgencyPartners: fundingAgencyPartners.length > 0 ? fundingAgencyPartners : undefined,
    projectStatus,
  };
}

export function flattenPublication(data: StrapiData<PublicationAttributes>): PublicationFlat {
  const { id, attributes } = data;

  // Flatten category if available (Taxonomia Dinâmica)
  const categoryData = attributes.category?.data;
  const category = categoryData
    ? {
        id: categoryData.id,
        name: categoryData.attributes.name,
        slug: categoryData.attributes.slug,
        color: categoryData.attributes.color || 'bg-slate-500/20 text-slate-400',
        displayOrder: categoryData.attributes.displayOrder || 0,
      }
    : undefined;

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    authorsText: attributes.authorsText,
    year: attributes.year,
    journalName: attributes.journalName,
    conferenceName: attributes.conferenceName,
    doi: attributes.doi,
    citationCount: attributes.citationCount,
    isFeatured: attributes.isFeatured,
    qualis: attributes.qualis,
    keywords: attributes.keywords,
    abstract: attributes.abstract,
    citationBibtex: attributes.citationBibtex,
    category,
  };
}

export function flattenNewsItem(data: StrapiData<NewsItemAttributes>): NewsItemFlat {
  const { id, attributes } = data;

  // Flatten newsCategory
  let newsCategory: NewsCategoryFlat | undefined;
  if (attributes.newsCategory?.data) {
    const cat = attributes.newsCategory.data;
    newsCategory = {
      id: cat.id,
      name: cat.attributes.name,
      slug: cat.attributes.slug,
      color: cat.attributes.color,
      displayOrder: cat.attributes.displayOrder,
      isActive: cat.attributes.isActive,
    };
  }

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    excerpt: attributes.excerpt || attributes.summary,
    newsCategory,
    publishDate: attributes.publishDate,
    isFeatured: attributes.isFeatured,
    coverImageUrl: getStrapiMediaUrl(attributes.coverImage?.data?.attributes?.url),
  };
}

export function flattenSoftwareTool(data: StrapiData<SoftwareToolAttributes>): SoftwareToolFlat {
  const { id, attributes } = data;
  return {
    id,
    name: attributes.name,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    repositoryUrl: attributes.repositoryUrl,
    license: attributes.license,
    isFeatured: attributes.isFeatured,
    logoUrl: getStrapiMediaUrl(attributes.logo?.data?.attributes?.url),
  };
}

export function flattenPartner(data: StrapiData<PartnerAttributes>): PartnerFlat {
  const { id, attributes } = data;

  // Flatten type - OBRIGATÓRIO (Taxonomia Dinâmica)
  // Se não existir no banco, usa fallback padrão
  const typeData = attributes.type?.data;
  const type = typeData
    ? {
        id: typeData.id,
        name: typeData.attributes.name,
        slug: typeData.attributes.slug,
        sectionTitle: typeData.attributes.sectionTitle,
        description: typeData.attributes.description,
        displayOrder: typeData.attributes.displayOrder || 0,
        color: typeData.attributes.color || 'text-ufam-primary',
        statsLabel: typeData.attributes.statsLabel,
        isActive: typeData.attributes.isActive ?? true,
        showInStats: typeData.attributes.showInStats ?? false,
      }
    : {
        // Fallback para parceiros sem tipo definido (migração)
        id: 0,
        name: 'Sem Tipo',
        slug: 'sem-tipo',
        sectionTitle: 'Outros Parceiros',
        description: '/// outros',
        displayOrder: 999,
        color: 'text-gray-400',
        isActive: true,
        showInStats: false,
      };

  // Flatten collaborators
  const collaboratorsData = attributes.collaborators?.data;
  const collaborators = collaboratorsData
    ? collaboratorsData.map((item) => ({
        id: item.id,
        fullName: item.attributes.fullName,
        slug: item.attributes.slug,
        title: item.attributes.title,
        position: item.attributes.position,
        collaborationType: item.attributes.collaborationType,
        researchArea: item.attributes.researchArea,
        collaborationDescription: item.attributes.collaborationDescription,
        email: item.attributes.email,
        websiteUrl: item.attributes.websiteUrl,
        googleScholarUrl: item.attributes.googleScholarUrl,
        lattesUrl: item.attributes.lattesUrl,
        orcidUrl: item.attributes.orcidUrl,
        researchGateUrl: item.attributes.researchGateUrl,
        isActive: item.attributes.isActive,
        displayOrder: item.attributes.displayOrder,
        jointPublications: item.attributes.jointPublications,
        jointProjects: item.attributes.jointProjects,
        photoUrl: getStrapiMediaUrl(item.attributes.photo?.data?.attributes?.url),
      }))
    : [];

  // Flatten projects (simplificado para lista de links)
  const projectsData = attributes.projects?.data;
  const projects = projectsData
    ? projectsData.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        slug: item.attributes.slug,
        shortDescription: item.attributes.summary || item.attributes.shortDescription,
        startDate: item.attributes.startDate,
        endDate: item.attributes.endDate,
        displayOrder: item.attributes.displayOrder,
        showOnHomepage: item.attributes.showOnHomepage ?? false,
        projectStatus: {
          id: 0,
          name: 'Ativo',
          slug: 'ativo',
          color: 'text-green-400',
          displayOrder: 0,
          isActive: true,
        },
      }))
    : [];

  // Flatten fundedProjects
  const fundedProjectsData = attributes.fundedProjects;
  const fundedProjects: FundedProject[] = fundedProjectsData
    ? (fundedProjectsData as any[]).map((item, idx) => ({
        id: idx,
        projectTitle: item.projectTitle,
        amount: item.amount,
        year: item.year,
        grantNumber: item.grantNumber,
        description: item.description,
      }))
    : [];

  return {
    id,
    name: attributes.name,
    type,
    country: attributes.country,
    state: attributes.state,
    city: attributes.city,
    description: attributes.description,
    collaborationType: attributes.collaborationType,
    collaborationArea: attributes.collaborationArea,
    startDate: attributes.startDate,
    jointPublications: attributes.jointPublications,
    websiteUrl: attributes.websiteUrl,
    colorTheme: attributes.colorTheme,
    isActive: attributes.isActive,
    logoUrl: getStrapiMediaUrl(attributes.logo?.data?.attributes?.url),
    collaborators,
    projects,
    fundedProjects,
  };
}

// ============================================
// API Functions - Member Roles (Dynamic Taxonomy)
// ============================================

export async function getMemberRoles(): Promise<MemberRoleFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<MemberRoleAttributes>[]>>(
    'member-roles',
    {
      sort: ['displayOrder:asc'],
      filters: { isActive: { $eq: true } },
    }
  );

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    color: item.attributes.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    displayOrder: item.attributes.displayOrder || 0,
    description: item.attributes.description,
    showInListing: item.attributes.showInListing,
    sectionTitle: item.attributes.sectionTitle,
    sectionDescription: item.attributes.sectionDescription,
  }));
}

// ============================================
// API Functions - Faculty Members
// ============================================

export async function getFacultyMembers(options: FetchOptions = {}): Promise<FacultyMemberFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<FacultyMemberAttributes>[]>>(
    'faculty-members',
    {
      populate: ['photo', 'researchLines', 'memberRole'],
      sort: ['displayOrder:asc', 'fullName:asc'],
      ...options,
    }
  );
  return response.data.map(flattenFacultyMember);
}

export async function getHomepageFacultyMembers(): Promise<FacultyMemberFlat[]> {
  // Try to get members marked for homepage first
  const homepageMembers = await getFacultyMembers({
    filters: {
      showOnHomepage: { $eq: true },
      isActive: { $eq: true },
    },
    sort: ['displayOrder:asc'],
  });

  // If no members marked for homepage, return first 4 active members
  if (homepageMembers.length === 0) {
    return getFacultyMembers({
      filters: { isActive: { $eq: true } },
      sort: ['displayOrder:asc'],
      pagination: { pageSize: 4 },
    });
  }

  return homepageMembers;
}

export async function getFacultyMemberBySlug(slug: string): Promise<FacultyMemberDetail | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<FacultyMemberAttributes>[]>>(
    'faculty-members',
    {
      filters: { slug: { $eq: slug } },
      populate: {
        photo: true,
        memberRole: true,
        researchLines: { populate: ['featuredImage', 'image', 'icon'] },
        coordinatedProjects: { populate: ['featuredImage', 'projectStatus'] },
        participatingProjects: { populate: ['featuredImage', 'projectStatus'] },
        publications: { populate: ['category'] },
        seo: { populate: '*' },
      },
    }
  );

  if (response.data.length === 0) return null;

  const item = response.data[0];
  const attrs = item.attributes;
  const flatBase = flattenFacultyMember(item);

  return {
    ...flatBase,
    slug: slug,
    biography: attrs.biography,
    academicFormation: attrs.academicFormation,
    awardsDistinctions: attrs.awardsDistinctions,
    currentGraduateAdvisees: attrs.currentGraduateAdvisees,
    completedAdvisees: attrs.completedAdvisees,
    teachingGraduate: attrs.teachingGraduate,
    teachingPostgraduate: attrs.teachingPostgraduate,
    researchGateUrl: attrs.researchGateUrl,
    googleScholarCitations: attrs.googleScholarCitations,
    institutionalPositions: attrs.institutionalPositions,
    internationalCollaborations: attrs.internationalCollaborations,
    // Toggles
    showBiography: attrs.showBiography,
    showEducation: attrs.showEducation,
    showResearchLines: attrs.showResearchLines,
    showProjects: attrs.showProjects,
    showPublications: attrs.showPublications,
    showAdvisees: attrs.showAdvisees,
    showTeaching: attrs.showTeaching,
    showAwards: attrs.showAwards,
    showInstitutionalPositions: attrs.showInstitutionalPositions,
    showCollaborations: attrs.showCollaborations,
    showContact: attrs.showContact,
    showMetrics: attrs.showMetrics,
    showAcademicLinks: attrs.showAcademicLinks,
    showSpecializations: attrs.showSpecializations,
    // Relacionamentos
    researchLines: attrs.researchLines?.data?.map(flattenResearchLine) || [],
    coordinatedProjects: attrs.coordinatedProjects?.data?.map(flattenProject) || [],
    participatingProjects: attrs.participatingProjects?.data?.map(flattenProject) || [],
    publications: attrs.publications?.data?.map(flattenPublication) || [],
    seo: attrs.seo,
  };
}

// ============================================
// API Functions - Research Categories (Dynamic Taxonomy)
// ============================================

export async function getResearchCategories(): Promise<ResearchCategoryFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchCategoryAttributes>[]>>(
    'research-categories',
    {
      sort: ['displayOrder:asc'],
      filters: { isActive: { $eq: true } },
    }
  );

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    sectionTitle: item.attributes.sectionTitle || item.attributes.name,
    description: item.attributes.description,
    statsLabel: item.attributes.statsLabel,
    displayOrder: item.attributes.displayOrder || 0,
    color: item.attributes.color || 'text-ufam-light',
    isActive: item.attributes.isActive ?? true,
  }));
}

// ============================================
// API Functions - Research Lines
// ============================================

export async function getResearchLines(options: FetchOptions = {}): Promise<ResearchLineFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchLineAttributes>[]>>(
    'research-lines',
    {
      populate: {
        image: true,
        featuredImage: true,
        icon: true,
        category: true,
      },
      sort: ['displayOrder:asc', 'title:asc'],
      filters: { isActive: { $eq: true } },
      ...options,
    }
  );
  return response.data.map(flattenResearchLine);
}

/**
 * getResearchLineBySlug - Retorna dados completos para página de detalhes
 * Inclui relacionamentos populados (faculty, projects, publications) e SEO
 */
export async function getResearchLineBySlug(slug: string): Promise<ResearchLineDetail | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchLineAttributes>[]>>(
    'research-lines',
    {
      filters: { slug: { $eq: slug } },
      // Populate profundo e estruturado para trazer todos os dados necessários
      populate: {
        image: true,
        featuredImage: true,
        icon: true,
        category: true,
        seo: {
          populate: '*', // Garante que traga ogImage, twitterImage, etc.
        },
        facultyMembers: {
          populate: ['photo', 'memberRole'], // Foto e role dos membros
        },
        relatedProjects: {
          populate: ['featuredImage', 'coordinator', 'projectStatus'], // Projetos com imagem, coordenador e status
        },
        relatedPublications: {
          populate: ['category'], // Publicações com categoria
        },
      },
    }
  );

  if (response.data.length === 0) return null;

  const { attributes } = response.data[0];

  // Reutiliza o flatten básico para os campos comuns
  const flatBase = flattenResearchLine(response.data[0]);

  // Mapeia relacionamentos aninhados para arrays flat
  const facultyMembers =
    attributes.facultyMembers?.data?.map((member: StrapiData<FacultyMemberAttributes>) =>
      flattenFacultyMember(member)
    ) || [];

  const projects =
    attributes.relatedProjects?.data?.map((project: StrapiData<ProjectAttributes>) =>
      flattenProject(project)
    ) || [];

  const publications =
    attributes.relatedPublications?.data?.map((pub: StrapiData<PublicationAttributes>) =>
      flattenPublication(pub)
    ) || [];

  // Retorna o tipo ResearchLineDetail completo
  return {
    ...flatBase,
    fullDescription: attributes.fullDescription,
    practicalApplications: attributes.practicalApplications,
    // Campos que podem não existir no schema - usar fallback seguro
    teachingCourses: (attributes as any).teachingCourses,
    externalCollaborations: (attributes as any).externalCollaborations,
    facilities: (attributes as any).facilities,
    keywords: Array.isArray(attributes.keywords) ? attributes.keywords : undefined,
    facultyMembers,
    projects,
    publications,
    seo: attributes.seo || {
      // Fallback SEO mínimo se não vier do Strapi
      id: 0,
      metaTitle: `${attributes.title} | Pesquisa | e-Controls`,
      metaDescription: attributes.shortDescription,
    },
  };
}

// ============================================
// API Functions - Projects
// ============================================

export async function getProjects(options: FetchOptions = {}): Promise<ProjectFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>('projects', {
    populate: {
      featuredImage: true,
      coordinator: true,
      researchLines: true,
      relatedPartners: { populate: ['logo', 'type'] },
      projectStatus: true,
    },
    sort: ['displayOrder:asc', 'startDate:desc'],
    ...options,
  });
  return response.data.map(flattenProject);
}

export async function getHomepageProjects(): Promise<ProjectFlat[]> {
  // Try to get projects marked for homepage first
  const homepageProjects = await getProjects({
    filters: { showOnHomepage: { $eq: true } },
    sort: ['displayOrder:asc'],
    pagination: { pageSize: 6 },
  });

  // If no projects marked for homepage, return first 6 projects
  if (homepageProjects.length === 0) {
    return getProjects({
      sort: ['startDate:desc'],
      pagination: { pageSize: 6 },
    });
  }

  return homepageProjects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>('projects', {
    filters: { slug: { $eq: slug } },
    populate: {
      featuredImage: true,
      gallery: true,
      researchLine: { populate: ['coverImage', 'image', 'icon', 'featuredImage'] },
      coordinator: { populate: ['photo'] },
      teamMembers: { populate: ['photo'] },
      relatedPublications: true,
      relatedPartners: { populate: ['logo', 'type'] },
      relatedNews: { populate: ['coverImage'] },
      projectStatus: true,
      seo: { populate: '*' },
    },
  });

  if (response.data.length === 0) return null;

  const item = response.data[0];
  const attrs = item.attributes;
  const flatBase = flattenProject(item);

  // Map relationships
  const coordinator = attrs.coordinator?.data
    ? flattenFacultyMember(attrs.coordinator.data)
    : undefined;

  // Map teamMembers -> team
  const team = attrs.teamMembers?.data?.map(flattenFacultyMember) || [];

  // Map relatedPartners -> partners (todos os parceiros)
  const partners = attrs.relatedPartners?.data?.map(flattenPartner) || [];

  // Filtra parceiros que são agências de fomento
  const fundingAgencyPartners = partners.filter((p) => p.type?.slug === 'funding-agency');

  // Map researchLine (singular) -> researchLines (array)
  const researchLines = attrs.researchLine?.data
    ? [flattenResearchLine(attrs.researchLine.data)]
    : [];

  // Map relatedPublications -> publications
  const publications = attrs.relatedPublications?.data?.map(flattenPublication) || [];

  return {
    ...flatBase,
    // Detail fields
    summary: attrs.summary,
    fullDescription: attrs.summary,
    objectives: attrs.objectives,
    methodology: attrs.methodology,
    expectedResults: attrs.expectedResults,
    achievedResults: attrs.achievedResults,
    impactLegacy: attrs.impactLegacy,
    duration: attrs.duration,
    currentStatus: attrs.currentStatus,
    progressPercentage: attrs.progressPercentage,
    fundingAmount: attrs.fundingAmount,
    processNumber: attrs.processNumber,
    websiteUrl: attrs.websiteUrl,
    repositoryUrl: attrs.repositoryUrl,
    keywords: attrs.keywords,
    gallery: attrs.gallery,
    // Visibility Toggles
    showDescription: attrs.showDescription,
    showObjectives: attrs.showObjectives,
    showMethodology: attrs.showMethodology,
    showExpectedResults: attrs.showExpectedResults,
    showAchievedResults: attrs.showAchievedResults,
    showImpactLegacy: attrs.showImpactLegacy,
    showTeam: attrs.showTeam,
    showResearchLines: attrs.showResearchLines,
    showPublications: attrs.showPublications,
    showFunding: attrs.showFunding,
    showGallery: attrs.showGallery,
    showLinks: attrs.showLinks,
    showKeywords: attrs.showKeywords,
    showPartners: attrs.showPartners,
    // Mapped relationships
    coordinator,
    team,
    fundingAgencyPartners,
    researchLines,
    publications,
    partners,
    seo: attrs.seo,
  };
}

// ============================================
// API Functions - Publications
// ============================================

export async function getPublicationCategories(): Promise<PublicationCategoryFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PublicationCategoryAttributes>[]>>(
    'publication-categories',
    {
      filters: { isActive: { $eq: true } },
      sort: ['displayOrder:asc', 'name:asc'],
    }
  );
  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    color: item.attributes.color || 'bg-slate-500/20 text-slate-400',
    displayOrder: item.attributes.displayOrder || 0,
  }));
}

export async function getProjectStatuses(): Promise<ProjectStatusFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProjectStatusAttributes>[]>>(
    'project-statuses',
    {
      filters: { isActive: { $eq: true } },
      sort: ['displayOrder:asc', 'name:asc'],
    }
  );
  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    color: item.attributes.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    displayOrder: item.attributes.displayOrder || 0,
    description: item.attributes.description,
    sectionLabel: item.attributes.sectionLabel,
    sectionTitle: item.attributes.sectionTitle,
    isActive: item.attributes.isActive ?? true,
  }));
}

export async function getPublications(options: FetchOptions = {}): Promise<PublicationFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PublicationAttributes>[]>>(
    'publications',
    {
      populate: ['authors', 'researchLines', 'category'],
      sort: ['year:desc', 'citationCount:desc'],
      ...options,
    }
  );
  return response.data.map(flattenPublication);
}

export async function getFeaturedPublications(): Promise<PublicationFlat[]> {
  // Try to get featured publications first
  const featured = await getPublications({
    filters: { isFeatured: { $eq: true } },
    sort: ['year:desc', 'citationCount:desc'],
    pagination: { pageSize: 5 },
  });

  // If no featured publications, return most recent ones
  if (featured.length === 0) {
    return getPublications({
      sort: ['year:desc', 'citationCount:desc'],
      pagination: { pageSize: 5 },
    });
  }

  return featured;
}

export async function getPublicationBySlug(slug: string): Promise<PublicationDetail | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PublicationAttributes>[]>>(
    'publications',
    {
      filters: { slug: { $eq: slug } },
      populate: {
        // Mídias
        coverImage: true,
        pdfFile: true,
        supplementaryMaterials: true,
        // Relacionamentos diretos
        category: true,
        seo: {
          populate: ['ogImage', 'twitterImage'],
        },
        // Autores com dados completos (não só photo)
        authors: {
          populate: ['photo'], // Mantenha photo, mas pode adicionar mais se necessário
        },
        // Linha de pesquisa com imagem
        researchLine: {
          populate: ['coverImage'],
        },
        // Projeto relacionado com status
        relatedProject: {
          populate: ['featuredImage', 'projectStatus'],
        },
        // Notícias relacionadas com categoria
        relatedNews: {
          populate: ['coverImage', 'newsCategory'],
        },
      },
    }
  );

  if (response.data.length === 0) return null;

  const item = response.data[0];
  const flatBase = flattenPublication(item);

  // Map detailed fields
  const researchLine = item.attributes.researchLine?.data
    ? flattenResearchLine(item.attributes.researchLine.data)
    : undefined;

  const relatedProject = item.attributes.relatedProject?.data
    ? flattenProject(item.attributes.relatedProject.data)
    : undefined;

  const authors = item.attributes.authors?.data?.map(flattenFacultyMember) || [];
  const relatedNews = item.attributes.relatedNews?.data?.map(flattenNewsItem) || [];

  return {
    ...flatBase,
    month: item.attributes.month,
    abstract: item.attributes.abstract,
    bookTitle: item.attributes.bookTitle,
    volume: item.attributes.volume,
    issue: item.attributes.issue,
    pages: item.attributes.pages,
    publisher: item.attributes.publisher,
    issnIsbn: item.attributes.issnIsbn,
    keywords: item.attributes.keywords,
    qualis: item.attributes.qualis,
    impactFactor: item.attributes.impactFactor,
    quartile: item.attributes.quartile,
    pdfUrl: item.attributes.pdfUrl,
    pdfFile: item.attributes.pdfFile,
    externalUrl: item.attributes.externalUrl,
    repositoryUrl: item.attributes.repositoryUrl,
    coverImage: item.attributes.coverImage,
    citationBibtex: item.attributes.citationBibtex,
    citationApa: item.attributes.citationApa,
    citationAbnt: item.attributes.citationAbnt,
    publicationStatus: item.attributes.publicationStatus,
    isOpenAccess: item.attributes.isOpenAccess,
    awardReceived: item.attributes.awardReceived,
    datasetUrl: item.attributes.datasetUrl,
    videoUrl: item.attributes.videoUrl,
    supplementaryMaterials: item.attributes.supplementaryMaterials,
    viewCount: item.attributes.viewCount,
    downloadCount: item.attributes.downloadCount,
    researchLine,
    relatedProject,
    authors,
    relatedNews,
    seo: item.attributes.seo || undefined,
  };
}

// ============================================
// API Functions - News Items
// ============================================

export async function getNewsItems(options: FetchOptions = {}): Promise<NewsItemFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<NewsItemAttributes>[]>>('news-items', {
    populate: ['coverImage', 'author', 'tags', 'newsCategory'],
    sort: ['publishDate:desc'],
    ...options,
  });
  return response.data.map(flattenNewsItem);
}

export async function getLatestNews(limit: number = 3): Promise<NewsItemFlat[]> {
  return getNewsItems({
    pagination: { pageSize: limit },
  });
}

export async function getNewsItemBySlug(slug: string): Promise<NewsItemDetail | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<NewsItemAttributes>[]>>('news-items', {
    filters: { slug: { $eq: slug } },
    populate: {
      coverImage: true,
      gallery: true,
      newsCategory: true,
      author: { populate: ['photo'] },
      relatedMembers: { populate: ['photo'] },
      relatedProjects: { populate: ['coverImage'] },
      relatedPublications: true,
      relatedNews: { populate: ['coverImage', 'newsCategory'] },
      seo: {
        populate: ['ogImage', 'twitterImage'],
      },
    },
  });

  if (response.data.length === 0) return null;

  const item = response.data[0];
  const flatBase = flattenNewsItem(item);

  // Map detailed fields
  const author = item.attributes.author?.data
    ? flattenFacultyMember(item.attributes.author.data)
    : undefined;

  const relatedMembers = item.attributes.relatedMembers?.data?.map(flattenFacultyMember) || [];
  const relatedProjects = item.attributes.relatedProjects?.data?.map(flattenProject) || [];
  const relatedPublications =
    item.attributes.relatedPublications?.data?.map(flattenPublication) || [];
  const relatedNews = item.attributes.relatedNews?.data?.map(flattenNewsItem) || [];

  // Map tags to array of strings (handle both array and object formats)
  let tags: string[] | undefined;
  if (item.attributes.tags) {
    if (Array.isArray(item.attributes.tags)) {
      tags = item.attributes.tags.map((t: any) =>
        typeof t === 'string' ? t : t.name || t.slug || String(t)
      );
    } else {
      tags = undefined;
    }
  }

  return {
    ...flatBase,
    summary: item.attributes.summary,
    content: item.attributes.content,
    gallery: item.attributes.gallery,
    isPinned: item.attributes.isPinned,
    externalUrl: item.attributes.externalUrl,
    eventDate: item.attributes.eventDate,
    tags,
    viewCount: item.attributes.viewCount,
    readingTime: item.attributes.readingTime,
    author,
    relatedMembers,
    relatedProjects,
    relatedPublications,
    relatedNews,
    seo: item.attributes.seo || undefined,
  };
}

// ============================================
// API Functions - Software Tools
// ============================================

export async function getSoftwareTools(options: FetchOptions = {}): Promise<SoftwareToolFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<SoftwareToolAttributes>[]>>(
    'software-tools',
    {
      populate: ['logo', 'maintainers'],
      sort: ['name:asc'],
      filters: { isActive: { $eq: true } },
      ...options,
    }
  );
  return response.data.map(flattenSoftwareTool);
}

export async function getFeaturedTools(): Promise<SoftwareToolFlat[]> {
  return getSoftwareTools({
    filters: { isFeatured: { $eq: true }, isActive: { $eq: true } },
  });
}

// ============================================
// API Functions - Partner Types (Dynamic Taxonomy)
// ============================================

export async function getPartnerTypes(): Promise<PartnerTypeFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PartnerTypeAttributes>[]>>(
    'partner-types',
    {
      sort: ['displayOrder:asc'],
      filters: { isActive: { $eq: true } },
    }
  );

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    sectionTitle: item.attributes.sectionTitle,
    description: item.attributes.description,
    displayOrder: item.attributes.displayOrder || 0,
    color: item.attributes.color || 'text-ufam-primary',
    statsLabel: item.attributes.statsLabel,
    isActive: item.attributes.isActive ?? true,
    showInStats: item.attributes.showInStats ?? false,
  }));
}

// ============================================
// API Functions - Partners
// ============================================

export async function getPartners(options: FetchOptions = {}): Promise<PartnerFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PartnerAttributes>[]>>('partners', {
    populate: {
      logo: true,
      type: true,
      collaborators: {
        populate: ['photo'],
      },
      projects: {
        populate: ['featuredImage'],
      },
      fundedProjects: true,
    },
    sort: ['displayOrder:asc', 'name:asc'],
    filters: { isActive: { $eq: true } },
    ...options,
  });
  return response.data.map(flattenPartner);
}

export async function getInternationalPartners(): Promise<PartnerFlat[]> {
  return getPartners({
    filters: {
      partnerType: { $eq: 'International University' },
      isActive: { $eq: true },
    },
  });
}

// ============================================
// API Functions - Funding Agency Partners
// ============================================

/**
 * Busca parceiros que são agências de fomento (type.slug === 'funding-agency')
 */
export async function getFundingAgencyPartners(options: FetchOptions = {}): Promise<PartnerFlat[]> {
  return getPartners({
    filters: {
      type: { slug: { $eq: 'funding-agency' } },
      isActive: { $eq: true },
    },
    ...options,
  });
}

// ============================================
// API Functions - Degree Levels (Dynamic Taxonomy)
// ============================================

export async function getDegreeLevels(): Promise<DegreeLevelFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<DegreeLevelAttributes>[]>>(
    'degree-levels',
    {
      sort: ['displayOrder:asc'],
    }
  );

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    pluralName: item.attributes.pluralName,
    displayOrder: item.attributes.displayOrder || 0,
  }));
}

// ============================================
// API Functions - Alumni Sectors (Dynamic Taxonomy)
// ============================================

export async function getAlumniSectors(): Promise<AlumniSectorFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<AlumniSectorAttributes>[]>>(
    'alumni-sectors',
    {
      sort: ['name:asc'],
    }
  );

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    statsLabel: item.attributes.statsLabel,
    description: item.attributes.description,
    color: item.attributes.color || 'text-gray-400',
    iconName: item.attributes.iconName,
  }));
}

// ============================================
// API Functions - Alumni Page Settings
// ============================================

export async function getAlumniPageSettings(): Promise<AlumniPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{
      data: { id: number; attributes: AlumniPageSettingAttributes };
    }>('alumni-page-setting', { populate: 'deep' });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching alumni page settings:', error);
    return null;
  }
}

// ============================================
// API Functions - Alumni
// ============================================

export function flattenAlumnus(data: StrapiData<AlumnusAttributes>): AlumnusFlat {
  const { id, attributes } = data;

  // Flatten degree - OBRIGATÓRIO (Taxonomia Dinâmica)
  const degreeData = attributes.degree?.data;
  const degree = degreeData
    ? {
        id: degreeData.id,
        name: degreeData.attributes.name,
        slug: degreeData.attributes.slug,
        pluralName: degreeData.attributes.pluralName,
        displayOrder: degreeData.attributes.displayOrder || 0,
      }
    : {
        // Fallback para alumni sem degree definido (migração)
        id: 0,
        name: 'Não informado',
        slug: 'nao-informado',
        pluralName: 'Não informado',
        displayOrder: 999,
      };

  // Flatten sector - OPCIONAL (pode não ter setor definido)
  const sectorData = attributes.sector?.data;
  const sector = sectorData
    ? {
        id: sectorData.id,
        name: sectorData.attributes.name,
        statsLabel: sectorData.attributes.statsLabel,
        description: sectorData.attributes.description,
        color: sectorData.attributes.color || 'text-gray-400',
        iconName: sectorData.attributes.iconName,
      }
    : undefined;

  return {
    id,
    fullName: attributes.fullName,
    slug: attributes.slug,
    degree,
    thesisTitle: attributes.thesisTitle,
    advisor: attributes.advisor,
    defenseYear: attributes.defenseYear,
    currentPosition: attributes.currentPosition,
    currentInstitution: attributes.currentInstitution,
    researchTopic: attributes.researchTopic,
    sector,
    linkedinUrl: attributes.linkedinUrl,
    lattesUrl: attributes.lattesUrl,
    email: attributes.email,
    publicationsCount: attributes.publicationsCount,
    displayOrder: attributes.displayOrder,
    photoUrl: getStrapiMediaUrl(attributes.photo?.data?.attributes?.url),
  };
}

export async function getAlumni(options: FetchOptions = {}): Promise<AlumnusFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<AlumnusAttributes>[]>>('alumni', {
    populate: ['photo', 'degree', 'sector'],
    sort: ['defenseYear:desc', 'fullName:asc'],
    ...options,
  });
  return response.data.map(flattenAlumnus);
}

export async function getHomepageAlumni(limit: number = 4): Promise<AlumnusFlat[]> {
  return getAlumni({
    pagination: { pageSize: limit },
    sort: ['defenseYear:desc'],
  });
}

// ============================================
// API Functions - Collaborators
// ============================================

export async function getCollaborators(
  options: FetchOptions = {}
): Promise<StrapiData<CollaboratorAttributes>[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<CollaboratorAttributes>[]>>(
    'collaborators',
    {
      populate: ['photo'],
      sort: ['fullName:asc'],
      filters: { isActive: { $eq: true } },
      ...options,
    }
  );
  return response.data;
}

// ============================================
// API Functions - Tags
// ============================================

export async function getTags(): Promise<StrapiData<TagAttributes>[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<TagAttributes>[]>>('tags', {
    sort: ['name:asc'],
  });
  return response.data;
}

// ============================================
// API Functions - Dashboard Metrics
// ============================================

export async function getDashboardMetrics(): Promise<StrapiData<DashboardMetricAttributes>[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<DashboardMetricAttributes>[]>>(
    'dashboard-metrics',
    {
      sort: ['displayOrder:asc'],
      filters: { isActive: { $eq: true } },
    }
  );
  return response.data;
}

// ============================================
// API Functions - Homepage Settings (Single Type)
// ============================================

export async function getHomepageSettings(): Promise<HomepageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{
      data: { id: number; attributes: HomepageSettingAttributes };
    }>('homepage-setting', {
      populate: 'deep', // Changed to 'deep' to populate nested components
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}

// ============================================
// API Functions - Research Page Settings (Single Type)
// ============================================

export async function getResearchPageSettings(): Promise<ResearchPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: ResearchPageSetting }>('research-page-setting', {
      populate: 'deep',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching research page settings:', error);
    return null;
  }
}

// ============================================
// API Functions - Projects Page Settings (Single Type)
// ============================================

export async function getProjectsPageSettings(): Promise<ProjectsPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: ProjectsPageSetting }>('projects-page-setting', {
      populate: 'deep',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching projects page settings:', error);
    return null;
  }
}

// ============================================
// People Page Settings
// ============================================

export async function getPeoplePageSettings(): Promise<PeoplePageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: PeoplePageSetting }>('people-page-setting', {
      populate: 'deep',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching people page settings:', error);
    return null;
  }
}

// ============================================
// Detailed Page Settings
// ============================================

export async function getPeopleDetailedPageSettings(): Promise<PeopleDetailedPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: PeopleDetailedPageSetting }>(
      'people-detailed-page-setting'
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching people detailed page settings:', error);
    return null;
  }
}

export async function getProjectsDetailedPageSettings(): Promise<ProjectsDetailedPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: ProjectsDetailedPageSetting }>(
      'projects-detailed-page-setting'
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching projects detailed page settings:', error);
    return null;
  }
}

export async function getResearchDetailedPageSettings(): Promise<ResearchDetailedPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: ResearchDetailedPageSetting }>(
      'research-detailed-page-setting'
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching research detailed page settings:', error);
    return null;
  }
}

// Publications Page Settings
export async function getPublicationsPageSettings(): Promise<PublicationsPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: PublicationsPageSetting }>(
      'publications-page-setting',
      { populate: 'deep' }
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching publications page settings:', error);
    return null;
  }
}

export async function getPublicationsDetailedPageSettings(): Promise<PublicationsDetailedPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: PublicationsDetailedPageSetting }>(
      'publications-detailed-page-setting'
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching publications detailed page settings:', error);
    return null;
  }
}

// News Page Settings
export async function getNewsPageSettings(): Promise<NewsPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: NewsPageSetting }>('news-page-setting', {
      populate: 'deep',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching news page settings:', error);
    return null;
  }
}

// News Categories
export async function getNewsCategories(): Promise<NewsCategoryFlat[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiData<NewsCategoryAttributes>[]>>(
      'news-categories',
      {
        sort: ['displayOrder:asc'],
        filters: { isActive: { $eq: true } },
      }
    );
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      slug: item.attributes.slug,
      color: item.attributes.color,
      displayOrder: item.attributes.displayOrder,
      isActive: item.attributes.isActive,
    }));
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return [];
  }
}

// Partners Page Settings
export async function getPartnersPageSettings(): Promise<PartnersPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: PartnersPageSetting }>('partners-page-setting', {
      populate: 'deep',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching partners page settings:', error);
    return null;
  }
}

export async function getNewsDetailedPageSettings(): Promise<NewsDetailedPageSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: NewsDetailedPageSetting }>(
      'news-detailed-page-setting'
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching news detailed page settings:', error);
    return null;
  }
}

// ============================================
// Navbar Settings
// ============================================

import type {
  NavbarSettingAttributes,
  FooterSettingAttributes,
  LayoutMenuLink,
  LayoutFooterMenuColumn,
} from '@/types/strapi';

export async function getNavbarSettings(): Promise<NavbarSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: { id: number; attributes: NavbarSettingAttributes } }>(
      'navbar-setting',
      {
        populate: {
          mainMenu: true,
          logo: true,
          ctaButton: true,
        },
      }
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching navbar settings:', error);
    return null;
  }
}

// ============================================
// Footer Settings
// ============================================

export async function getFooterSettings(): Promise<FooterSettingAttributes | null> {
  try {
    const response = await fetchAPI<{ data: { id: number; attributes: FooterSettingAttributes } }>(
      'footer-setting',
      {
        populate: {
          menuColumns: {
            populate: ['links'],
          },
          socialLinks: true,
          logo: true,
          contactInfo: true,
        },
      }
    );
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return null;
  }
}
