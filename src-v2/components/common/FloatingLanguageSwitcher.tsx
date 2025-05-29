import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const FloatingLanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Current languages - can be easily expanded in the future
  const languages: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳", nativeName: "Tiếng Việt" },
    // Future languages can be added here:
    // { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
    // { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
    // { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
    // { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
    // { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
    // { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    setIsAnimating(true);
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);

    // Add a small delay for smooth transition
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 300);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40"
    >
      {/* Language Options Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 ease-out animate-slide-up">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h3 className="text-sm font-semibold text-center">
              {t("common.language")}
            </h3>
          </div>
          <div className="py-2 max-h-60 overflow-y-auto">
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3 ${
                  i18n.language === language.code
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : ""
                } ${index === 0 ? "" : "border-t border-gray-100"}`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {i18n.language === language.code && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Future expansion hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              More languages coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        className={`relative group rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25"
        } ${isAnimating ? "animate-pulse" : ""}`}
        title={`${t("common.changeLanguage")} - ${currentLanguage.nativeName}`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

        {/* Content */}
        <div className="relative flex items-center justify-center w-full h-full">
          {isAnimating ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isOpen ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl mb-0.5">
                {currentLanguage.flag}
              </span>
              <div className="text-[8px] sm:text-[10px] font-bold text-white leading-none">
                {currentLanguage.code.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-30 transition-opacity duration-150"></div>
        </div>
      </button>
    </div>
  );
};

export default FloatingLanguageSwitcher;
