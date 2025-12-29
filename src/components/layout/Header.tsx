'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// Interface para links de navegação dinâmicos
interface NavLink {
  label: string;
  url: string;
  isExternal: boolean;
}

interface HeaderProps {
  groupName?: string;
  logoUrl?: string;
  logoAlt?: string;
  links?: NavLink[];
  ctaButton?: {
    label: string;
    url: string;
    isExternal: boolean;
    isVisible: boolean;
  };
}

// Links padrão (fallback caso não venha do Strapi)
const defaultNavLinks: NavLink[] = [
  { url: '/research', label: '/pesquisa', isExternal: false },
  { url: '/people', label: '/equipe', isExternal: false },
  { url: '/projects', label: '/projetos', isExternal: false },
  { url: '/partners', label: '/parceiros', isExternal: false },
  { url: '/publications', label: '/publicações', isExternal: false },
  { url: '/news', label: '/notícias', isExternal: false },
];

export default function Header({
  groupName = 'e-Controls',
  logoUrl,
  logoAlt = 'Logo',
  links = defaultNavLinks,
  ctaButton = { label: 'contato', url: '#contact', isExternal: false, isVisible: true },
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Usa os links passados via props, ou fallback para os padrões
  const navLinks = links.length > 0 ? links : defaultNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 border-b border-white/5 ${
        isScrolled ? 'bg-ufam-bg/90 backdrop-blur-lg' : 'backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="font-tech font-bold text-xl tracking-widest text-white flex items-center gap-2"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <>
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className="absolute w-full h-full border-2 border-ufam-primary rounded-r-lg border-l-0"></span>
                <span className="w-2 h-2 bg-ufam-secondary rounded-full absolute left-0"></span>
              </div>
              {groupName}
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 font-tech text-xs text-ufam-secondary tracking-widest">
          {navLinks.map((link, index) =>
            link.isExternal ? (
              <a
                key={`${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ufam-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={`${link.url}-${index}`}
                href={link.url}
                className="hover:text-ufam-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Contact Button */}
        {ctaButton.isVisible &&
          (ctaButton.isExternal ? (
            <a
              href={ctaButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all lowercase"
            >
              {ctaButton.label}
            </a>
          ) : (
            <Link
              href={ctaButton.url}
              className="hidden sm:block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all lowercase"
            >
              {ctaButton.label}
            </Link>
          ))}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ufam-bg/95 backdrop-blur-lg border-t border-white/5">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link, index) =>
              link.isExternal ? (
                <a
                  key={`mobile-${link.url}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-tech text-sm text-ufam-secondary hover:text-ufam-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={`mobile-${link.url}-${index}`}
                  href={link.url}
                  className="font-tech text-sm text-ufam-secondary hover:text-ufam-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            {ctaButton.isVisible &&
              (ctaButton.isExternal ? (
                <a
                  href={ctaButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all text-center lowercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaButton.label}
                </a>
              ) : (
                <Link
                  href={ctaButton.url}
                  className="inline-block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all text-center lowercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaButton.label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
