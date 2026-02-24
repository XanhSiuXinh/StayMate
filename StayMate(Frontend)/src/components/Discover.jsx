import { useState } from 'react';
import { X, Info, Heart, MessageSquare, ShieldCheck, Moon, Sparkles, Dog, ArrowLeft, ArrowUp, ArrowRight } from 'lucide-react';

const DUMMY_PROFILES = [
    {
        id: 1,
        name: 'Sarah',
        age: 20,
        university: 'Stanford University',
        matchPercentage: 87,
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        traits: [
            { icon: <Moon size={14} />, text: 'Night Owl' },
            { icon: <Sparkles size={14} />, text: 'Very Tidy' },
            { icon: <Dog size={14} />, text: 'Pet Friendly' },
        ]
    }
];

const Discover = () => {
    const [profiles] = useState(DUMMY_PROFILES);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentProfile = profiles[currentIndex];

    if (!currentProfile) {
        return (
            <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">No more profiles to discover.</p>
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
                        <p className="text-gray-200 text-lg mb-4">
                            {currentProfile.university}
                        </p>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentProfile.traits.map((trait, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                                >
                                    {trait.icon}
                                    {trait.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100">
                        <X size={32} strokeWidth={2.5} />
                    </button>

                    <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all">
                        <Info size={24} strokeWidth={2.5} />
                    </button>

                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100">
                        <Heart size={32} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Keyboard Hints */}
                <div className="flex items-center justify-center gap-8 mt-8 text-gray-400 text-xs font-semibold tracking-wider">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm"><ArrowLeft size={12} /></span>
                        SKIP
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm"><ArrowUp size={12} /></span>
                        INFO
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm"><ArrowRight size={12} /></span>
                        LIKE
                    </div>
                </div>

            </div>

            {/* Floating Message Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 hover:scale-105 transition-all">
                    <MessageSquare size={28} />
                </button>
            </div>

        </div>
    );
};

export default Discover;
