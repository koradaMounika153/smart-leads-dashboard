import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
}

function ProtectedRoute({
  children,
}: Props) {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;