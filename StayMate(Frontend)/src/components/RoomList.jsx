import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import RoomCard from './RoomCard';
import { useNavigate } from 'react-router-dom';

const RoomList = ({ searchTerm = '' }) => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch('http://localhost:5015/api/rooms');
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            room.title?.toLowerCase().includes(term) ||
            room.city?.toLowerCase().includes(term) ||
            room.district?.toLowerCase().includes(term)
        );
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (filteredRooms.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No rooms found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    We couldn't find any rooms matching "{searchTerm}". Try adjusting your search.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRooms.map(room => (
                <RoomCard key={room.roomId} room={room} />
            ))}
        </div>
    );
};

export default RoomList;
