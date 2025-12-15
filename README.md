# e-Controls Research Group - Frontend

Website oficial do Grupo de Pesquisa e-Controls da Universidade Federal do Amazonas (UFAM).

## Sobre o Projeto

Este projeto é o frontend do website institucional do grupo e-Controls, desenvolvido em Next.js com TypeScript e Tailwind CSS. O objetivo é criar uma plataforma moderna, profissional e performática para divulgar as pesquisas, publicações, projetos e membros do grupo.

## Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Hooks
- **Backend**: Strapi CMS (API separada)
- **Fontes**: Inter (principal) + JetBrains Mono (técnico)

## Estrutura do Projeto

```
econtrols-frontend/
├── src/
│   ├── app/              # App Router (páginas e layouts)
│   ├── components/       # Componentes reutilizáveis
│   ├── lib/             # Utilitários e helpers
│   └── types/           # Definições TypeScript
├── public/              # Assets estáticos
├── .github/             # Workflows e configurações GitHub
└── docs/                # Documentação adicional
```

## Páginas Principais

### Fase 1 (MVP)
- `/` - Home/Overview
- `/research` - Linhas de Pesquisa
- `/projects` - Projetos (Ativos e Concluídos)
- `/people` - Equipe (Faculty e Alumni)
- `/publications` - Publicações Científicas
- `/news` - Notícias e Atualizações
- `/partners` - Parceiros e Colaborações

### Fase 2 (Futuras)
- `/dashboard` - Dashboard com métricas
- `/opportunities` - Oportunidades de pesquisa
- `/gallery` - Galeria de fotos e vídeos

## Como Executar Localmente

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/AndresLosada21/econtrols-frontend.git

# Entrar na pasta do projeto
cd econtrols-frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Scripts Disponíveis

```bash
npm run dev      # Executar em modo desenvolvimento
npm run build    # Criar build de produção
npm run start    # Executar build de produção
npm run lint     # Executar linter
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

### Padrão de Commits

Seguimos o padrão Conventional Commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Testes
- `chore:` - Tarefas de manutenção

## Design System

### Cores Principais

```css
--ufam-green: #00D084    /* Verde UFAM (primária) */
--ufam-dark: #0A0F14     /* Fundo escuro */
--ufam-panel: #111820    /* Painéis */
--ufam-accent: #00FF9D   /* Acento */
```

### Tipografia

- **Principal**: Inter (sans-serif)
- **Técnica**: JetBrains Mono (monospace)

## Roadmap

- [ ] Sprint 1: Setup & Infraestrutura
- [ ] Sprint 2: Páginas Principais
- [ ] Sprint 3: Integração com Strapi
- [ ] Sprint 4: Componentes Avançados
- [ ] Sprint 5: Otimização e Testes
- [ ] Sprint 6: Deploy em Produção

## Licença

Este projeto é propriedade do Grupo e-Controls da UFAM.

## Contato

**Coordenador**: Prof. Dr. Iury Valente de Bessa  
**Email**: iurybessa@ufam.edu.br  
**Website**: [Em construção]

---

Desenvolvido com tecnologia na Amazônia.
