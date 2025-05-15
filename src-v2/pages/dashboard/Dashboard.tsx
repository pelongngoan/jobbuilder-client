import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role === "admin" || role === "hr" || role === "company") {
      navigate("/management");
    } else {
      navigate("/dashboard/user");
    }
  }, [isAuthenticated, role, navigate]);

  // This component doesn't render anything; it just redirects
  return <div className="loading">Redirecting...</div>;
};

export default Dashboard;
