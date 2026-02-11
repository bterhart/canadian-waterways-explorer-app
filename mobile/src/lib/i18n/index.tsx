// Translation system for Canadian Interactive Waterways Initiative
// Supports English (en) and French (fr) for Canadian education
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en, TranslationKey } from './en';
import { fr } from './fr';

// Supported languages
export type Language = 'en' | 'fr';

// Translation records
const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  fr,
};

// Storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = '@waterways_language';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  isLoading: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => en[key],
  isLoading: true,
});

// Language provider props
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Language Provider Component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLanguage();
  }, []);

  // Set language and persist to storage
  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, []);

  // Translation function
  const t = useCallback(
    (key: TranslationKey): string => {
      const translation = translations[language][key];
      if (!translation) {
        // Fallback to English if key not found
        return translations.en[key] || key;
      }
      return translation;
    },
    [language]
  );

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// Export types for use in other files
export type { TranslationKey };

// Export language names for UI
export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  fr: { native: 'Francais', english: 'French' },
};

// Helper to get all available languages
export const availableLanguages: Language[] = ['en', 'fr'];
