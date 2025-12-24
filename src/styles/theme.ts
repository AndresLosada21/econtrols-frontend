/**
 * ============================================
 * e-Controls Design System - Theme Tokens
 * ============================================
 *
 * Este arquivo centraliza TODOS os tokens de design do projeto.
 * Qualquer alteração de cor, tipografia ou espaçamento deve ser feita AQUI.
 *
 * Baseado no Manual de Identidade Visual da UFAM (PDF pg 6)
 */

// ============================================
// CORES
// ============================================

export const colors = {
  // Cores Principais UFAM (do manual de identidade visual)
  ufam: {
    primary: '#103EB3', // Azul Principal UFAM
    secondary: '#7C7F87', // Cinza Secundário
    light: '#93B6D4', // Azul Claro Auxiliar
    dark: '#373435', // Escuro Auxiliar
  },

  // Cores de Fundo
  background: {
    primary: '#0a0a0c', // Fundo principal (muito escuro)
    secondary: '#121214', // Fundo secundário
    tertiary: '#1a1a1c', // Fundo terciário (cards)
    elevated: '#2a2a2c', // Fundo elevado (cards hover)
  },

  // Cores de Texto
  text: {
    primary: '#ffffff', // Texto principal
    secondary: '#e2e8f0', // Texto secundário
    muted: '#94a3b8', // Texto suave
    disabled: '#64748b', // Texto desabilitado
  },

  // Cores de Estado
  state: {
    success: '#22c55e', // Verde sucesso
    successMuted: 'rgba(34, 197, 94, 0.2)',
    warning: '#f59e0b', // Amarelo alerta
    warningMuted: 'rgba(245, 158, 11, 0.2)',
    error: '#ef4444', // Vermelho erro
    errorMuted: 'rgba(239, 68, 68, 0.2)',
    info: '#3b82f6', // Azul info
    infoMuted: 'rgba(59, 130, 246, 0.2)',
  },

  // Cores de Borda
  border: {
    default: 'rgba(255, 255, 255, 0.05)',
    subtle: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
    accent: '#103EB3',
  },

  // Cores por Setor (Alumni)
  sector: {
    academia: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    industry: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    government: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' },
    entrepreneurship: { bg: 'rgba(249, 115, 22, 0.2)', text: '#fb923c' },
  },

  // Cores por Agência de Fomento
  fundingAgency: {
    fapeam: { from: '#103EB3', to: '#000000' },
    serrapilheira: { from: '#7C7F87', to: '#000000' },
    samsung: { from: '#1e3a5f', to: '#0f172a' },
    cnpq: { from: '#065f46', to: '#000000' },
    capes: { from: '#78350f', to: '#000000' },
    finep: { from: '#581c87', to: '#000000' },
    default: { from: '#373435', to: '#000000' },
  },

  // Cores por Tipo de Publicação
  publicationType: {
    journal: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    conference: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' },
    bookChapter: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    thesis: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
    report: { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' },
  },

  // Cores por Role (Faculty)
  role: {
    leader: { bg: 'rgba(16, 62, 179, 0.8)', border: '#103EB3' },
    coLeader: { bg: 'rgba(124, 127, 135, 0.8)', border: '#7C7F87' },
    default: { bg: 'rgba(0, 0, 0, 0.5)', border: 'rgba(255, 255, 255, 0.2)' },
  },
} as const;

// ============================================
// TIPOGRAFIA
// ============================================

export const typography = {
  // Famílias de Fonte
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    tech: ['Orbitron', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },

  // Tamanhos de Fonte (em rem)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Pesos de Fonte
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  // Alturas de Linha
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Espaçamento de Letras
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Presets de Texto (combinações prontas)
  presets: {
    // Headings
    h1: {
      fontSize: '3rem', // 48px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      fontWeight: '700',
      lineHeight: '1.375',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: '700',
      lineHeight: '1.5',
    },
    // Body
    bodyLarge: {
      fontSize: '1.125rem', // 18px
      fontWeight: '400',
      lineHeight: '1.625',
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      lineHeight: '1.5',
    },
    bodySmall: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
    },
    // Labels & Captions
    label: {
      fontSize: '0.875rem', // 14px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: '400',
      lineHeight: '1.5',
    },
    overline: {
      fontSize: '0.75rem', // 12px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

// ============================================
// ESPAÇAMENTOS
// ============================================

export const spacing = {
  // Escala Base (em rem)
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px

  // Espaçamentos Semânticos (para seções)
  section: {
    sm: '3rem', // 48px - py-12
    md: '5rem', // 80px - py-20
    lg: '6rem', // 96px - py-24
    xl: '8rem', // 128px - py-32
  },

  // Espaçamentos de Container
  container: {
    padding: '1.5rem', // 24px - px-6
    maxWidth: '80rem', // 1280px
  },

  // Gaps padronizados
  gap: {
    xs: '0.5rem', // 8px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
  },
} as const;

// ============================================
// BORDAS E RAIOS
// ============================================

export const borders = {
  // Larguras de Borda
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },

  // Raios de Borda
  radius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    full: '9999px',
  },
} as const;

// ============================================
// SOMBRAS
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',

  // Sombras com cor UFAM
  glow: {
    sm: `0 0 10px ${colors.ufam.primary}40`,
    md: `0 0 20px ${colors.ufam.primary}40`,
    lg: `0 0 30px ${colors.ufam.primary}40`,
  },

  // Sombra de elevação (cards)
  elevated: `0 10px 30px -10px ${colors.ufam.primary}30`,
} as const;

// ============================================
// TRANSIÇÕES E ANIMAÇÕES
// ============================================

export const transitions = {
  // Durações
  duration: {
    fastest: '75ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slowest: '700ms',
  },

  // Easing
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.5, 0, 0, 1)',
  },

  // Presets de Transição
  presets: {
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color, background-color, border-color 300ms ease',
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 300ms ease',
  },
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  cursor: 9999,
} as const;

// ============================================
// EXPORT COMPLETO DO TEMA
// ============================================

export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  breakpoints,
  zIndex,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;

export default theme;
