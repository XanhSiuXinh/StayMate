import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authModalView, setAuthModalView] = useState(null); // 'login', 'register', or null

    // Kiểm tra token còn hạn không
    const isTokenValid = (tokenStr) => {
        if (!tokenStr) return false;
        try {
            const payload = JSON.parse(atob(tokenStr.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    };

    // Load token từ localStorage khi app khởi động
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser && isTokenValid(storedToken)) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        } else {
            // Token hết hạn hoặc không có -> Xóa sạch
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (authData) => {
        const { token, email, fullName, avatarUrl, role } = authData;

        // Lưu vào state
        setToken(token);
        setUser({ email, fullName, avatarUrl, role });

        // Lưu vào localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify({ email, fullName, avatarUrl, role }));
        // Không tự đóng modal ở đây – để Register/Login tự quyết định dựa vào isNewUser
    };

    // Update user info function
    const updateUser = (updatedInfo) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedInfo };
            localStorage.setItem('authUser', JSON.stringify(newUser));
            return newUser;
        });
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
        updateUser,
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
