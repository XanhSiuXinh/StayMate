import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authModalView, setAuthModalView] = useState(null); // 'login', 'register', or null

    // Load token từ localStorage khi app khởi động
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (authData) => {
        const { token, email, fullName } = authData;

        // Lưu vào state
        setToken(token);
        setUser({ email, fullName });

        // Lưu vào localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify({ email, fullName }));
        setAuthModalView(null);
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    const openAuthModal = (view) => setAuthModalView(view);
    const closeAuthModal = () => setAuthModalView(null);

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
        authModalView,
        openAuthModal,
        closeAuthModal
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
