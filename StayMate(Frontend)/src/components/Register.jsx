import { useState } from 'react';
import { Mail, Lock, User, Calendar, Loader2, ArrowRight, X, Heart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from './ui/Input';
import Button from './ui/Button';

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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 relative max-h-[95vh] overflow-y-auto transition-colors">
                {showSetupPrompt ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-transparent dark:border-blue-500/20">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Account Created!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 whitespace-pre-line leading-relaxed">
                            Welcome to StayMate.<br />
                            Would you like to create your <b>Matching Profile</b> now so we can suggest the best compatible roommates for you?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={closeAuthModal}
                                variant="outline"
                            >
                                Later
                            </Button>
                            <Button
                                onClick={() => {
                                    closeAuthModal();
                                    navigate('/profile');
                                }}
                            >
                                Create Now
                            </Button>
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
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-gray-500 dark:text-gray-400">Join StayMate to find your perfect room.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        icon={User}
                                        required
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Date of Birth"
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        icon={Calendar}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    icon={Mail}
                                    required
                                />
                            </div>

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    minLength={6}
                                    icon={Lock}
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1">Must be at least 6 characters.</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium text-center border border-red-100 dark:border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={loading}
                                icon={loading ? undefined : ArrowRight}
                                fullWidth
                                size="lg"
                            >
                                Create Account
                            </Button>
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
                                text="signup_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>

                        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => openAuthModal('login')}
                                className="text-primary dark:text-blue-400 font-bold hover:underline"
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
