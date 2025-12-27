import qs from 'qs';
import type {
  StrapiResponse,
  StrapiData,
  FacultyMemberAttributes,
  ResearchLineAttributes,
  ProjectAttributes,
  PublicationAttributes,
  NewsItemAttributes,
  SoftwareToolAttributes,
  PartnerAttributes,
  CollaboratorAttributes,
  AlumnusAttributes,
  TagAttributes,
  DashboardMetricAttributes,
  HomepageSettingAttributes,
  ResearchPageSettingAttributes,
  ResearchPageSetting,
  ProjectsPageSettingAttributes,
  ProjectsPageSetting,
  PeoplePageSettingAttributes,
  PeoplePageSetting,
  FacultyMemberFlat,
  FacultyMemberDetail,
  ResearchLineFlat,
  ResearchLineDetail,
  ProjectFlat,
  ProjectDetail,
  PublicationFlat,
  PublicationDetail,
  NewsItemFlat,
  NewsItemDetail,
  SoftwareToolFlat,
  PartnerFlat,
  FundingAgencyFlat,
  FundingAgencyAttributes,
  AlumnusFlat,
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
  return {
    id,
    slug: attributes.slug,
    fullName: attributes.fullName,
    displayName: attributes.displayName,
    role: attributes.role,
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

  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    fullDescription: attributes.fullDescription,
    category: attributes.category,
    icon: attributes.icon,
    iconName: attributes.iconName,
    isActive: attributes.isActive,
    displayOrder: attributes.displayOrder,
    imageUrl,
  };
}

export function flattenProject(data: StrapiData<ProjectAttributes>): ProjectFlat {
  const { id, attributes } = data;
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    status: attributes.status,
    startDate: attributes.startDate,
    endDate: attributes.endDate,
    showOnHomepage: attributes.showOnHomepage,
    displayOrder: attributes.displayOrder,
    featuredImageUrl: getStrapiMediaUrl(attributes.featuredImage?.data?.attributes?.url),
    fundingAgencies: attributes.fundingAgencies?.data?.map(flattenFundingAgency) || [],
  };
}

export function flattenFundingAgency(data: StrapiData<FundingAgencyAttributes>): FundingAgencyFlat {
  const { id, attributes } = data;
  return {
    id,
    name: attributes.name,
    fullName: attributes.fullName,
    acronym: attributes.acronym,
    type: attributes.type,
    country: attributes.country,
    websiteUrl: attributes.websiteUrl,
    isActive: attributes.isActive,
    logoUrl: getStrapiMediaUrl(attributes.logo?.data?.attributes?.url),
  };
}

export function flattenPublication(data: StrapiData<PublicationAttributes>): PublicationFlat {
  const { id, attributes } = data;
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    authorsText: attributes.authorsText,
    publicationType: attributes.publicationType,
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
  };
}

export function flattenNewsItem(data: StrapiData<NewsItemAttributes>): NewsItemFlat {
  const { id, attributes } = data;
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    excerpt: attributes.excerpt || attributes.summary,
    category: attributes.category,
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
  return {
    id,
    name: attributes.name,
    partnerType: attributes.partnerType,
    country: attributes.country,
    city: attributes.city,
    websiteUrl: attributes.websiteUrl,
    isActive: attributes.isActive,
    logoUrl: getStrapiMediaUrl(attributes.logo?.data?.attributes?.url),
  };
}

// ============================================
// API Functions - Faculty Members
// ============================================

export async function getFacultyMembers(options: FetchOptions = {}): Promise<FacultyMemberFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<FacultyMemberAttributes>[]>>(
    'faculty-members',
    {
      populate: ['photo', 'researchLines'],
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
        researchLines: { populate: ['featuredImage', 'image', 'icon'] },
        coordinatedProjects: { populate: ['featuredImage'] },
        participatingProjects: { populate: ['featuredImage'] },
        publications: true,
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
    // Relacionamentos
    researchLines: attrs.researchLines?.data?.map(flattenResearchLine) || [],
    coordinatedProjects: attrs.coordinatedProjects?.data?.map(flattenProject) || [],
    participatingProjects: attrs.participatingProjects?.data?.map(flattenProject) || [],
    publications: attrs.publications?.data?.map(flattenPublication) || [],
    seo: attrs.seo,
  };
}

// ============================================
// API Functions - Research Lines
// ============================================

export async function getResearchLines(options: FetchOptions = {}): Promise<ResearchLineFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchLineAttributes>[]>>(
    'research-lines',
    {
      populate: ['image', 'featuredImage', 'icon'],
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
        seo: {
          populate: '*', // Garante que traga ogImage, twitterImage, etc.
        },
        facultyMembers: {
          populate: ['photo'], // Foto dos membros
        },
        relatedProjects: {
          populate: ['featuredImage', 'coordinator'], // Projetos com imagem e coordenador
        },
        relatedPublications: true, // Publicações (geralmente sem mídia pesada)
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
      fundingAgencies: { populate: ['logo'] },
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
      fundingAgencies: { populate: ['logo'] },
      relatedPublications: true,
      relatedPartners: { populate: ['logo'] },
      relatedNews: { populate: ['coverImage'] },
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

  // Map fundingAgencies
  const fundingAgencies = attrs.fundingAgencies?.data?.map(flattenFundingAgency) || [];

  // Map researchLine (singular) -> researchLines (array)
  const researchLines = attrs.researchLine?.data
    ? [flattenResearchLine(attrs.researchLine.data)]
    : [];

  // Map relatedPublications -> publications
  const publications = attrs.relatedPublications?.data?.map(flattenPublication) || [];

  // Map relatedPartners -> partners
  const partners = attrs.relatedPartners?.data?.map(flattenPartner) || [];

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
    // Mapped relationships
    coordinator,
    team,
    fundingAgencies,
    researchLines,
    publications,
    partners,
    seo: attrs.seo,
  };
}

// ============================================
// API Functions - Publications
// ============================================

export async function getPublications(options: FetchOptions = {}): Promise<PublicationFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PublicationAttributes>[]>>(
    'publications',
    {
      populate: ['authors', 'researchLines'],
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
        coverImage: true,
        pdfFile: true,
        supplementaryMaterials: true,
        authors: { populate: ['photo'] },
        researchLine: { populate: ['coverImage'] },
        relatedProject: { populate: ['featuredImage'] },
        relatedNews: { populate: ['coverImage'] },
        seo: {
          populate: ['ogImage', 'twitterImage'],
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
    populate: ['coverImage', 'author', 'tags'],
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
      author: { populate: ['photo'] },
      relatedMembers: { populate: ['photo'] },
      relatedProjects: { populate: ['coverImage'] },
      relatedPublications: true,
      relatedNews: { populate: ['coverImage'] },
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
// API Functions - Partners
// ============================================

export async function getPartners(options: FetchOptions = {}): Promise<PartnerFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PartnerAttributes>[]>>('partners', {
    populate: ['logo'],
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
// API Functions - Funding Agencies
// ============================================

export async function getFundingAgencies(options: FetchOptions = {}): Promise<FundingAgencyFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<FundingAgencyAttributes>[]>>(
    'funding-agencies',
    {
      populate: ['logo'],
      sort: ['displayOrder:asc', 'name:asc'],
      filters: { isActive: { $eq: true } },
      ...options,
    }
  );
  return response.data.map(flattenFundingAgency);
}

// ============================================
// API Functions - Alumni
// ============================================

export function flattenAlumnus(data: StrapiData<AlumnusAttributes>): AlumnusFlat {
  const { id, attributes } = data;
  return {
    id,
    fullName: attributes.fullName,
    degreeLevel: attributes.degreeLevel,
    thesisTitle: attributes.thesisTitle,
    advisor: attributes.advisor,
    defenseYear: attributes.defenseYear,
    currentPosition: attributes.currentPosition,
    currentInstitution: attributes.currentInstitution,
    currentSector: attributes.currentSector,
    linkedinUrl: attributes.linkedinUrl,
    lattesUrl: attributes.lattesUrl,
    photoUrl: getStrapiMediaUrl(attributes.photo?.data?.attributes?.url),
  };
}

export async function getAlumni(options: FetchOptions = {}): Promise<AlumnusFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<AlumnusAttributes>[]>>('alumni', {
    populate: ['photo'],
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
// Navbar Settings
// ============================================
// Navbar Settings
// ============================================

export async function getNavbarSettings(): Promise<any> {
  try {
    const response = await fetchAPI<{ data: { id: number; attributes: any } }>('navbar-setting', {
      populate: '*',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching navbar settings:', error);
    return null;
  }
}

// ============================================
// Footer Settings
// ============================================

export async function getFooterSettings(): Promise<any> {
  try {
    const response = await fetchAPI<{ data: { id: number; attributes: any } }>('footer-setting', {
      populate: '*',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return null;
  }
}
