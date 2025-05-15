import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define authentication state structure
interface AuthState {
  token: string | null;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return {
      token,
    };
  }
  return {
    token: null,
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
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

// Export actions and reducer
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
