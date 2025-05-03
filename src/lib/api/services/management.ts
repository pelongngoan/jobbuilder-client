import { apiRequest } from "../axios";
import type { AccountCredentials, LoginCredentials } from "../types";

export const login = async (params: LoginCredentials) => {
  const response = await apiRequest.post("/management/login", params);
  return response.data;
};

export const signup = async (params: AccountCredentials) => {
  const response = await apiRequest.post("/management/signup", params);

  return response.data;
};
