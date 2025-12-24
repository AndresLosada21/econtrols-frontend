'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { ProjectFlat } from '@/types/strapi';

interface ProjectCardProps {
  project: ProjectFlat;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  // Get gradient based on funding agency
  const getGradient = (agency?: string) => {
    if (!agency) return 'from-ufam-dark to-black';

    const agencyLower = agency.toLowerCase();
    if (agencyLower.includes('fapeam')) return 'from-ufam-primary to-black';
    if (agencyLower.includes('serrapilheira')) return 'from-[#7C7F87] to-black';
    if (agencyLower.includes('samsung')) return 'from-blue-900 to-slate-900';
    if (agencyLower.includes('cnpq')) return 'from-emerald-900 to-black';
    if (agencyLower.includes('capes')) return 'from-amber-900 to-black';
    if (agencyLower.includes('finep')) return 'from-purple-900 to-black';

    return 'from-ufam-dark to-black';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Em Andamento':
      case 'active':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          label: 'em andamento',
        };
      case 'Concluído':
      case 'finished':
        return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'concluído' };
      case 'Planejado':
      case 'planned':
        return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'planejado' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: status };
    }
  };

  const statusBadge = getStatusBadge(project.status);

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
            className={`absolute inset-0 bg-gradient-to-br ${getGradient(project.fundingAgency)} 
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
          className={`absolute top-4 left-4 text-xs font-tech px-2 py-1 rounded border ${statusBadge.color}`}
        >
          {statusBadge.label}
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
