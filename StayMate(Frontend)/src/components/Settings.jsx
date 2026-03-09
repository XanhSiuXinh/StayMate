import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Key, Trash2, Monitor, Globe, Loader2, Check, AlertTriangle, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from './ui/Input';
import Button from './ui/Button';

const Settings = () => {
    const { token, logout, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [activeTab, setActiveTab] = useState('account');
    const [language, setLanguage] = useState(i18n.language || 'en');

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
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">{t('settings.subtitle')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row transition-colors">

                    {/* Settings Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50/50 dark:bg-gray-900/50 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-2 transition-colors">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${activeTab === 'account' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-100 dark:border-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                        >
                            <Shield size={18} />
                            {t('settings.accountSecurity')}
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${activeTab === 'appearance' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-100 dark:border-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                        >
                            <Monitor size={18} />
                            {t('settings.appearanceLanguage')}
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
                                        <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400"><Key size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.changePassword')}</h2>
                                    </div>

                                    {pwdError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-500/20">{pwdError}</div>}
                                    {pwdSuccess && <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-100 dark:border-green-500/20 flex items-center gap-2"><Check size={16} /> {pwdSuccess}</div>}

                                    <form onSubmit={submitPasswordChange} className="space-y-4 max-w-md">
                                        <div>
                                            <Input
                                                label={t('settings.currentPassword')}
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder={t('settings.currentPassword')}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label={t('settings.newPassword')}
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder={t('settings.newPassword')}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label={t('settings.confirmNewPassword')}
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder={t('settings.confirmNewPassword')}
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                isLoading={pwdLoading}
                                                className="w-full sm:w-auto"
                                            >
                                                {t('settings.updatePassword')}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Note: If you registered via Google, you cannot change your password here.</p>
                                    </form>
                                </section>

                                <hr className="border-gray-100 dark:border-gray-700" />

                                {/* Danger Zone */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-red-50 dark:bg-red-500/10 p-2 rounded-lg text-red-600 dark:text-red-400"><AlertTriangle size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.dangerZone')}</h2>
                                    </div>

                                    {deleteError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-500/20">{deleteError}</div>}

                                    <div className="p-6 border border-red-100 dark:border-red-500/20 bg-red-50/30 dark:bg-red-500/5 rounded-xl max-w-md">
                                        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">{t('settings.deleteAccount')}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            {t('settings.deleteAccountWarning')}
                                        </p>
                                        <Button
                                            onClick={handleDeleteAccount}
                                            isLoading={deleteLoading}
                                            icon={Trash2}
                                            variant="outline"
                                            className="border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full sm:w-auto justify-center text-sm"
                                        >
                                            {t('settings.deleteMyAccount')}
                                        </Button>
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
                                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-lg text-indigo-600 dark:text-indigo-400"><Monitor size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.themePreference')}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                                        <button
                                            onClick={() => handleThemeChange('light')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'light' ? 'border-primary bg-blue-50/30 dark:bg-blue-900/20 ring-2 ring-primary/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">{t('settings.lightMode')}</span>
                                                <div className={`w-4 h-4 rounded-full border ${theme === 'light' ? 'border-4 border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>
                                            </div>
                                            <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col p-2 gap-2">
                                                <div className="w-full h-3 bg-white rounded shadow-sm"></div>
                                                <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                                                <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleThemeChange('dark')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'dark' ? 'border-primary bg-blue-50/30 dark:bg-blue-900/20 ring-2 ring-primary/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">{t('settings.darkMode')}</span>
                                                <div className={`w-4 h-4 rounded-full border ${theme === 'dark' ? 'border-4 border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>
                                            </div>
                                            <div className="w-full h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col p-2 gap-2">
                                                <div className="w-full h-3 bg-gray-700 rounded shadow-sm"></div>
                                                <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
                                                <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                                            </div>
                                        </button>
                                    </div>
                                </section>

                                <hr className="border-gray-100 dark:border-gray-700" />

                                {/* Language Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><Globe size={20} /></div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.language')}</h2>
                                    </div>

                                    <div className="max-w-md">
                                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                                            <button
                                                onClick={() => handleLanguageChange('en')}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🇺🇸</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('settings.english')}</span>
                                                </div>
                                                {language === 'en' && <Check size={18} className="text-primary" />}
                                            </button>
                                            <button
                                                onClick={() => handleLanguageChange('vi')}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🇻🇳</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('settings.vietnamese')}</span>
                                                </div>
                                                {language === 'vi' && <Check size={18} className="text-primary" />}
                                            </button>
                                        </div>
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
