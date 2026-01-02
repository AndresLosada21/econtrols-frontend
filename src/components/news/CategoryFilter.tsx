'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface CategoryFilterProps {
  categories: string[];
  categoriesLabel: string;
  allLabel?: string;
}

export function CategoryFilter({
  categories,
  categoriesLabel,
  allLabel = 'todas',
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('categoria');

  const handleCategoryClick = useCallback(
    (category: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (category === null) {
        params.delete('categoria');
      } else {
        params.set('categoria', category);
      }

      router.push(`/news${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-ufam-secondary text-sm font-tech mr-2">{categoriesLabel}:</span>
      <button
        onClick={() => handleCategoryClick(null)}
        className={`px-4 py-2 rounded text-sm font-tech lowercase transition-colors ${
          !currentCategory
            ? 'bg-ufam-primary text-white'
            : 'bg-white/5 text-ufam-secondary hover:bg-white/10'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded text-sm font-tech lowercase transition-colors ${
            currentCategory === category
              ? 'bg-ufam-primary text-white'
              : 'bg-white/5 text-ufam-secondary hover:bg-white/10'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
