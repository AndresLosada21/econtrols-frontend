'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavbarData } from '@/types/strapi';

interface HeaderProps {
  data?: NavbarData | null;
}

export default function Header({ data }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use data from Strapi or fallback to defaults
  const logoUrl = data?.logoUrl;
  const logoAlt = data?.logoAlt || 'e-Controls Logo';
  const siteName = data?.siteName || 'e-Controls';
  const mainMenu = data?.mainMenu || [];
  const ctaButton = data?.ctaButton;
  const isSticky = data?.isSticky ?? true;
  const transparentOnTop = data?.transparentOnTop ?? true;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo component - uses image from Strapi (replaces text) or fallback to CSS logo + text
  const Logo = () => (
    <Link
      href="/"
      className="font-tech font-bold text-xl tracking-widest text-white flex items-center gap-2"
    >
      {logoUrl ? (
        // When logo exists in Strapi, show only the image (replaces text)
        <Image
          src={logoUrl}
          alt={logoAlt}
          width={160}
          height={40}
          className="h-10 w-auto object-contain"
        />
      ) : (
        // Fallback: CSS icon + text
        <>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute w-full h-full border-2 border-ufam-primary rounded-r-lg border-l-0"></span>
            <span className="w-2 h-2 bg-ufam-secondary rounded-full absolute left-0"></span>
          </div>
          {siteName}
        </>
      )}
    </Link>
  );

  // Get button styles based on variant
  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-ufam-primary text-white hover:bg-ufam-primary/80';
      case 'secondary':
        return 'bg-ufam-secondary text-white hover:bg-ufam-secondary/80';
      case 'ghost':
        return 'text-ufam-primary hover:bg-ufam-primary/10';
      case 'outline':
      default:
        return 'border border-ufam-primary/50 text-ufam-primary hover:bg-ufam-primary hover:text-white';
    }
  };

  return (
    <nav
      className={`${isSticky ? 'fixed' : 'relative'} w-full z-50 top-0 transition-all duration-300 border-b border-white/5 ${
        isScrolled || !transparentOnTop ? 'bg-ufam-bg/90 backdrop-blur-lg' : 'backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 font-tech text-xs text-ufam-secondary tracking-widest">
          {mainMenu.map((link) =>
            link.isExternal ? (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ufam-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.id}
                href={link.url}
                className="hover:text-ufam-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA Button */}
        {ctaButton?.isVisible &&
          (ctaButton.isExternal ? (
            <a
              href={ctaButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:block px-6 py-2 rounded font-tech text-xs transition-all lowercase ${getButtonStyles(ctaButton.variant)}`}
            >
              {ctaButton.label}
            </a>
          ) : (
            <Link
              href={ctaButton.url}
              className={`hidden sm:block px-6 py-2 rounded font-tech text-xs transition-all lowercase ${getButtonStyles(ctaButton.variant)}`}
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
            {mainMenu.map((link) =>
              link.isExternal ? (
                <a
                  key={link.id}
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
                  key={link.id}
                  href={link.url}
                  className="font-tech text-sm text-ufam-secondary hover:text-ufam-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            {ctaButton?.isVisible &&
              (ctaButton.isExternal ? (
                <a
                  href={ctaButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-6 py-2 rounded font-tech text-xs text-center transition-all lowercase ${getButtonStyles(ctaButton.variant)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaButton.label}
                </a>
              ) : (
                <Link
                  href={ctaButton.url}
                  className={`inline-block px-6 py-2 rounded font-tech text-xs text-center transition-all lowercase ${getButtonStyles(ctaButton.variant)}`}
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
