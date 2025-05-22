// Job category interface matching the backend model
export interface Category {
  _id?: string;
  name: string;
  description: string;
  parentCategory?: Category | string | null;
  slug?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
