import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { BounceLoader } from "react-spinners";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white font-inter">
        <BounceLoader color="#FFFFFF" size={50} />
      </div>
    );
  }

  // If no currentUser and not loading, redirect to login.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
