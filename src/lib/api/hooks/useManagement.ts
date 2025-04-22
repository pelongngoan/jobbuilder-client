import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AccountCredentials, LoginCredentials } from "../types";
import { managementService } from "../services/management";
import { toggleLoading } from "../../../store/loading/loadingSlice";
import { setCredentials } from "../../../store/management/authSlice";

export const useManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (data: AccountCredentials) => {
    try {
      managementService.signup(data).then((response) => {
        if (response.data) {
          navigate("/management/login");
        }
      });
    } catch (error) {
      console.error("Management signup failed:", error);
    }
  };
  const handleLogin = async (data: LoginCredentials) => {
    try {
      managementService.login(data).then((response) => {
        if (response.token) {
          dispatch(
            setCredentials({
              token: response.token,
            })
          );
          navigate("/management/dashboard");
        }
      });
    } catch (error) {
      console.error("Management login failed:", error);
    }
  };
  const handleLogout = () => {
    managementService.logout();
    navigate("/management/login");
  };
  return { handleLogin, handleSignup, handleLogout };
};
