import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcherDemo } from "../../components/common";

const LanguageDemo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("languageDemo.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("languageDemo.description")}
          </p>
        </div>
        <LanguageSwitcherDemo />
      </div>
    </div>
  );
};

export default LanguageDemo;
