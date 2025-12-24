'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { ProjectFlat } from '@/types/strapi';
import { getFundingAgencyGradient, getProjectStatusColors } from '@/styles/utils';

interface ProjectCardProps {
  project: ProjectFlat;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const gradient = getFundingAgencyGradient(project.fundingAgency);
  const statusColors = getProjectStatusColors(project.status);

  return (
    <Link
      href={`/projects/${project.slug || project.id}`}
      className="block bg-[#2a2a2c] rounded overflow-hidden border border-white/5 
                 hover:border-ufam-primary transition-all duration-300
                 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,62,179,0.3)]
                 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image/Gradient Header */}
      <div className="h-48 relative overflow-hidden">
        {project.featuredImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.featuredImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} 
                        group-hover:scale-110 transition-transform duration-500`}
          />
        )}

        {/* Funding Agency Badge */}
        {project.fundingAgency && (
          <div
            className="absolute top-4 right-4 bg-black/60 backdrop-blur text-xs font-tech 
                          text-white px-2 py-1 rounded border border-white/10"
          >
            {project.fundingAgency}
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 text-xs font-tech px-2 py-1 rounded border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
        >
          {statusColors.label}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-ufam-primary/0 group-hover:bg-ufam-primary/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-white mb-2 line-clamp-2 font-tech group-hover:text-ufam-light transition-colors">
          {project.title}
        </h4>

        {project.shortDescription && (
          <p className="text-ufam-secondary text-sm mb-4 line-clamp-3">
            {project.shortDescription}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {project.startDate && (
            <span className="text-xs font-tech text-ufam-secondary flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(project.startDate).getFullYear()}
            </span>
          )}

          <span className="text-ufam-light text-xs font-bold font-tech group-hover:text-ufam-primary transition-colors flex items-center gap-1">
            detalhes
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
