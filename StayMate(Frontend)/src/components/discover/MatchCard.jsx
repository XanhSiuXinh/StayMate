import React from 'react';
import { Info, Sun, Moon, Sparkles, Dog, Heart } from 'lucide-react';

const MatchCard = ({ profile, swipeCount, onShowInfo }) => {
    if (!profile) return null;

    return (
        <div
            key={swipeCount}
            className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl bg-gray-200 animate-in fade-in slide-in-from-right-8 duration-300 group cursor-pointer"
            onClick={onShowInfo}
        >
            {/* Background Image */}
            <img
                src={profile.image}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Top Match Badge */}
            <div className="absolute top-6 left-6 z-10">
                <div className={`flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg backdrop-blur-md
                    ${profile.matchPercentage >= 80 ? 'bg-green-500/90 border border-green-400' : 
                      profile.matchPercentage >= 50 ? 'bg-orange-500/90 border border-orange-400' : 'bg-gray-500/90 border border-gray-400'}`}>
                    <Heart fill="currentColor" size={14} className={profile.matchPercentage >= 80 ? 'animate-pulse' : ''} />
                    {profile.matchPercentage}% MATCH
                </div>
            </div>

            {/* Bottom Info Gradient Area */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <h2 className="text-white text-3xl font-bold mb-1 flex items-center gap-2">
                    {profile.name}, {profile.age}
                </h2>
                <p className="text-gray-200 text-lg mb-1 font-medium">
                    {profile.university}
                </p>
                <p className="text-primary-300 text-sm mb-2 font-medium italic text-blue-300">
                    {profile.occupation}
                </p>
                <p className="text-gray-200 text-sm mb-4 line-clamp-2 leading-relaxed opacity-90">
                    "{profile.bio}"
                </p>

                {/* Traits */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {profile.traits?.slice(0, 3).map((trait, index) => {
                        let IconComponent = Info;
                        if (trait.icon === 'Sun') IconComponent = Sun;
                        if (trait.icon === 'Moon') IconComponent = Moon;
                        if (trait.icon === 'Sparkles') IconComponent = Sparkles;
                        if (trait.icon === 'Dog') IconComponent = Dog;
                        if (trait.icon === 'Heart') IconComponent = Heart;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
                            >
                                <IconComponent size={12} />
                                {trait.text}
                            </div>
                        );
                    })}
                    {profile.traits?.length > 3 && (
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            +{profile.traits.length - 3}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Click to view indicator */}
            <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Info size={20} />
                </div>
            </div>
        </div>
    );
};

export default MatchCard;
