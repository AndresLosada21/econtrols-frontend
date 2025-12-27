import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import {
  getHomepageSettings,
  getNavbarSettings,
  getFooterSettings,
  getStrapiMediaUrl,
} from '@/lib/strapi';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettings();
  const seo = settings?.defaultSeo;

  // Preparar URL da imagem OG
  const ogImageUrl = seo?.ogImage?.data?.attributes?.url
    ? getStrapiMediaUrl(seo.ogImage.data.attributes.url)
    : undefined;

  // Preparar URL da imagem Twitter
  const twitterImageUrl = seo?.twitterImage?.data?.attributes?.url
    ? getStrapiMediaUrl(seo.twitterImage.data.attributes.url)
    : ogImageUrl; // Fallback para ogImage se twitterImage não existir

  return {
    title:
      seo?.metaTitle || 'e-Controls Research Group - UFAM | Excelência em Controle de Sistemas',
    description:
      seo?.metaDescription ||
      'Grupo de pesquisa e-Controls da UFAM. Referência em teoria de controle, sistemas tolerantes a falhas e verificação formal de software com colaborações internacionais.',
    keywords: seo?.keywords?.split(', ') || [
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
    robots: seo?.metaRobots || 'index, follow',
    alternates: seo?.canonicalURL
      ? {
          canonical: seo.canonicalURL,
        }
      : undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || 'e-Controls Research Group - UFAM',
      description: seo?.ogDescription || seo?.metaDescription || '',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
      locale: 'pt_BR',
    },
    twitter: {
      card: (seo?.twitterCard as 'summary_large_image' | 'summary') || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || '',
      description: seo?.twitterDescription || seo?.metaDescription || '',
      images: twitterImageUrl ? [twitterImageUrl] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navbarSettings = await getNavbarSettings();
  const footerSettings = await getFooterSettings();

  return (
    <html lang="pt-br" className={`scroll-smooth ${inter.variable} ${orbitron.variable}`}>
      <body
        className={`${inter.className} antialiased selection:bg-ufam-primary selection:text-white`}
      >
        <Header
          groupName={navbarSettings?.siteName}
          logoUrl={
            navbarSettings?.logo?.data?.attributes?.url
              ? getStrapiMediaUrl(navbarSettings.logo.data.attributes.url)
              : undefined
          }
          logoAlt={navbarSettings?.logoAlt}
        />
        <main>{children}</main>
        <Footer
          groupName={footerSettings?.siteName}
          logoUrl={
            footerSettings?.logo?.data?.attributes?.url
              ? getStrapiMediaUrl(footerSettings.logo.data.attributes.url)
              : undefined
          }
          logoAlt={footerSettings?.logoAlt}
          description={footerSettings?.description}
          institutionName={footerSettings?.institutionName}
          department={footerSettings?.departmentName}
          contactEmail={footerSettings?.contactInfo?.email}
          contactPhone={footerSettings?.contactInfo?.phone}
          address={`${footerSettings?.contactInfo?.address}\n${footerSettings?.contactInfo?.city}, ${footerSettings?.contactInfo?.state}\nCEP: ${footerSettings?.contactInfo?.postalCode}`}
          copyrightText={footerSettings?.copyrightText}
          bottomText={footerSettings?.bottomText}
        />
      </body>
    </html>
  );
}
