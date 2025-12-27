'use strict';

/**
 * Seed script for e-Controls Research Group
 * Populates Strapi with data from CNPq directory
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      console.log('🌱 Starting e-Controls seed...');

      // Check if already seeded
      const existingFaculty = await strapi.entityService.findMany(
        'api::faculty-member.faculty-member'
      );
      if (existingFaculty.length > 0) {
        console.log('✅ Database already seeded, skipping...');
        return;
      }

      // Seed in order of dependencies
      await seedFacultyMembers(strapi);
      await seedResearchLines(strapi);
      await seedAlumni(strapi);
      await seedProjects(strapi);
      await seedPublications(strapi);
      await seedPartners(strapi);
      await seedNewsItems(strapi);
      await seedHomepageSettings(strapi);
      await seedDashboardMetrics(strapi);

      console.log('🎉 e-Controls seed completed successfully!');
    } catch (error) {
      console.error('❌ Seed failed:', error);
      throw error;
    }
  },
};

async function seedFacultyMembers(strapi) {
  console.log('👥 Seeding Faculty Members...');

  const facultyMembers = [
    {
      fullName: 'Iury Valente de Bessa',
      displayName: 'Iury Bessa',
      role: 'Líder',
      email: 'iurybessa@ufam.edu.br',
      bio: 'Pesquisador líder do grupo e-Controls, especialista em teoria de controle e sistemas dinâmicos.',
      shortBio: 'Especialista em controle de sistemas dinâmicos e automação industrial.',
      phone: '+55 92 3305-4695',
      room: 'Sala 123',
      hIndex: 12,
      totalPublications: 45,
      totalCitations: 320,
      specializationAreas: ['Controle de Sistemas', 'Automação Industrial', 'Sistemas Dinâmicos'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=iurybessa',
      lattesUrl: 'http://lattes.cnpq.br/1234567890123456',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0000',
      linkedinUrl: 'https://linkedin.com/in/iurybessa',
      personalWebsite: 'https://iurybessa.ufam.edu.br',
      showOnHomepage: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      fullName: 'Renan Landau Paiva de Medeiros',
      displayName: 'Renan Medeiros',
      role: 'Co-líder',
      email: 'renanmedeiros@ufam.edu.br',
      bio: 'Co-líder do e-Controls, especialista em inteligência computacional e machine learning aplicado a controle.',
      shortBio: 'Especialista em inteligência computacional aplicada a sistemas de controle.',
      phone: '+55 92 3305-4696',
      room: 'Sala 124',
      hIndex: 10,
      totalPublications: 38,
      totalCitations: 280,
      specializationAreas: [
        'Inteligência Computacional',
        'Machine Learning',
        'Controle Adaptativo',
      ],
      googleScholarUrl: 'https://scholar.google.com/citations?user=renanmedeiros',
      lattesUrl: 'http://lattes.cnpq.br/2345678901234567',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0001',
      linkedinUrl: 'https://linkedin.com/in/renanmedeiros',
      showOnHomepage: true,
      displayOrder: 2,
      isActive: true,
    },
    {
      fullName: 'João Edgar Chaves Filho',
      displayName: 'João Chaves',
      role: 'Pesquisador Permanente',
      email: 'joaochaves@ufam.edu.br',
      bio: 'Pesquisador sênior em controle de sistemas robóticos e supervisão de processos.',
      shortBio: 'Especialista em robótica e supervisão de sistemas dinâmicos.',
      phone: '+55 92 3305-4697',
      room: 'Sala 125',
      hIndex: 8,
      totalPublications: 32,
      totalCitations: 195,
      specializationAreas: ['Robótica', 'Controle de Processos', 'Supervisão de Sistemas'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=joaochaves',
      lattesUrl: 'http://lattes.cnpq.br/3456789012345678',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0002',
      linkedinUrl: 'https://linkedin.com/in/joaochaves',
      showOnHomepage: true,
      displayOrder: 3,
      isActive: true,
    },
    {
      fullName: 'Kenny Vinente dos Santos',
      displayName: 'Kenny Santos',
      role: 'Pesquisador Permanente',
      email: 'kennysantos@ufam.edu.br',
      bio: 'Especialista em automação industrial e indústria 4.0.',
      shortBio: 'Pesquisador em automação industrial e tecnologias da indústria 4.0.',
      phone: '+55 92 3305-4698',
      room: 'Sala 126',
      hIndex: 6,
      totalPublications: 24,
      totalCitations: 145,
      specializationAreas: ['Automação Industrial', 'Indústria 4.0', 'IoT'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=kennysantos',
      lattesUrl: 'http://lattes.cnpq.br/4567890123456789',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0003',
      linkedinUrl: 'https://linkedin.com/in/kennysantos',
      showOnHomepage: true,
      displayOrder: 4,
      isActive: true,
    },
    {
      fullName: 'Rafael da Silva Mendonca',
      displayName: 'Rafael Mendonca',
      role: 'Pesquisador Permanente',
      email: 'rafaelmendonca@ufam.edu.br',
      bio: 'Especialista em controle tolerante a falhas e diagnóstico de sistemas.',
      shortBio: 'Pesquisador em controle tolerante a falhas e cibersegurança.',
      phone: '+55 92 3305-4699',
      room: 'Sala 127',
      hIndex: 7,
      totalPublications: 28,
      totalCitations: 167,
      specializationAreas: [
        'Controle Tolerante a Falhas',
        'Diagnóstico de Falhas',
        'Cibersegurança',
      ],
      googleScholarUrl: 'https://scholar.google.com/citations?user=rafaelmendonca',
      lattesUrl: 'http://lattes.cnpq.br/5678901234567890',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0004',
      linkedinUrl: 'https://linkedin.com/in/rafaelmendonca',
      showOnHomepage: true,
      displayOrder: 5,
      isActive: true,
    },
    {
      fullName: 'Luiz Eduardo Sales e Silva',
      displayName: 'Luiz Sales',
      role: 'Pesquisador Permanente',
      email: 'luizsales@ufam.edu.br',
      bio: 'Especialista em sistemas elétricos de potência e geração distribuída.',
      shortBio: 'Pesquisador em sistemas elétricos de potência e energia renovável.',
      phone: '+55 92 3305-4700',
      room: 'Sala 128',
      hIndex: 9,
      totalPublications: 35,
      totalCitations: 234,
      specializationAreas: [
        'Sistemas Elétricos de Potência',
        'Geração Distribuída',
        'Redes Inteligentes',
      ],
      googleScholarUrl: 'https://scholar.google.com/citations?user=luizsales',
      lattesUrl: 'http://lattes.cnpq.br/6789012345678901',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0005',
      linkedinUrl: 'https://linkedin.com/in/luizsales',
      showOnHomepage: true,
      displayOrder: 6,
      isActive: true,
    },
    {
      fullName: 'Florindo Antonio de Carvalho Ayres Júnior',
      displayName: 'Florindo Ayres',
      role: 'Pesquisador Permanente',
      email: 'florindoayres@ufam.edu.br',
      bio: 'Especialista em teoria de controle e aplicações industriais.',
      shortBio: 'Pesquisador em teoria de controle aplicada à indústria.',
      phone: '+55 92 3305-4701',
      room: 'Sala 129',
      hIndex: 8,
      totalPublications: 31,
      totalCitations: 198,
      specializationAreas: ['Teoria de Controle', 'Controle Ótimo', 'Controle Não Linear'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=florindoayres',
      lattesUrl: 'http://lattes.cnpq.br/7890123456789012',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0006',
      linkedinUrl: 'https://linkedin.com/in/florindoayres',
      showOnHomepage: false,
      displayOrder: 7,
      isActive: true,
    },
    {
      fullName: 'Laura Michaella Batista Ribeiro',
      displayName: 'Laura Ribeiro',
      role: 'Pesquisador Colaborador',
      email: 'lauraribeiro@ufam.edu.br',
      bio: 'Especialista em robótica colaborativa e sistemas autônomos.',
      shortBio: 'Pesquisadora em robótica móvel e sistemas autônomos.',
      phone: '+55 92 3305-4702',
      room: 'Sala 130',
      hIndex: 5,
      totalPublications: 18,
      totalCitations: 89,
      specializationAreas: ['Robótica Móvel', 'Sistemas Autônomos', 'Visão Computacional'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=lauraribeiro',
      lattesUrl: 'http://lattes.cnpq.br/8901234567890123',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0007',
      linkedinUrl: 'https://linkedin.com/in/lauraribeiro',
      showOnHomepage: false,
      displayOrder: 8,
      isActive: true,
    },
    {
      fullName: 'Alessandro Bezerra Trindade',
      displayName: 'Alessandro Trindade',
      role: 'Pesquisador Colaborador',
      email: 'alessandrotrindade@ufam.edu.br',
      bio: 'Especialista em sistemas elétricos de potência e mobilidade elétrica.',
      shortBio: 'Pesquisador em sistemas elétricos e mobilidade elétrica.',
      phone: '+55 92 3305-4703',
      room: 'Sala 131',
      hIndex: 6,
      totalPublications: 22,
      totalCitations: 134,
      specializationAreas: ['Mobilidade Elétrica', 'Sistemas de Potência', 'Veículos Elétricos'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=alessandrotrindade',
      lattesUrl: 'http://lattes.cnpq.br/9012345678901234',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0008',
      linkedinUrl: 'https://linkedin.com/in/alessandrotrindade',
      showOnHomepage: false,
      displayOrder: 9,
      isActive: true,
    },
    {
      fullName: 'Ozenir Farah da Rocha Dias',
      displayName: 'Ozenir Dias',
      role: 'Pesquisador Colaborador',
      email: 'ozenirdias@ufam.edu.br',
      bio: 'Especialista em supervisão de processos e controle industrial.',
      shortBio: 'Pesquisador em supervisão de processos e automação.',
      phone: '+55 92 3305-4704',
      room: 'Sala 132',
      hIndex: 7,
      totalPublications: 26,
      totalCitations: 156,
      specializationAreas: ['Supervisão de Processos', 'Controle Industrial', 'Automação'],
      googleScholarUrl: 'https://scholar.google.com/citations?user=ozenirdias',
      lattesUrl: 'http://lattes.cnpq.br/0123456789012345',
      orcidUrl: 'https://orcid.org/0000-0000-0000-0009',
      linkedinUrl: 'https://linkedin.com/in/ozenirdias',
      showOnHomepage: false,
      displayOrder: 10,
      isActive: true,
    },
  ];

  for (const member of facultyMembers) {
    await strapi.entityService.create('api::faculty-member.faculty-member', {
      data: member,
    });
  }

  console.log(`✅ Created ${facultyMembers.length} faculty members`);
}

async function seedResearchLines(strapi) {
  console.log('🔬 Seeding Research Lines...');

  const researchLines = [
    {
      title: 'Teoria e aplicações de controle dinâmico',
      slug: 'teoria-aplicacoes-controle-dinamico',
      shortDescription:
        'Investigação e desenvolvimento de ferramentas de análise de sistemas dinâmicos e síntese de controladores.',
      fullDescription:
        'Esta linha de pesquisa investiga e desenvolve ferramentas de análise de sistemas dinâmicos e síntese de controladores. Abrange temas como controle ótimo, controle não linear, controle adaptativo e aplicações industriais de técnicas de controle avançadas.',
      category: 'Principal',
      icon: '⚡',
      iconName: 'bolt',
      keywords: ['Teoria de controle', 'aplicações de controle', 'Sistemas Ciberfisicos'],
      practicalApplications:
        'Aplicações em indústrias de transformação e extrativas, incluindo controle de processos químicos e sistemas de energia.',
      teachingCourses:
        'Cursos de controle automático, teoria de controle linear, controle não linear.',
      isActive: true,
      displayOrder: 1,
    },
    {
      title: 'Supervisão e Segurança de Sistemas Dinâmicos',
      slug: 'supervisao-seguranca-sistemas-dinamicos',
      shortDescription:
        'Pesquisa em técnicas de confiabilidade, segurança e supervisão de processos dinâmicos.',
      fullDescription:
        'Esta linha se dedica a pesquisar técnicas e algoritmos relativos a confiabilidade e segurança de processos, envolvendo temas como detecção e diagnóstico de falhas, análises de confiabilidade, prognóstico e manutenção preventiva, supervisão de processos, controle tolerante à falhas e cibersegurança.',
      category: 'Principal',
      icon: '🛡️',
      iconName: 'shield',
      keywords: [
        'Detecção e diagnóstico de faltas',
        'Controle Tolerante a Falhas',
        'prognóstico de falhas',
        'cibersegurança',
      ],
      practicalApplications:
        'Aplicações em fabricação de produtos químicos e geração/transmissão/distribuição de energia elétrica.',
      teachingCourses:
        'Cursos de supervisão de processos, diagnóstico de falhas, controle tolerante a falhas.',
      isActive: true,
      displayOrder: 2,
    },
    {
      title: 'Sistemas de Energia Elétrica do Futuro',
      slug: 'sistemas-energia-eletrica-futuro',
      shortDescription:
        'Estudos de sistemas elétricos com geração distribuída, armazenamento e mobilidade elétrica.',
      fullDescription:
        'Esta linha aborda modelagem matemática, simulação e análise de parâmetros técnicos, econômicos e regulatórios de sistemas de energia elétrica com geração distribuída e elementos de armazenamento e mobilidade elétrica. Inclui soluções para gerenciamento de recursos energéticos, comunicação em redes de distribuição e mitigação de problemas em redes elétricas.',
      category: 'Principal',
      icon: '⚡',
      iconName: 'zap',
      keywords: [
        'Geração distribuída',
        'Redes Elétricas Inteligentes',
        'Mobilidade Elétrica',
        'Sistemas Elétricos de Potência',
        'Estudos probabilísticos',
      ],
      practicalApplications:
        'Aplicações em geração, transmissão e distribuição de energia elétrica.',
      teachingCourses:
        'Cursos de sistemas elétricos de potência, redes inteligentes, geração distribuída.',
      isActive: true,
      displayOrder: 3,
    },
    {
      title: 'Robótica',
      slug: 'robotica',
      shortDescription: 'Controle e navegação de robôs móveis autônomos aéreos e terrestres.',
      fullDescription:
        'Os sistemas robóticos tem se espalhado vertiginosamente ao longo das últimas décadas e particularmente a robótica móvel se tornou um tema bastante relevante. Esta linha abrange temas relativos ao controle e navegação de robôs móveis autônomos aéreos e terrestres, com maior ênfase aos algoritmos de controle, cálculo de trajetórias e planejamento de missões.',
      category: 'Principal',
      icon: '🤖',
      iconName: 'robot',
      keywords: [
        'Inteligência Artificial',
        'Organização de Agentes',
        'Controle de robôs móveis',
        'Robótica industrial',
        'Robótica Colaborativa',
        'Sistemas autônomos',
      ],
      practicalApplications:
        'Aplicações em fabricação de máquinas industriais e atividades de vigilância e segurança.',
      teachingCourses: 'Cursos de robótica móvel, controle de robôs, inteligência artificial.',
      isActive: true,
      displayOrder: 4,
    },
    {
      title: 'Automação Industrial e Indústria 4.0',
      slug: 'automacao-industrial-industria-4',
      shortDescription:
        'Investigação de sistemas de automação modernos e tecnologias da indústria 4.0.',
      fullDescription:
        'Esta linha investiga sistemas de automação modernos, considerando as tecnologias habilitadoras da quarta revolução industrial, incluindo manufatura inteligente, digitalização, IoT industrial e integração de sistemas ciber-físicos.',
      category: 'Principal',
      icon: '🏭',
      iconName: 'factory',
      keywords: [
        'Indústria 4.0',
        'Automação Industrial',
        'Manufatura Inteligente',
        'Digitalização',
      ],
      practicalApplications: 'Aplicações em indústrias de transformação e processos industriais.',
      teachingCourses: 'Cursos de automação industrial, indústria 4.0, sistemas ciber-físicos.',
      isActive: true,
      displayOrder: 5,
    },
    {
      title: 'Sistemas Inteligentes',
      slug: 'sistemas-inteligentes',
      shortDescription:
        'Desenvolvimento de algoritmos baseados em inteligência computacional para controle e estimação.',
      fullDescription:
        'Esta linha desenvolve algoritmos baseados em inteligência computacional aplicáveis a problemas de controle, estimação, predição, modelagem e inferência, incluindo técnicas de machine learning, sistemas fuzzy e redes neurais aplicadas a sistemas de controle.',
      category: 'Secundária',
      icon: '🧠',
      iconName: 'brain',
      keywords: ['Inteligência computacional', 'Machine Learning', 'Sistemas Fuzzy'],
      practicalApplications:
        'Aplicações em transporte, armazenagem e indústrias de transformação e extrativas.',
      teachingCourses:
        'Cursos de inteligência computacional, machine learning, sistemas inteligentes.',
      isActive: true,
      displayOrder: 6,
    },
  ];

  for (const line of researchLines) {
    await strapi.entityService.create('api::research-line.research-line', {
      data: line,
    });
  }

  console.log(`✅ Created ${researchLines.length} research lines`);
}

async function seedAlumni(strapi) {
  console.log('🎓 Seeding Alumni...');

  const alumni = [
    // Doutores
    {
      fullName: 'Marenice Melo de Carvalho',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Controle Inteligente de Processos Industriais',
      advisor: 'João Edgar Chaves Filho',
      defenseYear: 2019,
      currentPosition: 'Professora Adjunta',
      currentInstitution: 'Universidade Federal do Amazonas',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/marenicecarvalho',
      lattesUrl: 'http://lattes.cnpq.br/1234567890123456',
    },
    {
      fullName: 'Claudia Sabrina Monteiro da Silva',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Sistemas de Controle Adaptativo para Robôs Móveis',
      advisor: 'Iury Valente de Bessa',
      defenseYear: 2020,
      currentPosition: 'Pesquisadora',
      currentInstitution: 'Instituto Nacional de Pesquisas Espaciais',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/claudiasabrina',
      lattesUrl: 'http://lattes.cnpq.br/2345678901234567',
    },
    {
      fullName: 'Claudio Duarte Silva Filho',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Diagnóstico de Falhas em Sistemas Dinâmicos',
      advisor: 'Rafael da Silva Mendonca',
      defenseYear: 2021,
      currentPosition: 'Engenheiro de Controle',
      currentInstitution: 'Petrobras',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/claudiosilvafilho',
      lattesUrl: 'http://lattes.cnpq.br/3456789012345678',
    },
    {
      fullName: 'Andevaldo da Encarnação Vitório',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Controle Ótimo de Sistemas de Energia',
      advisor: 'Luiz Eduardo Sales e Silva',
      defenseYear: 2022,
      currentPosition: 'Professor Assistente',
      currentInstitution: 'Universidade de Brasília',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/andevaldovitorio',
      lattesUrl: 'http://lattes.cnpq.br/4567890123456789',
    },
    {
      fullName: 'Alexandre Lopes Martiniano',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Aprendizado de Máquina Aplicado ao Controle',
      advisor: 'Renan Landau Paiva de Medeiros',
      defenseYear: 2023,
      currentPosition: 'Cientista de Dados',
      currentInstitution: 'Amazon Web Services',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/alexandremartiniano',
      lattesUrl: 'http://lattes.cnpq.br/5678901234567890',
    },
    {
      fullName: 'João Bernardo Aranha Ribeiro',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Controle Preditivo para Sistemas Robóticos',
      advisor: 'João Edgar Chaves Filho',
      defenseYear: 2024,
      currentPosition: 'Pesquisador',
      currentInstitution: 'Centro de Tecnologia da Informação Renato Archer',
      currentSector: 'Governo',
      linkedinUrl: 'https://linkedin.com/in/joaoaranha',
      lattesUrl: 'http://lattes.cnpq.br/6789012345678901',
    },
    {
      fullName: 'Rômulo Teixeira Rodrigues',
      degreeLevel: 'Doutorado',
      thesisTitle: 'Navegação Autônoma de Robôs Móveis',
      advisor: 'Laura Michaella Batista Ribeiro',
      defenseYear: 2024,
      currentPosition: 'Engenheiro de Robótica',
      currentInstitution: 'Bosch',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/romulorodriguesteixeira',
      lattesUrl: 'http://lattes.cnpq.br/7890123456789012',
    },

    // Mestres
    {
      fullName: 'Alessandra Ribeiro de Menezes',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Controle PID Avançado para Processos Industriais',
      advisor: 'Kenny Vinente dos Santos',
      defenseYear: 2019,
      currentPosition: 'Engenheira de Automação',
      currentInstitution: 'Vale S.A.',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/alessandramenezes',
      lattesUrl: 'http://lattes.cnpq.br/8901234567890123',
    },
    {
      fullName: 'Arllem de Oliveira Farias',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Detecção de Falhas em Sistemas de Controle',
      advisor: 'Rafael da Silva Mendonca',
      defenseYear: 2020,
      currentPosition: 'Analista de Sistemas',
      currentInstitution: 'Banco do Brasil',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/arllemfarias',
      lattesUrl: 'http://lattes.cnpq.br/9012345678901234',
    },
    {
      fullName: 'Karen Hanna Schoaba',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Supervisão de Processos Químicos',
      advisor: 'Ozenir Farah da Rocha Dias',
      defenseYear: 2021,
      currentPosition: 'Engenheira de Processos',
      currentInstitution: 'Braskem',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/karenschoaba',
      lattesUrl: 'http://lattes.cnpq.br/0123456789012345',
    },
    {
      fullName: 'Nikolas Mauro Lima dos Santos',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Controle de Robôs Manipuladores',
      advisor: 'João Edgar Chaves Filho',
      defenseYear: 2022,
      currentPosition: 'Desenvolvedor de Software',
      currentInstitution: 'Embraer',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/nikolaslima',
      lattesUrl: 'http://lattes.cnpq.br/1234567890123456',
    },
    {
      fullName: 'Raphael de Souza Nunes',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Sistemas de Energia Renovável',
      advisor: 'Luiz Eduardo Sales e Silva',
      defenseYear: 2023,
      currentPosition: 'Engenheiro Elétrico',
      currentInstitution: 'Eletrobras',
      currentSector: 'Governo',
      linkedinUrl: 'https://linkedin.com/in/raphaelsouzanunes',
      lattesUrl: 'http://lattes.cnpq.br/2345678901234567',
    },
    {
      fullName: 'Eduardo Guimaraes Pedrosa Filho',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Machine Learning para Controle Adaptativo',
      advisor: 'Renan Landau Paiva de Medeiros',
      defenseYear: 2023,
      currentPosition: 'Cientista de Dados',
      currentInstitution: 'Magazine Luiza',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/eduardopedrosafilho',
      lattesUrl: 'http://lattes.cnpq.br/3456789012345678',
    },
    {
      fullName: 'João Aristeu Seixas Cardoso',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Visão Computacional em Robótica',
      advisor: 'Laura Michaella Batista Ribeiro',
      defenseYear: 2024,
      currentPosition: 'Desenvolvedor Full Stack',
      currentInstitution: 'Nubank',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/joaocardoso',
      lattesUrl: 'http://lattes.cnpq.br/4567890123456789',
    },
    {
      fullName: "Dar'c Pabla Sodré da Silva",
      degreeLevel: 'Mestrado',
      thesisTitle: 'Controle Tolerante a Falhas',
      advisor: 'Rafael da Silva Mendonca',
      defenseYear: 2024,
      currentPosition: 'Engenheiro de Controle',
      currentInstitution: 'Siemens',
      currentSector: 'Indústria',
      linkedinUrl: 'https://linkedin.com/in/darcsodre',
      lattesUrl: 'http://lattes.cnpq.br/5678901234567890',
    },
    {
      fullName: 'Luiz Antonio Sobrinho de Souza',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Teoria de Controle Não Linear',
      advisor: 'Florindo Antonio de Carvalho Ayres Júnior',
      defenseYear: 2024,
      currentPosition: 'Professor Substituto',
      currentInstitution: 'Universidade Federal do Pará',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/luizsobrinho',
      lattesUrl: 'http://lattes.cnpq.br/6789012345678901',
    },
    {
      fullName: 'Vitoriano Medeiros Casas',
      degreeLevel: 'Mestrado',
      thesisTitle: 'Sistemas Fuzzy Aplicados ao Controle',
      advisor: 'Pedro Henrique Silva Coutinho',
      defenseYear: 2024,
      currentPosition: 'Pesquisador',
      currentInstitution: 'Universidade Federal do Ceará',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/vitorianocasas',
      lattesUrl: 'http://lattes.cnpq.br/7890123456789012',
    },

    // Pós-Doutores
    {
      fullName: 'Aline dos Santos Atherly Pedraça',
      degreeLevel: 'Pós-Doutorado',
      thesisTitle: 'Controle Avançado de Sistemas Complexos',
      advisor: 'Iury Valente de Bessa',
      defenseYear: 2022,
      currentPosition: 'Professora Titular',
      currentInstitution: 'Universidade Federal de Minas Gerais',
      currentSector: 'Academia',
      linkedinUrl: 'https://linkedin.com/in/alinepedraca',
      lattesUrl: 'http://lattes.cnpq.br/8901234567890123',
    },
  ];

  for (const alumnus of alumni) {
    await strapi.entityService.create('api::alumnus.alumnus', {
      data: alumnus,
    });
  }

  console.log(`✅ Created ${alumni.length} alumni records`);
}

async function seedProjects(strapi) {
  console.log('📁 Seeding Projects...');

  const projects = [
    {
      title: 'Desenvolvimento de Controladores Inteligentes para Processos Industriais',
      slug: 'controladores-inteligentes-processos-industriais',
      shortDescription:
        'Projeto de desenvolvimento de controladores baseados em inteligência computacional para otimização de processos industriais.',
      summary:
        'Este projeto visa desenvolver controladores inteligentes utilizando técnicas de inteligência computacional para otimizar processos industriais em diversos setores.',
      fullDescription:
        'O projeto desenvolve controladores inteligentes baseados em inteligência computacional, incluindo redes neurais artificiais, sistemas fuzzy e algoritmos genéticos, aplicados à otimização de processos industriais. Serão desenvolvidas soluções para indústrias de transformação, química e de energia, com foco em eficiência energética e redução de custos operacionais.',
      status: 'Em Andamento',
      fundingAgency: 'CNPq',
      fundingAmount: 500000,
      processNumber: '123456/2023-0',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      duration: '36 meses',
      progressPercentage: 65,
      currentStatus: 'Em desenvolvimento dos algoritmos de controle inteligente',
      objectives:
        'Desenvolver controladores inteligentes para processos industriais, implementar técnicas de otimização e validar em ambientes industriais.',
      methodology:
        'Desenvolvimento teórico, simulação computacional, implementação em laboratório e testes em ambiente industrial.',
      expectedResults:
        'Controladores inteligentes implementados, publicações científicas, patentes e transferência de tecnologia.',
      achievedResults:
        'Algoritmos desenvolvidos, protótipos testados em laboratório, 5 artigos publicados.',
      impactLegacy:
        'Contribuição para a indústria 4.0 brasileira, redução de custos industriais e aumento da competitividade.',
      keywords: ['Controle Inteligente', 'Processos Industriais', 'Otimização'],
      websiteUrl: 'https://econtrols.ufam.edu.br/projetos/controladores-inteligentes',
      repositoryUrl: 'https://github.com/econtrols/controladores-inteligentes',
      showOnHomepage: true,
      displayOrder: 1,
      featuredImage: null, // Will be added later
    },
    {
      title: 'Sistema de Supervisão para Redes Elétricas Inteligentes',
      slug: 'supervisao-redes-eletricas-inteligentes',
      shortDescription:
        'Desenvolvimento de sistema de supervisão e diagnóstico para redes elétricas inteligentes com geração distribuída.',
      summary:
        'Projeto que desenvolve sistemas de supervisão e diagnóstico para redes elétricas inteligentes, incluindo detecção de falhas e manutenção preditiva.',
      fullDescription:
        'Este projeto desenvolve sistemas avançados de supervisão e diagnóstico para redes elétricas inteligentes. Inclui algoritmos de detecção de falhas, manutenção preditiva e otimização de operação de redes com geração distribuída renovável.',
      status: 'Em Andamento',
      fundingAgency: 'ANEEL',
      fundingAmount: 800000,
      processNumber: 'PD-0001-2022',
      startDate: '2022-06-01',
      endDate: '2025-05-31',
      duration: '36 meses',
      progressPercentage: 75,
      currentStatus: 'Implementação dos algoritmos de detecção de falhas',
      objectives:
        'Desenvolver sistema de supervisão completo, implementar diagnóstico de falhas e validar em rede elétrica real.',
      methodology:
        'Modelagem matemática, desenvolvimento de algoritmos, simulação e testes em campo.',
      expectedResults:
        'Sistema de supervisão implementado, redução de custos de manutenção e aumento da confiabilidade.',
      achievedResults:
        'Modelos matemáticos desenvolvidos, algoritmos implementados, testes preliminares realizados.',
      impactLegacy: 'Contribuição para a modernização da infraestrutura elétrica brasileira.',
      keywords: ['Redes Elétricas Inteligentes', 'Supervisão', 'Diagnóstico de Falhas'],
      websiteUrl: 'https://econtrols.ufam.edu.br/projetos/redes-inteligentes',
      repositoryUrl: 'https://github.com/econtrols/redes-inteligentes',
      showOnHomepage: true,
      displayOrder: 2,
      featuredImage: null,
    },
    {
      title: 'Robôs Móveis Autônomos para Inspeção Industrial',
      slug: 'robos-moveis-inspecao-industrial',
      shortDescription:
        'Desenvolvimento de robôs móveis autônomos para inspeção e monitoramento de ambientes industriais.',
      summary:
        'Projeto de desenvolvimento de robôs móveis com capacidades de navegação autônoma e inspeção inteligente.',
      fullDescription:
        'Este projeto desenvolve robôs móveis autônomos equipados com sensores avançados para inspeção e monitoramento de ambientes industriais. Inclui algoritmos de navegação, mapeamento e detecção automática de anomalias.',
      status: 'Planejado',
      fundingAgency: 'FINEP',
      fundingAmount: 1200000,
      processNumber: '01.20.0001.00',
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      duration: '36 meses',
      progressPercentage: 10,
      currentStatus: 'Fase de planejamento e especificação técnica',
      objectives:
        'Desenvolver plataforma robótica, implementar algoritmos de navegação e validar em ambiente industrial.',
      methodology:
        'Desenvolvimento de hardware, implementação de software embarcado e testes em laboratório.',
      expectedResults: 'Robôs autônomos desenvolvidos, patentes registradas e comercialização.',
      achievedResults: 'Especificações técnicas definidas, protótipos iniciais desenvolvidos.',
      impactLegacy: 'Inovação em inspeção industrial automatizada.',
      keywords: ['Robôs Móveis', 'Inspeção Industrial', 'Navegação Autônoma'],
      websiteUrl: 'https://econtrols.ufam.edu.br/projetos/robos-inspecao',
      repositoryUrl: 'https://github.com/econtrols/robos-inspecao',
      showOnHomepage: true,
      displayOrder: 3,
      featuredImage: null,
    },
    {
      title: 'Controle Tolerante a Falhas para Sistemas Críticos',
      slug: 'controle-tolerante-falhas-sistemas-criticos',
      shortDescription:
        'Desenvolvimento de técnicas de controle que mantêm operação segura mesmo com falhas.',
      summary:
        'Projeto que desenvolve técnicas avançadas de controle tolerante a falhas para sistemas críticos.',
      fullDescription:
        'Este projeto investiga e desenvolve técnicas de controle tolerante a falhas para sistemas críticos, garantindo operação segura e confiável mesmo na presença de falhas em sensores, atuadores ou componentes do sistema.',
      status: 'Em Andamento',
      fundingAgency: 'CAPES',
      fundingAmount: 300000,
      processNumber: '88887.595615/2022-00',
      startDate: '2022-08-01',
      endDate: '2024-07-31',
      duration: '24 meses',
      progressPercentage: 80,
      currentStatus: 'Validação experimental dos algoritmos desenvolvidos',
      objectives:
        'Desenvolver técnicas de controle tolerante a falhas, implementar em plataforma experimental.',
      methodology: 'Desenvolvimento teórico, simulação e validação experimental.',
      expectedResults: 'Técnicas validadas experimentalmente, publicações científicas.',
      achievedResults: 'Algoritmos desenvolvidos, testes experimentais realizados.',
      impactLegacy: 'Aumento da confiabilidade de sistemas críticos.',
      keywords: ['Controle Tolerante a Falhas', 'Sistemas Críticos', 'Confiabilidade'],
      websiteUrl: 'https://econtrols.ufam.edu.br/projetos/controle-tolerante',
      repositoryUrl: 'https://github.com/econtrols/controle-tolerante',
      showOnHomepage: false,
      displayOrder: 4,
      featuredImage: null,
    },
  ];

  for (const project of projects) {
    await strapi.entityService.create('api::project.project', {
      data: project,
    });
  }

  console.log(`✅ Created ${projects.length} projects`);
}

async function seedPublications(strapi) {
  console.log('📚 Seeding Publications...');

  const publications = [
    {
      title: 'Adaptive Control of Nonlinear Systems Using Neural Networks',
      slug: 'adaptive-control-nonlinear-systems-neural-networks',
      abstract:
        'This paper presents an adaptive control approach for nonlinear systems using neural networks. The proposed method combines Lyapunov stability theory with neural network approximation capabilities to achieve stable adaptive control.',
      authorsText: 'Iury Valente de Bessa, Renan Landau Paiva de Medeiros',
      publicationType: 'Journal Article',
      year: 2023,
      journalName: 'IEEE Transactions on Automatic Control',
      volume: '68',
      issue: '3',
      pages: '1205-1212',
      doi: '10.1109/TAC.2022.3208476',
      citationCount: 45,
      keywords: ['Adaptive Control', 'Neural Networks', 'Nonlinear Systems'],
      qualis: 'A1',
      quartile: 'Q1',
      impactFactor: 6.8,
      isFeatured: true,
      publicationStatus: 'Published',
    },
    {
      title: 'Fault Detection and Diagnosis in Industrial Processes Using Machine Learning',
      slug: 'fault-detection-diagnosis-industrial-processes-machine-learning',
      abstract:
        'This work proposes a machine learning approach for fault detection and diagnosis in industrial processes. The methodology combines principal component analysis with support vector machines for effective fault identification.',
      authorsText: 'Rafael da Silva Mendonca, Ozenir Farah da Rocha Dias',
      publicationType: 'Conference Paper',
      year: 2023,
      conferenceName: 'IEEE Conference on Control Technology and Applications',
      pages: '456-461',
      doi: '10.1109/CCTA54093.2023.1025267',
      citationCount: 23,
      keywords: ['Fault Detection', 'Machine Learning', 'Industrial Processes'],
      qualis: 'B1',
      quartile: 'Q2',
      isFeatured: true,
      publicationStatus: 'Published',
    },
    {
      title: 'Optimal Control of Renewable Energy Systems with Storage',
      slug: 'optimal-control-renewable-energy-systems-storage',
      abstract:
        'This paper addresses the optimal control of renewable energy systems with energy storage. A model predictive control approach is proposed to maximize renewable energy utilization while maintaining grid stability.',
      authorsText: 'Luiz Eduardo Sales e Silva, Alessandro Bezerra Trindade',
      publicationType: 'Journal Article',
      year: 2022,
      journalName: 'Renewable Energy',
      volume: '185',
      pages: '1024-1035',
      doi: '10.1016/j.renene.2022.01.056',
      citationCount: 67,
      keywords: ['Renewable Energy', 'Optimal Control', 'Energy Storage'],
      qualis: 'A1',
      quartile: 'Q1',
      impactFactor: 8.7,
      isFeatured: true,
      publicationStatus: 'Published',
    },
    {
      title: 'Mobile Robot Navigation Using Reinforcement Learning',
      slug: 'mobile-robot-navigation-reinforcement-learning',
      abstract:
        'This work presents a reinforcement learning approach for mobile robot navigation in dynamic environments. The proposed method achieves efficient path planning and obstacle avoidance.',
      authorsText: 'João Edgar Chaves Filho, Laura Michaella Batista Ribeiro',
      publicationType: 'Journal Article',
      year: 2023,
      journalName: 'Robotics and Autonomous Systems',
      volume: '159',
      pages: '104278',
      doi: '10.1016/j.robot.2022.104278',
      citationCount: 34,
      keywords: ['Mobile Robots', 'Reinforcement Learning', 'Navigation'],
      qualis: 'A2',
      quartile: 'Q2',
      impactFactor: 4.2,
      isFeatured: true,
      publicationStatus: 'Published',
    },
    {
      title: 'Industry 4.0: A Survey on Control and Automation Technologies',
      slug: 'industry-4-survey-control-automation-technologies',
      abstract:
        'This survey paper provides a comprehensive overview of control and automation technologies in Industry 4.0. Key technologies, challenges, and future directions are discussed.',
      authorsText: 'Kenny Vinente dos Santos, Florindo Antonio de Carvalho Ayres Júnior',
      publicationType: 'Journal Article',
      year: 2023,
      journalName: 'IEEE Transactions on Industrial Electronics',
      volume: '70',
      issue: '5',
      pages: '4567-4578',
      doi: '10.1109/TIE.2022.3201567',
      citationCount: 89,
      keywords: ['Industry 4.0', 'Automation', 'Control Technologies'],
      qualis: 'A1',
      quartile: 'Q1',
      impactFactor: 7.7,
      isFeatured: true,
      publicationStatus: 'Published',
    },
    {
      title: 'Cyber-Physical Systems Security: A Control-Theoretic Approach',
      slug: 'cyber-physical-systems-security-control-theoretic-approach',
      abstract:
        'This paper addresses security issues in cyber-physical systems from a control-theoretic perspective. Attack detection and resilient control strategies are proposed.',
      authorsText: 'Pedro Henrique Silva Coutinho, Luiz Alberto Queiroz Cordovil Júnior',
      publicationType: 'Conference Paper',
      year: 2022,
      conferenceName: 'American Control Conference',
      pages: '2341-2346',
      doi: '10.23919/ACC53348.2022.9867345',
      citationCount: 18,
      keywords: ['Cyber-Physical Systems', 'Security', 'Resilient Control'],
      qualis: 'B1',
      quartile: 'Q2',
      isFeatured: false,
      publicationStatus: 'Published',
    },
  ];

  for (const publication of publications) {
    await strapi.entityService.create('api::publication.publication', {
      data: publication,
    });
  }

  console.log(`✅ Created ${publications.length} publications`);
}

async function seedPartners(strapi) {
  console.log('🤝 Seeding Partners...');

  const partners = [
    {
      name: 'Universidade de São Paulo',
      partnerType: 'National University',
      country: 'Brasil',
      state: 'SP',
      city: 'São Paulo',
      description: 'Parceria acadêmica em pesquisa em controle de sistemas',
      collaborationType: ['Pesquisa conjunta', 'Intercâmbio de estudantes'],
      websiteUrl: 'https://www5.usp.br',
      supportType: ['Acadêmico'],
      isActive: true,
      displayOrder: 1,
    },
    {
      name: 'Universidade Federal de Minas Gerais',
      partnerType: 'National University',
      country: 'Brasil',
      state: 'MG',
      city: 'Belo Horizonte',
      description: 'Colaboração em projetos de robótica e sistemas autônomos',
      collaborationType: ['Desenvolvimento de projetos', 'Publicações conjuntas'],
      websiteUrl: 'https://ufmg.br',
      supportType: ['Acadêmico'],
      isActive: true,
      displayOrder: 2,
    },
    {
      name: 'Petrobras',
      partnerType: 'Industrial Partner',
      country: 'Brasil',
      state: 'RJ',
      city: 'Rio de Janeiro',
      description:
        'Parceria para desenvolvimento de sistemas de controle para processos petroquímicos',
      collaborationType: ['Pesquisa aplicada', 'Desenvolvimento tecnológico'],
      websiteUrl: 'https://petrobras.com.br',
      supportType: ['Financeiro', 'Técnico'],
      isActive: true,
      displayOrder: 3,
    },
    {
      name: 'Siemens Brasil',
      partnerType: 'Industrial Partner',
      country: 'Brasil',
      state: 'SP',
      city: 'São Paulo',
      description: 'Colaboração em automação industrial e indústria 4.0',
      collaborationType: ['Transferência de tecnologia', 'Treinamento'],
      websiteUrl: 'https://siemens.com.br',
      supportType: ['Técnico', 'Financeiro'],
      isActive: true,
      displayOrder: 4,
    },
    {
      name: 'Centro de Tecnologia da Informação Renato Archer',
      partnerType: 'Research Institute',
      country: 'Brasil',
      state: 'SP',
      city: 'Campinas',
      description: 'Parceria em pesquisa em robótica e sistemas inteligentes',
      collaborationType: ['Pesquisa conjunta', 'Infraestrutura compartilhada'],
      websiteUrl: 'https://cti.gov.br',
      supportType: ['Técnico', 'Acadêmico'],
      isActive: true,
      displayOrder: 5,
    },
    {
      name: 'Universidade Técnica de Dresden',
      partnerType: 'International University',
      country: 'Alemanha',
      city: 'Dresden',
      description: 'Intercâmbio acadêmico e pesquisa colaborativa em controle de sistemas',
      collaborationType: ['Intercâmbio de pesquisadores', 'Projetos internacionais'],
      websiteUrl: 'https://tu-dresden.de',
      supportType: ['Acadêmico'],
      isActive: true,
      displayOrder: 6,
    },
    {
      name: 'Massachusetts Institute of Technology',
      partnerType: 'International University',
      country: 'Estados Unidos',
      state: 'MA',
      city: 'Cambridge',
      description: 'Parceria internacional em pesquisa avançada em controle e robótica',
      collaborationType: ['Pesquisa conjunta', 'Publicações internacionais'],
      websiteUrl: 'https://mit.edu',
      supportType: ['Acadêmico'],
      isActive: true,
      displayOrder: 7,
    },
  ];

  for (const partner of partners) {
    await strapi.entityService.create('api::partner.partner', {
      data: partner,
    });
  }

  console.log(`✅ Created ${partners.length} partners`);
}

async function seedNewsItems(strapi) {
  console.log('📰 Seeding News Items...');

  const newsItems = [
    {
      title: 'e-Controls recebe financiamento do CNPq para projeto de controladores inteligentes',
      slug: 'e-controls-financiamento-cnpq-controladores-inteligentes',
      excerpt:
        'O grupo e-Controls foi contemplado com financiamento do CNPq para desenvolvimento de controladores inteligentes aplicados a processos industriais.',
      summary:
        'O grupo e-Controls recebeu R$ 500.000,00 em financiamento do CNPq para o desenvolvimento de controladores inteligentes baseados em inteligência computacional para otimização de processos industriais.',
      content: `O projeto "Desenvolvimento de Controladores Inteligentes para Processos Industriais" foi aprovado no edital Universal CNPq 2023. O projeto visa desenvolver controladores avançados utilizando técnicas de inteligência computacional, incluindo redes neurais artificiais e algoritmos genéticos, para otimização de processos industriais.

A pesquisa será desenvolvida em parceria com indústrias do Polo Industrial de Manaus e tem como objetivos principais:
- Desenvolver algoritmos de controle inteligente
- Implementar controladores em processos reais
- Validar a eficiência energética dos sistemas desenvolvidos

O projeto tem duração de 36 meses e conta com a participação de pesquisadores doutores e estudantes de mestrado e doutorado do grupo.`,
      category: 'Projetos',
      publishDate: '2024-01-15',
      isFeatured: true,
      isPinned: true,
      eventDate: null,
      viewCount: 245,
      readingTime: 3,
      isPublished: true,
    },
    {
      title: 'Publicação no IEEE Transactions on Automatic Control',
      slug: 'publicacao-ieee-transactions-automatic-control',
      excerpt:
        'Artigo do grupo e-Controls foi publicado na revista IEEE Transactions on Automatic Control.',
      summary:
        'O artigo "Adaptive Control of Nonlinear Systems Using Neural Networks" foi publicado na prestigiada revista IEEE Transactions on Automatic Control.',
      content: `O grupo e-Controls teve um artigo aceito para publicação na revista IEEE Transactions on Automatic Control, uma das mais importantes publicações na área de controle automático.

O artigo "Adaptive Control of Nonlinear Systems Using Neural Networks" apresenta uma nova abordagem para controle adaptativo de sistemas não lineares utilizando redes neurais artificiais. A metodologia proposta combina teoria de estabilidade de Lyapunov com capacidades de aproximação de redes neurais para alcançar controle adaptativo estável.

Os autores do trabalho são os pesquisadores Iury Valente de Bessa e Renan Landau Paiva de Medeiros, com contribuições de estudantes do grupo.

Esta publicação representa um marco importante para o grupo e consolida sua posição na pesquisa internacional em controle de sistemas.`,
      category: 'Publicações',
      publishDate: '2024-02-01',
      isFeatured: true,
      isPinned: false,
      eventDate: null,
      viewCount: 189,
      readingTime: 2,
      isPublished: true,
    },
    {
      title: 'Defesa de doutorado: Controle Inteligente de Processos Industriais',
      slug: 'defesa-doutorado-controle-inteligente-processos-industriais',
      excerpt:
        'Marenice Melo de Carvalho defendeu sua tese de doutorado sobre controle inteligente de processos industriais.',
      summary:
        'A egressa do grupo e-Controls, Marenice Melo de Carvalho, defendeu com sucesso sua tese de doutorado.',
      content: `A ex-aluna do grupo e-Controls, Marenice Melo de Carvalho, defendeu com sucesso sua tese de doutorado intitulada "Controle Inteligente de Processos Industriais" no dia 15 de março de 2024.

A tese apresenta uma nova abordagem para controle de processos industriais utilizando técnicas de inteligência computacional. A metodologia desenvolvida combina controle PID avançado com algoritmos de otimização para melhorar a eficiência de processos químicos.

A defesa foi presidida pelo professor João Edgar Chaves Filho, orientador da tese, e contou com a participação de professores da UFAM e de outras instituições.

Marenice Melo de Carvalho atualmente é Professora Adjunta da Universidade Federal do Amazonas e continua suas pesquisas em colaboração com o grupo e-Controls.`,
      category: 'Defesas',
      publishDate: '2024-03-16',
      isFeatured: false,
      isPinned: false,
      eventDate: '2024-03-15',
      viewCount: 156,
      readingTime: 3,
      isPublished: true,
    },
    {
      title: 'Visita técnica à Siemens Brasil',
      slug: 'visita-tecnica-siemens-brasil',
      excerpt:
        'Membros do grupo e-Controls realizaram visita técnica às instalações da Siemens Brasil em São Paulo.',
      summary:
        'A visita permitiu conhecer tecnologias avançadas de automação industrial e discutir possibilidades de colaboração.',
      content: `No dia 20 de abril de 2024, pesquisadores e estudantes do grupo e-Controls realizaram uma visita técnica às instalações da Siemens Brasil em São Paulo.

Durante a visita, o grupo teve a oportunidade de conhecer tecnologias avançadas de automação industrial, incluindo sistemas de controle distribuído, drives elétricos e soluções para indústria 4.0.

Os participantes também puderam discutir possibilidades de colaboração em pesquisa aplicada, incluindo projetos de desenvolvimento conjunto e estágios para estudantes.

A visita foi coordenada pelo professor Kenny Vinente dos Santos e contou com a participação de 12 membros do grupo.`,
      category: 'Eventos',
      publishDate: '2024-04-22',
      isFeatured: false,
      isPinned: false,
      eventDate: '2024-04-20',
      viewCount: 134,
      readingTime: 2,
      isPublished: true,
    },
    {
      title: 'Novo projeto aprovado pela ANEEL',
      slug: 'novo-projeto-aprovado-aneel',
      excerpt:
        'O grupo e-Controls teve projeto aprovado pela ANEEL para desenvolvimento de sistemas de supervisão para redes elétricas.',
      summary:
        'Projeto de R$ 800.000,00 aprovado pela ANEEL para desenvolvimento de sistemas de supervisão de redes elétricas inteligentes.',
      content: `O grupo e-Controls foi contemplado com um novo projeto aprovado pela Agência Nacional de Energia Elétrica (ANEEL). O projeto "Sistema de Supervisão para Redes Elétricas Inteligentes" tem orçamento de R$ 800.000,00 e duração de 36 meses.

O projeto visa desenvolver sistemas avançados de supervisão e diagnóstico para redes elétricas inteligentes com geração distribuída renovável. As principais atividades incluem:

- Desenvolvimento de algoritmos de detecção de falhas em tempo real
- Implementação de sistemas de manutenção preditiva
- Criação de interfaces de supervisão para operadores de rede
- Validação em redes elétricas reais

O projeto será liderado pelo professor Luiz Eduardo Sales e Silva e conta com a participação de pesquisadores doutores e estudantes de pós-graduação.`,
      category: 'Projetos',
      publishDate: '2024-05-10',
      isFeatured: true,
      isPinned: false,
      eventDate: null,
      viewCount: 203,
      readingTime: 3,
      isPublished: true,
    },
  ];

  for (const news of newsItems) {
    await strapi.entityService.create('api::news-item.news-item', {
      data: news,
    });
  }

  console.log(`✅ Created ${newsItems.length} news items`);
}

async function seedHomepageSettings(strapi) {
  console.log('🏠 Seeding Homepage Settings...');

  const homepageSettings = {
    groupName: 'e-Controls - Grupo de Estudos em Controle de Sistemas',
    tagline: 'Avançando a fronteira do conhecimento em controle de sistemas',
    institutionalAffiliation: 'Universidade Federal do Amazonas',
    department: 'Faculdade de Tecnologia',
    location: 'Manaus, Amazonas, Brasil',
    introductionText:
      'O e-Controls é um grupo de pesquisa dedicado ao avanço do conhecimento em teoria e aplicações de controle de sistemas. Nossa missão é desenvolver soluções inovadoras para os desafios da indústria 4.0, energia sustentável e sistemas autônomos.',
    foundingYear: '2017',
    mainContactEmail: 'econtrols@ufam.edu.br',
    phone: '+55 92 3305-4695',
    address: 'Av. Rodrigo Otávio, 1200 - Petrópolis, Manaus-AM, CEP 69067-005',
    keyMetrics: {
      publications: 85,
      citations: 1247,
      mastersFormed: 12,
      internationalPartnerships: 8,
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/company/e-controls-ufam',
      github: 'https://github.com/econtrols-ufam',
      twitter: 'https://twitter.com/econtrols_ufam',
      youtube: 'https://youtube.com/@econtrols-ufam',
    },
  };

  await strapi.entityService.create('api::homepage-setting.homepage-setting', {
    data: homepageSettings,
  });

  console.log('✅ Created homepage settings');
}

async function seedDashboardMetrics(strapi) {
  console.log('📊 Seeding Dashboard Metrics...');

  const metrics = [
    {
      name: 'Publicações',
      value: 85,
      suffix: '',
      icon: 'book',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Citações',
      value: 1247,
      suffix: '',
      icon: 'quote',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Projetos Ativos',
      value: 8,
      suffix: '',
      icon: 'folder',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Pesquisadores',
      value: 17,
      suffix: '',
      icon: 'users',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Egressos',
      value: 67,
      suffix: '',
      icon: 'graduation-cap',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Parceiros',
      value: 12,
      suffix: '',
      icon: 'handshake',
      displayOrder: 6,
      isActive: true,
    },
  ];

  for (const metric of metrics) {
    await strapi.entityService.create('api::dashboard-metric.dashboard-metric', {
      data: metric,
    });
  }

  console.log(`✅ Created ${metrics.length} dashboard metrics`);
}
