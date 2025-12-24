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
│   │   ├── globals.css   # Estilos globais
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Homepage
│   ├── components/       # Componentes reutilizáveis
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Seções da página
│   │   └── ui/           # Componentes UI reutilizáveis
│   ├── lib/              # Utilitários e helpers
│   │   ├── strapi.ts     # Cliente API Strapi
│   │   └── queries/      # Queries específicas por collection
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Estilos adicionais
│   └── types/            # Definições TypeScript
│       └── strapi.ts     # Tipos das collections Strapi
├── public/               # Assets estáticos
└── .husky/               # Git hooks (pre-commit)
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
npm run format   # Formatar código com Prettier
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (use `.env.example` como referência):

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Nota**: O Strapi deve estar rodando localmente na porta 1337 com as permissões de API configuradas para acesso público às collections.

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

Configuradas no Tailwind (`tailwind.config.ts`):

```css
primary:   #00D084  /* Verde UFAM */
secondary: #00FF9D  /* Verde claro/acento */
dark:      #0A0F14  /* Fundo escuro */
bg:        #111820  /* Background painéis */
light:     #E0E0E0  /* Texto claro */
```

### Tipografia

- **Principal**: Inter (sans-serif)
- **Display**: Orbitron (títulos tech)

## Roadmap

- [x] Sprint 1: Setup & Infraestrutura
- [ ] Sprint 2: Homepage Core (Hero, Navbar, Research Lines)
- [ ] Sprint 3: Páginas Internas
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
