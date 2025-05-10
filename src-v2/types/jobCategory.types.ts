import { ObjectId } from './common.types';

// Job category interface matching the backend model
export interface JobCategory {
  _id: ObjectId;
  name: string;
  description: string;
  parentCategory?: ObjectId;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Job category with nested parent category data
export interface JobCategoryWithParent extends JobCategory {
  parentCategoryData?: JobCategory;
}

// Job category creation/update request
export interface JobCategoryRequest {
  name: string;
  description: string;
  parentCategory?: ObjectId;
}

// Job category hierarchy for dropdown/tree views
export interface JobCategoryHierarchy extends JobCategory {
  children?: JobCategoryHierarchy[];
} 