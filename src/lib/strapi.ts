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
  FacultyMemberFlat,
  ResearchLineFlat,
  ProjectFlat,
  PublicationFlat,
  NewsItemFlat,
  SoftwareToolFlat,
  PartnerFlat,
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
    fullName: attributes.fullName,
    displayName: attributes.displayName,
    role: attributes.role,
    email: attributes.email,
    bio: attributes.bio,
    shortBio: attributes.shortBio,
    hIndex: attributes.hIndex,
    totalPublications: attributes.totalPublications,
    totalCitations: attributes.totalCitations,
    specializationAreas: attributes.specializationAreas,
    googleScholarUrl: attributes.googleScholarUrl,
    lattesUrl: attributes.lattesUrl,
    linkedinUrl: attributes.linkedinUrl,
    showOnHomepage: attributes.showOnHomepage,
    displayOrder: attributes.displayOrder,
    isActive: attributes.isActive,
    photoUrl: getStrapiMediaUrl(attributes.photo?.data?.attributes?.url),
  };
}

export function flattenResearchLine(data: StrapiData<ResearchLineAttributes>): ResearchLineFlat {
  const { id, attributes } = data;
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    shortDescription: attributes.shortDescription,
    fullDescription: attributes.fullDescription,
    category: attributes.category,
    icon: attributes.icon,
    isActive: attributes.isActive,
    displayOrder: attributes.displayOrder,
    imageUrl: getStrapiMediaUrl(attributes.image?.data?.attributes?.url),
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
    fundingAgency: attributes.fundingAgency,
    startDate: attributes.startDate,
    endDate: attributes.endDate,
    showOnHomepage: attributes.showOnHomepage,
    displayOrder: attributes.displayOrder,
    featuredImageUrl: getStrapiMediaUrl(attributes.featuredImage?.data?.attributes?.url),
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
  };
}

export function flattenNewsItem(data: StrapiData<NewsItemAttributes>): NewsItemFlat {
  const { id, attributes } = data;
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    excerpt: attributes.excerpt,
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
  return getFacultyMembers({
    filters: {
      showOnHomepage: { $eq: true },
      isActive: { $eq: true },
    },
    sort: ['displayOrder:asc'],
  });
}

export async function getFacultyMemberBySlug(slug: string): Promise<FacultyMemberFlat | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<FacultyMemberAttributes>[]>>(
    'faculty-members',
    {
      filters: { slug: { $eq: slug } },
      populate: ['photo', 'researchLines', 'publications'],
    }
  );
  if (response.data.length === 0) return null;
  return flattenFacultyMember(response.data[0]);
}

// ============================================
// API Functions - Research Lines
// ============================================

export async function getResearchLines(options: FetchOptions = {}): Promise<ResearchLineFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchLineAttributes>[]>>(
    'research-lines',
    {
      populate: ['image'],
      sort: ['displayOrder:asc', 'title:asc'],
      filters: { isActive: { $eq: true } },
      ...options,
    }
  );
  return response.data.map(flattenResearchLine);
}

export async function getResearchLineBySlug(slug: string): Promise<ResearchLineFlat | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ResearchLineAttributes>[]>>(
    'research-lines',
    {
      filters: { slug: { $eq: slug } },
      populate: ['image', 'facultyMembers', 'projects'],
    }
  );
  if (response.data.length === 0) return null;
  return flattenResearchLine(response.data[0]);
}

// ============================================
// API Functions - Projects
// ============================================

export async function getProjects(options: FetchOptions = {}): Promise<ProjectFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>('projects', {
    populate: ['featuredImage', 'coordinator', 'researchLines'],
    sort: ['displayOrder:asc', 'startDate:desc'],
    ...options,
  });
  return response.data.map(flattenProject);
}

export async function getHomepageProjects(): Promise<ProjectFlat[]> {
  return getProjects({
    filters: { showOnHomepage: { $eq: true } },
    sort: ['displayOrder:asc'],
    pagination: { pageSize: 6 },
  });
}

export async function getProjectBySlug(slug: string): Promise<ProjectFlat | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>('projects', {
    filters: { slug: { $eq: slug } },
    populate: ['featuredImage', 'coordinator', 'researchLines', 'team'],
  });
  if (response.data.length === 0) return null;
  return flattenProject(response.data[0]);
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
  return getPublications({
    filters: { isFeatured: { $eq: true } },
    sort: ['year:desc', 'citationCount:desc'],
    pagination: { pageSize: 5 },
  });
}

export async function getPublicationBySlug(slug: string): Promise<PublicationFlat | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<PublicationAttributes>[]>>(
    'publications',
    {
      filters: { slug: { $eq: slug } },
      populate: ['authors', 'researchLines'],
    }
  );
  if (response.data.length === 0) return null;
  return flattenPublication(response.data[0]);
}

// ============================================
// API Functions - News Items
// ============================================

export async function getNewsItems(options: FetchOptions = {}): Promise<NewsItemFlat[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<NewsItemAttributes>[]>>('news-items', {
    populate: ['coverImage', 'author', 'tags'],
    sort: ['publishDate:desc'],
    filters: { isPublished: { $eq: true } },
    ...options,
  });
  return response.data.map(flattenNewsItem);
}

export async function getLatestNews(limit: number = 3): Promise<NewsItemFlat[]> {
  return getNewsItems({
    pagination: { pageSize: limit },
  });
}

export async function getNewsItemBySlug(slug: string): Promise<NewsItemFlat | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<NewsItemAttributes>[]>>('news-items', {
    filters: { slug: { $eq: slug } },
    populate: ['coverImage', 'author', 'tags'],
  });
  if (response.data.length === 0) return null;
  return flattenNewsItem(response.data[0]);
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
      populate: '*',
    });
    return response.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}
