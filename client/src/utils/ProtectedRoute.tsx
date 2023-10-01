import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    console.log(currentUser);
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
