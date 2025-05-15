import React, { useState } from "react";
import CategoryManager from "../../features/jobs/components/CategoryManager";
import { JobCategory } from "../../types";
import { Card } from "../../components/common";

// Example page that shows how to use CategoryManager in selection mode
const CategorySelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(
    null
  );

  const handleCategorySelect = (category: JobCategory) => {
    setSelectedCategory(category);
    // You can use the selected category for your specific needs
    console.log("Selected category:", category);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Select Category Example</h1>

      {selectedCategory && (
        <Card className="mb-8 p-4 bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Selected Category:</h2>
          <div className="flex flex-col">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {selectedCategory.name}
            </p>
            {selectedCategory.description && (
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {selectedCategory.description}
              </p>
            )}
            {selectedCategory.parentCategory && (
              <p>
                <span className="font-semibold">Parent ID:</span>{" "}
                {selectedCategory.parentCategory}
              </p>
            )}
          </div>
        </Card>
      )}

      <CategoryManager
        title="Select a Category"
        onCategorySelect={handleCategorySelect}
        readOnly={true}
      />
    </div>
  );
};

export default CategorySelector;
