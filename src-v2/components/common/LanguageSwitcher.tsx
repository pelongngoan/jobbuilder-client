import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "button" | "dropdown";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
  variant = "button",
}) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
  };

  if (variant === "dropdown") {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.flag} {language.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={i18n.language === language.code ? "primary" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange(language.code)}
          className="flex items-center space-x-1 px-3 py-1"
        >
          <span>{language.flag}</span>
          <span className="hidden sm:inline">{language.name}</span>
        </Button>
      ))}
    </div>
  );
};
