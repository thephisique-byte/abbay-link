import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { REFERENCE_PRODUCTS, CATEGORIES } from '../data/mockData';
import {
  Search,
  X,
  ArrowRight,
  Building2,
  Package,
  Compass,
  Layers,
  Sprout,
  Droplets,
  HardHat,
  FlaskConical,
  CornerDownLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    suppliers,
    requests,
    openPostRequest,
    setActiveTab,
    setSelectedRequestId,
    openProductDetail,
    setSelectedCategoryFilter,
    setSelectedOriginFilter,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'products' | 'suppliers' | 'categories' | 'opportunities'>('all');

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery('');
      setActiveFilterTab('all');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  // Search across 4 domains
  const filteredProducts = useMemo(() => {
    if (!query) return REFERENCE_PRODUCTS.slice(0, 4);
    return REFERENCE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
        (p.shortSpec && p.shortSpec.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query) ||
        p.origin.toLowerCase().includes(query) ||
        p.manufacturer.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredSuppliers = useMemo(() => {
    if (!query) return suppliers.slice(0, 3);
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query) ||
        s.products.some((pr) => pr.toLowerCase().includes(query)) ||
        s.categories.some((c) => c.toLowerCase().includes(query)) ||
        s.description.toLowerCase().includes(query)
    );
  }, [query, suppliers]);

  const filteredCategories = useMemo(() => {
    if (!query) return CATEGORIES;
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredRequests = useMemo(() => {
    if (!query) return requests.slice(0, 3);
    return requests.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.specifications.toLowerCase().includes(query) ||
        r.destinationCity.toLowerCase().includes(query) ||
        r.preferredOrigin.toLowerCase().includes(query)
    );
  }, [query, requests]);

  // Dynamic search suggestions based on current query
  const suggestions = useMemo(() => {
    if (!query) return [];
    const list: Array<{ label: string; type: 'product' | 'category' | 'supplier' | 'opportunity'; targetId?: string }> = [];

    // Product suggestions
    filteredProducts.slice(0, 3).forEach((p) => {
      list.push({ label: p.name, type: 'product', targetId: p.id });
    });

    // Supplier suggestions
    if (filteredSuppliers.length > 0) {
      list.push({ label: `${query.toUpperCase()} Suppliers (${filteredSuppliers.length})`, type: 'supplier' });
    }

    // Opportunity suggestions
    if (filteredRequests.length > 0) {
      list.push({ label: `${query.toUpperCase()} Sourcing Opportunities (${filteredRequests.length})`, type: 'opportunity' });
    }

    return list;
  }, [query, filteredProducts, filteredSuppliers, filteredRequests]);

  const popularSearches = [
    'HDPE pipe',
    'UPVC pipe',
    'Irrigation pump',
    'Waterproofing membrane',
    'Agricultural boom sprayer',
    'Center pivot irrigation',
    'Polyacrylamide flocculant',
    'Soluble NPK',
  ];

  const handleSelectProduct = (prodId: string) => {
    closeSearch();
    openProductDetail(prodId);
  };

  const handleSelectCategory = (catName: string) => {
    closeSearch();
    setSelectedCategoryFilter(catName);
    setActiveTab('products');
  };

  const handleSelectOpportunity = (reqId: string) => {
    closeSearch();
    setSelectedRequestId(reqId);
    setActiveTab('opportunities');
  };

  const handleSelectSupplier = () => {
    closeSearch();
    setActiveTab('suppliers');
  };

  const totalResults =
    (activeFilterTab === 'all' || activeFilterTab === 'products' ? filteredProducts.length : 0) +
    (activeFilterTab === 'all' || activeFilterTab === 'suppliers' ? filteredSuppliers.length : 0) +
    (activeFilterTab === 'all' || activeFilterTab === 'categories' ? filteredCategories.length : 0) +
    (activeFilterTab === 'all' || activeFilterTab === 'opportunities' ? filteredRequests.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-14 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeSearch}
      />

      {/* Search Container: Fullscreen on mobile, rounded card on tablet/desktop */}
      <div className="relative w-full max-w-3xl bg-white sm:rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 h-full sm:h-auto sm:max-h-[88vh] flex flex-col">
        {/* Search Header Input */}
        <div className="p-3.5 sm:p-4 border-b border-[#E5EAF0] flex items-center gap-3 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#063B73] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search products, materials, equipment or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-[#102A43] placeholder-[#64748B] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#64748B] hover:text-[#102A43] rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="text-xs font-bold text-[#64748B] hover:text-[#102A43] px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 transition-colors shrink-0"
          >
            Cancel
          </button>
        </div>

        {/* Tab Scope Filters */}
        <div className="px-4 py-2 border-b border-[#E5EAF0] bg-white flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-medium">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeFilterTab === 'all'
                ? 'bg-[#063B73] text-white font-bold'
                : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveFilterTab('products')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeFilterTab === 'products'
                ? 'bg-[#063B73] text-white font-bold'
                : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('suppliers')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeFilterTab === 'suppliers'
                ? 'bg-[#063B73] text-white font-bold'
                : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
            }`}
          >
            Suppliers ({filteredSuppliers.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('categories')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeFilterTab === 'categories'
                ? 'bg-[#063B73] text-white font-bold'
                : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
            }`}
          >
            Categories ({filteredCategories.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('opportunities')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeFilterTab === 'opportunities'
                ? 'bg-[#063B73] text-white font-bold'
                : 'text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
            }`}
          >
            Opportunities ({filteredRequests.length})
          </button>
        </div>

        {/* Dynamic Suggestions as User Types */}
        {query && suggestions.length > 0 && (
          <div className="px-4 py-2.5 bg-blue-50/50 border-b border-blue-100 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B73] block mb-1.5">
              Suggestions for "{query}"
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (s.type === 'product' && s.targetId) {
                      handleSelectProduct(s.targetId);
                    } else if (s.type === 'supplier') {
                      handleSelectSupplier();
                    } else if (s.type === 'opportunity') {
                      setActiveTab('opportunities');
                      closeSearch();
                    } else {
                      setSearchQuery(s.label);
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#063B73] hover:text-white text-[#102A43] rounded-md border border-blue-200 text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Search className="w-3 h-3 text-[#063B73] group-hover:text-white" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search: Popular Queries */}
        {!query && (
          <div className="p-4 border-b border-slate-100 bg-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Trending B2B Sourcing Inquiries
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#063B73]/10 hover:text-[#063B73] text-xs font-medium text-[#102A43] rounded-lg border border-[#E5EAF0] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. MATCHING PRODUCTS */}
          {(activeFilterTab === 'all' || activeFilterTab === 'products') && filteredProducts.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>Products ({filteredProducts.length})</span>
                </span>
                <span className="text-[11px] text-[#64748B]">Verified reference specs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredProducts.slice(0, 6).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className="p-3 rounded-xl border border-[#E5EAF0] hover:border-[#063B73] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#102A43] group-hover:text-[#063B73] truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5 truncate">
                        <span>{prod.category}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#063B73]">{prod.origin}</span>
                      </div>
                      {prod.shortSpec && (
                        <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                          {prod.shortSpec}
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {prod.estimatedPrice || 'Request quotation'}
                        </span>
                        <span className="text-[11px] font-bold text-[#063B73] group-hover:underline flex items-center gap-0.5">
                          View Specs →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MATCHING SUPPLIERS */}
          {(activeFilterTab === 'all' || activeFilterTab === 'suppliers') && filteredSuppliers.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Global Suppliers ({filteredSuppliers.length})</span>
                </span>
                <span className="text-[11px] text-[#64748B]">Export capability verified</span>
              </div>

              <div className="space-y-2">
                {filteredSuppliers.slice(0, 4).map((sup) => (
                  <div
                    key={sup.id}
                    onClick={handleSelectSupplier}
                    className="p-3 rounded-xl border border-[#E5EAF0] hover:border-[#063B73] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="text-2xl shrink-0 p-1 bg-[#F8FAFC] rounded-lg border border-slate-200">
                        {sup.flag}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#102A43] group-hover:text-[#063B73] truncate">
                          {sup.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5 truncate">
                          <span>{sup.country}</span>
                          <span>·</span>
                          <span>MOQ: {sup.moq}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 truncate">
                          Products: {sup.products.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#0B8F73] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                      {sup.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MATCHING SOURCING OPPORTUNITIES */}
          {(activeFilterTab === 'all' || activeFilterTab === 'opportunities') && filteredRequests.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Sourcing Opportunities ({filteredRequests.length})</span>
                </span>
                <span className="text-[11px] text-[#64748B]">Active Ethiopian buyer inquiries</span>
              </div>

              <div className="space-y-2">
                {filteredRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    onClick={() => handleSelectOpportunity(req.id)}
                    className="p-3 rounded-xl border border-[#E5EAF0] hover:border-[#063B73] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#063B73]/10 text-[#063B73] shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#102A43] group-hover:text-[#063B73] truncate">
                          {req.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                          <span>{req.category}</span>
                          <span>·</span>
                          <span>{req.quantity} {req.unit}</span>
                          <span>·</span>
                          <span>Dest: {req.destinationCity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-[#0B8F73] block">
                        {req.status}
                      </span>
                      <span className="text-[10px] text-[#063B73] font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MATCHING CATEGORIES */}
          {(activeFilterTab === 'all' || activeFilterTab === 'categories') && filteredCategories.length > 0 && query && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Categories ({filteredCategories.length})</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCategory(c.name)}
                    className="p-3 rounded-xl border border-[#E5EAF0] hover:border-[#063B73] bg-white hover:bg-[#F8FAFC] text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#102A43] group-hover:text-[#063B73]">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] line-clamp-1">
                        {c.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#063B73] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ZERO RESULTS STATE */}
          {query && totalResults === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#64748B]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#102A43]">
                No exact match found for "{searchQuery}"
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Can't find the exact product or material? Post a custom sourcing request and ABAYLINK's brokerage desk will search our offline supplier network.
              </p>
              <button
                onClick={() => {
                  closeSearch();
                  openPostRequest('', searchQuery);
                }}
                className="mt-2 px-5 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post Sourcing Request for "{searchQuery}"</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E5EAF0] flex items-center justify-between text-xs text-[#64748B]">
          <span className="hidden sm:inline">Press ESC to dismiss</span>
          <button
            onClick={() => {
              closeSearch();
              openPostRequest('', searchQuery);
            }}
            className="text-[#063B73] font-bold hover:underline ml-auto flex items-center gap-1"
          >
            <span>Need something specific? Post a request</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
