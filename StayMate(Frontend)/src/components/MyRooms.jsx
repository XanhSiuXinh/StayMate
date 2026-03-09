import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Home, CheckCircle, XCircle, Trash2, Loader2, MapPin, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';

const MyRooms = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState({ totalRooms: 0, availableRooms: 0, occupiedRooms: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [roomsRes, statsRes] = await Promise.all([
                fetch('http://localhost:5015/api/rooms/my-rooms', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5015/api/rooms/landlord-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (roomsRes.ok && statsRes.ok) {
                const roomsData = await roomsRes.json();
                const statsData = await statsRes.json();
                setRooms(roomsData);
                setStats(statsData);
            }
        } catch (error) {
            console.error('Error fetching landlord data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const handleToggleAvailability = async (roomId) => {
        setActionLoading(roomId);
        try {
            const response = await fetch(`http://localhost:5015/api/rooms/${roomId}/toggle-availability`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRooms(prev => prev.map(r => 
                    r.roomId === roomId ? { ...r, isAvailable: data.isAvailable } : r
                ));
                // Update local stats too
                setStats(prev => ({
                    ...prev,
                    availableRooms: data.isAvailable ? prev.availableRooms + 1 : prev.availableRooms - 1,
                    occupiedRooms: !data.isAvailable ? prev.occupiedRooms + 1 : prev.occupiedRooms - 1
                }));
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        
        setActionLoading(roomId);
        try {
            const response = await fetch(`http://localhost:5015/api/rooms/${roomId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setRooms(prev => prev.filter(r => r.roomId !== roomId));
                // Refresh stats
                fetchAllData();
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-gray-500 font-medium">Loading your listings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('myRooms.title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your property listings and track performance.
                    </p>
                </div>
                <Link to="/post-room">
                    <Button icon={Plus} size="lg" className="shadow-lg hover:shadow-xl transition-all">
                        {t('navbar.postRoom')}
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Home size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('myRooms.stats.total')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRooms}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('myRooms.stats.available')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.availableRooms}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('myRooms.stats.occupied')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.occupiedRooms}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection/Filter Bar (Future proofing) */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Listings</h2>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button className="p-1.5 bg-white dark:bg-gray-700 shadow-sm rounded-md text-primary" title="Grid View">
                        <LayoutGrid size={18} />
                    </button>
                    <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" title="List View">
                        <ListIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Room Cards Grid */}
            {rooms.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Home size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('myRooms.noRooms')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                        Start making money by listing your extra space today.
                    </p>
                    <Link to="/post-room">
                        <Button variant="primary" icon={Plus}>
                            {t('myRooms.addFirst')}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <div 
                            key={room.roomId}
                            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img 
                                    src={room.photoUrls && room.photoUrls.length > 0 ? room.photoUrls[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} 
                                    alt={room.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 group-hover:translate-x-0 transition-transform">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
                                        room.isAvailable 
                                            ? 'bg-green-500/90 text-white' 
                                            : 'bg-amber-500/90 text-white'
                                    }`}>
                                        {room.isAvailable ? 'Available' : 'Occupied'}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {room.title}
                                </h3>
                                
                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    <MapPin size={14} className="text-primary" />
                                    <span className="line-clamp-1">{room.district}, {room.city}</span>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-primary dark:text-blue-400">
                                            {room.price?.toLocaleString('vi-VN')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">đ/month</span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                        {room.areaSqm} m²
                                    </div>
                                </div>

                                {/* Management Actions */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        fullWidth
                                        className="rounded-xl font-bold"
                                        onClick={() => handleToggleAvailability(room.roomId)}
                                        isLoading={actionLoading === room.roomId}
                                    >
                                        {room.isAvailable ? 'Mark Occupied' : 'Mark Available'}
                                    </Button>
                                    <div className="flex gap-2">
                                        <Link to={`/rooms/${room.roomId}`} className="flex-1">
                                            <Button variant="secondary" size="sm" fullWidth className="rounded-xl" title="View Detail">
                                                Detail
                                            </Button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteRoom(room.roomId)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                                            title="Delete Listing"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRooms;
