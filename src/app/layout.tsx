import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "e-Controls Research Group - UFAM | Excelência em Controle de Sistemas na Amazônia",
  description: "Grupo de pesquisa e-Controls da UFAM. Referência em teoria de controle, sistemas tolerantes a falhas e verificação formal de software com colaborações internacionais.",
  keywords: ["UFAM", "e-Controls", "Controle de Sistemas", "Verificação Formal", "Sistemas Tolerantes a Falhas", "Robótica", "Indústria 4.0", "Manaus", "Amazonas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased selection:bg-ufam-green selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
