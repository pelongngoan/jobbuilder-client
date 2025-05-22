import React, { useEffect } from "react";
import { Work } from "@mui/icons-material";
import { useCategory } from "../../hooks/useCategory";
import Card from "../common/Card";
import Button from "../common/Button";

interface FeaturedCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onCategoryClick,
}) => {
  const { categories, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Popular Job Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map(
          (category) =>
            category._id && (
              <Card key={category._id} className="text-center p-6">
                <div className="flex flex-col items-center">
                  <Work className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() =>
                      category._id && onCategoryClick(category._id)
                    }
                  >
                    Browse Jobs
                  </Button>
                </div>
              </Card>
            )
        )}
      </div>
    </div>
  );
};
