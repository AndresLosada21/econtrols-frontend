'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  label?: string;
}

export function ShareButton({ title, label = 'compartilhar' }: ShareButtonProps) {
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
      {label}
    </button>
  );
}
