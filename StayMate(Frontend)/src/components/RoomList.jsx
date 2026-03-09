import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import RoomCard from './RoomCard';
import { useNavigate } from 'react-router-dom';

const RoomList = ({ rooms = [], loading = false }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No rooms found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
                    We couldn't find any rooms matching your criteria. Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map(room => (
                <RoomCard key={room.roomId} room={room} />
            ))}
        </div>
    );
};

export default RoomList;
