import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ width: "100%" }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
