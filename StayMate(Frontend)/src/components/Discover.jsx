import { useState, useEffect } from 'react';
import { UserCircle2, Heart, History, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import FilterBar from './discover/FilterBar';
import MatchCard from './discover/MatchCard';
import ActionButtons from './discover/ActionButtons';
import PassedProfilesModal from './discover/PassedProfilesModal';
import ProfileDetailsModal from './discover/ProfileDetailsModal';
import Button from './ui/Button';

const Discover = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    // Core state
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMatchingProfile, setHasMatchingProfile] = useState(null);
    const [swipeCount, setSwipeCount] = useState(0);

    // Filters
    const [filters, setFilters] = useState({ maxPrice: '', district: '', city: '' });
    const [isFiltering, setIsFiltering] = useState(false);

    // Modals
    const [showInfo, setShowInfo] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showPassed, setShowPassed] = useState(false);
    const [passedProfiles, setPassedProfiles] = useState([]);
    const [loadingPassed, setLoadingPassed] = useState(false);

    const fetchRecommendations = async () => {
        setIsFiltering(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.district) queryParams.append('district', filters.district);
            if (filters.city) queryParams.append('city', filters.city);
            
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            const response = await fetch(`http://localhost:5015/api/discover/recommendations${queryString}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProfiles(data);
                setCurrentIndex(0);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        const checkProfileAndFetch = async () => {
            try {
                const statusRes = await fetch('http://localhost:5015/api/users/profile/status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    setHasMatchingProfile(statusData.hasMatchingProfile);

                    if (statusData.hasMatchingProfile) {
                        await fetchRecommendations();
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkProfileAndFetch();
    }, [token]);

    const handleSwipe = async (swipeType) => {
        if (!profiles[currentIndex]) return;

        try {
            await fetch(`http://localhost:5015/api/discover/swipe/${profiles[currentIndex].id}?swipeType=${swipeType}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error swiping profile:", error);
        }

        setShowInfo(false); 
        setCurrentPhotoIndex(0); 
        setSwipeCount(prev => prev + 1);

        if (currentIndex + 1 >= profiles.length) {
            await fetchRecommendations();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const nextPhoto = () => {
        if (currentProfile?.photos?.length > 0) {
            setCurrentPhotoIndex((prev) => (prev === currentProfile.photos.length ? 0 : prev + 1));
        }
    };

    const prevPhoto = () => {
        if (currentProfile?.photos?.length > 0) {
            setCurrentPhotoIndex((prev) => (prev === 0 ? currentProfile.photos.length : prev - 1));
        }
    };

    const currentProfile = profiles[currentIndex];
    
    const getGalleryImages = () => {
        if (!currentProfile) return [];
        return [currentProfile.image, ...(currentProfile.photos || [])];
    };
    
    const fetchPassedProfiles = async () => {
        setShowPassed(true);
        if (passedProfiles.length === 0) {
            setLoadingPassed(true);
            try {
                const res = await fetch('http://localhost:5015/api/discover/passed', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setPassedProfiles(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPassed(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4 transition-colors">
                <Loader2 className="w-10 h-10 animate-spin text-primary dark:text-blue-400" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Checking your profile...</p>
            </div>
        );
    }

    if (!hasMatchingProfile) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
                <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-colors">
                    <div className="h-2 bg-gradient-to-r from-primary via-blue-400 to-purple-400" />
                    <div className="p-10 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full animate-ping opacity-30" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-blue-400 dark:from-blue-600 dark:to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                                <UserCircle2 className="text-white" size={44} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            You don't have a matching profile yet!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                            To view and match with compatible roommates, you need to create a matching profile first. It only takes a few minutes!
                        </p>
                        
                        <Button 
                            size="lg" 
                            fullWidth 
                            onClick={() => navigate('/profile')}
                            icon={Heart}
                        >
                            Create matching profile now
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentProfile) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">No more profiles to discover at this time. 🔍</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-6 px-4 transition-colors">
            
            <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                onApply={fetchRecommendations} 
                isFiltering={isFiltering} 
            />

            <div className="max-w-md w-full mx-auto flex flex-col items-center">
                <MatchCard 
                    profile={currentProfile} 
                    swipeCount={swipeCount} 
                    onShowInfo={() => setShowInfo(true)} 
                />

                <ActionButtons 
                    onPass={() => handleSwipe('Pass')}
                    onLike={() => handleSwipe('Like')}
                    onInfo={() => setShowInfo(true)}
                />

                {/* View links */}
                <div className="mt-4 mb-16 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium group"
                    >
                        <UserCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                        View your profile
                    </button>
                    <span className="text-gray-200 dark:text-gray-700">|</span>
                    <button
                        onClick={fetchPassedProfiles}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors font-medium group"
                    >
                        <History size={18} className="group-hover:scale-110 transition-transform" />
                        Passed Profiles
                    </button>
                </div>
            </div>

            {/* Floating Message Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <button 
                    onClick={() => navigate('/messages')}
                    className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 dark:shadow-none hover:bg-blue-600 dark:hover:bg-blue-500 hover:scale-105 transition-all"
                >
                    <MessageSquare size={28} />
                </button>
            </div>

            <PassedProfilesModal 
                show={showPassed} 
                onClose={() => setShowPassed(false)}
                passedProfiles={passedProfiles}
                loadingPassed={loadingPassed}
            />

            <ProfileDetailsModal 
                profile={currentProfile}
                show={showInfo}
                onClose={() => setShowInfo(false)}
                onPass={() => handleSwipe('Pass')}
                onLike={() => handleSwipe('Like')}
                galleryImages={getGalleryImages()}
                currentPhotoIndex={currentPhotoIndex}
                nextPhoto={nextPhoto}
                prevPhoto={prevPhoto}
            />
        </div>
    );
};

export default Discover;
