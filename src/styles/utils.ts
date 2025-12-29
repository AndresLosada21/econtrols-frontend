/**
 * ============================================
 * Design System Utilities
 * ============================================
 *
 * Funções utilitárias para usar os tokens do Design System
 * de forma type-safe nos componentes React.
 */

import { colors } from './theme';

// ============================================
// GETTERS DE COR POR CONTEXTO
// ============================================

/**
 * Retorna as cores do badge baseado no setor do Alumni
 */
export function getSectorColors(sector: string | undefined) {
  if (!sector) return { bg: 'bg-gray-500/20', text: 'text-gray-400' };

  const sectorMap: Record<string, { bg: string; text: string }> = {
    Academia: { bg: 'bg-state-info-muted', text: 'text-blue-400' },
    Indústria: { bg: 'bg-state-success-muted', text: 'text-green-400' },
    Governo: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    Empreendedorismo: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  };

  return sectorMap[sector] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
}

/**
 * Retorna as cores do badge baseado no status do projeto
 */
export function getProjectStatusColors(status: string) {
  const statusMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
    'Em Andamento': {
      bg: 'bg-state-success-muted',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'em andamento',
    },
    active: {
      bg: 'bg-state-success-muted',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'em andamento',
    },
    Concluído: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: 'concluído',
    },
    finished: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: 'concluído',
    },
    Planejado: {
      bg: 'bg-state-info-muted',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'planejado',
    },
    planned: {
      bg: 'bg-state-info-muted',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'planejado',
    },
  };

  return (
    statusMap[status] || {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: status,
    }
  );
}

/**
 * Retorna o gradiente baseado na agência de fomento
 */
export function getFundingAgencyGradient(agency: string | undefined): string {
  if (!agency) return 'from-ufam-dark to-black';

  const agencyLower = agency.toLowerCase();
  const gradientMap: Record<string, string> = {
    fapeam: 'from-ufam-primary to-black',
    serrapilheira: 'from-[#7C7F87] to-black',
    samsung: 'from-blue-900 to-slate-900',
    cnpq: 'from-emerald-900 to-black',
    capes: 'from-amber-900 to-black',
    finep: 'from-purple-900 to-black',
  };

  // Procura por match parcial
  for (const [key, gradient] of Object.entries(gradientMap)) {
    if (agencyLower.includes(key)) {
      return gradient;
    }
  }

  return 'from-ufam-dark to-black';
}

/**
 * Retorna as cores do badge baseado no tipo de publicação
 *
 * TAXONOMIA DINÂMICA: Se o tipo não for encontrado no mapa,
 * retorna cores padrão (cinza) e usa o próprio tipo como label.
 * Isso garante que novos tipos adicionados no Strapi funcionem
 * automaticamente sem precisar editar este arquivo.
 */
export function getPublicationTypeColors(type: string): {
  bg: string;
  text: string;
  label: string;
} {
  const typeMap: Record<string, { bg: string; text: string; label: string }> = {
    // Artigos em periódicos
    'Journal Article': { bg: 'bg-state-info-muted', text: 'text-blue-400', label: 'journal' },
    // Conferências
    'Conference Paper': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'conference' },
    // Livros e capítulos
    Book: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'book' },
    'Book Chapter': { bg: 'bg-state-warning-muted', text: 'text-amber-400', label: 'book chapter' },
    // Teses
    Thesis: { bg: 'bg-state-success-muted', text: 'text-green-400', label: 'thesis' },
    'Thesis - PhD': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'phd thesis' },
    'Thesis - Masters': { bg: 'bg-teal-500/20', text: 'text-teal-400', label: 'masters thesis' },
    // Outros
    'Technical Report': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'report' },
    'Software/Tool': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'software' },
  };

  // Fallback robusto: retorna cores neutras e o tipo original como label
  // Isso garante que tipos novos (ex: "Podcast", "Patent") funcionem automaticamente
  const fallback = {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    label: type.toLowerCase(),
  };

  return typeMap[type] || fallback;
}

/**
 * @deprecated Use memberRole.color from the MemberRole taxonomy instead.
 * This function is kept for backwards compatibility but should not be used.
 * The colors are now managed dynamically via the member-role content type in Strapi.
 *
 * Retorna as cores do badge baseado no role do membro
 */
export function getRoleColors(role: string) {
  console.warn(
    '[DEPRECATED] getRoleColors() is deprecated. Use memberRole.color from the MemberRole taxonomy instead.'
  );
  const roleMap: Record<string, { bg: string; border: string }> = {
    Líder: { bg: 'bg-ufam-primary/80', border: 'border-ufam-primary' },
    'Co-líder': { bg: 'bg-ufam-secondary/80', border: 'border-ufam-secondary' },
  };

  return roleMap[role] || { bg: 'bg-black/50', border: 'border-white/20' };
}

/**
 * Retorna as cores do badge baseado na categoria da linha de pesquisa
 */
export function getResearchLineCategoryColors(category: string): string {
  const categoryMap: Record<string, string> = {
    Principal: 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30',
    Secundária: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Secundaria: 'bg-blue-500/20 text-blue-400 border-blue-500/30', // fallback sem acento
    Emergente: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return categoryMap[category] || 'bg-white/10 text-white border-white/20';
}

/**
 * Retorna as cores do badge baseado na categoria da notícia
 */
export function getNewsCategoryColors(category: string): string {
  const categoryMap: Record<string, string> = {
    Publicacao: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Publicação: 'bg-blue-500/20 text-blue-400 border-blue-500/30', // com acento
    Evento: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Premio: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Prêmio: 'bg-amber-500/20 text-amber-400 border-amber-500/30', // com acento
    Projeto: 'bg-green-500/20 text-green-400 border-green-500/30',
    Parceria: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return categoryMap[category] || 'bg-ufam-primary/20 text-ufam-primary border-ufam-primary/30';
}

// ============================================
// CSS VARIABLE HELPERS
// ============================================

/**
 * Acessa uma variável CSS do tema
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Cria uma string de cor rgba com opacidade
 */
export function withOpacity(color: string, opacity: number): string {
  // Se já é uma variável CSS, não podemos manipular
  if (color.startsWith('var(')) {
    return color;
  }

  // Converte hex para rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
}

// ============================================
// EXPORT DOS TOKENS PARA USO DIRETO
// ============================================

export { colors };

// Cores mais usadas como constantes
export const COLORS = {
  primary: colors.ufam.primary,
  secondary: colors.ufam.secondary,
  light: colors.ufam.light,
  dark: colors.ufam.dark,
  background: colors.background.primary,
  text: colors.text.primary,
  textMuted: colors.text.muted,
} as const;
