import React, { useEffect, useState } from "react";
import { Category } from "../../types/category.types";
import { Button, Input, Modal, Select } from "../../components/common";
import { useCategory } from "../../hooks/usecategory";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Category) => void;
  isEdit?: boolean;
}

export const CategoryForm = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
}: CategoryFormProps) => {
  const { categories, currentCategory, getCategories } = useCategory();
  const [formData, setFormData] = useState<Category>({
    name: currentCategory?.name || "",
    description: currentCategory?.description || "",
    parentCategory: currentCategory?.parentCategory || "",
  });
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Create Category"}
    >
      <Input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <Select
        placeholder="Parent"
        options={categories.map((category) => ({
          value: category._id as string,
          label: category.name,
        }))}
        value={formData.parentCategory}
        onChange={(e) =>
          setFormData({ ...formData, parentCategory: e.target.value })
        }
      />
      <Button onClick={() => onSubmit(formData)}>Submit</Button>
    </Modal>
  );
};
