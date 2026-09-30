'use client';

import React, { useState } from 'react';
import { useApiKey } from '@/context/ApiKeyContext';
import { Key, X, CheckCircle, AlertCircle, ExternalLink, Sparkles, Shield, Trash2 } from 'lucide-react';

export default function ApiKeyModal() {
  const { apiKey, setApiKey, isModalOpen, setIsModalOpen, clearApiKey, hasCustomKey } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isModalOpen) return null;

  const handleSave = () => {
    setApiKey(inputKey);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    setInputKey('');
    clearApiKey();
    setTestStatus('idle');
  };

  const handleTestKey = async () => {
    if (!inputKey || inputKey.trim().length < 10) {
      setTestStatus('invalid');
      setErrorMessage('Please enter a valid Gemini API key format');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    try {
      // Test the key via API route with a lightweight text test
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 blank png
          mimeType: 'image/png',
          apiKey: inputKey.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.isMock === false) {
        setTestStatus('valid');
      } else if (res.ok && data.isMock === true) {
        setTestStatus('invalid');
        setErrorMessage('Key could not be authenticated with Google AI. Please check the key.');
      } else {
        setTestStatus('invalid');
        setErrorMessage(data.error || 'Authentication failed');
      }
    } catch (e: any) {
      setTestStatus('invalid');
      setErrorMessage(e.message || 'Connection error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in scale-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Google Gemini API Configuration</h3>
              <p className="text-xs text-slate-500">Enable live multimodal vision OCR extraction</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Your key stays local:</span> The API key is stored securely in your browser&apos;s localStorage and sent only to official Google AI Gemini endpoints.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setTestStatus('idle');
                }}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Test Status Feedback */}
          {testStatus === 'testing' && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              Testing connection with Google Gemini 1.5 Flash...
            </div>
          )}
          {testStatus === 'valid' && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Connection successful! Live Gemini OCR vision extraction is active.
            </div>
          )}
          {testStatus === 'invalid' && (
            <div className="flex items-start gap-2 text-xs text-red-700 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage || 'Invalid API key or network error'}</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Get a free API key at Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleTestKey}
              disabled={!inputKey || testStatus === 'testing'}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors"
            >
              Test Key
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {hasCustomKey && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Stored Key
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
