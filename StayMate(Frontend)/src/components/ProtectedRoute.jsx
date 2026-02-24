import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, openAuthModal } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            openAuthModal('login');
        }
    }, [loading, isAuthenticated, openAuthModal]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
