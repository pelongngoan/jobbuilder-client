import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Card from "./Card";

export const LanguageSwitcherDemo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("common.welcome")}
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {t("common.changeLanguage")}
            </h2>

            {/* Button variant */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Button Style:
              </h3>
              <LanguageSwitcher variant="button" />
            </div>

            {/* Dropdown variant */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Dropdown Style:
              </h3>
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common translations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Common Translations
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Welcome:</strong> {t("common.welcome")}
                </li>
                <li>
                  <strong>Login:</strong> {t("common.login")}
                </li>
                <li>
                  <strong>Register:</strong> {t("common.register")}
                </li>
                <li>
                  <strong>Logout:</strong> {t("common.logout")}
                </li>
                <li>
                  <strong>Search:</strong> {t("common.search")}
                </li>
                <li>
                  <strong>Submit:</strong> {t("common.submit")}
                </li>
                <li>
                  <strong>Cancel:</strong> {t("common.cancel")}
                </li>
                <li>
                  <strong>Language:</strong> {t("common.language")}
                </li>
              </ul>
            </div>

            {/* Navigation translations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Navigation Translations
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Jobs:</strong> {t("navigation.jobs")}
                </li>
                <li>
                  <strong>Companies:</strong> {t("navigation.companies")}
                </li>
                <li>
                  <strong>Tools:</strong> {t("navigation.tools")}
                </li>
                <li>
                  <strong>Jobs by Category:</strong>{" "}
                  {t("navigation.jobsByCategory")}
                </li>
                <li>
                  <strong>Career Tools:</strong> {t("navigation.careerTools")}
                </li>
                <li>
                  <strong>Resume Builder:</strong>{" "}
                  {t("navigation.resumeBuilder")}
                </li>
                <li>
                  <strong>My Account:</strong> {t("navigation.myAccount")}
                </li>
              </ul>
            </div>

            {/* Dashboard translations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Dashboard Translations
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Overview:</strong> {t("dashboard.overview")}
                </li>
                <li>
                  <strong>Applications:</strong> {t("dashboard.applications")}
                </li>
                <li>
                  <strong>Saved Jobs:</strong> {t("dashboard.savedJobs")}
                </li>
                <li>
                  <strong>Profile:</strong> {t("dashboard.profile")}
                </li>
              </ul>
            </div>

            {/* Jobs translations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Jobs Translations
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Search Jobs:</strong> {t("jobs.search")}
                </li>
                <li>
                  <strong>Filter:</strong> {t("jobs.filter")}
                </li>
                <li>
                  <strong>Location:</strong> {t("jobs.location")}
                </li>
                <li>
                  <strong>Category:</strong> {t("jobs.category")}
                </li>
                <li>
                  <strong>Apply Now:</strong> {t("jobs.applyNow")}
                </li>
                <li>
                  <strong>Save Job:</strong> {t("jobs.saveJob")}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Test Instructions
            </h3>
            <p className="text-blue-700 text-sm">
              Click the language switcher buttons above to see all text change
              between English and Vietnamese. The language preference is
              automatically saved to localStorage and will persist when you
              reload the page.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
