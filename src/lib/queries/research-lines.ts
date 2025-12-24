import { getResearchLines, getResearchLineBySlug } from '@/lib/strapi';

export { getResearchLines, getResearchLineBySlug };

// Alias for convenience
export const getResearchLine = getResearchLineBySlug;
