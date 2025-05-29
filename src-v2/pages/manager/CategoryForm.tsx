import { useEffect, useState } from "react";
import { Category } from "../../types/category.types";
import {
  Button,
  Input,
  Modal,
  Select,
  TextArea,
} from "../../components/common";
import { useCategory } from "../../hooks/useCategory";
import { clearCurrentCategory } from "../../redux/slices/categorySlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/store";
interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CategoryForm = ({
  isOpen,
  onClose,
  onSubmit,
}: CategoryFormProps) => {
  const dispatch = useDispatch();
  const {
    categories,
    getCategories,
    currentCategory,
    updateCategory,
    createCategory,
  } = useCategory();
  const [formData, setFormData] = useState<Category>({
    name: currentCategory?.name || "",
    description: currentCategory?.description || "",
    parentCategory: currentCategory?.parentCategory || "",
  });
  const { page, limit } = useAppSelector((state) => state.pagination);

  useEffect(() => {
    getCategories(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page]);

  useEffect(() => {
    if (currentCategory) {
      setFormData({
        name: currentCategory.name || "",
        description: currentCategory.description || "",
        parentCategory: currentCategory.parentCategory || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parentCategory: "",
      });
    }
  }, [currentCategory]);

  const handleSubmit = async () => {
    try {
      if (currentCategory && currentCategory._id) {
        await updateCategory({ ...formData, _id: currentCategory._id });
      } else {
        await createCategory(formData);
      }
      getCategories(page, limit);
      dispatch(clearCurrentCategory());
      setFormData({
        name: "",
        description: "",
        parentCategory: "",
      });
    } catch (error) {
      console.error("Error saving category:", error);
    }
    onSubmit();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentCategory ? "Edit Category" : "Create Category"}
    >
      <div className="space-y-4">
        <Input
          label="Name"
          placeholder="Category name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <TextArea
          label="Description"
          placeholder="Category description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          required
        />
        <Select
          label="Parent Category"
          placeholder="Select parent category"
          options={categories
            .filter((cat) => cat._id !== formData._id) // Prevent self-selection as parent
            .map((category) => ({
              value: category._id as string,
              label: category.name,
            }))}
          value={formData.parentCategory as string}
          onChange={(e) =>
            setFormData({ ...formData, parentCategory: e.target.value })
          }
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {currentCategory ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
