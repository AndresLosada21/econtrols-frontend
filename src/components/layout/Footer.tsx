import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'overview' },
  { href: '/research', label: 'pesquisa' },
  { href: '/people', label: 'equipe' },
  { href: '/projects', label: 'projetos' },
  { href: '/partners', label: 'parceiros' },
  { href: '/publications', label: 'publicações' },
  { href: '/news', label: 'notícias' },
  { href: 'https://ufam.edu.br', label: 'portal ufam', external: true },
];

// SVG Icons inline para evitar problemas de depreciação
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface SocialLink {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface FooterProps {
  groupName?: string;
  logoUrl?: string;
  logoAlt?: string;
  description?: string;
  institutionName?: string;
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  copyrightText?: string;
  bottomText?: string;
}

export default function Footer({
  groupName = 'e-Controls',
  logoUrl,
  logoAlt = 'Logo',
  description = 'Grupo de pesquisa em controle e automação da UFAM',
  institutionName = 'Universidade Federal do Amazonas (UFAM)',
  department = 'Departamento de Eletricidade - Faculdade de Tecnologia',
  contactEmail = 'iurybessa@ufam.edu.br',
  contactPhone = '+55 92 3305-1181',
  address = 'Av. General Rodrigo Otávio, 6200\nCoroado I, Manaus - AM\nCEP: 69077-000',
  copyrightText = 'e-Controls Research Group. Todos os direitos reservados.',
  bottomText = 'Desenvolvido com ❤️ na Amazônia.',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { href: '#', Icon: LinkedInIcon, label: 'LinkedIn' },
    { href: '#', Icon: GitHubIcon, label: 'GitHub' },
    { href: `mailto:${contactEmail}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <footer id="contact" className="bg-ufam-dark pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            {logoUrl ? (
              <div className="mb-6">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={180}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
            ) : (
              <div className="font-tech font-bold text-2xl tracking-tighter text-white flex items-center gap-2 mb-6">
                <span className="w-3 h-3 bg-ufam-primary rounded-full"></span>
                {groupName}
              </div>
            )}
            <p className="text-ufam-secondary max-w-sm mb-2">{description}</p>
            <p className="text-ufam-secondary max-w-sm mb-2">{department}</p>
            <p className="text-ufam-secondary max-w-sm mb-6">{institutionName}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-ufam-secondary hover:text-white hover:bg-ufam-primary transition-all"
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 font-tech lowercase">contato</h4>
            <ul className="space-y-4 text-sm text-ufam-secondary">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ufam-primary shrink-0" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ufam-primary" />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ufam-primary" />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-tech lowercase">menu</h4>
            <ul className="space-y-2 text-sm text-ufam-secondary">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ufam-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-ufam-primary transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-ufam-secondary font-tech">
          <p>
            &copy; {currentYear} {copyrightText}
          </p>
          <p className="mt-2 md:mt-0">{bottomText}</p>
        </div>
      </div>
    </footer>
  );
}
