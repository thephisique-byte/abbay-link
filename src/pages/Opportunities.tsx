import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Search,
  Plus,
  X,
} from 'lucide-react';

export const Opportunities: React.FC = () => {
  const { requests, openPostRequest, openSupplierRegister, selectedRequestId, setSelectedRequestId, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOrigin, setSelectedOrigin] = useState('All');

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const categories = ['All', 'Water & Irrigation', 'Agriculture', 'Construction', 'Chemicals'];
  const origins = ['All', 'Australia', 'Turkey', 'China', 'India', 'UAE', 'Europe', 'No preference'];

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.specifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || req.category === selectedCategory;
    const matchesOrigin = selectedOrigin === 'All' || req.preferredOrigin === selectedOrigin;
    return matchesSearch && matchesCategory && matchesOrigin;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            {t('tradeDiscovery')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {t('sourcingOpportunities')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {t('opportunitiesSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openPostRequest()}
            className="px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('postSourcingRequest')}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF0] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('opportunitiesFilterPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#063B73]"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43] font-medium"
            >
              <option value="All">{t('allOrigins')}</option>
              {origins.filter((o) => o !== 'All').map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#063B73] text-white'
                  : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#102A43]'
              }`}
            >
              {cat === 'All' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-[#E5EAF0] p-5 hover:border-[#063B73] transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-[#063B73]">{req.category}</span>
                <span className="text-[11px] font-semibold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                  {req.status}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#102A43] leading-snug">
                {req.title}
              </h3>

              <p className="text-xs text-[#64748B] mt-2 line-clamp-3 leading-relaxed">
                {req.specifications}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-[#102A43]">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('buyerRequirement')}:</span>
                <span className="font-bold font-mono">{req.quantity} {req.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('destination')}:</span>
                <span className="font-semibold">{req.destinationCity}, {req.destinationCountry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('preferredOrigin')}:</span>
                <span className="font-semibold">{req.preferredOrigin}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedRequestId(req.id)}
                className="flex-1 py-2.5 bg-[#F7F9FC] hover:bg-[#063B73] hover:text-white text-[#102A43] text-xs font-semibold rounded-xl border border-[#E5EAF0] transition-colors text-center"
              >
                {t('viewOpportunity')}
              </button>
              <button
                onClick={() => openPostRequest(req.category, req.title)}
                className="py-2.5 px-3 bg-[#063B73]/10 hover:bg-[#063B73]/20 text-[#063B73] text-xs font-semibold rounded-xl transition-colors"
                title="Post similar requirement"
              >
                {t('postSimilar')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#102A43]">{t('noOpportunitiesFound')}</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            {t('noOpportunitiesSub')}
          </p>
          <button
            onClick={() => openPostRequest()}
            className="mt-2 px-5 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl"
          >
            {t('postSourcingRequest')}
          </button>
        </div>
      )}

      {/* Opportunity Detail Drawer / Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRequestId(null)} />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F7F9FC]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#063B73]">
                  {selectedRequest.id}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#102A43]">
                  {selectedRequest.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRequestId(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#102A43]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#102A43]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F9FC] p-3.5 rounded-xl border border-[#E5EAF0]">
                <div>
                  <span className="text-[#64748B] block text-[10px]">{t('category')}</span>
                  <span className="font-bold text-[#063B73]">{selectedRequest.category}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">{t('quantity')}</span>
                  <span className="font-bold font-mono">{selectedRequest.quantity} {selectedRequest.unit}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">{t('destination')}</span>
                  <span className="font-semibold">{selectedRequest.destinationCity}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">{t('status')}</span>
                  <span className="font-bold text-[#0B8F73]">{selectedRequest.status}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                  {t('technicalSpecs')}
                </h4>
                <p className="bg-[#F7F9FC] p-3 rounded-xl border border-[#E5EAF0] leading-relaxed text-slate-700">
                  {selectedRequest.specifications}
                </p>
              </div>

              {selectedRequest.additionalRequirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                    {t('additionalReqs')}
                  </h4>
                  <p className="bg-[#F7F9FC] p-3 rounded-xl border border-[#E5EAF0] leading-relaxed text-slate-700">
                    {selectedRequest.additionalRequirements}
                  </p>
                </div>
              )}

              {/* Intermediary Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-2">
                  {t('sourcingProgressTimeline')}
                </h4>
                <div className="space-y-2 border-l-2 border-[#063B73]/20 pl-3 ml-2">
                  {selectedRequest.activityTimeline.map((item) => (
                    <div key={item.id} className="relative space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#102A43]">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      {item.note && <p className="text-slate-600 text-[11px]">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <p className="text-[11px] text-[#063B73] leading-relaxed">
                  <strong>{t('intermediaryDeskNoticeTitle')}:</strong> {t('intermediaryDeskNoticeBody')}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#F7F9FC] border-t border-[#E5EAF0] flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setSelectedRequestId(null);
                  openPostRequest(selectedRequest.category, selectedRequest.title);
                }}
                className="flex-1 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl text-center"
              >
                {t('postSimilar')}
              </button>
              <button
                onClick={() => {
                  setSelectedRequestId(null);
                  openSupplierRegister();
                }}
                className="py-2.5 px-4 bg-white hover:bg-slate-100 text-[#102A43] border border-[#E5EAF0] text-xs font-semibold rounded-xl text-center"
              >
                {t('iAmASupplier')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
