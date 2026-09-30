import React, { createContext, useContext, useState } from 'react';
import { Language, translations, CloneTranslations } from '../i18n/translations';
import { DEPARTMENTS_AM } from '../data/seedData';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: CloneTranslations;
  getDeptName: (dept: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'afran_hospital_language_v3';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      // Default to Amharic ('am') to fulfill user request directly, while saving user's manual preference
      return (saved === 'am' || saved === 'en') ? saved : 'am';
    } catch {
      return 'am';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'am' : 'en';
    setLanguage(next);
  };

  const t = translations[language];

  const getDeptName = (dept: string) => {
    if (language === 'am') {
      return DEPARTMENTS_AM[dept] || dept;
    }
    return dept;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getDeptName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
