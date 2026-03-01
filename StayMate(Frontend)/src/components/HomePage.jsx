import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <main className="p-8 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm transition-colors mt-8">
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
