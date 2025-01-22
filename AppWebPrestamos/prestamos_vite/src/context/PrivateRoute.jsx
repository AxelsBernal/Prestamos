import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.token) {
    console.log("Redirecting to /login due to missing token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
