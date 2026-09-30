'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasCustomKey: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = 'aushadhisetu_gemini_api_key';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiKeyState(stored);
      }
    } catch (e) {
      // Ignore localStorage read errors in SSR/sandboxed environments
    }
  }, []);

  const setApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKeyState(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // Ignore storage write errors
    }
  };

  const clearApiKey = () => {
    setApiKey('');
  };

  const hasCustomKey = !!apiKey && apiKey.length > 5;

  return (
    <ApiKeyContext.Provider value={{
      apiKey,
      setApiKey,
      hasCustomKey,
      isModalOpen,
      setIsModalOpen,
      clearApiKey
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
