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
 */
export function getPublicationTypeColors(type: string) {
  const typeMap: Record<string, { bg: string; text: string; label: string }> = {
    'Journal Article': { bg: 'bg-state-info-muted', text: 'text-blue-400', label: 'journal' },
    'Conference Paper': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'conference' },
    'Book Chapter': { bg: 'bg-state-warning-muted', text: 'text-amber-400', label: 'book chapter' },
    Thesis: { bg: 'bg-state-success-muted', text: 'text-green-400', label: 'thesis' },
    'Technical Report': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'report' },
  };

  return typeMap[type] || { bg: 'bg-gray-500/20', text: 'text-gray-400', label: type };
}

/**
 * Retorna as cores do badge baseado no role do membro
 */
export function getRoleColors(role: string) {
  const roleMap: Record<string, { bg: string; border: string }> = {
    Líder: { bg: 'bg-ufam-primary/80', border: 'border-ufam-primary' },
    'Co-líder': { bg: 'bg-ufam-secondary/80', border: 'border-ufam-secondary' },
  };

  return roleMap[role] || { bg: 'bg-black/50', border: 'border-white/20' };
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
