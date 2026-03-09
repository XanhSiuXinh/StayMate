import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCTA = () => {
        if (isAuthenticated) {
            navigate('/discover');
        } else {
            openAuthModal('register');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 flex items-center justify-center min-h-[85vh]">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px]"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 mb-8 animate-float shadow-sm">
                        <Sparkles size={16} className="text-secondary" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Smart Matchmaking Algorithm inside
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Find your perfect <br />
                        <span className="text-gradient">Space & Roommate</span>
                    </h1>
                    
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10">
                        StayMate connects students and young professionals based on lifestyle compatibility. 
                        No more awkward living situations.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button 
                            size="xl" 
                            onClick={handleCTA}
                            icon={ArrowRight}
                            className="w-full sm:w-auto"
                        >
                            Start Matching Now
                        </Button>
                        <Button 
                            variant="white" 
                            size="xl" 
                            onClick={() => navigate('/post-room')}
                            icon={Home}
                            className="w-full sm:w-auto"
                        >
                            I have a room
                        </Button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: 'Active Users', value: '10k+', icon: Users },
                            { label: 'Rooms Listed', value: '5k+', icon: Home },
                            { label: 'Successful Matches', value: '8k+', icon: Sparkles },
                            { label: 'Verified Profiles', value: '100%', icon: ShieldCheck },
                        ].map((stat, i) => (
                            <Card key={i} glass className="p-6">
                                <stat.icon className="mx-auto mb-3 text-primary opacity-80" size={28} />
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div className="py-24 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How StayMate Works</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            We use advanced matchmaking to ensure you find a living situation that actually works for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                        
                        {[
                            { 
                                title: 'Create your Profile', 
                                desc: 'Tell us about your lifestyle, habits, and what you looking for in a roommate.',
                                icon: UserIcon
                            },
                            { 
                                title: 'Get Matched', 
                                desc: 'Our algorithm finds people and places with high compatibility scores natively.',
                                icon: Sparkles
                            },
                            { 
                                title: 'Connect & Move', 
                                desc: 'Chat securely, verify details, and move into your new home stress-free.',
                                icon: Home
                            }
                        ].map((step, i) => (
                            <div key={i} className="text-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <step.icon className="text-primary" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Temp icon component while fixing imports
function UserIcon(props) {
  return <Users {...props} />;
}

export default HomePage;
