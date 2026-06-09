import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}