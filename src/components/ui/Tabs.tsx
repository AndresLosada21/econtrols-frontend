'use client';

import { useState } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  defaultTab?: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange(tabId);
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={`px-4 py-2 rounded font-tech text-sm transition-colors ${
            activeTab === tab.id
              ? 'bg-ufam-primary text-white'
              : 'bg-white/5 text-ufam-secondary hover:bg-white/10 hover:text-white'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-2 opacity-70">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}
