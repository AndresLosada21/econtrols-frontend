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
  slug?: string;
  role: 'Líder' | 'Co-líder' | 'Pesquisador Permanente' | 'Pesquisador Colaborador' | 'Pós-Doc';
  email: string;
  bio?: string;
  shortBio?: string;
  biography?: string;
  phone?: string;
  room?: string;
  hIndex?: number;
  totalPublications?: number;
  totalCitations?: number;
  googleScholarCitations?: number;
  specializationAreas?: string[];
  teachingGraduate?: string[];
  teachingPostgraduate?: string[];
  institutionalPositions?: string[];
  internationalCollaborations?: string;
  googleScholarUrl?: string;
  lattesUrl?: string;
  researchGateUrl?: string;
  orcidUrl?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  isActive: boolean;
  // Toggles de visibilidade
  showBiography?: boolean;
  showEducation?: boolean;
  showResearchLines?: boolean;
  showProjects?: boolean;
  showPublications?: boolean;
  showAdvisees?: boolean;
  showTeaching?: boolean;
  showAwards?: boolean;
  showInstitutionalPositions?: boolean;
  showCollaborations?: boolean;
  // Componentes
  academicFormation?: any[];
  awardsDistinctions?: any[];
  currentGraduateAdvisees?: any[];
  completedAdvisees?: any[];
  // Relações
  photo?: StrapiMedia;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  coordinatedProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  participatingProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  publications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  seo?: SharedSeo;
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
  // Nomes corretos dos relacionamentos no Strapi schema
  relatedProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  relatedPublications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  // Campos de detalhes
  practicalApplications?: string;
  keywords?: string[] | { [key: string]: any }; // JSON field
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchLine extends StrapiData<ResearchLineAttributes> {}

// Project
export interface ProjectAttributes {
  title: string;
  slug: string;
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Planejado';
  summary?: string;
  shortDescription?: string;
  // Rich Text Fields
  objectives?: string;
  methodology?: string;
  expectedResults?: string;
  achievedResults?: string;
  impactLegacy?: string;
  // Simple Fields
  fundingAmount?: number;
  processNumber?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  currentStatus?: string;
  progressPercentage?: number;
  websiteUrl?: string;
  repositoryUrl?: string;
  keywords?: any;
  showOnHomepage: boolean;
  displayOrder?: number;
  // Media
  featuredImage?: StrapiMedia;
  gallery?: StrapiMedia;
  // Relationships (Backend names)
  researchLine?: StrapiResponse<StrapiData<ResearchLineAttributes>>;
  coordinator?: StrapiResponse<StrapiData<FacultyMemberAttributes>>;
  teamMembers?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  fundingAgencies?: StrapiResponse<StrapiData<FundingAgencyAttributes>[]>;
  relatedPublications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  relatedPartners?: StrapiResponse<StrapiData<PartnerAttributes>[]>;
  relatedNews?: StrapiResponse<StrapiData<NewsItemAttributes>[]>;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends StrapiData<ProjectAttributes> {}

// Publication
export interface PublicationAttributes {
  title: string;
  slug: string;
  publicationType:
    | 'Journal Article'
    | 'Conference Paper'
    | 'Book'
    | 'Book Chapter'
    | 'Thesis - PhD'
    | 'Thesis - Masters'
    | 'Technical Report'
    | 'Software/Tool';
  authorsText: string;
  year: number;
  month?: number;
  abstract?: string;
  journalName?: string;
  conferenceName?: string;
  bookTitle?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  issnIsbn?: string;
  keywords?: any;
  citationCount?: number;
  qualis?: 'A1' | 'A2' | 'A3' | 'A4' | 'B1' | 'B2' | 'B3' | 'B4' | 'C' | 'N/A';
  impactFactor?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'N/A';
  pdfUrl?: string;
  pdfFile?: StrapiMedia;
  externalUrl?: string;
  repositoryUrl?: string;
  coverImage?: StrapiMedia;
  citationBibtex?: string;
  citationApa?: string;
  citationAbnt?: string;
  publicationStatus?: 'Published' | 'Accepted' | 'Submitted' | 'In Press';
  isFeatured: boolean;
  isOpenAccess?: boolean;
  awardReceived?: string;
  datasetUrl?: string;
  videoUrl?: string;
  supplementaryMaterials?: StrapiMedia;
  viewCount?: number;
  downloadCount?: number;
  researchLine?: StrapiResponse<StrapiData<ResearchLineAttributes>>;
  relatedProject?: StrapiResponse<StrapiData<ProjectAttributes>>;
  authors?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  relatedNews?: StrapiResponse<StrapiData<NewsItemAttributes>[]>;
  seo?: SharedSeo;
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
  isPinned?: boolean;
  coverImage?: StrapiMedia;
  gallery?: StrapiMedia;
  externalUrl?: string;
  eventDate?: string;
  tags?: any;
  viewCount?: number;
  readingTime?: number;
  author?: StrapiResponse<StrapiData<FacultyMemberAttributes>>;
  relatedMembers?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  relatedProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  relatedPublications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  relatedNews?: StrapiResponse<StrapiData<NewsItemAttributes>[]>;
  seo?: SharedSeo;
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

// Funding Agency
export interface FundingAgencyAttributes {
  name: string;
  fullName?: string;
  acronym?: string;
  type: 'Federal' | 'Estadual' | 'Municipal' | 'Internacional' | 'Privada' | 'Mista';
  country: string;
  websiteUrl?: string;
  logo?: StrapiMedia;
  description?: string;
  isActive: boolean;
  displayOrder?: number;
  projects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface FundingAgency extends StrapiData<FundingAgencyAttributes> {}

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

// ============================================
// Component Interfaces (for Homepage Settings)
// ============================================

export interface LayoutSectionHeader {
  id: number;
  label: string;
  title: string;
  description: string;
}

export interface LayoutSectionVisibility {
  id: number;
  showHero: boolean;
  showAbout: boolean;
  showMetrics: boolean;
  showResearch: boolean;
  showProjects: boolean;
  showTeam: boolean;
  showAlumni: boolean;
  showPartners: boolean;
  showPublications: boolean;
  showNews: boolean;
}

export interface ComponentKeyMetric {
  id: number;
  label: string;
  value: string;
  order: number;
  icon?: string;
}

export interface CtaButton {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  isVisible: boolean;
}

export interface SharedSeo {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  metaRobots?: string;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiMedia;
  ogUrl?: string;
  ogType?: string;
  ogLocale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: StrapiMedia;
}

// Research Page Settings (Single Type)
export interface ResearchPageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  principalSection: LayoutSectionHeader;
  secondarySection: LayoutSectionHeader;
  emergentSection: LayoutSectionHeader;
  ctaSection: LayoutSectionHeader;
  ctaButton: CtaButton;
  seo: SharedSeo;
  statsLabelTotal: string;
  statsLabelPrincipal: string;
  statsLabelSecondary: string;
  statsLabelEmergent: string;
  cardDetailText: string;
  emptyStateMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchPageSetting {
  id: number;
  attributes: ResearchPageSettingAttributes;
}

// Projects Page Setting (Single Type)
export interface ProjectsPageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  activeSection: LayoutSectionHeader;
  plannedSection: LayoutSectionHeader;
  finishedSection: LayoutSectionHeader;
  agenciesTitle: string;
  emptyStateMessage: string;
  seo: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsPageSetting {
  id: number;
  attributes: ProjectsPageSettingAttributes;
}

// People Page Setting (Single Type)
export interface PeopleDetailLabels {
  // Navegação
  backButtonText: string;

  // Biografia
  bioLabel: string;
  bioTitle: string;

  // Contatos
  contactsLabel: string;
  contactsTitle: string;

  // Métricas Acadêmicas
  metricsLabel: string;
  metricsTitle: string;
  hIndexTooltip: string;
  citationsLabel: string;
  publicationsCountLabel: string;

  // Formação Acadêmica
  educationLabel: string;
  educationTitle: string;

  // Linhas de Pesquisa
  researchLinesLabel: string;
  researchLinesTitle: string;

  // Projetos
  projectsLabel: string;
  projectsTitle: string;
  coordinatedProjectsLabel: string;
  participatingProjectsLabel: string;

  // Publicações
  publicationsLabel: string;
  publicationsTitle: string;
  publicationsEmptyState: string;

  // Orientações
  adviseesLabel: string;
  adviseesTitle: string;
  currentAdviseesLabel: string;
  completedAdviseesLabel: string;
  expectedDefenseLabel: string;
  currentPositionLabel: string;

  // Ensino
  teachingLabel: string;
  teachingTitle: string;
  graduateCoursesLabel: string;
  postgraduateCoursesLabel: string;

  // Prêmios e Distinções
  awardsLabel: string;
  awardsTitle: string;
  issuerLabel: string;

  // Posições Institucionais
  institutionalLabel: string;
  institutionalTitle: string;

  // Colaborações Internacionais
  collaborationsLabel: string;
  collaborationsTitle: string;

  // Links Externos
  viewProfileLabel: string;
  websiteLabel: string;
}

export interface PeoplePageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  leadersSection?: LayoutSectionHeader;
  researchersSection?: LayoutSectionHeader;
  postdocsSection?: LayoutSectionHeader;
  alumniSection?: LayoutSectionHeader;
  detailLabels?: PeopleDetailLabels;
  seo?: SharedSeo;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeoplePageSetting {
  id: number;
  attributes: PeoplePageSettingAttributes;
}

// Homepage Setting (Single Type)
export interface HomepageSettingAttributes {
  groupName: string;
  tagline: string;
  institutionalAffiliation: string;
  department: string;
  location: string;
  foundingYear: string;

  // Novos campos dinâmicos
  aboutTitle: string;
  introductionText: string; // Agora contém HTML
  heroBackground?: StrapiMedia;

  // Seções (Componentes)
  projectsSection: LayoutSectionHeader;
  teamSection: LayoutSectionHeader;
  alumniSection: LayoutSectionHeader;
  partnersSection: LayoutSectionHeader;
  publicationsSection: LayoutSectionHeader;
  newsSection: LayoutSectionHeader;

  // Configuração e Métricas
  sectionVisibility: LayoutSectionVisibility;
  keyMetrics: ComponentKeyMetric[];

  // Campos mantidos/opcionais
  logo?: StrapiMedia;
  partnerLogos?: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
        url: string;
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
      };
    }>;
  };
  defaultSeo?: SharedSeo;
  mainContactEmail?: string;
  phone?: string;
  address?: string;
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
  slug?: string;
  fullName: string;
  displayName: string;
  role: string;
  email: string;
  phone?: string;
  room?: string;
  bio?: string;
  shortBio?: string;
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
  photoUrl?: string;
  // Relações e campos complexos
  researchLines?: ResearchLineFlat[];
  publications?: PublicationFlat[];
  projects?: ProjectFlat[];
  education?: any[];
  experience?: any[];
  skills?: string[];
  teaching?: any[];
  awards?: any[];
  collaborations?: any[];
  supervisions?: any[];
}

export interface FacultyMemberDetail extends FacultyMemberFlat {
  // Campos adicionais para detalhes
  slug: string;
  biography?: string;
  academicFormation?: any[];
  awardsDistinctions?: any[];
  currentGraduateAdvisees?: any[];
  completedAdvisees?: any[];
  teachingGraduate?: string[];
  teachingPostgraduate?: string[];
  researchGateUrl?: string;
  googleScholarCitations?: number;
  institutionalPositions?: string[];
  internationalCollaborations?: string;
  // Toggles de visibilidade
  showBiography?: boolean;
  showEducation?: boolean;
  showResearchLines?: boolean;
  showProjects?: boolean;
  showPublications?: boolean;
  showAdvisees?: boolean;
  showTeaching?: boolean;
  showAwards?: boolean;
  showInstitutionalPositions?: boolean;
  showCollaborations?: boolean;
  // Relacionamentos populados
  researchLines: ResearchLineFlat[];
  coordinatedProjects?: ProjectFlat[];
  participatingProjects?: ProjectFlat[];
  publications: PublicationFlat[];
  seo?: SharedSeo;
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
  startDate?: string;
  endDate?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  featuredImageUrl?: string;
  fundingAgencies?: FundingAgencyFlat[];
}

export interface ProjectDetail extends ProjectFlat {
  // Rich Text Fields
  summary?: string;
  fullDescription?: string;
  objectives?: string;
  methodology?: string;
  expectedResults?: string;
  achievedResults?: string;
  impactLegacy?: string;
  // Additional Fields
  duration?: string;
  currentStatus?: string;
  progressPercentage?: number;
  fundingAmount?: number;
  processNumber?: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  keywords?: string[];
  gallery?: StrapiMedia;
  // Relationships mapped to page-friendly names
  coordinator?: FacultyMemberFlat;
  team: FacultyMemberFlat[]; // Mapped from teamMembers
  fundingAgencies: FundingAgencyFlat[]; // Mapped from fundingAgencies
  researchLines: ResearchLineFlat[]; // Mapped from researchLine (encapsulated in array)
  publications: PublicationFlat[]; // Mapped from relatedPublications
  partners: PartnerFlat[]; // Mapped from relatedPartners
  seo?: SharedSeo;
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
  qualis?: string;
  keywords?: string[];
  abstract?: string;
  citationBibtex?: string;
}

export interface PublicationDetail extends PublicationFlat {
  month?: number;
  abstract?: string;
  bookTitle?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  issnIsbn?: string;
  keywords?: string[];
  qualis?: string;
  impactFactor?: number;
  quartile?: string;
  pdfUrl?: string;
  pdfFile?: StrapiMedia;
  externalUrl?: string;
  repositoryUrl?: string;
  coverImage?: StrapiMedia;
  citationBibtex?: string;
  citationApa?: string;
  citationAbnt?: string;
  publicationStatus?: string;
  isOpenAccess?: boolean;
  awardReceived?: string;
  datasetUrl?: string;
  videoUrl?: string;
  supplementaryMaterials?: StrapiMedia;
  viewCount?: number;
  downloadCount?: number;
  researchLine?: ResearchLineFlat;
  relatedProject?: ProjectFlat;
  authors?: FacultyMemberFlat[];
  relatedNews?: NewsItemFlat[];
  seo?: SharedSeo;
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

export interface NewsItemDetail extends NewsItemFlat {
  summary?: string;
  content: string;
  gallery?: StrapiMedia;
  isPinned?: boolean;
  externalUrl?: string;
  eventDate?: string;
  tags?: string[];
  viewCount?: number;
  readingTime?: number;
  author?: FacultyMemberFlat;
  relatedMembers?: FacultyMemberFlat[];
  relatedProjects?: ProjectFlat[];
  relatedPublications?: PublicationFlat[];
  relatedNews?: NewsItemFlat[];
  seo?: SharedSeo;
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

export interface FundingAgencyFlat {
  id: number;
  name: string;
  fullName?: string;
  acronym?: string;
  type: string;
  country: string;
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

// ============================================
// Detail Types (for individual detail pages)
// ============================================

/**
 * ResearchLineDetail - Tipo completo para página de detalhes
 * Estende ResearchLineFlat e adiciona relacionamentos populados + SEO
 */
export interface ResearchLineDetail extends ResearchLineFlat {
  // Relacionamentos completos (arrays populados, não nested Strapi format)
  facultyMembers: FacultyMemberFlat[];
  projects: ProjectFlat[];
  publications: PublicationFlat[];

  // Campos de texto rico específicos da página de detalhes
  fullDescription?: string;
  practicalApplications?: string;
  teachingCourses?: string;
  externalCollaborations?: string;
  facilities?: string;
  keywords?: string[];

  // SEO é obrigatório na página de detalhes
  seo: SharedSeo;
}
