// src/components/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute: React.FC = () => {
    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to="/signin" replace />; 
    }

    return <Outlet />; // Render the children (protected component)
};

export default ProtectedRoute;
