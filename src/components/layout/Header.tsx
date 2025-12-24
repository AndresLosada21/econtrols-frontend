'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/research', label: '/pesquisa' },
  { href: '/people', label: '/equipe' },
  { href: '/projects', label: '/projetos' },
  { href: '/partners', label: '/parceiros' },
  { href: '/publications', label: '/publicações' },
  { href: '/news', label: '/notícias' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute w-full h-full border-2 border-ufam-primary rounded-r-lg border-l-0"></span>
            <span className="w-2 h-2 bg-ufam-secondary rounded-full absolute left-0"></span>
          </div>
          e-Controls
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 font-tech text-xs text-ufam-secondary tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ufam-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact Button */}
        <Link
          href="#contact"
          className="hidden sm:block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all lowercase"
        >
          contato
        </Link>

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-tech text-sm text-ufam-secondary hover:text-ufam-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="inline-block px-6 py-2 border border-ufam-primary/50 rounded text-ufam-primary font-tech text-xs hover:bg-ufam-primary hover:text-white transition-all text-center lowercase"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              contato
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
