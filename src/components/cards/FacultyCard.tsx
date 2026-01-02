'use client';

import Link from 'next/link';
import type {
  FacultyMemberFlat,
  PeopleCardVisibility,
  PeopleCardLabels,
  PeopleCardStyling,
} from '@/types/strapi';

interface FacultyCardProps {
  member: FacultyMemberFlat;
  index?: number;
  visibility?: PeopleCardVisibility;
  labels?: PeopleCardLabels;
  styling?: PeopleCardStyling;
}

export default function FacultyCard({
  member,
  index = 0,
  visibility,
  labels,
  styling,
}: FacultyCardProps) {
  // Configurações de visibilidade com fallback
  const showPhoto = visibility?.showPhoto ?? true;
  const showRole = visibility?.showRole ?? true;
  const showSpecialization = visibility?.showSpecialization ?? true;
  const showMetrics = visibility?.showMetrics ?? true;

  // Configurações de labels com fallback
  const hIndexLabel = labels?.hIndexLabel ?? 'h-index';
  const publicationsLabel = labels?.publicationsLabel ?? 'pub.';

  // Configurações de estilo com fallback
  const cardBg = styling?.cardBackgroundColor ?? 'bg-transparent'; // Default transparente pois o grid já tem fundo
  const photoBorder = styling?.photoBorderColor ?? 'border-ufam-primary';
  const photoGradFrom = styling?.photoPlaceholderGradientFrom ?? 'from-ufam-primary/20';
  const photoGradTo = styling?.photoPlaceholderGradientTo ?? 'to-ufam-dark';
  const roleGradFrom = styling?.roleBadgeGradientFrom ?? 'from-black/80';
  const nameColor = styling?.nameColor ?? 'text-white';
  const nameHoverColor = styling?.nameHoverColor ?? 'group-hover:text-ufam-light';
  const specializationColor = styling?.specializationColor ?? 'text-ufam-secondary';
  const metricsColor = styling?.metricsColor ?? 'text-ufam-secondary/70';
  const metricsHighlight = styling?.metricsHighlightColor ?? 'text-ufam-light';

  return (
    <Link
      href={`/people/${member.slug || member.id}`}
      className={`group text-center block ${cardBg} p-4 rounded-lg transition-all`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Photo Container */}
      {showPhoto && (
        <div
          className={`relative overflow-hidden rounded-lg mb-4 bg-gray-800 aspect-[3/4] border-b-2 ${photoBorder}`}
        >
          {member.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photoUrl}
              alt={member.displayName}
              className="w-full h-full object-cover transition-all duration-500 
                         group-hover:scale-105 opacity-80 group-hover:opacity-100
                         mix-blend-luminosity group-hover:mix-blend-normal"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${photoGradFrom} ${photoGradTo}`}
            >
              <span className="text-6xl font-tech text-ufam-primary/50 group-hover:text-ufam-primary/70 transition-colors">
                {member.displayName.charAt(0)}
              </span>
            </div>
          )}

          {/* Role Badge - usando cores dinâmicas do memberRole + gradiente configurável */}
          {showRole && (
            <div
              className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${roleGradFrom} via-black/50 to-transparent p-4`}
            >
              <span
                className={`font-tech text-xs px-2 py-1 rounded backdrop-blur border lowercase ${member.memberRole.color}`}
              >
                {member.memberRole.name}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-ufam-primary/0 group-hover:bg-ufam-primary/10 transition-colors duration-300" />
        </div>
      )}

      {/* Name */}
      <h4
        className={`text-lg font-bold ${nameColor} ${nameHoverColor} transition-colors font-tech`}
      >
        {member.displayName}
      </h4>

      {/* Specialization */}
      {showSpecialization &&
        member.specializationAreas &&
        member.specializationAreas.length > 0 && (
          <p className={`${specializationColor} text-sm mb-2`}>{member.specializationAreas[0]}</p>
        )}

      {/* Metrics */}
      {showMetrics && (member.hIndex || member.totalPublications) && (
        <div className={`flex justify-center gap-4 mt-2 text-xs ${metricsColor}`}>
          {member.hIndex && (
            <span className="font-tech">
              {hIndexLabel}: <span className={metricsHighlight}>{member.hIndex}</span>
            </span>
          )}
          {member.totalPublications && (
            <span className="font-tech">
              <span className={metricsHighlight}>{member.totalPublications}</span>{' '}
              {publicationsLabel}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
