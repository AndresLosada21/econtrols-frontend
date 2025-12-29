'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { ProjectFlat } from '@/types/strapi';
import { getFundingAgencyGradient } from '@/styles/utils';

interface ProjectCardProps {
  project: ProjectFlat;
  index?: number;
}

/**
 * Extrai as classes de cor do campo color do projectStatus
 *
 * O campo color do banco vem no formato:
 * "bg-green-500/20 text-green-400 border-green-500/30"
 *
 * Esta função separa em: { bg, text, border }
 */
function parseStatusColor(colorString: string): {
  bg: string;
  text: string;
  border: string;
} {
  const classes = colorString.split(' ');

  const bg = classes.find((c) => c.startsWith('bg-')) || 'bg-gray-500/20';
  const text = classes.find((c) => c.startsWith('text-')) || 'text-gray-400';
  const border = classes.find((c) => c.startsWith('border-')) || 'border-gray-500/30';

  return { bg, text, border };
}

/**
 * Obtém as cores do status do projeto
 *
 * TAXONOMIA DINÂMICA: Usa projectStatus.color do banco de dados.
 */
function getStatusColorClasses(project: ProjectFlat): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const { bg, text, border } = parseStatusColor(project.projectStatus.color);
  return {
    bg,
    text,
    border,
    label: project.projectStatus.name.toLowerCase(),
  };
}

/**
 * Obtém a agência de fomento do projeto
 */
function getFundingAgency(project: ProjectFlat): { name: string; count: number } | null {
  if (project.fundingAgencyPartners && project.fundingAgencyPartners.length > 0) {
    return {
      name: project.fundingAgencyPartners[0].name,
      count: project.fundingAgencyPartners.length,
    };
  }

  return null;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const fundingAgency = getFundingAgency(project);
  const gradient = getFundingAgencyGradient(fundingAgency?.name || '');
  const statusColors = getStatusColorClasses(project);

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
        {fundingAgency && (
          <div
            className="absolute top-4 right-4 bg-black/60 backdrop-blur text-xs font-tech 
                          text-white px-2 py-1 rounded border border-white/10"
          >
            {fundingAgency.name}
            {fundingAgency.count > 1 && ` +${fundingAgency.count - 1}`}
          </div>
        )}

        {/* Status Badge - Usando cores dinâmicas */}
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
