import { useState, useEffect } from "react";
import useCompany from "../../hooks/useCompany";
import { CompanyCard } from "./CompanyCard";
import { useTranslation } from "react-i18next";

export const CompanyList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { getAllCompanies, companies } = useCompany();

  useEffect(() => {
    getAllCompanies(page, limit);
  }, [getAllCompanies, page, limit]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("companyList.title")}</h1>

      {companies?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t("companyList.noCompaniesFound")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 mr-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          {t("companyList.previous")}
        </button>
        <span className="px-4 py-2">
          {t("companyList.page")} {page}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          //   disabled={companies && companies.length < limit }
          className="px-4 py-2 ml-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          {t("companyList.next")}
        </button>
      </div>
    </div>
  );
};
