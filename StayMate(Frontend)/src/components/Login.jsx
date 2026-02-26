import { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, X, Heart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, openAuthModal, closeAuthModal } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSetupPrompt, setShowSetupPrompt] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5015/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data);
            closeAuthModal();

        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:5015/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google login failed');
            }

            login(data);
            if (data.isNewUser) {
                setShowSetupPrompt(true);
            } else {
                closeAuthModal();
            }
        } catch (err) {
            setError('Google login failed: ' + err.message);
        }
    };

    const handleGoogleError = () => {
        setError('Google login was cancelled or failed');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300 relative transition-colors">
                {showSetupPrompt ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-transparent dark:border-blue-500/20">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Login Successful!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 whitespace-pre-line leading-relaxed">
                            Welcome to StayMate.<br />
                            Would you like to create your <b>Matching Profile</b> now so we can suggest the best compatible roommates for you?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={closeAuthModal}
                                className="py-3 px-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                Later
                            </button>
                            <button
                                onClick={() => {
                                    closeAuthModal();
                                    navigate('/profile');
                                }}
                                className="py-3 px-4 bg-primary dark:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-600 dark:hover:bg-blue-500 hover:-translate-y-0.5 transition-all"
                            >
                                Create Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={closeAuthModal}
                            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-500 dark:text-gray-400">Sign in to continue your journey with StayMate.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <a href="#" className="text-sm font-semibold text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium text-center border border-red-100 dark:border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-primary dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg hover:shadow-primary/30 dark:hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>

                        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => openAuthModal('register')}
                                className="text-primary dark:text-blue-400 font-bold hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
