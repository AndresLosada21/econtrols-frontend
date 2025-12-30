/**
 * ============================================
 * Design System Utilities
 * ============================================
 *
 * Funções utilitárias para usar os tokens do Design System
 * de forma type-safe nos componentes React.
 *
 * NOTA: Funções de mapeamento de cores (getSectorColors, getFundingAgencyGradient, etc.)
 * foram removidas. Agora todas as cores vêm diretamente do banco de dados Strapi
 * via taxonomias dinâmicas (news-category, alumni-sector, partner.colorTheme, etc.)
 */

import { colors } from './theme';

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
