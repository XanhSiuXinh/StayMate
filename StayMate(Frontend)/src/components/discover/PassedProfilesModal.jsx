import React, { useState } from 'react';
import { X, History, Loader2, Coffee, Home } from 'lucide-react';

const PassedProfilesModal = ({ 
    show, 
    onClose, 
    passedProfiles, 
    loadingPassed 
}) => {
    const [selectedPassedProfile, setSelectedPassedProfile] = useState(null);

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 z-[50] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <div
                    className="bg-white dark:bg-gray-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col transition-colors border-t border-gray-200 dark:border-gray-700 sm:border animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in duration-300"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-200 dark:border-orange-500/20">
                                <History size={20} className="text-orange-500 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recently Passed</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Your pass history</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                            <X size={20} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1 px-4 py-3">
                        {loadingPassed ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-primary dark:text-blue-400" size={32} />
                            </div>
                        ) : passedProfiles.length === 0 ? (
                            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <History size={32} className="opacity-40" />
                                </div>
                                <p className="font-semibold text-gray-600 dark:text-gray-300">No history</p>
                                <p className="text-sm mt-1">You haven't passed any profiles yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 py-2">
                                {passedProfiles.map((p) => (
                                    <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-blue-100 dark:hover:border-gray-700 cursor-pointer group" onClick={() => setSelectedPassedProfile(p)}>
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm group-hover:shadow-md transition-shadow"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">{p.name}, {p.age}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{p.occupation}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{p.university}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className="text-xs text-orange-600 dark:text-orange-400 font-bold bg-orange-100/50 dark:bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-500/20 uppercase tracking-wide text-center">
                                                Passed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Passed Profile Preview Mini-Modal */}
            {selectedPassedProfile && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedPassedProfile(null)}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Cover Image */}
                        <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                            <img src={selectedPassedProfile.image} alt={selectedPassedProfile.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                                <h2 className="text-white text-3xl font-bold mb-1">{selectedPassedProfile.name}, {selectedPassedProfile.age}</h2>
                                <p className="text-gray-200 text-sm font-medium opacity-90">{selectedPassedProfile.university}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPassedProfile(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                            <span className="absolute top-4 left-4 bg-orange-500/90 border border-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm tracking-wide uppercase">Passed</span>
                        </div>

                        {/* Info */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Coffee size={16} className="text-primary dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-medium">{selectedPassedProfile.occupation}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Home size={16} className="text-primary dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-medium">{selectedPassedProfile.university}</span>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setSelectedPassedProfile(null)}
                                    className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700 shadow-sm"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PassedProfilesModal;
