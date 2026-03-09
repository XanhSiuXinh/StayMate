import React from 'react';
import { X, ShieldCheck, Home, Coffee, Sun, Moon, Sparkles, Wind, VolumeX, Dog, Info, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProfileDetailsModal = ({ 
    profile, 
    show, 
    onClose, 
    onPass, 
    onLike, 
    galleryImages, 
    currentPhotoIndex, 
    nextPhoto, 
    prevPhoto 
}) => {
    if (!show || !profile) return null;

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-300 relative transition-colors flex flex-col">
                
                {/* Photo Gallery Header */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800 shrink-0">
                    <img
                        src={galleryImages[currentPhotoIndex]}
                        alt={`${profile.name} - photo ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover"
                    />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
                    >
                        <X size={24} />
                    </button>

                    {/* Gallery Navigation Controls */}
                    {galleryImages.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-primary text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-primary text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {galleryImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentPhotoIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                                        role="button"
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Expanded Info Content */}
                <div className="p-6 md:p-8 space-y-8 flex-1">
                    {/* Basic Info & Match Score */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex flex-wrap items-center gap-3">
                                {profile.name}, {profile.age}
                                {profile.isVerified && (
                                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-500/20 uppercase tracking-wide">
                                        <ShieldCheck size={14} /> Verified
                                    </div>
                                )}
                            </h2>
                            <div className="space-y-2 mt-3">
                                <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Home size={16} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                    {profile.university}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                        <Coffee size={16} className="text-primary dark:text-blue-400" />
                                    </div>
                                    {profile.occupation}
                                </p>
                            </div>
                        </div>
                        <div className="text-center shrink-0 ml-4">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-xl
                                ${profile.matchPercentage >= 80 ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30' : 
                                  profile.matchPercentage >= 50 ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/30' : 
                                  'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/30'}`}>
                                {profile.matchPercentage}%
                            </div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 block uppercase tracking-widest">Match</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Info size={14} /> About me
                        </h3>
                        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed italic">"{profile.bio}"</p>
                    </div>

                    {/* Detail Lifestyle Preferences */}
                    {profile.lifestyle && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="p-1.5 bg-yellow-100 dark:bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-500">
                                    <Sparkles size={18} />
                                </span> 
                                Lifestyle Details
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', label: 'Wake up', value: profile.lifestyle.wakeUpTime || 'Not set' },
                                    { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', label: 'Sleep', value: profile.lifestyle.sleepTime || 'Not set' },
                                    { icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10', label: 'Cleanliness', value: profile.lifestyle.cleanlinessLevel ? `${profile.lifestyle.cleanlinessLevel}/5` : 'Not set' },
                                    { icon: VolumeX, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/10', label: 'Noise', value: profile.lifestyle.noiseLevel ? `${profile.lifestyle.noiseLevel}/5` : 'Not set' },
                                    { icon: Dog, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Pets', value: profile.lifestyle.hasPets ? (profile.lifestyle.petType || 'Has pets') : 'No pets' },
                                    { icon: Info, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Habits', value: `${profile.lifestyle.smokingStatus?.split(' ')[0] || 'Unknown'} / ${profile.lifestyle.drinkingStatus?.split(' ')[0] || 'Unknown'}` }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                                            <item.icon className={item.color} size={16} />
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-bold truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Attributes/Interests Tags */}
                    {profile.traits && profile.traits.length > 0 && (
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Interests & Traits</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {profile.traits.map((trait, index) => {
                                    let IconComponent = Info;
                                    if (trait.icon === 'Sun') IconComponent = Sun;
                                    if (trait.icon === 'Moon') IconComponent = Moon;
                                    if (trait.icon === 'Sparkles') IconComponent = Sparkles;
                                    if (trait.icon === 'Dog') IconComponent = Dog;
                                    if (trait.icon === 'Heart') IconComponent = Heart;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm"
                                        >
                                            <IconComponent size={16} className="text-primary dark:text-blue-400" />
                                            {trait.text}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons inside modal */}
                    <div className="flex justify-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pb-4 pt-6 -mx-8 px-8">
                        <button
                            onClick={onPass}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            Pass Profile
                        </button>
                        <button
                            onClick={onLike}
                            className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            <Heart size={20} fill="currentColor" /> Send Match
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetailsModal;
