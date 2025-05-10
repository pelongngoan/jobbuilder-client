import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

// Define authentication state structure
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: "user" | "company" | "hr" | "admin" | null;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      user,
      token,
      isAuthenticated: !!token,
      role: user?.role || null,
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
  };
};

const initialState: AuthState = getInitialState();

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user.role;

      // Also save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

// Export actions and reducer
export const { setAuth, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
