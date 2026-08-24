import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, onLanguageChange }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('humassist_language') || localStorage.getItem('nova_language');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  useEffect(() => {
    localStorage.setItem('humassist_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = translations[language];
    if (dict && (key in dict)) {
      return (dict as Record<string, string>)[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
