export interface CompanyProfile {
  _id?: string;
  userId?: string;
  companyName: string;
  email: string;
  phone: string;
  logo: string;
  website: string;
  wallPaper: string;
  description: string;
  address: string;
  domain: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CompanyStaff {
  _id?: string;
  fullName?: string;
  password: string;
  role: string;
  active: boolean;
}
