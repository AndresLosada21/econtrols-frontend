import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import { getNavbarData, getFooterData } from '@/lib/strapi';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch navbar and footer data in parallel
  const [navbarData, footerData] = await Promise.all([getNavbarData(), getFooterData()]);

  return (
    <html lang="pt-br" className={`scroll-smooth ${inter.variable} ${orbitron.variable}`}>
      <body
        className={`${inter.className} antialiased selection:bg-ufam-primary selection:text-white`}
      >
        <Header data={navbarData} />
        <main>{children}</main>
        <Footer data={footerData} />
      </body>
    </html>
  );
}
