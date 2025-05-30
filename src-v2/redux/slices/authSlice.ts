import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  id: string | null;
  role: "user" | "admin" | "staff" | "company" | null;
  useProfileId: string | null;
  companyId: string | null;
  companyProfileId: string | null;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const useProfileId = localStorage.getItem("useProfileId");
    const companyId = localStorage.getItem("companyId");
    const companyProfileId = localStorage.getItem("companyProfileId");
    return {
      token,
      id,
      role: role as "user" | "admin" | "staff" | "company" | null,
      useProfileId,
      companyId,
      companyProfileId,
    };
  }
  return {
    companyProfileId: null,
    companyId: null,
    token: null,
    id: null,
    role: null,
    useProfileId: null,
  };
};

const initialState: AuthState = getInitialState();

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },
    setId: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.id = id;
      if (typeof window !== "undefined") {
        localStorage.setItem("id", id);
      }
    },
    setRole: (
      state,
      action: PayloadAction<{ role: "user" | "admin" | "staff" | "company" }>
    ) => {
      const { role } = action.payload;
      state.role = role;
      if (typeof window !== "undefined") {
        localStorage.setItem("role", role);
      }
    },
    setUseProfileId: (
      state,
      action: PayloadAction<{ useProfileId: string }>
    ) => {
      const { useProfileId } = action.payload;
      state.useProfileId = useProfileId;
      if (typeof window !== "undefined") {
        localStorage.setItem("useProfileId", useProfileId);
      }
    },
    setCompanyId: (state, action: PayloadAction<{ companyId: string }>) => {
      const { companyId } = action.payload;
      state.companyId = companyId;
      if (typeof window !== "undefined") {
        localStorage.setItem("companyId", companyId);
      }
    },
    setCompanyProfileId: (
      state,
      action: PayloadAction<{ companyProfileId: string }>
    ) => {
      const { companyProfileId } = action.payload;
      state.companyProfileId = companyProfileId;
      if (typeof window !== "undefined") {
        localStorage.setItem("companyProfileId", companyProfileId);
      }
    },
    logout: (state) => {
      state.token = null;
      state.id = null;
      state.role = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("useProfileId");
        localStorage.removeItem("companyId");
        localStorage.removeItem("companyProfileId");
      }
    },
  },
});

// Export actions and reducer
export const {
  setAuth,
  setId,
  setRole,
  setUseProfileId,
  setCompanyId,
  setCompanyProfileId,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
