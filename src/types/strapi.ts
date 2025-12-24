// ============================================
// Strapi Types - e-Controls Frontend
// ============================================

// Base Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail?: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
      };
      url: string;
    };
  } | null;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

// ============================================
// Content Type Interfaces
// ============================================

// Faculty Member
export interface FacultyMemberAttributes {
  fullName: string;
  displayName: string;
  role: 'Líder' | 'Co-líder' | 'Pesquisador Permanente' | 'Pesquisador Colaborador' | 'Pós-Doc';
  email: string;
  bio?: string;
  shortBio?: string;
  phone?: string;
  room?: string;
  hIndex?: number;
  totalPublications?: number;
  totalCitations?: number;
  specializationAreas?: string[];
  googleScholarUrl?: string;
  lattesUrl?: string;
  orcidUrl?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  isActive: boolean;
  photo?: StrapiMedia;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyMember extends StrapiData<FacultyMemberAttributes> {}

// Research Line
export interface ResearchLineAttributes {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category: 'Principal' | 'Secundária' | 'Emergente';
  icon?: string;
  iconName?: string; // Nome do ícone Lucide como fallback (ex: "settings", "cpu")
  isActive: boolean;
  displayOrder?: number;
  image?: StrapiMedia;
  featuredImage?: StrapiMedia;
  facultyMembers?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  projects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchLine extends StrapiData<ResearchLineAttributes> {}

// Project
export interface ProjectAttributes {
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  status: 'Em Andamento' | 'Concluído' | 'Planejado';
  fundingAgency?: string;
  fundingAmount?: number;
  startDate?: string;
  endDate?: string;
  currentStatus?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  featuredImage?: StrapiMedia;
  coordinator?: StrapiResponse<StrapiData<FacultyMemberAttributes>>;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends StrapiData<ProjectAttributes> {}

// Publication
export interface PublicationAttributes {
  title: string;
  slug: string;
  abstract?: string;
  authorsText: string;
  publicationType:
    | 'Journal Article'
    | 'Conference Paper'
    | 'Book Chapter'
    | 'Thesis'
    | 'Technical Report';
  year: number;
  journalName?: string;
  conferenceName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pdfUrl?: string;
  citationCount?: number;
  qualis?: string;
  quartile?: string;
  impactFactor?: number;
  awardReceived?: string;
  isFeatured: boolean;
  publicationStatus?: 'Published' | 'Accepted' | 'In Press' | 'Submitted';
  authors?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface Publication extends StrapiData<PublicationAttributes> {}

// News Item
export interface NewsItemAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  content: string;
  category: string;
  publishDate: string;
  isFeatured: boolean;
  isPublished?: boolean;
  coverImage?: StrapiMedia;
  author?: StrapiResponse<StrapiData<FacultyMemberAttributes>>;
  tags?: StrapiResponse<StrapiData<TagAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem extends StrapiData<NewsItemAttributes> {}

// Software Tool
export interface SoftwareToolAttributes {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  releaseYear?: number;
  currentVersion?: string;
  license?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  demoUrl?: string;
  downloadUrl?: string;
  programmingLanguages?: string[];
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  logo?: StrapiMedia;
  screenshots?: StrapiMedia;
  maintainers?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface SoftwareTool extends StrapiData<SoftwareToolAttributes> {}

// Partner
export interface PartnerAttributes {
  name: string;
  partnerType:
    | 'International University'
    | 'National University'
    | 'Research Institute'
    | 'Industrial Partner'
    | 'Funding Agency';
  country: string;
  state?: string;
  city?: string;
  description?: string;
  collaborationType?: string;
  websiteUrl?: string;
  supportType?: string[];
  isActive: boolean;
  displayOrder?: number;
  logo?: StrapiMedia;
  createdAt: string;
  updatedAt: string;
}

export interface Partner extends StrapiData<PartnerAttributes> {}

// Collaborator
export interface CollaboratorAttributes {
  fullName: string;
  institution: string;
  country: string;
  role?: string;
  email?: string;
  websiteUrl?: string;
  isActive: boolean;
  photo?: StrapiMedia;
  createdAt: string;
  updatedAt: string;
}

export interface Collaborator extends StrapiData<CollaboratorAttributes> {}

// Alumnus
export interface AlumnusAttributes {
  fullName: string;
  degreeLevel: 'Mestrado' | 'Doutorado' | 'Pós-Doutorado' | 'Iniciação Científica';
  thesisTitle?: string;
  advisor?: string;
  defenseYear?: number;
  currentPosition?: string;
  currentInstitution?: string;
  currentSector?: 'Academia' | 'Indústria' | 'Governo' | 'Empreendedorismo';
  linkedinUrl?: string;
  lattesUrl?: string;
  photo?: StrapiMedia;
  createdAt: string;
  updatedAt: string;
}

export interface Alumnus extends StrapiData<AlumnusAttributes> {}

// Tag
export interface TagAttributes {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag extends StrapiData<TagAttributes> {}

// Dashboard Metric
export interface DashboardMetricAttributes {
  name: string;
  value: number;
  suffix?: string;
  icon?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetric extends StrapiData<DashboardMetricAttributes> {}

// Homepage Setting (Single Type)
export interface HomepageSettingAttributes {
  groupName: string;
  tagline: string;
  institutionalAffiliation?: string;
  department?: string;
  location?: string;
  introductionText?: string;
  foundingYear?: string;
  mainContactEmail?: string;
  phone?: string;
  address?: string;
  keyMetrics?: {
    publications: number;
    citations: number;
    mastersFormed: number;
    internationalPartnerships: number;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HomepageSetting {
  id: number;
  attributes: HomepageSettingAttributes;
}

// ============================================
// Flattened Types (for easier use in components)
// ============================================

export interface FacultyMemberFlat {
  id: number;
  fullName: string;
  displayName: string;
  role: string;
  email: string;
  bio?: string;
  shortBio?: string;
  hIndex?: number;
  totalPublications?: number;
  totalCitations?: number;
  specializationAreas?: string[];
  googleScholarUrl?: string;
  lattesUrl?: string;
  linkedinUrl?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  isActive: boolean;
  photoUrl?: string;
}

export interface ResearchLineFlat {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  icon?: string;
  iconName?: string;
  isActive: boolean;
  displayOrder?: number;
  imageUrl?: string;
}

export interface ProjectFlat {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  status: string;
  fundingAgency?: string;
  startDate?: string;
  endDate?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  featuredImageUrl?: string;
}

export interface PublicationFlat {
  id: number;
  title: string;
  slug: string;
  authorsText: string;
  publicationType: string;
  year: number;
  journalName?: string;
  conferenceName?: string;
  doi?: string;
  citationCount?: number;
  isFeatured: boolean;
}

export interface NewsItemFlat {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  publishDate: string;
  isFeatured: boolean;
  coverImageUrl?: string;
}

export interface SoftwareToolFlat {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  repositoryUrl?: string;
  license?: string;
  isFeatured: boolean;
  logoUrl?: string;
}

export interface PartnerFlat {
  id: number;
  name: string;
  partnerType: string;
  country: string;
  city?: string;
  websiteUrl?: string;
  isActive: boolean;
  logoUrl?: string;
}

export interface AlumnusFlat {
  id: number;
  fullName: string;
  degreeLevel: string;
  thesisTitle?: string;
  advisor?: string;
  defenseYear?: number;
  currentPosition?: string;
  currentInstitution?: string;
  currentSector?: string;
  linkedinUrl?: string;
  lattesUrl?: string;
  photoUrl?: string;
}
