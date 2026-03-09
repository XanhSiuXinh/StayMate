import React from 'react';
import { X, Info, Heart } from 'lucide-react';

const ActionButtons = ({ onPass, onLike, onInfo }) => {
    return (
        <div className="flex items-center justify-center gap-6 mt-8 mb-6">
            <button
                onClick={onPass}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-500/20"
            >
                <X size={32} strokeWidth={2.5} />
            </button>

            <button
                onClick={onInfo}
                className="w-14 h-14 bg-primary dark:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
                <Info size={24} strokeWidth={2.5} />
            </button>

            <button
                onClick={onLike}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 shadow-xl hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-500/20"
            >
                <Heart size={32} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default ActionButtons;
