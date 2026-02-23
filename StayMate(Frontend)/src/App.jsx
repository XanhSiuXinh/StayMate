import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import PostRoom from './components/PostRoom';
import RoomDetail from './components/RoomDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Layout>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/post-room"
                    element={
                        <ProtectedRoute>
                            <PostRoom />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rooms/:id"
                    element={
                        <ProtectedRoute>
                            <RoomDetail />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    )
}

export default App
