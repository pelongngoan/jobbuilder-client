import axios from "axios";
import { store } from "../../store";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiRequest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiRequest.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: "auth/logout" });
    }
    return Promise.reject(error);
  }
);
