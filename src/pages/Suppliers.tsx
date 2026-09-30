import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';
import {
  Search,
  Plus,
  X,
  Building2,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Phone,
  Mail,
  Filter,
  Check,
} from 'lucide-react';

export const Suppliers: React.FC = () => {
  const {
    suppliers,
    openSupplierRegister,
    openPostRequest,
    selectedOriginFilter,
    setSelectedOriginFilter,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeSupplierProfile, setActiveSupplierProfile] = useState<Supplier | null>(null);

  const countryTabs = ['All', 'Australia', 'China', 'Turkey', 'India', 'UAE', 'Europe'];
  const categoryTabs = ['All', 'Water & Irrigation', 'Agriculture', 'Construction', 'Chemicals'];
  const statusTabs = ['All', 'Verified', 'Under Review', 'Contacted', 'Supplier Information'];

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      // Country filter
      const currentCountry = selectedOriginFilter || 'All';
      const matchesCountry = currentCountry === 'All' || sup.country === currentCountry;

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || sup.categories.includes(selectedCategory);

      // Status filter
      const matchesStatus =
        selectedStatus === 'All' || sup.status === selectedStatus;

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sup.name.toLowerCase().includes(q) ||
        sup.country.toLowerCase().includes(q) ||
        sup.products.some((p) => p.toLowerCase().includes(q)) ||
        sup.categories.some((c) => c.toLowerCase().includes(q)) ||
        sup.description.toLowerCase().includes(q);

      return matchesCountry && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [suppliers, selectedOriginFilter, selectedCategory, selectedStatus, searchQuery]);

  const getStatusBadge = (status: Supplier['status']) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#0B8F73] border border-emerald-200">
            ✓ Verified Factory
          </span>
        );
      case 'Under Review':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Under Review
          </span>
        );
      case 'Contacted':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Contacted
          </span>
        );
      case 'Supplier Information':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Information Available
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            International Trade Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            Global Suppliers Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Vetted manufacturers with verifiable export experience to African destinations
          </p>
        </div>

        <button
          onClick={openSupplierRegister}
          className="px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register as Supplier</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] space-y-3.5 shadow-2xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search suppliers by company, country, product lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm text-[#102A43] focus:outline-none focus:ring-1 focus:ring-[#063B73]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Rows: Country & Category Tabs */}
        <div className="space-y-2">
          {/* Countries */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            <span className="text-[#64748B] font-semibold text-[11px] shrink-0 mr-1">Country:</span>
            {countryTabs.map((country) => {
              const isActive = (selectedOriginFilter || 'All') === country;
              return (
                <button
                  key={country}
                  onClick={() => setSelectedOriginFilter(country === 'All' ? null : country)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#063B73] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#102A43] hover:bg-slate-100'
                  }`}
                >
                  {country}
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
            <span className="text-[#64748B] font-semibold text-[11px] shrink-0 mr-1">Category:</span>
            {categoryTabs.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0B8F73] text-white shadow-2xs'
                      : 'bg-white border border-[#E5EAF0] text-[#64748B] hover:text-[#102A43]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>Showing <strong className="text-[#102A43]">{filteredSuppliers.length}</strong> verified global suppliers</span>
        {(selectedOriginFilter || selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedOriginFilter(null);
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
            className="text-[#063B73] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Suppliers Grid (3-4 columns) */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-xl border border-[#E5EAF0] p-5 hover:border-[#063B73] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Supplier Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-bold text-[#102A43] text-sm">
                    <span className="text-xl">{sup.flag}</span>
                    <span>{sup.country}</span>
                  </div>
                  {getStatusBadge(sup.status)}
                </div>

                <h3 className="text-base font-bold text-[#102A43] leading-snug">{sup.name}</h3>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {sup.categories.map((c) => (
                    <span key={c} className="text-[10px] font-semibold text-[#063B73] bg-[#063B73]/5 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] mt-2.5 line-clamp-3 leading-relaxed">
                  {sup.description}
                </p>
              </div>

              {/* Specs & Products List */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-[#102A43]">
                <div>
                  <span className="text-[#64748B] text-[11px]">Primary Products: </span>
                  <span className="font-semibold text-xs">{sup.products.slice(0, 3).join(', ')}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#64748B]">Typical MOQ:</span>
                  <span className="font-mono font-medium text-slate-800">{sup.moq}</span>
                </div>
                {sup.website && (
                  <div className="flex items-center gap-1 text-[11px] text-[#063B73] truncate">
                    <Globe className="w-3 h-3 text-[#063B73] shrink-0" />
                    <span className="truncate">{sup.website.replace('https://', '')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => setActiveSupplierProfile(sup)}
                  className="flex-1 py-2.5 bg-[#F8FAFC] hover:bg-[#063B73] hover:text-white text-[#102A43] text-xs font-semibold rounded-xl border border-[#E5EAF0] transition-colors text-center"
                >
                  View Profile
                </button>
                <button
                  onClick={() => openPostRequest(sup.categories[0], sup.products[0])}
                  className="py-2.5 px-3 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  title="Source with this supplier"
                >
                  Source with Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-12 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#102A43]">No suppliers match the current filter</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            ABAYLINK regularly onboards international suppliers. Post a sourcing inquiry and we will search our unlisted manufacturing partners.
          </p>
          <button
            onClick={() => {
              setSelectedOriginFilter(null);
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#063B73] text-white text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Supplier Profile Detail Drawer / Modal */}
      {activeSupplierProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveSupplierProfile(null)} />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeSupplierProfile.flag}</span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43]">
                    {activeSupplierProfile.name}
                  </h2>
                  <span className="text-xs text-[#64748B]">{activeSupplierProfile.country}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveSupplierProfile(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#102A43]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#102A43]">
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] text-center">
                <div>
                  <span className="text-[#64748B] block text-[10px]">Verification Status</span>
                  <span className="font-bold text-[#063B73]">{activeSupplierProfile.status}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Standard MOQ</span>
                  <span className="font-semibold text-slate-800">{activeSupplierProfile.moq}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Established</span>
                  <span className="font-semibold text-slate-800">{activeSupplierProfile.yearEstablished || 'N/A'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                  Company Overview
                </h4>
                <p className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E5EAF0] leading-relaxed text-slate-700">
                  {activeSupplierProfile.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                  Products Offered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplierProfile.products.map((prod) => (
                    <span
                      key={prod}
                      className="px-2.5 py-1 bg-white border border-[#E5EAF0] text-[#102A43] font-medium rounded-lg text-xs"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {activeSupplierProfile.certifications && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                    Certifications & Standards
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSupplierProfile.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#0B8F73] font-semibold rounded-lg text-xs"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#063B73]">ABAYLINK Trade Facilitation:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ABAYLINK conducts initial technical matching, proforma request facilitation, and shipping logistics coordination from factory to Djibouti Port and Mojo dry port customs terminals.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E5EAF0] flex gap-3">
              <button
                onClick={() => {
                  const sup = activeSupplierProfile;
                  setActiveSupplierProfile(null);
                  openPostRequest(sup.categories[0], sup.products[0]);
                }}
                className="flex-1 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl text-center shadow-xs"
              >
                Source with {activeSupplierProfile.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
