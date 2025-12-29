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
  // Fetch navigation settings from Strapi
  const navbarSettings = await getNavbarSettings();
  const footerSettings = await getFooterSettings();

  // Transform mainMenu to the format expected by Header component
  // Handles null/undefined cases gracefully
  const headerLinks =
    navbarSettings?.mainMenu?.map((item) => ({
      label: item.label,
      url: item.url,
      isExternal: item.isExternal ?? false,
    })) || [];

  // Transform ctaButton for Header
  const headerCtaButton = navbarSettings?.ctaButton
    ? {
        label: navbarSettings.ctaButton.label,
        url: navbarSettings.ctaButton.url,
        isExternal: navbarSettings.ctaButton.isExternal ?? false,
        isVisible: navbarSettings.ctaButton.isVisible ?? true,
      }
    : undefined;

  // Transform menuColumns to the format expected by Footer component
  // Deep populate: menuColumns -> links
  const footerMenuColumns =
    footerSettings?.menuColumns?.map((column) => ({
      title: column.title,
      links:
        column.links?.map((link) => ({
          label: link.label,
          url: link.url,
          isExternal: link.isExternal ?? false,
        })) || [],
    })) || [];

  // Build address string from contactInfo
  const footerAddress = footerSettings?.contactInfo
    ? `${footerSettings.contactInfo.address || ''}\n${footerSettings.contactInfo.city || ''}, ${footerSettings.contactInfo.state || ''}\nCEP: ${footerSettings.contactInfo.postalCode || ''}`
    : undefined;

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
          links={headerLinks}
          ctaButton={headerCtaButton}
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
          address={footerAddress}
          copyrightText={footerSettings?.copyrightText}
          bottomText={footerSettings?.bottomText}
          menuColumns={footerMenuColumns}
        />
      </body>
    </html>
  );
}
