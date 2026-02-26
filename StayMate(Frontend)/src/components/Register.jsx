import { useState } from 'react';
import { Mail, Lock, User, Calendar, Loader2, ArrowRight, X, Heart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { login, openAuthModal, closeAuthModal } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSetupPrompt, setShowSetupPrompt] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5015/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            login(data);
            if (data.isNewUser) {
                setShowSetupPrompt(true);
            } else {
                closeAuthModal();
            }

        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 relative max-h-[95vh] overflow-y-auto">
                {showSetupPrompt ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Created!</h2>
                        <p className="text-gray-500 mb-8 whitespace-pre-line leading-relaxed">
                            Welcome to StayMate.<br />
                            Would you like to create your <b>Matching Profile</b> now so we can suggest the best compatible roommates for you?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={closeAuthModal}
                                className="py-3 px-4 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                Later
                            </button>
                            <button
                                onClick={() => {
                                    closeAuthModal();
                                    navigate('/profile');
                                }}
                                className="py-3 px-4 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
                            >
                                Create Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={closeAuthModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500">Join StayMate to find your perfect room.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        minLength={6}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 pl-1">Must be at least 6 characters.</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium text-center border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signup_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>

                        <p className="mt-8 text-center text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => openAuthModal('login')}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
