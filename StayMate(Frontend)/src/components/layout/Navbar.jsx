import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, User, Plus, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationDropdown from '../ui/NotificationDropdown';

const Navbar = () => {
    const { user, logout, isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="glass sticky top-0 z-50 transition-all duration-300 border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Home className="h-6 w-6 text-primary dark:text-blue-400" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                            Stay<span className="text-primary dark:text-blue-400">Mate</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated ? (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                to="/discover"
                                className={`text-sm font-bold transition-colors ${isActive('/discover') ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                {t('navbar.discover')}
                            </Link>
                            <Link
                                to="/messages"
                                className={`text-sm font-bold transition-colors ${isActive('/messages') ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                {t('navbar.messages')}
                            </Link>
                            <Link
                                to="/saved"
                                className={`text-sm font-bold transition-colors ${isActive('/saved') ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                {t('navbar.saved')}
                            </Link>
                            {user?.role === 'Landlord' && (
                                <Link
                                    to="/my-rooms"
                                    className={`text-sm font-bold transition-colors ${isActive('/my-rooms') ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                >
                                    {t('navbar.myListings')}
                                </Link>
                            )}
                            {user?.role === 'Landlord' && (
                                <Link
                                    to="/post-room"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 rounded-xl text-sm font-bold transition-all"
                                >
                                    <Plus size={18} />
                                    {t('navbar.postRoom')}
                                </Link>
                            )}

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                
                                <Link to="/settings" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors bg-gray-100/50 dark:bg-gray-800/50">
                                    <Settings size={20} />
                                </Link>

                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
                                >
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                        alt={user?.fullName}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white max-w-[100px] truncate">
                                        {user?.fullName}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Log Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => openAuthModal('login')}
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-semibold text-sm px-4 py-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all"
                            >
                                {t('navbar.logIn')}
                            </button>
                            <button
                                onClick={() => openAuthModal('register')}
                                className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {t('navbar.signUp')}
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-500 dark:text-gray-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                        alt={user?.fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{user?.fullName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('navbar.findRooms')}
                                </Link>
                                {user?.role === 'Landlord' && (
                                    <Link
                                        to="/my-rooms"
                                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navbar.myListings')}
                                    </Link>
                                )}
                                {user?.role === 'Landlord' && (
                                    <Link
                                        to="/post-room"
                                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('navbar.postRoom')}
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('navbar.profileSettings')}
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium flex items-center gap-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings size={18} /> {t('navbar.appSettings')}
                                </Link>
                                <Link
                                    to="/preferences"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium flex items-center gap-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings size={18} /> {t('navbar.matchingPreferences')}
                                </Link>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium flex items-center gap-2"
                                >
                                    <LogOut size={18} /> {t('navbar.logOut')}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openAuthModal('login');
                                    }}
                                    className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium"
                                >
                                    {t('navbar.logIn')}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openAuthModal('register');
                                    }}
                                    className="w-full text-left px-3 py-2 text-primary dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                                >
                                    {t('navbar.signUp')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
