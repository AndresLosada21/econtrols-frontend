'use client';

import { useState } from 'react';
import { CitationModal } from '@/components/ui/CitationModal';
import { Quote } from 'lucide-react';

interface PublicationCitationProps {
  title: string;
  bibtex?: string | null;
  apa?: string | null;
  abnt?: string | null;
}

export function PublicationCitation({ title, bibtex, apa, abnt }: PublicationCitationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 w-full px-4 py-3 bg-ufam-dark border border-white/10 rounded hover:border-ufam-primary/50 hover:bg-ufam-primary/10 transition-all group"
      >
        <Quote className="w-4 h-4 text-ufam-primary" />
        <span className="text-white font-tech text-sm">Citar</span>
      </button>

      <CitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        bibtex={bibtex}
        apa={apa}
        abnt={abnt}
      />
    </>
  );
}
