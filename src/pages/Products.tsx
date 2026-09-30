import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { REFERENCE_PRODUCTS, CATEGORIES } from '../data/mockData';
import { ProductReference } from '../types';
import {
  Search,
  Filter,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Building2,
  Package,
  Layers,
  FileCheck,
  Check,
  RotateCcw,
} from 'lucide-react';

export const Products: React.FC = () => {
  const {
    openPostRequest,
    openProductDetail,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedOriginFilter,
    setSelectedOriginFilter,
    t,
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState<'all' | 'estimated' | 'quotation'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'origin'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Subcategories mapping
  const subCategoryMap: Record<string, string[]> = {
    'Water & Irrigation': ['HDPE Pipe', 'PVC Pipe', 'Drip Irrigation', 'Valves', 'Fittings', 'Filters'],
    'Agriculture': ['Sprayers', 'Irrigation', 'Pumps', 'Farm Equipment', 'Fertilizer Equipment'],
    'Construction': ['Waterproofing', 'Sealants', 'Admixtures', 'Repair Materials', 'Tile Adhesives', 'Coatings'],
    'Chemicals': ['Industrial Chemicals', 'Fertilizers', 'Agricultural Chemicals', 'Adjuvants'],
  };

  const originList = ['Australia', 'China', 'Turkey', 'India', 'UAE', 'Europe'];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return REFERENCE_PRODUCTS.filter((prod) => {
      // Category filter
      if (selectedCategoryFilter && selectedCategoryFilter !== 'all' && prod.category !== selectedCategoryFilter) {
        return false;
      }
      // Subcategory filter
      if (selectedSubCategory && prod.subCategory !== selectedSubCategory) {
        return false;
      }
      // Origin filter
      if (selectedOriginFilter && prod.origin !== selectedOriginFilter) {
        return false;
      }
      // Price / Quote filter
      if (selectedPriceType === 'estimated' && !prod.estimatedPrice?.includes('Estimated')) {
        return false;
      }
      if (selectedPriceType === 'quotation' && !prod.estimatedPrice?.includes('Request quotation')) {
        return false;
      }
      // Keyword search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        const matchSpec = prod.shortSpec?.toLowerCase().includes(q);
        const matchSub = prod.subCategory?.toLowerCase().includes(q);
        const matchOrigin = prod.origin.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSpec && !matchSub && !matchOrigin) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'origin') return a.origin.localeCompare(b.origin);
      return 0; // featured default
    });
  }, [selectedCategoryFilter, selectedSubCategory, selectedOriginFilter, selectedPriceType, searchKeyword, sortBy]);

  const handleSourceProduct = (e: React.MouseEvent, prod: ProductReference) => {
    e.stopPropagation();
    const specsString = Object.entries(prod.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    openPostRequest(prod.category, prod.name, specsString);
  };

  const resetAllFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedSubCategory(null);
    setSelectedOriginFilter(null);
    setSelectedPriceType('all');
    setSearchKeyword('');
  };

  const activeFiltersCount =
    (selectedCategoryFilter && selectedCategoryFilter !== 'all' ? 1 : 0) +
    (selectedSubCategory ? 1 : 0) +
    (selectedOriginFilter ? 1 : 0) +
    (selectedPriceType !== 'all' ? 1 : 0) +
    (searchKeyword.trim() ? 1 : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF0]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
            <span className="hover:text-[#063B73] cursor-pointer" onClick={() => setSelectedCategoryFilter(null)}>
              Marketplace Catalog
            </span>
            {selectedCategoryFilter && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-[#063B73]">{selectedCategoryFilter}</span>
              </>
            )}
            {selectedSubCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#102A43] font-medium">{selectedSubCategory}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {selectedCategoryFilter ? `${selectedCategoryFilter} Catalog` : 'Sourcing Reference Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Verified international product specifications ready for proforma quotations & brokerage
          </p>
        </div>

        {/* Global Action: Post Sourcing Request */}
        <button
          onClick={() => openPostRequest(selectedCategoryFilter || undefined)}
          className="px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Custom Request</span>
        </button>
      </div>

      {/* Main Marketplace Area: Left Sidebar (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block bg-white rounded-2xl border border-[#E5EAF0] p-5 space-y-6 shadow-2xs sticky top-36">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#063B73]" />
              <h3 className="text-sm font-bold text-[#102A43]">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Keyword Search within catalog */}
          <div>
            <label className="block text-xs font-bold text-[#102A43] mb-1.5">Search within catalog</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. PE100, pump, 4mm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#102A43] focus:outline-none focus:ring-1 focus:ring-[#063B73]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Primary Categories & Subcategories */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Categories
            </label>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategoryFilter(null);
                  setSelectedSubCategory(null);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  !selectedCategoryFilter
                    ? 'bg-[#063B73]/10 text-[#063B73] font-bold'
                    : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] font-mono text-slate-400">{REFERENCE_PRODUCTS.length}</span>
              </button>

              {Object.keys(subCategoryMap).map((catName) => {
                const isCatSelected = selectedCategoryFilter === catName;
                const catProductsCount = REFERENCE_PRODUCTS.filter((p) => p.category === catName).length;

                return (
                  <div key={catName} className="space-y-0.5">
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter(catName);
                        setSelectedSubCategory(null);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        isCatSelected
                          ? 'bg-[#063B73] text-white font-bold'
                          : 'text-[#102A43] hover:bg-slate-50'
                      }`}
                    >
                      <span>{catName}</span>
                      <span className={`text-[11px] font-mono ${isCatSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {catProductsCount}
                      </span>
                    </button>

                    {/* Subcategories list when category is active */}
                    {isCatSelected && (
                      <div className="pl-3 py-1 space-y-0.5 border-l-2 border-[#063B73]/30 ml-2">
                        {subCategoryMap[catName].map((sub) => {
                          const isSubSelected = selectedSubCategory === sub;
                          const subCount = REFERENCE_PRODUCTS.filter(
                            (p) => p.category === catName && p.subCategory === sub
                          ).length;

                          return (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubCategory(isSubSelected ? null : sub)}
                              className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                                isSubSelected
                                  ? 'bg-[#0B8F73] text-white font-semibold'
                                  : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
                              }`}
                            >
                              <span>{sub}</span>
                              <span className="text-[10px] font-mono opacity-80">{subCount}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Origin Country Filters */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Origin Country
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedOriginFilter(null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  !selectedOriginFilter
                    ? 'bg-[#063B73]/10 text-[#063B73] font-bold'
                    : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-50'
                }`}
              >
                <span>All Origins</span>
                {!selectedOriginFilter && <Check className="w-3.5 h-3.5 text-[#063B73]" />}
              </button>

              {originList.map((country) => {
                const isSelected = selectedOriginFilter === country;
                const count = REFERENCE_PRODUCTS.filter((p) => p.origin === country).length;

                return (
                  <button
                    key={country}
                    onClick={() => setSelectedOriginFilter(isSelected ? null : country)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#063B73] text-white font-bold'
                        : 'text-[#102A43] hover:bg-slate-50'
                    }`}
                  >
                    <span>{country}</span>
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indication / Quotation Type */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Pricing Structure
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Listings' },
                { id: 'estimated', label: 'Estimated Benchmark Price' },
                { id: 'quotation', label: 'Custom Quotation Required' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPriceType(item.id as any)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedPriceType === item.id
                      ? 'bg-[#063B73]/10 text-[#063B73] font-bold'
                      : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedPriceType === item.id && <Check className="w-3.5 h-3.5 text-[#063B73]" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: MAIN CATALOG PRODUCT GRID & TOP TOOLBAR */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Control Bar: Mobile Filter Button, Sort Selector, Results Count */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#E5EAF0] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3 py-2 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E5EAF0] text-[#102A43] text-xs font-bold rounded-lg flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#063B73]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#063B73] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Counter & Active Pills */}
            <div className="text-xs text-[#64748B]">
              Showing <strong className="text-[#102A43]">{filteredProducts.length}</strong> reference products
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg px-2.5 py-1.5 text-xs text-[#102A43] font-medium focus:outline-none focus:ring-1 focus:ring-[#063B73]"
              >
                <option value="featured">Featured Specifications</option>
                <option value="name-asc">Product Name (A-Z)</option>
                <option value="origin">Origin Country</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#64748B]">Active filters:</span>

              {selectedCategoryFilter && (
                <span className="inline-flex items-center gap-1 bg-[#063B73]/10 text-[#063B73] px-2.5 py-1 rounded-full font-medium">
                  Category: {selectedCategoryFilter}
                  <button onClick={() => setSelectedCategoryFilter(null)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubCategory && (
                <span className="inline-flex items-center gap-1 bg-[#0B8F73]/10 text-[#0B8F73] px-2.5 py-1 rounded-full font-medium">
                  Subcategory: {selectedSubCategory}
                  <button onClick={() => setSelectedSubCategory(null)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedOriginFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  Origin: {selectedOriginFilter}
                  <button onClick={() => setSelectedOriginFilter(null)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPriceType !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  Price: {selectedPriceType === 'estimated' ? 'Estimated' : 'Quotation Required'}
                  <button onClick={() => setSelectedPriceType('all')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchKeyword && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  "{searchKeyword}"
                  <button onClick={() => setSearchKeyword('')} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-semibold text-red-600 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Subcategories Horizontal Scrollbar (When a category is active) */}
          {selectedCategoryFilter && subCategoryMap[selectedCategoryFilter] && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedSubCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  !selectedSubCategory
                    ? 'bg-[#063B73] text-white shadow-2xs'
                    : 'bg-white border border-[#E5EAF0] text-[#64748B] hover:text-[#102A43]'
                }`}
              >
                All {selectedCategoryFilter}
              </button>
              {subCategoryMap[selectedCategoryFilter].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSubCategory === sub
                      ? 'bg-[#0B8F73] text-white shadow-2xs'
                      : 'bg-white border border-[#E5EAF0] text-[#64748B] hover:text-[#102A43]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* PRODUCT CARDS GRID */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => openProductDetail(prod.id)}
                  className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden hover:border-[#063B73] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image Container */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded text-[11px] font-bold text-[#063B73] shadow-xs border border-slate-200">
                        Origin: {prod.origin}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-[#102A43]/85 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-medium">
                        {prod.category}
                      </div>

                      {prod.shortSpec && (
                        <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded truncate">
                          {prod.shortSpec}
                        </div>
                      )}
                    </div>

                    {/* Product Meta */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 mb-0.5">
                          <span>{prod.subCategory || prod.category}</span>
                          <span>·</span>
                          <span className="truncate">{prod.manufacturer}</span>
                        </div>
                        <h2 className="text-sm font-bold text-[#102A43] group-hover:text-[#063B73] transition-colors line-clamp-2 leading-snug">
                          {prod.name}
                        </h2>
                      </div>

                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Technical Specs Preview Table */}
                      <div className="bg-[#F8FAFC] rounded-lg p-2.5 border border-[#E5EAF0] space-y-1 text-[11px]">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#64748B]">Indication:</span>
                          <span className="font-bold text-[#063B73]">
                            {prod.estimatedPrice || 'Request quotation'}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#64748B]">Typical MOQ:</span>
                          <span className="font-mono text-slate-800 font-medium">{prod.typicalMOQ}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[#64748B]">Supplier Desk:</span>
                          <span className="text-[#0B8F73] font-medium truncate max-w-[140px]">
                            {prod.supplierAvailability || 'Vetted Manufacturer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={(e) => handleSourceProduct(e, prod)}
                      className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Source This Product</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#102A43]">
                No reference products match the selected criteria
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Can't find the exact specifications you require? You can post a custom sourcing request and our brokerage team will match global suppliers directly.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 border border-[#E5EAF0] rounded-xl text-xs font-semibold text-[#102A43] hover:bg-slate-50 transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => openPostRequest(selectedCategoryFilter || undefined, searchKeyword || undefined)}
                  className="px-5 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Custom Sourcing Request</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl border-t border-[#E5EAF0] overflow-hidden z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#063B73]" />
                <h3 className="text-sm font-bold text-[#102A43]">Filter Products</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 overflow-y-auto space-y-5 text-xs">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73] mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(null);
                      setSelectedSubCategory(null);
                    }}
                    className={`p-2.5 text-left rounded-lg border text-xs font-semibold ${
                      !selectedCategoryFilter
                        ? 'border-[#063B73] bg-[#063B73]/10 text-[#063B73]'
                        : 'border-[#E5EAF0] text-[#102A43]'
                    }`}
                  >
                    All Categories
                  </button>
                  {Object.keys(subCategoryMap).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategoryFilter(cat);
                        setSelectedSubCategory(null);
                      }}
                      className={`p-2.5 text-left rounded-lg border text-xs font-semibold ${
                        selectedCategoryFilter === cat
                          ? 'border-[#063B73] bg-[#063B73]/10 text-[#063B73]'
                          : 'border-[#E5EAF0] text-[#102A43]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if selected) */}
              {selectedCategoryFilter && subCategoryMap[selectedCategoryFilter] && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73] mb-2">
                    Subcategory ({selectedCategoryFilter})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {subCategoryMap[selectedCategoryFilter].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          selectedSubCategory === sub
                            ? 'bg-[#0B8F73] text-white border-[#0B8F73]'
                            : 'border-[#E5EAF0] text-[#102A43]'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Origin */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73] mb-2">
                  Origin Country
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedOriginFilter(null)}
                    className={`p-2 text-left rounded-lg border text-xs font-medium ${
                      !selectedOriginFilter
                        ? 'border-[#063B73] bg-[#063B73]/10 text-[#063B73]'
                        : 'border-[#E5EAF0] text-[#102A43]'
                    }`}
                  >
                    All Origins
                  </button>
                  {originList.map((country) => (
                    <button
                      key={country}
                      onClick={() => setSelectedOriginFilter(selectedOriginFilter === country ? null : country)}
                      className={`p-2 text-left rounded-lg border text-xs font-medium ${
                        selectedOriginFilter === country
                          ? 'border-[#063B73] bg-[#063B73]/10 text-[#063B73]'
                          : 'border-[#E5EAF0] text-[#102A43]'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73] mb-2">
                  Pricing Indication
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All Listings' },
                    { id: 'estimated', label: 'Estimated Benchmark Price' },
                    { id: 'quotation', label: 'Custom Quotation Required' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPriceType(item.id as any)}
                      className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                        selectedPriceType === item.id
                          ? 'border-[#063B73] bg-[#063B73]/10 text-[#063B73] font-bold'
                          : 'border-[#E5EAF0] text-[#102A43]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedPriceType === item.id && <Check className="w-3.5 h-3.5 text-[#063B73]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-[#E5EAF0] bg-[#F8FAFC] flex gap-3">
              <button
                onClick={resetAllFilters}
                className="py-2.5 px-4 bg-white border border-[#E5EAF0] text-[#102A43] text-xs font-semibold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl text-center shadow-xs"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
