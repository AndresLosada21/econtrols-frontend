'use client';

import {
  ExternalLink,
  MapPin,
  Globe,
  Calendar,
  FileText,
  Briefcase,
  Users,
  FolderGit2,
  TrendingUp,
} from 'lucide-react';
import { CollaboratorFlat, FundedProject, PartnerFlat } from '@/types/strapi';
import { FadeIn } from '@/components/effects/FadeIn';

interface PartnerCardProps {
  partner: PartnerFlat;
  index: number;
  showDescription: boolean;
  showState: boolean;
  showCity: boolean;
  showCollaborationType: boolean;
  showCollaborationArea: boolean;
  showStartDate: boolean;
  showJointPublications: boolean;
  showCustomColorTheme: boolean;
  showCollaborators: boolean;
  showRelatedProjects: boolean;
  showFundedProjects: boolean;
  collaborationTypeLabel: string;
  startDateLabel: string;
  collaborationAreaLabel: string;
  publicationsLabel: string;
  publicationLabel: string;
  collaboratorsLabel: string;
  projectsLabel: string;
  fundedProjectsLabel: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardHoverBorderColor: string;
  titleColor: string;
  titleHoverColor: string;
  locationColor: string;
  descriptionColor: string;
  iconColor: string;
  tagBackgroundColor: string;
  tagTextColor: string;
  customThemeGradientFrom: string;
  customThemeGradientTo: string;
}

export function PartnerCard({
  partner,
  index,
  showDescription,
  showState,
  showCity,
  showCollaborationType,
  showCollaborationArea,
  showStartDate,
  showJointPublications,
  showCustomColorTheme,
  showCollaborators,
  showRelatedProjects,
  showFundedProjects,
  collaborationTypeLabel,
  startDateLabel,
  collaborationAreaLabel,
  publicationsLabel,
  publicationLabel,
  collaboratorsLabel,
  projectsLabel,
  fundedProjectsLabel,
  cardBackgroundColor,
  cardBorderColor,
  cardHoverBorderColor,
  titleColor,
  titleHoverColor,
  locationColor,
  descriptionColor,
  iconColor,
  tagBackgroundColor,
  tagTextColor,
  customThemeGradientFrom,
  customThemeGradientTo,
}: PartnerCardProps) {
  const formatStartDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  // Check if any extra info should be shown based on toggles AND data availability
  const hasExtraInfo =
    (showDescription && partner.description) ||
    (showCollaborationType && partner.collaborationType) ||
    (showCollaborationArea && partner.collaborationArea) ||
    (showStartDate && partner.startDate) ||
    (showJointPublications && partner.jointPublications && partner.jointPublications > 0);

  const hasCollaborators =
    showCollaborators && partner.collaborators && partner.collaborators.length > 0;
  const hasProjects = showRelatedProjects && partner.projects && partner.projects.length > 0;
  const hasFundedProjects =
    showFundedProjects && partner.fundedProjects && partner.fundedProjects.length > 0;

  // Build location string
  const locationParts: string[] = [];
  if (partner.city && showCity) locationParts.push(partner.city);
  if (partner.state && showState) locationParts.push(partner.state);
  if (partner.country) locationParts.push(partner.country);
  const locationString = locationParts.join(', ');

  // Determine card background classes
  const getCardBackgroundClass = () => {
    if (showCustomColorTheme && partner.colorTheme) {
      const colors = partner.colorTheme.split(' ');
      if (colors.length >= 2) {
        return `bg-gradient-to-br ${colors[0]} ${colors[1]}`;
      }
      return `bg-gradient-to-br ${partner.colorTheme} ${customThemeGradientTo}`;
    }
    return cardBackgroundColor;
  };

  // Collaborator Badge Component
  const CollaboratorBadge = ({ collaborator }: { collaborator: CollaboratorFlat }) => (
    <div className="flex items-center gap-2 text-xs">
      {collaborator.photoUrl ? (
        <img
          src={collaborator.photoUrl}
          alt={collaborator.fullName}
          className="w-6 h-6 rounded-full object-cover bg-white/5"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-ufam-primary/20 flex items-center justify-center">
          <span className="text-ufam-primary text-xs font-bold">
            {collaborator.fullName.charAt(0)}
          </span>
        </div>
      )}
      <span className={descriptionColor}>{collaborator.fullName}</span>
      {collaborator.title && <span className="text-ufam-primary/60">- {collaborator.title}</span>}
    </div>
  );

  return (
    <FadeIn delay={index * 50}>
      <a
        href={partner.websiteUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block ${getCardBackgroundClass()} border ${cardBorderColor} p-6 rounded ${cardHoverBorderColor} transition-all h-full`}
      >
        {/* Header with logo and name */}
        <div className="flex items-start gap-4">
          {partner.logoUrl ? (
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="w-16 h-16 object-contain bg-white/5 rounded p-2 group-hover:bg-white/10 transition-colors"
            />
          ) : (
            <div
              className={`w-16 h-16 bg-gradient-to-br ${customThemeGradientFrom} ${customThemeGradientTo} rounded flex items-center justify-center`}
            >
              <Globe className={`w-8 h-8 ${iconColor}`} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4
              className={`font-tech font-bold ${titleColor} ${titleHoverColor} transition-colors mb-1`}
            >
              {partner.name}
            </h4>
            {locationString && (
              <div className={`flex items-center gap-1 text-xs ${locationColor}`}>
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{locationString}</span>
              </div>
            )}
          </div>

          {partner.websiteUrl && (
            <ExternalLink
              className={`w-4 h-4 ${locationColor} group-hover:text-ufam-primary transition-colors shrink-0`}
            />
          )}
        </div>

        {/* Extra info section - Only shown if toggles are enabled AND data exists */}
        {hasExtraInfo && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            {/* Description */}
            {showDescription && partner.description && (
              <p className={`text-xs ${descriptionColor} line-clamp-2`}>{partner.description}</p>
            )}

            {/* Collaboration Type */}
            {showCollaborationType && partner.collaborationType && (
              <div className="flex items-center gap-2 text-xs">
                <Briefcase className={`w-3 h-3 ${iconColor}`} />
                <span className={descriptionColor}>
                  {collaborationTypeLabel}: {partner.collaborationType}
                </span>
              </div>
            )}

            {/* Collaboration Area */}
            {showCollaborationArea && partner.collaborationArea && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className={`w-3 h-3 ${iconColor}`} />
                <span className={descriptionColor}>
                  {collaborationAreaLabel}: {partner.collaborationArea}
                </span>
              </div>
            )}

            {/* Start date and publications */}
            <div className="flex items-center gap-4 text-xs">
              {showStartDate && partner.startDate && (
                <div className={`flex items-center gap-1 ${descriptionColor}`}>
                  <Calendar className={`w-3 h-3 ${iconColor}`} />
                  <span>
                    {startDateLabel} {formatStartDate(partner.startDate)}
                  </span>
                </div>
              )}
              {showJointPublications &&
                partner.jointPublications &&
                partner.jointPublications > 0 && (
                  <div className={`flex items-center gap-1 ${descriptionColor}`}>
                    <FileText className={`w-3 h-3 ${iconColor}`} />
                    <span>
                      {partner.jointPublications}{' '}
                      {partner.jointPublications === 1 ? publicationLabel : publicationsLabel}
                    </span>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Collaborators Section */}
        {hasCollaborators && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1 text-xs mb-2">
              <Users className={`w-3 h-3 ${iconColor}`} />
              <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                {collaboratorsLabel}
              </span>
            </div>
            <div className="space-y-1">
              {partner.collaborators!.slice(0, 3).map((collaborator) => (
                <CollaboratorBadge key={collaborator.id} collaborator={collaborator} />
              ))}
              {partner.collaborators!.length > 3 && (
                <p className={`text-xs ${descriptionColor} italic`}>
                  +{partner.collaborators!.length - 3} mais...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Related Projects Section */}
        {hasProjects && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1 text-xs mb-2">
              <FolderGit2 className={`w-3 h-3 ${iconColor}`} />
              <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                {projectsLabel}
              </span>
            </div>
            <div className="space-y-1">
              {partner.projects!.slice(0, 2).map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`block text-xs ${descriptionColor} hover:text-ufam-primary transition-colors truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  • {project.title}
                </a>
              ))}
              {partner.projects!.length > 2 && (
                <p className={`text-xs ${descriptionColor} italic`}>
                  +{partner.projects!.length - 2} projetos...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Funded Projects Section */}
        {hasFundedProjects && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1 text-xs mb-2">
              <TrendingUp className={`w-3 h-3 ${iconColor}`} />
              <span className={`font-tech uppercase tracking-wider ${titleColor}`}>
                {fundedProjectsLabel}
              </span>
            </div>
            <div className="space-y-1">
              {partner.fundedProjects!.slice(0, 2).map((fp, idx) => (
                <div key={idx} className="text-xs">
                  <span className={descriptionColor}>{fp.projectTitle}</span>
                  {fp.amount && (
                    <span className="text-ufam-primary ml-1">{formatCurrency(fp.amount)}</span>
                  )}
                  {fp.year && <span className="text-ufam-secondary ml-1">({fp.year})</span>}
                </div>
              ))}
              {partner.fundedProjects!.length > 2 && (
                <p className={`text-xs ${descriptionColor} italic`}>
                  +{partner.fundedProjects!.length - 2} financiamentos...
                </p>
              )}
            </div>
          </div>
        )}
      </a>
    </FadeIn>
  );
}
