import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterBarProps {
    onSearch: (term: string) => void;
    placeholder?: string;
    isFilterEnabled?: boolean;
    onFilterClick?: () => void;
    isFilterOpen?: boolean;
    filterContent?: ReactNode;
    actions?: ReactNode;
    initialSearchTerm?: string;
}

const SearchFilterBar = ({
    onSearch,
    placeholder = "Rechercher...",
    isFilterEnabled = false,
    onFilterClick,
    isFilterOpen = false,
    filterContent,
    actions,
    initialSearchTerm = ''
}: SearchFilterBarProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close search if clicked outside
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchExpanded(false);
            }

            // Close filter if clicked outside
            if (filterRef.current && !filterRef.current.contains(event.target as Node) && isFilterOpen && onFilterClick) {
                onFilterClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchTerm, isFilterOpen, onFilterClick]);

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2" ref={searchContainerRef}>
                {/* Search Input */}
                <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'flex-1 max-w-md' : 'w-10'}`}>
                    <button
                        onClick={() => setIsSearchExpanded(true)}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isSearchExpanded ? 'text-gray-400 pointer-events-none' : 'text-white bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        <Search size={18} />
                    </button>

                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-all pl-10 pr-4 ${isSearchExpanded ? 'opacity-100 visible' : 'opacity-0 invisible w-0 p-0 border-0'
                            }`}
                    />

                    {isSearchExpanded && searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filter Button */}
                {isFilterEnabled && (
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={onFilterClick}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border ${isFilterOpen
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            <Filter size={18} />
                            {/* <span className="hidden md:inline">Filtrer</span> - User wanted icons next to each other, implies compact? Or text? 
                                User said "l'icone loupe et l'icone filtre a cote". 
                                Let's keep the text for usability but maybe make it optional or purely icon on mobile.
                            */}
                        </button>

                        {isFilterOpen && (
                            <div className="absolute left-0 top-full mt-2 w-64 bg-[#1a1f37] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                {filterContent}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions (Right side buttons) */}
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default SearchFilterBar;
