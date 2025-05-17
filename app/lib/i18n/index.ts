import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {
  initReactI18next,
  useTranslation as useReactI18nTranslation,
} from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;

export const useTranslation = () => {
  const { t, i18n } = useReactI18nTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const availableLanguages = ["fr", "en"];

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    availableLanguages,
  };
};

/**
 * Union type of all possible translation keys.
 */
export type TranslationKey = "common.test";
