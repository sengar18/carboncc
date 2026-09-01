'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { ApiKeySettingsModal } from './api-key-settings-modal';

export function NavbarSettingsTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if key exists on mount to show active state
    const key = localStorage.getItem('cs_llm_api_key');
    setHasKey(!!key);
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition relative"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
        {hasKey && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"></span>
        )}
      </button>
      
      <ApiKeySettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
