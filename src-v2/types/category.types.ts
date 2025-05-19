// Job category interface matching the backend model
export interface Category {
  _id?: string;
  name: string;
  description: string;
  parentCategory?: string;
  slug?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
