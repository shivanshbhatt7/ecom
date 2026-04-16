import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useSelector((state) => state.user?.user);
  const token = localStorage.getItem("accessToken");


  if (!token) {
    return <Navigate to="/login" />;
  }

  // ⏳ If token exists but user not loaded yet → block temporarily
  if (!user) {
    return <div>Loading...</div>; 
  }

  // 🔒 Admin protection
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;