'use client';

import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  bibtex?: string | null;
  apa?: string | null;
  abnt?: string | null;
}

export function CitationModal({ isOpen, onClose, title, bibtex, apa, abnt }: CitationModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bibtex' | 'apa' | 'abnt'>('bibtex');

  const handleCopy = (format: 'bibtex' | 'apa' | 'abnt', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const getCitationText = () => {
    switch (activeTab) {
      case 'bibtex':
        return bibtex || '@article{...}';
      case 'apa':
        return apa || '...';
      case 'abnt':
        return abnt || '...';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ufam-dark border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white font-tech">Cite this paper</h3>
            <p className="text-sm text-ufam-secondary mt-1 line-clamp-1">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-ufam-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('bibtex')}
            className={`px-6 py-3 font-tech text-sm transition-colors ${
              activeTab === 'bibtex'
                ? 'text-ufam-primary border-b-2 border-ufam-primary bg-ufam-primary/10'
                : 'text-ufam-secondary hover:text-white'
            }`}
          >
            BibTeX
          </button>
          <button
            onClick={() => setActiveTab('apa')}
            className={`px-6 py-3 font-tech text-sm transition-colors ${
              activeTab === 'apa'
                ? 'text-ufam-primary border-b-2 border-ufam-primary bg-ufam-primary/10'
                : 'text-ufam-secondary hover:text-white'
            }`}
          >
            APA
          </button>
          <button
            onClick={() => setActiveTab('abnt')}
            className={`px-6 py-3 font-tech text-sm transition-colors ${
              activeTab === 'abnt'
                ? 'text-ufam-primary border-b-2 border-ufam-primary bg-ufam-primary/10'
                : 'text-ufam-secondary hover:text-white'
            }`}
          >
            ABNT
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            readOnly
            value={getCitationText()}
            className="w-full h-48 bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono text-ufam-secondary focus:outline-none focus:border-ufam-primary/50 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded font-tech text-sm text-ufam-secondary hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleCopy(activeTab, getCitationText())}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-ufam-primary text-white rounded font-tech text-sm hover:bg-ufam-primary/80 transition-colors"
          >
            {copiedFormat === activeTab ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
