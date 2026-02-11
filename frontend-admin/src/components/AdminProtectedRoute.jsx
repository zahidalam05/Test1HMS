import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminProtectedRoute = () => {
    const { admin, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
