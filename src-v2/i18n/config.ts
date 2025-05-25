import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

// Lấy ngôn ngữ đã lưu từ localStorage hoặc sử dụng ngôn ngữ mặc định
const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Sử dụng ngôn ngữ đã lưu
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Cấu hình để ưu tiên localStorage
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
