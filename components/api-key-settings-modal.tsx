'use client';

import React, { useState, useEffect } from 'react';
import { X, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';

export function ApiKeySettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('cs_llm_provider') || 'deepseek';
      const savedKey = localStorage.getItem('cs_llm_api_key') || '';
      setProvider(savedProvider);
      setApiKey(savedKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('cs_llm_provider', provider);
    if (apiKey.trim()) {
      localStorage.setItem('cs_llm_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('cs_llm_api_key');
    }
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('cs_llm_provider');
    localStorage.removeItem('cs_llm_api_key');
    setProvider('deepseek');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">LLM Provider Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium">Bring your own key (BYOK)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              <option value="deepseek">DeepSeek (Recommended)</option>
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">API Key</label>
              {apiKey ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Configured
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <ShieldAlert className="w-3 h-3" /> Using server default
                </span>
              )}
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Keys are stored securely in your browser's local storage and attached to outgoing requests.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Clear Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
