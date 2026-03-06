import { Navigate, useLocation } from "react-router-dom";

function CustomerGuard({ children }) {
    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;
    const location = useLocation();

    if (!token) {
        // Redirect to login, remember where they were trying to go
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
}

export default CustomerGuard;
