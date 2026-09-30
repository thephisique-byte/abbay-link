import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Droplets,
  HardHat,
  FlaskConical,
  Wrench,
  Layers,
  LayoutGrid,
  ChevronDown,
  Globe,
  Compass,
} from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    t,
  } = useApp();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'All Catalog', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'Agriculture', label: 'Agriculture', icon: <Sprout className="w-3.5 h-3.5" /> },
    { id: 'Water & Irrigation', label: 'Water & Irrigation', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'Construction', label: 'Construction', icon: <HardHat className="w-3.5 h-3.5" /> },
    { id: 'Chemicals', label: 'Chemicals', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'Pipes & Fittings', label: 'Pipes & Fittings', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'Equipment', label: 'Equipment', icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  const moreItems = [
    { label: 'Global Suppliers Directory', action: () => setActiveTab('suppliers'), icon: <Globe className="w-4 h-4 text-[#063B73]" /> },
    { label: 'Sourcing Opportunities', action: () => setActiveTab('opportunities'), icon: <Compass className="w-4 h-4 text-[#0B8F73]" /> },
    { label: 'Landed Cost Calculator', action: () => setActiveTab('calculator'), icon: <Layers className="w-4 h-4 text-[#0B5FA5]" /> },
    { label: 'How ABAYLINK Works', action: () => setActiveTab('how-it-works'), icon: <Wrench className="w-4 h-4 text-[#35A878]" /> },
  ];

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(catId);
    }
    setActiveTab('products');
  };

  return (
    <div className="bg-[#F8FAFC] border-t border-[#E5EAF0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1.5 text-xs font-medium">
          <div className="flex items-center gap-1 sm:gap-2">
            {categories.map((cat) => {
              const isActive =
                activeTab === 'products' &&
                ((cat.id === 'all' && !selectedCategoryFilter) || selectedCategoryFilter === cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#063B73] text-white font-semibold shadow-2xs'
                      : 'text-[#102A43] hover:text-[#063B73] hover:bg-white'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{cat.icon}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* "More" Dropdown */}
          <div className="relative shrink-0 ml-1" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors text-xs font-semibold ${
                isMoreOpen ? 'bg-[#063B73] text-white' : 'text-[#64748B] hover:text-[#063B73] hover:bg-white'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E5EAF0] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {moreItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMoreOpen(false);
                      item.action();
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-[#F8FAFC] text-[#102A43] transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
