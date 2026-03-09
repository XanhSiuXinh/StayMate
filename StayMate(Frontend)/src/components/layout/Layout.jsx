import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    const isMessagesRoute = location.pathname.startsWith('/messages');
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            {!isMessagesRoute && <Footer />}
        </div>
    );
};

export default Layout;
