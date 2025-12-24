import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import type { FooterData } from '@/types/strapi';

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

function GoogleScholarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5 12 0z" />
    </svg>
  );
}

function ResearchGateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53h-.005a3.334 3.334 0 0 0 .112.44c.244.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.353-.306-.203-.517-.454-.67-.915a3.136 3.136 0 0 1-.147-.762 17.366 17.366 0 0 1-.034-.656c-.01-.26-.014-.572-.014-.939a26.401 26.401 0 0 1 .014-.938 15.821 15.821 0 0 1 .035-.656 3.19 3.19 0 0 1 .148-.764c.152-.46.363-.712.67-.916.31-.203.665-.35 1.21-.35.51 0 .836.092 1.105.272.27.18.452.394.595.689.056.122.08.182.165.182h1.495c.057 0 .14-.047.14-.141 0-.432-.174-.86-.396-1.129a3.614 3.614 0 0 0-.36-.384 3.874 3.874 0 0 0-.606-.44C20.83.19 20.075 0 19.586 0zM.53 4.97v14.06h3.422V4.97H.53zm5.753 0v14.06h2.127V12.56l3.394 6.47h2.295v-6.47l3.394 6.47h2.295V4.97h-2.127v6.152l-3.422-6.152H9.706v6.152L6.283 4.97H6.283z" />
    </svg>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
  );
}

// Map platform name to icon component
function getSocialIcon(platform: string) {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('linkedin')) return LinkedInIcon;
  if (platformLower.includes('github')) return GitHubIcon;
  if (platformLower.includes('scholar')) return GoogleScholarIcon;
  if (platformLower.includes('researchgate')) return ResearchGateIcon;
  if (platformLower.includes('orcid')) return OrcidIcon;
  if (platformLower.includes('website')) return ExternalLink;
  return Mail; // Default fallback
}

interface FooterProps {
  data?: FooterData | null;
}

export default function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Use data from Strapi or fallback to defaults
  const logoUrl = data?.logoUrl;
  const logoAlt = data?.logoAlt || 'e-Controls Logo';
  const siteName = data?.siteName || 'e-Controls';
  const description = data?.description;
  const institutionName = data?.institutionName || 'Universidade Federal do Amazonas (UFAM)';
  const departmentName =
    data?.departmentName || 'Departamento de Eletricidade - Faculdade de Tecnologia';
  const contactInfo = data?.contactInfo;
  const socialLinks = data?.socialLinks || [];
  const menuColumns = data?.menuColumns || [];
  const copyrightText =
    data?.copyrightText || 'e-Controls Research Group. Todos os direitos reservados.';
  const bottomText = data?.bottomText || 'Desenvolvido com ❤️ na Amazônia.';

  // Build address string
  const getAddressLines = () => {
    if (!contactInfo) {
      return ['Av. General Rodrigo Otávio, 6200', 'Coroado I, Manaus - AM', 'CEP: 69077-000'];
    }
    const lines = [];
    if (contactInfo.address) lines.push(contactInfo.address);
    if (contactInfo.city || contactInfo.state) {
      lines.push(
        `${contactInfo.city || ''}${contactInfo.city && contactInfo.state ? ', ' : ''}${contactInfo.state || ''}`
      );
    }
    if (contactInfo.postalCode) lines.push(`CEP: ${contactInfo.postalCode}`);
    return lines;
  };

  const addressLines = getAddressLines();
  const email = contactInfo?.email || 'iurybessa@ufam.edu.br';
  const phone = contactInfo?.phone || '+55 92 3305-1181';

  return (
    <footer id="contact" className="bg-ufam-dark pt-20 pb-10 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={140}
                  height={35}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <div className="font-tech font-bold text-2xl tracking-tighter text-white flex items-center gap-2">
                  <span className="w-3 h-3 bg-ufam-primary rounded-full"></span>
                  {siteName}
                </div>
              )}
            </div>
            {description ? (
              <p className="text-ufam-secondary max-w-sm mb-6">{description}</p>
            ) : (
              <p className="text-ufam-secondary max-w-sm mb-6">
                {departmentName}
                <br />
                {institutionName}
              </p>
            )}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = getSocialIcon(social.platform);
                const isMailto = social.url.startsWith('mailto:');
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-ufam-secondary hover:text-white hover:bg-ufam-primary transition-all"
                    aria-label={social.label || social.platform}
                    target={!isMailto ? '_blank' : undefined}
                    rel={!isMailto ? 'noopener noreferrer' : undefined}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
              {/* Always show email icon if not in social links */}
              {!socialLinks.some((s) => s.url.startsWith('mailto:')) && (
                <a
                  href={`mailto:${email}`}
                  className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-ufam-secondary hover:text-white hover:bg-ufam-primary transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 font-tech lowercase">contato</h4>
            <ul className="space-y-4 text-sm text-ufam-secondary">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ufam-primary shrink-0" />
                <span>
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-ufam-primary" />
                  <span>{phone}</span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ufam-primary" />
                <a href={`mailto:${email}`} className="hover:text-ufam-primary transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Menu Columns */}
          {menuColumns.length > 0 ? (
            menuColumns.map((column) => (
              <div key={column.id}>
                <h4 className="text-white font-bold mb-6 font-tech lowercase">{column.title}</h4>
                <ul className="space-y-2 text-sm text-ufam-secondary">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      {link.isExternal ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-ufam-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.url} className="hover:text-ufam-primary transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Default menu when no columns configured
            <div>
              <h4 className="text-white font-bold mb-6 font-tech lowercase">menu</h4>
              <ul className="space-y-2 text-sm text-ufam-secondary">
                <li>
                  <Link href="/" className="hover:text-ufam-primary transition-colors">
                    overview
                  </Link>
                </li>
                <li>
                  <Link href="/research" className="hover:text-ufam-primary transition-colors">
                    pesquisa
                  </Link>
                </li>
                <li>
                  <Link href="/people" className="hover:text-ufam-primary transition-colors">
                    equipe
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-ufam-primary transition-colors">
                    projetos
                  </Link>
                </li>
                <li>
                  <Link href="/publications" className="hover:text-ufam-primary transition-colors">
                    publicações
                  </Link>
                </li>
                <li>
                  <a
                    href="https://ufam.edu.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ufam-primary transition-colors"
                  >
                    portal ufam
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-ufam-secondary font-tech">
          <p>
            &copy; {currentYear} {copyrightText}
          </p>
          {bottomText && (
            <p className="mt-2 md:mt-0">
              {bottomText.includes('❤') ? (
                <>
                  {bottomText.split('❤')[0]}
                  <span className="text-ufam-primary">&#10084;</span>
                  {bottomText.split('❤')[1]}
                </>
              ) : (
                bottomText
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
