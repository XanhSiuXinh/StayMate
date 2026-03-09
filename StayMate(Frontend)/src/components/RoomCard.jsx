import { MapPin, Home, Maximize, User, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    const isNew = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    return (
        <div
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/rooms/${room.roomId}`)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={room.photoUrls?.[0] || `https://source.unsplash.com/random/800x600?room,interior&sig=${room.roomId}`}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {isNew(room.createdAt) && (
                        <span className="bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            New
                        </span>
                    )}
                    {room.reviewsCount > 0 && (
                        <span className="bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> {room.averageRating.toFixed(1)} ({room.reviewsCount})
                        </span>
                    )}
                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-gray-200 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <User size={10} className="text-primary dark:text-blue-400" /> Verified
                    </span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-sm font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(room.price)}
                        </span>
                        <span className="text-[10px] text-gray-300 font-medium">/mo</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                        {room.title}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <MapPin size={14} className="text-primary/70 dark:text-blue-400/70 shrink-0" />
                    <span className="truncate">{room.ward ? `${room.ward}, ` : ''}{room.district}, {room.city}</span>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1.5 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Maximize size={12} className="text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">{room.areaSqm}m²</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1.5 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Home size={12} className="text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">Available</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={room.hostAvatar || `https://ui-avatars.com/api/?name=${room.hostName || 'Host'}&background=random`}
                            alt={room.hostName}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-none">{room.hostName}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Host</span>
                        </div>
                    </div>

                    <button className="text-xs font-medium text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                        Details <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
