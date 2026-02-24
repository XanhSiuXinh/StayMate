import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, User, Plus, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Home className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                            Stay<span className="text-primary">Mate</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated ? (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                to="/discover"
                                className={`text-sm font-bold transition-colors ${isActive('/discover') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Discover
                            </Link>
                            <Link
                                to="/messages"
                                className={`text-sm font-bold transition-colors ${isActive('/messages') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Messages
                            </Link>
                            <Link
                                to="#"
                                className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Saved
                            </Link>

                            <div className="h-6 w-px bg-gray-200 mx-2"></div>

                            <div className="flex items-center gap-4">
                                <Link to="/preferences" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors bg-gray-100/50">
                                    <Settings size={20} />
                                </Link>

                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                                >
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                        alt={user?.fullName}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-[100px] truncate">
                                        {user?.fullName}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => openAuthModal('register')}
                                className="bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-500"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                        alt={user?.fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">{user?.fullName}</div>
                                        <div className="text-xs text-gray-500">{user?.email}</div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 my-2"></div>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Find Rooms
                                </Link>
                                <Link
                                    to="/post-room"
                                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Post a Room
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile Settings
                                </Link>
                                <Link
                                    to="/preferences"
                                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings size={18} /> Matching Preferences
                                </Link>
                                <div className="border-t border-gray-100 my-2"></div>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2"
                                >
                                    <LogOut size={18} /> Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openAuthModal('login');
                                    }}
                                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openAuthModal('register');
                                    }}
                                    className="w-full text-left px-3 py-2 text-primary font-bold hover:bg-blue-50 rounded-lg"
                                >
                                    Sign Up
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
