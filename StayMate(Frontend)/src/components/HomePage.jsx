import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Users, ArrowRight, ShieldCheck, Sparkles, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import RoomList from './RoomList';
import MapView from './MapView';
import { useTranslation } from 'react-i18next';
import { Map, List } from 'lucide-react';
import { createApiUrl } from '../config/api';

const HomePage = () => {
    const { isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // Room state
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        searchTerm: '',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: ''
        });
    };

    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const params = new URLSearchParams();
            if (filters.searchTerm) params.append('city', filters.searchTerm);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.minArea) params.append('minArea', filters.minArea);
            if (filters.maxArea) params.append('maxArea', filters.maxArea);

            const response = await fetch(createApiUrl('/api/rooms') + `?${params.toString()}`);
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [filters]);

    const handleCTA = () => {
        if (isAuthenticated) {
            navigate('/discover');
        } else {
            openAuthModal('register');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors">
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
                            className="w-full sm:w-auto shadow-lg shadow-blue-500/25"
                        >
                            Start Matching Now
                        </Button>
                        <Button 
                            variant="white" 
                            size="xl" 
                            onClick={() => navigate('/post-room')}
                            icon={Home}
                            className="w-full sm:w-auto shadow-sm"
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

            {/* Rooms Section */}
            <div id="rooms-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                                Available Rooms
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Browse recently posted rooms from our community. Find your next home today.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 self-center md:self-end">
                            <div className="relative w-full md:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="searchTerm"
                                    placeholder="Search by city, district..."
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    value={filters.searchTerm}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-semibold ${showFilters ? 'bg-primary text-white border-primary shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'}`}
                            >
                                <Filter size={20} />
                                <span className="hidden sm:inline">Filters</span>
                            </button>

                            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm ml-1">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                >
                                    <List size={20} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('map')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                >
                                    <Map size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Filter Panel */}
                    <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-[400px] mb-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Price Range */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Price Range (VND)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            placeholder="Min"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="text-gray-300">/</span>
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            placeholder="Max"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>

                                {/* Area Range */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Area (m²)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="minArea"
                                            placeholder="Min"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={filters.minArea}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="text-gray-300">/</span>
                                        <input
                                            type="number"
                                            name="maxArea"
                                            placeholder="Max"
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={filters.maxArea}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end lg:col-span-2">
                                    <button 
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} /> Reset All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {viewMode === 'list' ? (
                    <RoomList rooms={rooms} loading={loadingRooms} />
                ) : (
                    <MapView rooms={rooms} />
                )}
                
                <div className="mt-16 text-center">
                    <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => navigate('/discover')}
                        icon={ArrowRight}
                    >
                        View More Shared Spaces
                    </Button>
                </div>
            </div>

            {/* How it works */}
            <div className="py-24 bg-white dark:bg-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How StayMate Works</h2>
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
                                icon: Users
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
                            <div key={i} className="text-center bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-primary/10 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <step.icon className="text-primary dark:text-blue-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
