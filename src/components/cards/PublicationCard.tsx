'use client';

import Link from 'next/link';
import { ExternalLink, Quote } from 'lucide-react';
import type { PublicationFlat } from '@/types/strapi';

interface PublicationCardProps {
  publication: PublicationFlat;
  index?: number;
}

export default function PublicationCard({ publication, index = 0 }: PublicationCardProps) {
  // Get publication type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Journal Article':
        return { color: 'bg-blue-500/20 text-blue-400', label: 'journal' };
      case 'Conference Paper':
        return { color: 'bg-purple-500/20 text-purple-400', label: 'conference' };
      case 'Book Chapter':
        return { color: 'bg-amber-500/20 text-amber-400', label: 'book chapter' };
      case 'Thesis':
        return { color: 'bg-green-500/20 text-green-400', label: 'thesis' };
      case 'Technical Report':
        return { color: 'bg-gray-500/20 text-gray-400', label: 'report' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', label: type };
    }
  };

  const typeBadge = getTypeBadge(publication.publicationType);
  const venue = publication.journalName || publication.conferenceName;

  return (
    <div
      className="bg-ufam-dark border border-white/5 p-6 rounded hover:border-ufam-primary/30 
                 transition-all duration-300 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-start">
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          {/* Year Badge + Type Badge */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-block px-2 py-1 bg-ufam-primary/20 text-ufam-light text-xs font-tech rounded">
              {publication.year}
            </span>
            <span className={`inline-block px-2 py-1 text-xs font-tech rounded ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
          </div>

          {/* Title (clickable) */}
          <Link href={`/publications/${publication.slug || publication.id}`}>
            <h4
              className="text-lg md:text-xl font-bold text-white mb-2 hover:text-ufam-light 
                         cursor-pointer font-tech transition-colors line-clamp-2"
            >
              {publication.title}
            </h4>
          </Link>

          {/* Authors */}
          <p className="text-ufam-secondary text-sm mb-2 line-clamp-1">{publication.authorsText}</p>

          {/* Venue */}
          {venue && <p className="text-ufam-secondary/70 text-sm italic">{venue}</p>}
        </div>

        {/* Metrics and Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Citations */}
          {publication.citationCount !== undefined && publication.citationCount > 0 && (
            <div className="text-center px-4 py-2 bg-black/30 rounded min-w-[70px]">
              <span className="block text-xl font-bold text-white font-tech">
                {publication.citationCount}
              </span>
              <span className="text-[10px] text-ufam-secondary uppercase tracking-wider flex items-center justify-center gap-1">
                <Quote className="w-2 h-2" />
                citações
              </span>
            </div>
          )}

          {/* External Link (DOI) */}
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-full hover:bg-ufam-primary hover:text-white 
                         transition-colors text-ufam-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
