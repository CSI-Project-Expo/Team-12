import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // If no token, redirect to login
    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);

        // If role doesn't match allowed roles, redirect
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect based on what role they actually have
            if (user.role === 'admin') {
                return <Navigate to="/admin/dashboard" replace />;
            }
            return <Navigate to="/shop" replace />;
        }

        return children;
    } catch (e) {
        // Fallback if parsing fails
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
