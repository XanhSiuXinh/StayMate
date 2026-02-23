import { Home, Heart, Instagram, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                Stay<span className="text-primary">Mate</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Connecting students and young professionals with perfect living spaces and compatible roommates. safe, transparent, and community-driven.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/" className="hover:text-primary transition-colors">Find a Room</Link></li>
                            <li><Link to="/post-room" className="hover:text-primary transition-colors">Post a Room</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Roommate Matching</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Verification</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-primary transition-colors">Safety Tips</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Community Guidelines</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Tenant Rights</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
                        <p className="text-gray-500 text-sm mb-4">Subscribe to our newsletter for the latest listings and community news.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} StayMate. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
