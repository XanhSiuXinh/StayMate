import { useState, useEffect } from 'react';
import { X, Info, Heart, MessageSquare, ShieldCheck, Moon, Sparkles, Dog, ArrowLeft, ArrowUp, ArrowRight, Sun, Loader2, ChevronLeft, ChevronRight, Wind, VolumeX, Home, Coffee, UserCircle2, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMatchingProfile, setHasMatchingProfile] = useState(null); // null = chưa biết
    const [showInfo, setShowInfo] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showPassed, setShowPassed] = useState(false);
    const [passedProfiles, setPassedProfiles] = useState([]);
    const [loadingPassed, setLoadingPassed] = useState(false);
    const [selectedPassedProfile, setSelectedPassedProfile] = useState(null);

    useEffect(() => {
        const checkProfileAndFetch = async () => {
            try {
                // Bước 1: Kiểm tra xem người dùng đã có hồ sơ ghép đôi chưa
                const statusRes = await fetch('http://localhost:5015/api/users/profile/status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    setHasMatchingProfile(statusData.hasMatchingProfile);

                    // Bước 2: Chỉ fetch gợi ý nếu đã có hồ sơ
                    if (statusData.hasMatchingProfile) {
                        const response = await fetch('http://localhost:5015/api/discover/recommendations', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            setProfiles(data);
                        }
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error swiping profile:", error);
        }

        setCurrentIndex(prev => prev + 1);
        setShowInfo(false); // Reset modal when swiping
        setCurrentPhotoIndex(0); // Reset photo gallery when swiping
    };

    const nextPhoto = () => {
        if (currentProfile?.photos && currentProfile.photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev === currentProfile.photos.length ? 0 : prev + 1));
        }
    };

    const prevPhoto = () => {
        if (currentProfile?.photos && currentProfile.photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev === 0 ? currentProfile.photos.length : prev - 1));
        }
    };

    const currentProfile = profiles[currentIndex];

    // Combine AvatarUrl and additional Photos into one array for the modal
    const getGalleryImages = () => {
        if (!currentProfile) return [];
        const mainImage = currentProfile.image; // fallback is applied in API
        const otherImages = currentProfile.photos || [];
        return [mainImage, ...otherImages];
    };
    const galleryImages = getGalleryImages();

    if (loading) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Checking your profile...</p>
            </div>
        );
    }

    // GATE: Nếu chưa có hồ sơ ghép đôi thì hiện màn hình mời tạo hồ sơ
    if (!hasMatchingProfile) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Decorative header */}
                    <div className="h-2 bg-gradient-to-r from-primary via-blue-400 to-purple-400" />

                    <div className="p-10 text-center">
                        {/* Animated Icon */}
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                                <UserCircle2 className="text-white" size={44} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            You don't have a matching profile yet!
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            To view and match with compatible roommates, you need to create a matching profile first. It only takes a few minutes!
                        </p>

                        {/* Steps preview */}
                        <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg">1</div>
                                <span className="text-gray-500">Fill your info</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg">2</div>
                                <span className="text-gray-500">Add preferences</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg">3</div>
                                <span className="text-gray-500">Start matching!</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-lg shadow-lg shadow-blue-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                        >
                            <Heart size={22} fill="currentColor" />
                            Create matching profile now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentProfile) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium tracking-wide">No more profiles to discover at this time. 🔍</p>
            </div>
        );
    }


    return (
        <div className="flex-1 min-h-[calc(100vh-64px)] bg-gray-50 flex py-8 relative px-4">

            <div className="max-w-md w-full mx-auto flex flex-col items-center">

                {/* Main Card */}
                <div className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl bg-gray-200">
                    {/* Background Image */}
                    <img
                        src={currentProfile.image}
                        alt={currentProfile.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Top Match Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <div className="flex items-center gap-1.5 bg-[#8b5cf6] text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                            <ShieldCheck size={16} />
                            {currentProfile.matchPercentage}% MATCH
                        </div>
                    </div>

                    {/* Bottom Info Gradient Area */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">

                        <h2 className="text-white text-3xl font-bold mb-1">
                            {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <p className="text-gray-200 text-lg mb-1">
                            {currentProfile.university}
                        </p>
                        <p className="text-gray-300 text-sm mb-1 font-medium italic">
                            {currentProfile.occupation}
                        </p>
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                            "{currentProfile.bio}"
                        </p>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentProfile.traits?.map((trait, index) => {
                                let IconComponent = Info;
                                if (trait.icon === 'Sun') IconComponent = Sun;
                                if (trait.icon === 'Moon') IconComponent = Moon;
                                if (trait.icon === 'Sparkles') IconComponent = Sparkles;
                                if (trait.icon === 'Dog') IconComponent = Dog;
                                if (trait.icon === 'Heart') IconComponent = Heart;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        <IconComponent size={14} />
                                        {trait.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                        onClick={() => handleSwipe('Pass')}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100"
                    >
                        <X size={32} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => setShowInfo(true)}
                        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                        <Info size={24} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => handleSwipe('Like')}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100"
                    >
                        <Heart size={32} strokeWidth={2.5} />
                    </button>
                </div>

                {/* View own profile link */}
                <div className="mt-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors font-medium group"
                    >
                        <UserCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                        View your profile
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                        onClick={async () => {
                            setShowPassed(true);
                            if (passedProfiles.length === 0) {
                                setLoadingPassed(true);
                                try {
                                    const res = await fetch('http://localhost:5015/api/discover/passed', {
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.ok) setPassedProfiles(await res.json());
                                } catch (e) { console.error(e); }
                                finally { setLoadingPassed(false); }
                            }
                        }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors font-medium group"
                    >
                        <History size={18} className="group-hover:scale-110 transition-transform" />
                        Passed Profiles
                    </button>
                </div>

            </div>

            {/* Floating Message Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 hover:scale-105 transition-all">
                    <MessageSquare size={28} />
                </button>
            </div>

            {/* Passed Profiles Modal */}
            {showPassed && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowPassed(false)}>
                    <div
                        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                                    <History size={18} className="text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Recently Passed</h3>
                                    <p className="text-xs text-gray-400">Past 10 profiles</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPassed(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1 px-4 py-3">
                            {loadingPassed ? (
                                <div className="flex justify-center items-center py-16">
                                    <Loader2 className="animate-spin text-gray-400" size={32} />
                                </div>
                            ) : passedProfiles.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <History size={40} className="mx-auto mb-3 opacity-40" />
                                    <p className="font-medium">No passed profiles yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 py-2">
                                    {passedProfiles.map((p) => (
                                        <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{p.name}, {p.age}</p>
                                                <p className="text-sm text-gray-500 truncate">{p.occupation}</p>
                                                <p className="text-xs text-gray-400 truncate">{p.university}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                <span className="text-xs text-orange-400 font-medium bg-orange-50 px-2 py-1 rounded-full">Passed</span>
                                                <button
                                                    onClick={() => setSelectedPassedProfile(p)}
                                                    className="text-xs text-primary font-semibold hover:underline"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Passed Profile Preview Mini-Modal */}
            {selectedPassedProfile && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPassedProfile(null)}>
                    <div
                        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Cover Image */}
                        <div className="relative h-56 bg-gray-100">
                            <img src={selectedPassedProfile.image} alt={selectedPassedProfile.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                <h2 className="text-white text-2xl font-bold">{selectedPassedProfile.name}, {selectedPassedProfile.age}</h2>
                                <p className="text-gray-200 text-sm">{selectedPassedProfile.university}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPassedProfile(null)}
                                className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <span className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Passed</span>
                        </div>

                        {/* Info */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Coffee size={16} className="text-primary flex-shrink-0" />
                                <span className="text-sm">{selectedPassedProfile.occupation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Home size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="text-sm">{selectedPassedProfile.university}</span>
                            </div>

                            <div className="pt-3 flex gap-3">
                                <button
                                    onClick={() => setSelectedPassedProfile(null)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Info Modal */}
            {showInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {/* Photo Gallery */}
                        <div className="relative aspect-[4/3] w-full bg-gray-100">
                            <img
                                src={galleryImages[currentPhotoIndex]}
                                alt={`${currentProfile.name} - ${currentPhotoIndex}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Gallery Navigation Controls (Only show if multiple images) */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPhoto}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextPhoto}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Sub-indicators */}
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                        {galleryImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all ${idx === currentPhotoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Expanded Info Content */}
                        <div className="p-6 md:p-8 space-y-8">
                            {/* Basic Info & Match Score */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        {currentProfile.name}, {currentProfile.age}
                                        <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
                                            <ShieldCheck size={16} /> Verified
                                        </div>
                                    </h2>
                                    <p className="text-gray-500 text-lg mt-1 flex gap-2"><Home size={20} className="text-gray-400" /> {currentProfile.university}</p>
                                    <p className="text-primary font-medium mt-1 flex gap-2"><Coffee size={20} className="text-primary/70" /> {currentProfile.occupation}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                                        {currentProfile.matchPercentage}%
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 mt-2 block uppercase tracking-wider">Match</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">About me</h3>
                                <p className="text-gray-700 leading-relaxed">"{currentProfile.bio}"</p>
                            </div>

                            {/* Detail Lifestyle Preferences */}
                            {currentProfile.lifestyle && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="text-yellow-500" /> Lifestyle</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Sun className="text-orange-400" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Wake up time</p>
                                                <p className="text-sm text-gray-900 font-semibold">{currentProfile.lifestyle.wakeUpTime || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Moon className="text-indigo-400" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Sleep time</p>
                                                <p className="text-sm text-gray-900 font-semibold">{currentProfile.lifestyle.sleepTime || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Wind className="text-cyan-500" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Cleanliness layer</p>
                                                <p className="text-sm text-gray-900 font-semibold">{currentProfile.lifestyle.cleanlinessLevel ? `${currentProfile.lifestyle.cleanlinessLevel}/5` : 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <VolumeX className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Noise level</p>
                                                <p className="text-sm text-gray-900 font-semibold">{currentProfile.lifestyle.noiseLevel ? `${currentProfile.lifestyle.noiseLevel}/5` : 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Dog className="text-amber-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Pets</p>
                                                <p className="text-sm text-gray-900 font-semibold">{currentProfile.lifestyle.hasPets ? (currentProfile.lifestyle.petType || 'Has pets') : 'No pets'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Info className="text-red-400" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Smoking & Drinking</p>
                                                <p className="text-sm text-gray-900 font-semibold truncate" title={`${currentProfile.lifestyle.smokingStatus} • ${currentProfile.lifestyle.drinkingStatus}`}>
                                                    {currentProfile.lifestyle.smokingStatus} • {currentProfile.lifestyle.drinkingStatus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Additional Attributes/Interests Tags */}
                            {currentProfile.traits && currentProfile.traits.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Similarities / Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProfile.traits.map((trait, index) => {
                                            let IconComponent = Info;
                                            if (trait.icon === 'Sun') IconComponent = Sun;
                                            if (trait.icon === 'Moon') IconComponent = Moon;
                                            if (trait.icon === 'Sparkles') IconComponent = Sparkles;
                                            if (trait.icon === 'Dog') IconComponent = Dog;
                                            if (trait.icon === 'Heart') IconComponent = Heart;

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                                                >
                                                    <IconComponent size={14} className="text-gray-500" />
                                                    {trait.text}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons inside modal */}
                            <div className="flex justify-center gap-6 pt-6 mt-4">
                                <button
                                    onClick={() => handleSwipe('Pass')}
                                    className="px-8 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-red-500 transition-colors w-full"
                                >
                                    Pass
                                </button>
                                <button
                                    onClick={() => handleSwipe('Like')}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all w-full flex items-center justify-center gap-2"
                                >
                                    <Heart size={20} fill="currentColor" /> Like
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discover;
