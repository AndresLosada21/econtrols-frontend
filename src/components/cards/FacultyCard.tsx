'use client';

import Link from 'next/link';
import type { FacultyMemberFlat } from '@/types/strapi';
import { getRoleColors } from '@/styles/utils';

interface FacultyCardProps {
  member: FacultyMemberFlat;
  index?: number;
}

export default function FacultyCard({ member, index = 0 }: FacultyCardProps) {
  const roleColors = getRoleColors(member.role);

  return (
    <Link
      href={`/people/${member.id}`}
      className="group text-center block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Photo Container */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-800 aspect-[3/4] border-b-2 border-ufam-primary">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ufam-primary/20 to-ufam-dark">
            <span className="text-6xl font-tech text-ufam-primary/50 group-hover:text-ufam-primary/70 transition-colors">
              {member.displayName.charAt(0)}
            </span>
          </div>
        )}

        {/* Role Badge */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <span
            className={`text-white font-tech text-xs px-2 py-1 rounded backdrop-blur border lowercase ${roleColors.bg} ${roleColors.border}`}
          >
            {member.role}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-ufam-primary/0 group-hover:bg-ufam-primary/10 transition-colors duration-300" />
      </div>

      {/* Name */}
      <h4 className="text-lg font-bold text-white group-hover:text-ufam-light transition-colors font-tech">
        {member.displayName}
      </h4>

      {/* Specialization */}
      {member.specializationAreas && member.specializationAreas.length > 0 && (
        <p className="text-ufam-secondary text-sm mb-2">{member.specializationAreas[0]}</p>
      )}

      {/* Metrics */}
      {(member.hIndex || member.totalPublications) && (
        <div className="flex justify-center gap-4 mt-2 text-xs text-ufam-secondary/70">
          {member.hIndex && (
            <span className="font-tech">
              h-index: <span className="text-ufam-light">{member.hIndex}</span>
            </span>
          )}
          {member.totalPublications && (
            <span className="font-tech">
              <span className="text-ufam-light">{member.totalPublications}</span> pub.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
