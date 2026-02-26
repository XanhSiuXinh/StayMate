import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Trash2, Monitor, Globe, Loader2, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('account');
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [pwdSuccess, setPwdSuccess] = useState('');

    // Delete Account State
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setPwdError('');
        setPwdSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPwdError('New passwords do not match.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPwdError('New password must be at least 6 characters.');
            return;
        }

        setPwdLoading(true);
        try {
            const res = await fetch('http://localhost:5015/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPwdSuccess('Password changed successfully.');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // Hide success message after 3 seconds
                setTimeout(() => setPwdSuccess(''), 3000);
            } else {
                setPwdError(data.message || 'Failed to change password.');
            }
        } catch (err) {
            setPwdError('Connection error. Please try again.');
        } finally {
            setPwdLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data."
        );

        if (!confirmDelete) return;

        setDeleteLoading(true);
        setDeleteError('');

        try {
            const res = await fetch('http://localhost:5015/api/users/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // If successful, log them out and redirect
                logout();
                navigate('/');
            } else {
                const data = await res.json();
                setDeleteError(data.message || 'Failed to delete account.');
            }
        } catch (err) {
            setDeleteError('Connection error. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Note: Theme and Language changes here are just UI mocks right now 
    // unless a global context/provider is added for i18n and Themes.
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        // Add functionality to change CSS/Tailwind classes if needed later
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        // Add i18n logic here later
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">App Settings</h1>
                    <p className="mt-2 text-gray-500">Manage your account preferences and app appearance</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

                    {/* Settings Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${activeTab === 'account' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Shield size={18} />
                            Account Security
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${activeTab === 'appearance' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Monitor size={18} />
                            Appearance & Language
                        </button>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 p-8">
                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">

                                {/* Change Password Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Key size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                                    </div>

                                    {pwdError && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{pwdError}</div>}
                                    {pwdSuccess && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 flex items-center gap-2"><Check size={16} /> {pwdSuccess}</div>}

                                    <form onSubmit={submitPasswordChange} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={pwdLoading}
                                            className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm disabled:opacity-70 w-full sm:w-auto justify-center"
                                        >
                                            {pwdLoading ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2">Note: If you registered via Google, you cannot change your password here.</p>
                                    </form>
                                </section>

                                <hr className="border-gray-100" />

                                {/* Danger Zone */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-red-50 p-2 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
                                    </div>

                                    {deleteError && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{deleteError}</div>}

                                    <div className="p-6 border border-red-100 bg-red-50/30 rounded-xl max-w-md">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">Delete Account</h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Once you delete your account, there is no going back. Please be certain. All your data, saved rooms, and messages will be permanently removed.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteLoading}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm disabled:opacity-70 w-full sm:w-auto justify-center"
                                        >
                                            {deleteLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                            Delete My Account
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Appearance & Language Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">

                                {/* Theme Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Monitor size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900">Theme Preference</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                                        <button
                                            onClick={() => handleThemeChange('light')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'light' ? 'border-primary bg-blue-50/30 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-semibold text-gray-900">Light Mode</span>
                                                <div className={`w-4 h-4 rounded-full border ${theme === 'light' ? 'border-4 border-primary' : 'border-gray-300'}`}></div>
                                            </div>
                                            <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col p-2 gap-2">
                                                <div className="w-full h-3 bg-white rounded shadow-sm"></div>
                                                <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                                                <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleThemeChange('dark')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'dark' ? 'border-primary bg-blue-50/30 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-semibold text-gray-900">Dark Mode</span>
                                                <div className={`w-4 h-4 rounded-full border ${theme === 'dark' ? 'border-4 border-primary' : 'border-gray-300'}`}></div>
                                            </div>
                                            <div className="w-full h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col p-2 gap-2">
                                                <div className="w-full h-3 bg-gray-700 rounded shadow-sm"></div>
                                                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                                                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                                            </div>
                                        </button>
                                    </div>
                                </section>

                                <hr className="border-gray-100" />

                                {/* Language Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Globe size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900">Language</h2>
                                    </div>

                                    <div className="max-w-md">
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                                            <button
                                                onClick={() => handleLanguageChange('en')}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🇺🇸</span>
                                                    <span className="font-medium text-gray-900">English</span>
                                                </div>
                                                {language === 'en' && <Check size={18} className="text-primary" />}
                                            </button>
                                            <button
                                                onClick={() => handleLanguageChange('vi')}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🇻🇳</span>
                                                    <span className="font-medium text-gray-900">Tiếng Việt</span>
                                                </div>
                                                {language === 'vi' && <Check size={18} className="text-primary" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">Changes will be applied immediately across the application (mocked for now).</p>
                                    </div>
                                </section>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
