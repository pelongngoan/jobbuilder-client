import { apiRequest } from "../axios";
import { AccountCredentials } from "../types";

export const login = async (params: AccountCredentials) => {
  const response = await apiRequest.post("/auth/login", params);
  return response.data;
};

export const signup = async (params: AccountCredentials) => {
  const response = await apiRequest.post("/auth/signup", params);
  return response.data;
};
