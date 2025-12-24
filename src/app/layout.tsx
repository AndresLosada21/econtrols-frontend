import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'e-Controls Research Group - UFAM | Excelência em Controle de Sistemas',
  description:
    'Grupo de pesquisa e-Controls da UFAM. Referência em teoria de controle, sistemas tolerantes a falhas e verificação formal de software com colaborações internacionais.',
  keywords: [
    'UFAM',
    'e-Controls',
    'Controle de Sistemas',
    'Verificação Formal',
    'Sistemas Tolerantes a Falhas',
    'Robótica',
    'Indústria 4.0',
    'Manaus',
    'Amazonas',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`scroll-smooth ${inter.variable} ${orbitron.variable}`}>
      <body
        className={`${inter.className} antialiased selection:bg-ufam-primary selection:text-white`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
