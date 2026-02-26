import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

const HomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors">
                <h1 className="text-2xl font-bold m-0 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Home size={24} className="text-primary dark:text-blue-400" />
                    Stay<span className="text-primary dark:text-blue-400">Mate</span>.
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                        Welcome, <strong className="text-gray-900 dark:text-white">{user?.fullName}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary dark:hover:border-blue-400"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm transition-colors">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">👋 Welcome to StayMate!</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Logged in as <strong className="text-primary dark:text-blue-400">{user?.email}</strong>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
