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
import Discover from './components/Discover';
import Messages from './components/Messages';
import Preferences from './components/Preferences';
import Settings from './components/Settings';
import Saved from './components/Saved';
import MyRooms from './components/MyRooms';

function App() {
    const { isAuthenticated, authModalView } = useAuth();

    return (
        <Layout>
            {authModalView === 'login' && <Login />}
            {authModalView === 'register' && <Register />}
            <Routes>
                {/* Protected Routes */}
                <Route
                    path="/"
                    element={<HomePage />}
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
                    path="/profile/:id"
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
                    path="/my-rooms"
                    element={
                        <ProtectedRoute>
                            <MyRooms />
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
                <Route
                    path="/discover"
                    element={
                        <ProtectedRoute>
                            <Discover />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/preferences"
                    element={
                        <ProtectedRoute>
                            <Preferences />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute>
                            <Saved />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
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
