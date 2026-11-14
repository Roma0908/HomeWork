import React, { createContext, useContext, useState, useEffect } from 'react';
import { kk } from './kk.ts';
import { en } from './en.ts';

export type Language = 'kk' | 'en';

type TranslationType = typeof kk;

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('caseverse_lang');
      if (saved === 'en' || saved === 'kk') return saved;
    } catch {
      // ignore
    }
    return 'kk'; // Kazakh as default per specification
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('caseverse_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'kk' ? kk : en;

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};
