import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Paleta UFAM baseada no PDF de identidade visual
        ufam: {
          primary: '#103EB3', // Azul Principal (PDF pg 6)
          secondary: '#7C7F87', // Cinza Secundário (PDF pg 6)
          light: '#93B6D4', // Azul Claro Auxiliar (PDF pg 6)
          dark: '#373435', // Escuro Auxiliar (PDF pg 6)
          bg: '#0a0a0c', // Fundo muito escuro para contraste
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        tech: ['Orbitron', 'sans-serif'], // Estética Robótica/Tech
      },
    },
  },
  plugins: [],
};
export default config;
