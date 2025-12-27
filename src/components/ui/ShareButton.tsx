'use client';

import { Share2 } from 'lucide-react';

export function ShareButton({ title }: { title: string }) {
  return (
    <button
      className="flex items-center gap-2 hover:text-ufam-primary transition-colors ml-auto"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title,
            url: window.location.href,
          });
        }
      }}
    >
      <Share2 className="w-4 h-4" />
      compartilhar
    </button>
  );
}
