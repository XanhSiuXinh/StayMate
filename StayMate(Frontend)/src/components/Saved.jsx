import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Heart, GraduationCap, Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Saved = () => {
    const { token } = useAuth();
    const [savedProfiles, setSavedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedProfiles = async () => {
            try {
                const response = await fetch('http://localhost:5015/api/discover/saved', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSavedProfiles(data);
                }
            } catch (error) {
                console.error("Error fetching saved profiles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedProfiles();
    }, [token]);

    if (loading) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Loading saved list...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" /> Saved Profiles
                </h1>
                <p className="text-gray-500 mt-2">Review the people you have liked on the Discover page.</p>
            </div>

            {savedProfiles.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No one here yet</h3>
                    <p className="text-gray-500 mb-6">You haven't "Liked" any profiles on the Discover page yet. Start swiping!</p>
                    <Link to="/discover" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-blue-600 transition-colors shadow-sm">
                        Discover Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {savedProfiles.map((profile) => (
                        <div key={profile.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col">
                            {/* Profile Header Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="text-2xl font-bold truncate drop-shadow-md">{profile.name}, {profile.age}</h3>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="space-y-3 mb-4 flex-1">
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <GraduationCap className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium line-clamp-1">{profile.university}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <Briefcase className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-sm italic">{profile.occupation}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mt-2 border border-gray-100">
                                        <span className="line-clamp-3">"{profile.bio}"</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 mt-auto border-t border-gray-100 flex gap-3">
                                    <button className="flex-1 bg-primary text-white py-2.5 rounded-full font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                                        <Mail className="w-4 h-4" /> Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Saved;
