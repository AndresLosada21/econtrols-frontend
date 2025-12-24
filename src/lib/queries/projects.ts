import { getProjects, getHomepageProjects, getProjectBySlug } from '@/lib/strapi';
import type { ProjectFlat } from '@/types/strapi';

export { getProjects, getHomepageProjects, getProjectBySlug };

// Alias for convenience
export const getProject = getProjectBySlug;

// Get current (ongoing) projects
export async function getCurrentProjects(): Promise<ProjectFlat[]> {
  return getProjects({
    filters: { status: { $eq: 'Em Andamento' } },
    sort: ['displayOrder:asc', 'startDate:desc'],
  });
}

// Get finished projects
export async function getFinishedProjects(): Promise<ProjectFlat[]> {
  return getProjects({
    filters: { status: { $eq: 'Concluído' } },
    sort: ['endDate:desc'],
  });
}
