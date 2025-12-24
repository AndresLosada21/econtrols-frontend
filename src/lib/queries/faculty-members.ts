import { getFacultyMembers, getHomepageFacultyMembers, getFacultyMemberBySlug } from '@/lib/strapi';

export { getFacultyMembers, getHomepageFacultyMembers, getFacultyMemberBySlug };

// Alias for convenience
export const getFacultyMember = getFacultyMemberBySlug;
