import type { Config } from 'tailwindcss';
import {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  breakpoints,
} from './src/styles/theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================
      // CORES - Centralizadas em theme.ts
      // ============================================
      colors: {
        // Cores base (CSS variables)
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Paleta UFAM
        ufam: {
          primary: colors.ufam.primary,
          secondary: colors.ufam.secondary,
          light: colors.ufam.light,
          dark: colors.ufam.dark,
          bg: colors.background.primary,
        },

        // Backgrounds
        surface: {
          primary: colors.background.primary,
          secondary: colors.background.secondary,
          tertiary: colors.background.tertiary,
          elevated: colors.background.elevated,
        },

        // Estados
        state: {
          success: colors.state.success,
          'success-muted': colors.state.successMuted,
          warning: colors.state.warning,
          'warning-muted': colors.state.warningMuted,
          error: colors.state.error,
          'error-muted': colors.state.errorMuted,
          info: colors.state.info,
          'info-muted': colors.state.infoMuted,
        },

        // Bordas
        border: {
          DEFAULT: colors.border.default,
          subtle: colors.border.subtle,
          strong: colors.border.strong,
          accent: colors.border.accent,
        },

        // Texto
        content: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          muted: colors.text.muted,
          disabled: colors.text.disabled,
        },
      },

      // ============================================
      // TIPOGRAFIA - Centralizada em theme.ts
      // ============================================
      fontFamily: {
        sans: [...typography.fontFamily.sans],
        tech: [...typography.fontFamily.tech],
        mono: [...typography.fontFamily.mono],
      },

      fontSize: {
        xs: [typography.fontSize.xs, { lineHeight: typography.lineHeight.normal }],
        sm: [typography.fontSize.sm, { lineHeight: typography.lineHeight.normal }],
        base: [typography.fontSize.base, { lineHeight: typography.lineHeight.normal }],
        lg: [typography.fontSize.lg, { lineHeight: typography.lineHeight.relaxed }],
        xl: [typography.fontSize.xl, { lineHeight: typography.lineHeight.relaxed }],
        '2xl': [typography.fontSize['2xl'], { lineHeight: typography.lineHeight.snug }],
        '3xl': [typography.fontSize['3xl'], { lineHeight: typography.lineHeight.snug }],
        '4xl': [typography.fontSize['4xl'], { lineHeight: typography.lineHeight.tight }],
        '5xl': [typography.fontSize['5xl'], { lineHeight: typography.lineHeight.tight }],
        '6xl': [typography.fontSize['6xl'], { lineHeight: typography.lineHeight.none }],
      },

      letterSpacing: {
        tighter: typography.letterSpacing.tighter,
        tight: typography.letterSpacing.tight,
        normal: typography.letterSpacing.normal,
        wide: typography.letterSpacing.wide,
        wider: typography.letterSpacing.wider,
        widest: typography.letterSpacing.widest,
      },

      // ============================================
      // ESPAÇAMENTOS - Centralizados em theme.ts
      // ============================================
      spacing: {
        // Section paddings
        'section-sm': spacing.section.sm,
        'section-md': spacing.section.md,
        'section-lg': spacing.section.lg,
        'section-xl': spacing.section.xl,
        // Container
        'container-px': spacing.container.padding,
      },

      maxWidth: {
        container: spacing.container.maxWidth,
      },

      gap: {
        xs: spacing.gap.xs,
        sm: spacing.gap.sm,
        md: spacing.gap.md,
        lg: spacing.gap.lg,
        xl: spacing.gap.xl,
      },

      // ============================================
      // BORDAS - Centralizadas em theme.ts
      // ============================================
      borderRadius: {
        none: borders.radius.none,
        sm: borders.radius.sm,
        DEFAULT: borders.radius.md,
        md: borders.radius.md,
        lg: borders.radius.lg,
        xl: borders.radius.xl,
        '2xl': borders.radius['2xl'],
        full: borders.radius.full,
      },

      borderWidth: {
        DEFAULT: borders.width.thin,
        0: borders.width.none,
        2: borders.width.medium,
        4: borders.width.thick,
      },

      // ============================================
      // SOMBRAS - Centralizadas em theme.ts
      // ============================================
      boxShadow: {
        none: shadows.none,
        sm: shadows.sm,
        DEFAULT: shadows.md,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        'glow-sm': shadows.glow.sm,
        'glow-md': shadows.glow.md,
        'glow-lg': shadows.glow.lg,
        elevated: shadows.elevated,
      },

      // ============================================
      // TRANSIÇÕES - Centralizadas em theme.ts
      // ============================================
      transitionDuration: {
        fastest: transitions.duration.fastest,
        fast: transitions.duration.fast,
        normal: transitions.duration.normal,
        slow: transitions.duration.slow,
        slowest: transitions.duration.slowest,
      },

      transitionTimingFunction: {
        linear: transitions.easing.linear,
        in: transitions.easing.in,
        out: transitions.easing.out,
        'in-out': transitions.easing.inOut,
        bounce: transitions.easing.bounce,
        smooth: transitions.easing.smooth,
      },

      // ============================================
      // BREAKPOINTS - Centralizados em theme.ts
      // ============================================
      screens: {
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        '2xl': breakpoints['2xl'],
      },

      // ============================================
      // ANIMAÇÕES CUSTOMIZADAS
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
