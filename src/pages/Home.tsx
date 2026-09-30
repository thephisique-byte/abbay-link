import React from 'react';
import { useApp } from '../context/AppContext';
import { REFERENCE_PRODUCTS, CATEGORIES } from '../data/mockData';
import {
  Search,
  ArrowRight,
  Sprout,
  Droplets,
  HardHat,
  FlaskConical,
  Plus,
  Compass,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    openPostRequest,
    openSearch,
    setActiveTab,
    requests,
    setSelectedRequestId,
    setSelectedCategoryFilter,
    setSelectedOriginFilter,
    openProductDetail,
    t,
  } = useApp();

  const sampleSearches = [
    'HDPE pipe',
    'Irrigation pump',
    'Waterproofing membrane',
    'Agricultural sprayer',
    'Water treatment polymers',
  ];

  const supplierMarkets = [
    { name: 'Australia', flag: '🇦🇺', specialization: 'HDPE Pipes & Poly Systems', count: 1 },
    { name: 'China', flag: '🇨🇳', specialization: 'Agricultural Machinery & Sprayers', count: 1 },
    { name: 'Turkey', flag: '🇹🇷', specialization: 'Industrial Pumps, Valves & Adhesives', count: 1 },
    { name: 'India', flag: '🇮🇳', specialization: 'Fertilizers, Crop Chemicals & Polymers', count: 1 },
    { name: 'UAE', flag: '🇦🇪', specialization: 'Waterproofing, Sealants & Construction', count: 1 },
    { name: 'Europe', flag: '🇪🇺', specialization: 'Solar Irrigation & Precision Drip Systems', count: 1 },
    { name: 'Other', flag: '🌐', specialization: 'Global Sourcing & Trade Network', count: 0 },
  ];

  // Primary 4 categories with detailed subcategories
  const featuredCategories = [
    {
      id: 'cat-water-irrigation',
      name: 'Water & Irrigation',
      icon: <Droplets className="w-5 h-5 text-[#063B73]" />,
      desc: 'HDPE, UPVC, Drip lines, Industrial pumps & Valves',
      subcategories: ['HDPE Pipe', 'PVC Pipe', 'Drip Irrigation', 'Valves', 'Fittings', 'Filters'],
      itemCount: 42,
    },
    {
      id: 'cat-agriculture',
      name: 'Agriculture',
      icon: <Sprout className="w-5 h-5 text-[#0B8F73]" />,
      desc: 'Crop sprayers, farm tillage, center pivots & spreaders',
      subcategories: ['Sprayers', 'Irrigation', 'Pumps', 'Farm Equipment', 'Fertilizer Equipment'],
      itemCount: 38,
    },
    {
      id: 'cat-construction',
      name: 'Construction',
      icon: <HardHat className="w-5 h-5 text-[#0B5FA5]" />,
      desc: 'Waterproofing membranes, sealants, admixtures & grouts',
      subcategories: ['Waterproofing', 'Sealants', 'Admixtures', 'Repair Materials', 'Tile Adhesives', 'Coatings'],
      itemCount: 56,
    },
    {
      id: 'cat-chemicals',
      name: 'Chemicals',
      icon: <FlaskConical className="w-5 h-5 text-[#35A878]" />,
      desc: 'Water treatment polymers, soluble fertilizers & crop protectants',
      subcategories: ['Industrial Chemicals', 'Fertilizers', 'Agricultural Chemicals', 'Adjuvants'],
      itemCount: 29,
    },
  ];

  const handleCategoryClick = (catName: string, subCategory?: string) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('products');
  };

  const handleMarketClick = (marketName: string) => {
    setSelectedOriginFilter(marketName === 'Other' ? null : marketName);
    setActiveTab('suppliers');
  };

  const handleSourceProduct = (e: React.MouseEvent, prod: typeof REFERENCE_PRODUCTS[0]) => {
    e.stopPropagation();
    const specsString = Object.entries(prod.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    openPostRequest(prod.category, prod.name, specsString);
  };

  // 6 Featured Reference Products for the homepage grid
  const featuredProducts = REFERENCE_PRODUCTS.slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-12 max-w-7xl mx-auto">
      {/* 1. COMPACT MARKETPLACE SEARCH BANNER (No giant illustration, high utility) */}
      <section className="bg-gradient-to-r from-[#063B73] via-[#0B5FA5] to-[#063B73] rounded-2xl p-5 sm:p-7 text-white shadow-sm border border-[#063B73]">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35A878] animate-pulse" />
            <span>B2B Sourcing Brokerage for Ethiopia</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Where Ethiopian Buyers Discover Global Supply.
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            Source verified industrial materials, irrigation equipment, construction supplies, and agricultural inputs directly from vetted manufacturers worldwide.
          </p>

          {/* Interactive Marketplace Search Bar */}
          <div className="pt-1">
            <div
              onClick={openSearch}
              className="bg-white rounded-xl p-2 sm:p-2.5 flex items-center gap-3 cursor-pointer shadow-md hover:ring-2 hover:ring-white/80 transition-all text-[#102A43]"
            >
              <Search className="w-5 h-5 text-[#063B73] shrink-0 ml-1.5" />
              <span className="text-xs sm:text-sm text-[#64748B] flex-1 truncate select-none">
                Search products, materials, equipment or suppliers...
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openSearch();
                }}
                className="px-4 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-lg transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Filter Tags & CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-blue-200 font-medium shrink-0">Popular:</span>
              {sampleSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => openPostRequest('', term)}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>

            <button
              onClick={() => openPostRequest()}
              className="inline-flex items-center gap-1.5 font-bold text-xs text-white bg-[#0B8F73] hover:bg-[#1DA57A] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Sourcing Request</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SOURCING CATEGORIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
              Featured Sourcing Categories
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Explore specialized product specifications and vetted manufacturing origins
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setActiveTab('products');
            }}
            className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Browse all catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white rounded-xl border border-[#E5EAF0] p-4 hover:border-[#063B73] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] flex items-center justify-center group-hover:bg-[#063B73]/5 group-hover:border-[#063B73]/30 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.itemCount}+ specs
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#102A43] group-hover:text-[#063B73] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-snug line-clamp-2">
                  {cat.desc}
                </p>

                {/* Subcategory quick tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60"
                    >
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <span className="text-[10px] text-[#063B73] font-semibold px-1 py-0.5">
                      +{cat.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold text-[#063B73] group-hover:translate-x-0.5 transition-transform">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Amazon-Style Clean Marketplace Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
                Featured Products
              </h2>
              <span className="text-[11px] font-bold text-[#0B8F73] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified Specs
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Standard commercial specifications available for direct procurement matching
            </p>
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all ({REFERENCE_PRODUCTS.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-4 Column Clean Marketplace Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => openProductDetail(prod.id)}
              className="bg-white rounded-xl border border-[#E5EAF0] overflow-hidden hover:border-[#063B73] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-[#063B73] shadow-xs border border-slate-200/70">
                    Origin: {prod.origin}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#102A43]/85 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-medium">
                    {prod.category}
                  </div>

                  {prod.shortSpec && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded truncate">
                      {prod.shortSpec}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#102A43] group-hover:text-[#063B73] transition-colors line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Specification Pill & Origin Note */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Indication:</span>
                      <span className="font-semibold text-[#063B73]">
                        {prod.estimatedPrice || 'Request quotation'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Typical MOQ:</span>
                      <span className="font-mono text-slate-800 font-medium">{prod.typicalMOQ}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Supplier Desk:</span>
                      <span className="text-[#0B8F73] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#0B8F73]" />
                        {prod.supplierAvailability || 'Vetted Manufacturer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA: "Source This Product" */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={(e) => handleSourceProduct(e, prod)}
                  className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] active:scale-[0.99] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Source This Product</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUPPLIER MARKETS (Interactive Origin Country Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
              Supplier Markets
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Direct shipping connections to Djibouti Port & Mojo dry port customs terminals
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedOriginFilter(null);
              setActiveTab('suppliers');
            }}
            className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All global suppliers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {supplierMarkets.map((market) => (
            <button
              key={market.name}
              onClick={() => handleMarketClick(market.name)}
              className="bg-white rounded-xl border border-[#E5EAF0] p-3 text-left hover:border-[#063B73] hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-2xl block mb-1">{market.flag}</span>
                <span className="text-xs font-bold text-[#102A43] group-hover:text-[#063B73] transition-colors block">
                  {market.name}
                </span>
                <p className="text-[10px] text-[#64748B] mt-0.5 line-clamp-2 leading-tight">
                  {market.specialization}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#063B73] font-semibold">
                <span>Browse</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. RECENT SOURCING OPPORTUNITIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
              Recent Sourcing Opportunities
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Active commercial inquiries from Ethiopian enterprises and project contractors
            </p>
          </div>
          <button
            onClick={() => setActiveTab('opportunities')}
            className="text-xs font-semibold text-[#063B73] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all ({requests.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {requests.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-[#E5EAF0] p-4 hover:border-[#063B73] transition-all flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#063B73] bg-[#063B73]/5 px-2 py-0.5 rounded">
                    {req.category}
                  </span>
                  <span className="text-[11px] font-bold text-[#0B8F73] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {req.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#102A43] line-clamp-1">
                  {req.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {req.specifications}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-[#64748B]">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-semibold text-[#102A43]">
                    {req.quantity} {req.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-medium text-[#102A43]">{req.destinationCity}, {req.destinationCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Origin Preference:</span>
                  <span className="font-medium text-[#102A43]">{req.preferredOrigin}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequestId(req.id);
                    setActiveTab('opportunities');
                  }}
                  className="flex-1 py-2 bg-[#F8FAFC] hover:bg-[#063B73] hover:text-white text-[#102A43] text-xs font-semibold rounded-lg border border-[#E5EAF0] transition-colors text-center"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => openPostRequest(req.category, `Similar to: ${req.title}`)}
                  className="py-2 px-3 bg-[#063B73]/10 hover:bg-[#063B73]/20 text-[#063B73] text-xs font-semibold rounded-lg transition-colors"
                  title="Source similar item"
                >
                  Source Similar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW ABAYLINK WORKS (4 Compact Logical Steps) */}
      <section className="bg-white border border-[#E5EAF0] rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#063B73]">
            Trade Intermediary Model
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#102A43] mt-0.5">
            How ABAYLINK Sourcing Works
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Bridging Ethiopian buyers with verified global factories from specification to port clearance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#063B73] text-white text-xs font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="text-xs font-bold text-[#102A43]">Search & Discover</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Browse reference industrial materials, technical specifications, and international supplier profiles.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#0B5FA5] text-white text-xs font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="text-xs font-bold text-[#102A43]">Post Sourcing Request</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Tell us your required specs, volume, destination city, and target timeline in Ethiopia.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#0B8F73] text-white text-xs font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="text-xs font-bold text-[#102A43]">Broker Matches & Quotes</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              ABAYLINK identifies certified manufacturers and secures binding CIF Djibouti or FOB proforma quotations.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#35A878] text-white text-xs font-bold flex items-center justify-center">
              04
            </div>
            <h3 className="text-xs font-bold text-[#102A43]">Commercial Connection</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Review factory certifications, approve commercial terms, and finalize purchase contracts with full transparency.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => openPostRequest()}
            className="px-6 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Sourcing Request Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};
