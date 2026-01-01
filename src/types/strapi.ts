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
      ext?: string;
      mime?: string;
      size?: number;
    };
  } | null;
}

export interface StrapiMediaMultiple {
  data: Array<{
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
  }> | null;
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
// Component Interfaces
// ============================================

export interface AcademicFormation {
  id: number;
  degree:
    | 'Graduação'
    | 'Especialização'
    | 'Mestrado'
    | 'Doutorado'
    | 'Pós-Doutorado'
    | 'Livre-Docência';
  field: string;
  institution: string;
  year: number;
  details?: string;
}

export interface AwardDistinction {
  id: number;
  title: string;
  event?: string;
  year: number;
  description?: string;
}

export interface Advisee {
  id: number;
  name: string;
  level: 'Doutorado' | 'Mestrado' | 'Iniciação Científica' | 'TCC';
  topic?: string;
  title?: string;
  startYear?: number;
  year?: number;
  status: 'Em andamento' | 'Concluído';
}

export interface Collaboration {
  id: number;
  institutionName: string;
  country?: string;
  collaborationType?: 'Co-development' | 'Funding' | 'Testing' | 'Support';
}

// ============================================
// Content Type Interfaces
// ============================================

// Faculty Member
export interface FacultyMemberAttributes {
  fullName: string;
  displayName: string;
  slug?: string;
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
  showContact?: boolean;
  showMetrics?: boolean;
  showAcademicLinks?: boolean;
  showSpecializations?: boolean;
  // Componentes
  academicFormation?: AcademicFormation[];
  awardsDistinctions?: AwardDistinction[];
  currentGraduateAdvisees?: Advisee[];
  completedAdvisees?: Advisee[];
  // Relações
  photo?: StrapiMedia;
  memberRole?: StrapiResponse<StrapiData<MemberRoleAttributes>>;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  coordinatedProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  participatingProjects?: StrapiResponse<StrapiData<ProjectAttributes>[]>;
  publications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyMember extends StrapiData<FacultyMemberAttributes> {}

// Research Category (Dynamic Taxonomy)
export interface ResearchCategoryAttributes {
  name: string;
  slug: string;
  sectionTitle: string;
  description?: string;
  statsLabel?: string;
  displayOrder: number;
  color: string;
  isActive: boolean;
  researchLines?: StrapiResponse<StrapiData<ResearchLineAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchCategory extends StrapiData<ResearchCategoryAttributes> {}

// Research Line
export interface ResearchLineAttributes {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category?: StrapiResponse<StrapiData<ResearchCategoryAttributes>>;
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
  gallery?: StrapiMediaMultiple;
  // Visibility Toggles
  showDescription?: boolean;
  showObjectives?: boolean;
  showMethodology?: boolean;
  showExpectedResults?: boolean;
  showAchievedResults?: boolean;
  showImpactLegacy?: boolean;
  showTeam?: boolean;
  showResearchLines?: boolean;
  showPublications?: boolean;
  showFunding?: boolean;
  showGallery?: boolean;
  showLinks?: boolean;
  showKeywords?: boolean;
  showPartners?: boolean;
  // Relationships (Backend names)
  researchLine?: StrapiResponse<StrapiData<ResearchLineAttributes>>;
  coordinator?: StrapiResponse<StrapiData<FacultyMemberAttributes>>;
  teamMembers?: StrapiResponse<StrapiData<FacultyMemberAttributes>[]>;
  relatedPublications?: StrapiResponse<StrapiData<PublicationAttributes>[]>;
  /** Partners incluem agências de fomento (type.slug === 'funding-agency') e outros parceiros */
  relatedPartners?: StrapiResponse<StrapiData<PartnerAttributes>[]>;
  relatedNews?: StrapiResponse<StrapiData<NewsItemAttributes>[]>;
  projectStatus?: StrapiResponse<StrapiData<ProjectStatusAttributes>>;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends StrapiData<ProjectAttributes> {}

// Publication
export interface PublicationAttributes {
  title: string;
  slug: string;
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
  category?: StrapiResponse<StrapiData<PublicationCategoryAttributes>>;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface Publication extends StrapiData<PublicationAttributes> {}

// Publication Category (Dynamic Taxonomy)
export interface PublicationCategoryAttributes {
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationCategory extends StrapiData<PublicationCategoryAttributes> {}

// Project Status (Dynamic Taxonomy)
export interface ProjectStatusAttributes {
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  description?: string;
  sectionLabel?: string;
  sectionTitle?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatus extends StrapiData<ProjectStatusAttributes> {}

// Member Role (Dynamic Taxonomy)
export interface MemberRoleAttributes {
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  description?: string;
  isActive: boolean;
  showInListing?: boolean;
  sectionTitle?: string;
  sectionDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRole extends StrapiData<MemberRoleAttributes> {}

// News Category (Dynamic Taxonomy)
export interface NewsCategoryAttributes {
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
  newsItems?: StrapiResponse<StrapiData<NewsItemAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface NewsCategory extends StrapiData<NewsCategoryAttributes> {}

// News Item
export interface NewsItemAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  content: string;
  newsCategory?: StrapiResponse<StrapiData<NewsCategoryAttributes>>;
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

// Partner Type (Dynamic Taxonomy)
export interface PartnerTypeAttributes {
  name: string;
  slug: string;
  sectionTitle?: string;
  description?: string;
  displayOrder: number;
  color: string;
  statsLabel?: string;
  isActive: boolean;
  showInStats: boolean;
  partners?: StrapiResponse<StrapiData<PartnerAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerType extends StrapiData<PartnerTypeAttributes> {}

// Partner
export interface PartnerAttributes {
  name: string;
  type?: StrapiResponse<StrapiData<PartnerTypeAttributes>>;
  country: string;
  state?: string;
  city?: string;
  description?: string;
  collaborationType?: string;
  websiteUrl?: string;
  supportType?: string[];
  colorTheme?: string;
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

// Degree Level (Dynamic Taxonomy)
export interface DegreeLevelAttributes {
  name: string;
  slug: string;
  pluralName?: string;
  displayOrder: number;
  alumni?: StrapiResponse<StrapiData<AlumnusAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface DegreeLevel extends StrapiData<DegreeLevelAttributes> {}

// Alumni Sector (Dynamic Taxonomy)
export interface AlumniSectorAttributes {
  name: string;
  statsLabel?: string;
  description?: string;
  color?: string;
  iconName?: string;
  alumni?: StrapiResponse<StrapiData<AlumnusAttributes>[]>;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniSector extends StrapiData<AlumniSectorAttributes> {}

// Alumni Page Setting (Single Type)
export interface AlumniPageSettingAttributes {
  pageTitle: string;
  pageDescription?: string;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniPageSetting {
  id: number;
  attributes: AlumniPageSettingAttributes;
}

// Alumnus
export interface AlumnusAttributes {
  fullName: string;
  slug?: string;
  degree?: StrapiResponse<StrapiData<DegreeLevelAttributes>>;
  thesisTitle?: string;
  advisor?: string;
  defenseYear?: number;
  currentPosition?: string;
  currentInstitution?: string;
  researchTopic?: string;
  sector?: StrapiResponse<StrapiData<AlumniSectorAttributes>>;
  linkedinUrl?: string;
  lattesUrl?: string;
  email?: string;
  publicationsCount?: number;
  displayOrder?: number;
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
export interface PeoplePageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  leadersSection?: LayoutSectionHeader;
  researchersSection?: LayoutSectionHeader;
  postdocsSection?: LayoutSectionHeader;
  alumniSection?: LayoutSectionHeader;
  seo?: SharedSeo;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeoplePageSetting {
  id: number;
  attributes: PeoplePageSettingAttributes;
}

// People Detailed Page Setting (Single Type)
export interface PeopleDetailedPageSettingAttributes {
  backButtonText: string;
  bioLabel: string;
  bioTitle: string;
  contactsLabel: string;
  contactsTitle: string;
  metricsLabel: string;
  metricsTitle: string;
  hIndexTooltip: string;
  citationsLabel: string;
  publicationsCountLabel: string;
  educationLabel: string;
  educationTitle: string;
  researchLinesLabel: string;
  researchLinesTitle: string;
  projectsLabel: string;
  projectsTitle: string;
  coordinatedProjectsLabel: string;
  participatingProjectsLabel: string;
  publicationsLabel: string;
  publicationsTitle: string;
  publicationsEmptyState: string;
  adviseesLabel: string;
  adviseesTitle: string;
  currentAdviseesLabel: string;
  completedAdviseesLabel: string;
  expectedDefenseLabel: string;
  currentPositionLabel: string;
  teachingLabel: string;
  teachingTitle: string;
  graduateCoursesLabel: string;
  postgraduateCoursesLabel: string;
  awardsLabel: string;
  awardsTitle: string;
  issuerLabel: string;
  institutionalLabel: string;
  institutionalTitle: string;
  collaborationsLabel: string;
  collaborationsTitle: string;
  viewProfileLabel: string;
  websiteLabel: string;
}

export interface PeopleDetailedPageSetting {
  id: number;
  attributes: PeopleDetailedPageSettingAttributes;
}

// Projects Detailed Page Setting (Single Type)
export interface ProjectsDetailedPageSettingAttributes {
  backButtonText: string;
  descriptionLabel: string;
  descriptionTitle: string;
  teamLabel: string;
  teamTitle: string;
  researchLinesLabel: string;
  researchLinesTitle: string;
  objectivesLabel: string;
  objectivesTitle: string;
  methodologyLabel: string;
  methodologyTitle: string;
  resultsLabel: string;
  resultsTitle: string;
  expectedResultsLabel: string;
  expectedResultsTitle: string;
  achievedResultsLabel: string;
  achievedResultsTitle: string;
  impactLabel: string;
  impactTitle: string;
  publicationsLabel: string;
  publicationsTitle: string;
  linksLabel: string;
  linksTitle: string;
  keywordsLabel: string;
  keywordsTitle: string;
  fundingAgencyLabel: string;
  fundingLabel: string;
  fundingTitle: string;
  fundingAmountLabel: string;
  periodLabel: string;
  coordinatorLabel: string;
  processLabel: string;
  durationLabel: string;
  progressLabel: string;
  websiteLabel: string;
  websiteDescription: string;
  repositoryLabel: string;
  repositoryDescription: string;
  partnersLabel: string;
  partnersTitle: string;
  galleryLabel: string;
  galleryTitle: string;
  citationsLabel: string;
}

export interface ProjectsDetailedPageSetting {
  id: number;
  attributes: ProjectsDetailedPageSettingAttributes;
}

// Research Detailed Page Setting (Single Type)
export interface ResearchDetailedPageSettingAttributes {
  backButtonText: string;
  descriptionLabel: string;
  descriptionTitle: string;
  teamLabel: string;
  teamTitle: string;
  projectsLabel: string;
  projectsTitle: string;
  keywordsLabel: string;
  keywordsTitle: string;
  applicationsLabel: string;
  applicationsTitle: string;
  publicationsLabel: string;
  publicationsTitle: string;
  teachingLabel: string;
  teachingTitle: string;
  collaborationsLabel: string;
  collaborationsTitle: string;
  facilitiesLabel: string;
  facilitiesTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
}

export interface ResearchDetailedPageSetting {
  id: number;
  attributes: ResearchDetailedPageSettingAttributes;
}

// Publications Page Setting (Single Type)
export interface PublicationsPageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  emptyStateMessage: string;
  totalLabel: string;
  citationsLabel: string;
  journalsLabel: string;
  conferencesLabel: string;
  allTabLabel: string;
  journalsTabLabel: string;
  conferencesTabLabel: string;
  chaptersTabLabel: string;
  thesesTabLabel: string;
  googleScholarUrl?: string;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationsPageSetting {
  id: number;
  attributes: PublicationsPageSettingAttributes;
}

// Publications Detailed Page Setting (Single Type)
export interface PublicationsDetailedPageSettingAttributes {
  backButtonText: string;
  abstractLabel: string;
  abstractTitle: string;
  authorsLabel: string;
  authorsTitle: string;
  researchLinesLabel: string;
  researchLinesTitle: string;
  detailsTitle: string;
  awardTitle: string;
  citationButtonLabel: string;
  downloadButtonLabel: string;
  relatedTitle: string;
  viewAllText: string;
  doiLabel: string;
}

export interface PublicationsDetailedPageSetting {
  id: number;
  attributes: PublicationsDetailedPageSettingAttributes;
}

// News Page Setting (Single Type)
export interface NewsPageSettingAttributes {
  pageTitle: string;
  pageDescription: string;
  emptyStateMessage: string;
  featuredLabel: string;
  allNewsLabel: string;
  categoriesLabel: string;
  readMoreLabel: string;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface NewsPageSetting {
  id: number;
  attributes: NewsPageSettingAttributes;
}

// News Detailed Page Setting (Single Type)
export interface NewsDetailedPageSettingAttributes {
  backButtonText: string;
  relatedTitle: string;
  shareTitle: string;
  tagsLabel: string;
  viewAllText: string;
}

export interface NewsDetailedPageSetting {
  id: number;
  attributes: NewsDetailedPageSettingAttributes;
}

// Partners Page Setting (Single Type)
export interface PartnersPageSettingAttributes {
  pageTitle: string;
  pageDescription?: string;
  statsLabelTotal: string;
  statsLabelCountries: string;
  globalPresenceTitle?: string;
  globalPresenceDescription?: string;
  emptyStateMessage: string;
  seo?: SharedSeo;
  createdAt: string;
  updatedAt: string;
}

export interface PartnersPageSetting {
  id: number;
  attributes: PartnersPageSettingAttributes;
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
  googleScholarUrl?: string;
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
  /** Dynamic role from Strapi - taxonomia dinâmica */
  memberRole: MemberRoleFlat;
  // Relações e campos complexos
  researchLines?: ResearchLineFlat[];
  publications?: PublicationFlat[];
  projects?: ProjectFlat[];
  education?: AcademicFormation[];
  experience?: any[];
  skills?: string[];
  teaching?: any[];
  awards?: AwardDistinction[];
  collaborations?: Collaboration[];
  supervisions?: Advisee[];
}

export interface FacultyMemberDetail extends FacultyMemberFlat {
  // Campos adicionais para detalhes
  slug: string;
  biography?: string;
  academicFormation?: AcademicFormation[];
  awardsDistinctions?: AwardDistinction[];
  currentGraduateAdvisees?: Advisee[];
  completedAdvisees?: Advisee[];
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
  showContact?: boolean;
  showMetrics?: boolean;
  showAcademicLinks?: boolean;
  showSpecializations?: boolean;
  // Relacionamentos populados
  researchLines: ResearchLineFlat[];
  coordinatedProjects?: ProjectFlat[];
  participatingProjects?: ProjectFlat[];
  publications: PublicationFlat[];
  /** Dynamic role from Strapi - taxonomia dinâmica (inherited from FacultyMemberFlat) */
  memberRole: MemberRoleFlat;
  seo?: SharedSeo;
}

// Research Category Flat (for components)
export interface ResearchCategoryFlat {
  id: number;
  name: string;
  slug: string;
  sectionTitle: string;
  description?: string;
  statsLabel?: string;
  displayOrder: number;
  color: string;
  isActive: boolean;
}

export interface ResearchLineFlat {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  /** Dynamic category from Strapi - taxonomia dinâmica */
  category: ResearchCategoryFlat;
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
  startDate?: string;
  endDate?: string;
  showOnHomepage: boolean;
  displayOrder?: number;
  featuredImageUrl?: string;
  /** Parceiros que são agências de fomento (filtrados de relatedPartners onde type.slug === 'funding-agency') */
  fundingAgencyPartners?: PartnerFlat[];
  /** Dynamic status from Strapi - taxonomia dinâmica */
  projectStatus: ProjectStatusFlat;
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
  gallery?: StrapiMediaMultiple;
  // Visibility Toggles
  showDescription?: boolean;
  showObjectives?: boolean;
  showMethodology?: boolean;
  showExpectedResults?: boolean;
  showAchievedResults?: boolean;
  showImpactLegacy?: boolean;
  showTeam?: boolean;
  showResearchLines?: boolean;
  showPublications?: boolean;
  showFunding?: boolean;
  showGallery?: boolean;
  showLinks?: boolean;
  showKeywords?: boolean;
  showPartners?: boolean;
  // Relationships mapped to page-friendly names
  coordinator?: FacultyMemberFlat;
  team: FacultyMemberFlat[]; // Mapped from teamMembers
  /** Parceiros que são agências de fomento (filtrados de relatedPartners onde type.slug === 'funding-agency') */
  fundingAgencyPartners: PartnerFlat[];
  researchLines: ResearchLineFlat[]; // Mapped from researchLine (encapsulated in array)
  publications: PublicationFlat[]; // Mapped from relatedPublications
  partners: PartnerFlat[]; // Mapped from relatedPartners
  /** Dynamic status from Strapi - taxonomia dinâmica (inherited from ProjectFlat) */
  projectStatus: ProjectStatusFlat;
  seo?: SharedSeo;
}

// Publication Category Flat (for components)
export interface PublicationCategoryFlat {
  id: number;
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
}

// Project Status Flat (for components)
export interface ProjectStatusFlat {
  id: number;
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  description?: string;
  sectionLabel?: string;
  sectionTitle?: string;
  isActive: boolean;
}

// Member Role Flat (for components)
export interface MemberRoleFlat {
  id: number;
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  description?: string;
  showInListing?: boolean;
  sectionTitle?: string;
  sectionDescription?: string;
}

export interface PublicationFlat {
  id: number;
  title: string;
  slug: string;
  authorsText: string;
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
  /** Dynamic category from Strapi - taxonomia dinâmica */
  category?: PublicationCategoryFlat;
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

// News Category Flat (for components)
export interface NewsCategoryFlat {
  id: number;
  name: string;
  slug: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
}

export interface NewsItemFlat {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  /** Dynamic category from Strapi - taxonomia dinâmica */
  newsCategory?: NewsCategoryFlat;
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
  /** Dynamic type from Strapi - taxonomia dinâmica */
  type: PartnerTypeFlat;
  country: string;
  city?: string;
  websiteUrl?: string;
  colorTheme?: string;
  isActive: boolean;
  logoUrl?: string;
}

// Partner Type Flat (for components)
export interface PartnerTypeFlat {
  id: number;
  name: string;
  slug: string;
  sectionTitle?: string;
  description?: string;
  displayOrder: number;
  color: string;
  statsLabel?: string;
  isActive: boolean;
  showInStats: boolean;
}

// Degree Level Flat (for components)
export interface DegreeLevelFlat {
  id: number;
  name: string;
  slug: string;
  pluralName?: string;
  displayOrder: number;
}

// Alumni Sector Flat (for components)
export interface AlumniSectorFlat {
  id: number;
  name: string;
  statsLabel?: string;
  description?: string;
  color?: string;
  iconName?: string;
}

export interface AlumnusFlat {
  id: number;
  fullName: string;
  slug?: string;
  /** Dynamic degree from Strapi - taxonomia dinâmica */
  degree: DegreeLevelFlat;
  thesisTitle?: string;
  advisor?: string;
  defenseYear?: number;
  currentPosition?: string;
  currentInstitution?: string;
  researchTopic?: string;
  /** Dynamic sector from Strapi - taxonomia dinâmica */
  sector?: AlumniSectorFlat;
  linkedinUrl?: string;
  lattesUrl?: string;
  email?: string;
  publicationsCount?: number;
  displayOrder?: number;
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

// ============================================
// Layout Component Interfaces (Navigation)
// ============================================

/**
 * Menu Link - Componente reutilizável para links de navegação
 * Usado tanto no Navbar quanto no Footer
 */
export interface LayoutMenuLink {
  id: number;
  label: string;
  url: string;
  order?: number;
  isExternal: boolean;
  icon?: string;
}

/**
 * Footer Menu Column - Coluna de links no footer
 * Contém um título e uma lista de links
 */
export interface LayoutFooterMenuColumn {
  id: number;
  title: string;
  order?: number;
  links: LayoutMenuLink[];
}

/**
 * CTA Button - Botão de call-to-action
 */
export interface LayoutCtaButton {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  isVisible: boolean;
}

/**
 * Contact Info - Informações de contato
 */
export interface LayoutContactInfo {
  id: number;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

/**
 * Social Link - Link para redes sociais
 */
export interface SharedSocialLink {
  id: number;
  platform: 'linkedin' | 'github' | 'twitter' | 'youtube' | 'instagram' | 'facebook';
  url: string;
  isVisible: boolean;
}

// ============================================
// Navbar Settings (Single Type)
// ============================================

export interface NavbarSettingAttributes {
  logo?: StrapiMedia;
  logoAlt?: string;
  siteName?: string;
  mainMenu: LayoutMenuLink[];
  ctaButton?: LayoutCtaButton;
  showSearch: boolean;
  isSticky: boolean;
  transparentOnTop: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavbarSetting {
  id: number;
  attributes: NavbarSettingAttributes;
}

// ============================================
// Footer Settings (Single Type)
// ============================================

export interface FooterSettingAttributes {
  logo?: StrapiMedia;
  logoAlt?: string;
  siteName?: string;
  description?: string;
  institutionName?: string;
  departmentName?: string;
  contactInfo?: LayoutContactInfo;
  socialLinks?: SharedSocialLink[];
  menuColumns: LayoutFooterMenuColumn[];
  copyrightText?: string;
  bottomText?: string;
  showNewsletter: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FooterSetting {
  id: number;
  attributes: FooterSettingAttributes;
}
