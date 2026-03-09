import React from 'react';
import { Loader2, DollarSign, MapPin, Search } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const FilterBar = ({ filters, setFilters, onApply, isFiltering }) => {
    return (
        <div className="glass-card w-full max-w-2xl mb-8 p-4 flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
                <Input
                    label="Max Price"
                    type="number"
                    icon={DollarSign}
                    value={filters.maxPrice}
                    onChange={e => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                    placeholder="Budget (VND)"
                    className="bg-white/50 dark:bg-gray-800/50"
                />
            </div>
            <div className="flex-1 w-full">
                <Input
                    label="District"
                    type="text"
                    icon={MapPin}
                    value={filters.district}
                    onChange={e => setFilters(prev => ({...prev, district: e.target.value}))}
                    placeholder="Where to look?"
                    className="bg-white/50 dark:bg-gray-800/50"
                />
            </div>
            <div className="w-full md:w-auto">
                <Button 
                    onClick={onApply}
                    disabled={isFiltering}
                    isLoading={isFiltering}
                    icon={Search}
                    className="w-full md:w-auto h-[46.5px] px-8"
                >
                    Find Rooms
                </Button>
            </div>
        </div>
    );
};

export default FilterBar;
