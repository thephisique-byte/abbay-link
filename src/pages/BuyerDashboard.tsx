import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quotation } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  Plus,
  Eye,
  X,
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const {
    requests,
    quotations,
    connections,
    requestConnection,
    messages,
    sendMessage,
    currentUser,
    openPostRequest,
    selectedRequestId,
    t,
  } = useApp();

  const userRequests = requests.filter(
    (r) => r.buyerId === currentUser.id || r.buyerEmail === currentUser.email || true // For demo, show requests
  );

  const [activeReqId, setActiveReqId] = useState<string>(
    selectedRequestId || (userRequests.length > 0 ? userRequests[0].id : '')
  );

  const [viewingQuote, setViewingQuote] = useState<Quotation | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [connectionSuccessModal, setConnectionSuccessModal] = useState<string | null>(null);

  const activeRequest = requests.find((r) => r.id === activeReqId);
  const activeQuotations = quotations.filter((q) => q.requestId === activeReqId);
  const activeMessages = messages.filter((m) => m.requestId === activeReqId);
  const activeConnection = connections.find((c) => c.requestId === activeReqId);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeReqId) return;
    sendMessage(activeReqId, chatMessage);
    setChatMessage('');
  };

  const handleRequestIntro = (supplierId: string, supplierName: string) => {
    if (!activeReqId) return;
    requestConnection(
      activeReqId,
      supplierId,
      `Buyer requested introduction with ${supplierName} for quotation terms.`
    );
    setConnectionSuccessModal(supplierName);
  };

  const statusList = [
    'Submitted',
    'Under Review',
    'Finding Suppliers',
    'Supplier Matched',
    'Quotation Requested',
    'Quotation Received',
    'Buyer Review',
    'Connected',
    'Completed',
  ];

  const getStatusIndex = (st: string) => {
    const idx = statusList.indexOf(st);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            {t('buyerWorkspace')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {t('mySourcingRequests')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {t('buyerDashboardSubtitle')}
          </p>
        </div>

        <button
          onClick={() => openPostRequest()}
          className="px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newSourcingRequest')}</span>
        </button>
      </div>

      {userRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5EAF0] p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#102A43]">{t('noSourcingRequests')}</h3>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
            {t('noSourcingRequestsSubtitle')}
          </p>
          <button
            onClick={() => openPostRequest()}
            className="px-6 py-2.5 bg-[#063B73] text-white text-xs font-semibold rounded-xl"
          >
            {t('postFirstRequest')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Requests List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-1">
              {t('activeSourcingFiles')} ({userRequests.length})
            </h3>

            <div className="space-y-2.5">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setActiveReqId(req.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    activeReqId === req.id
                      ? 'bg-white border-[#063B73] shadow-md ring-1 ring-[#063B73]'
                      : 'bg-white border-[#E5EAF0] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold text-[#063B73]">{req.id}</span>
                    <span className="text-[10px] font-semibold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#102A43] line-clamp-1">{req.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-2">
                    <span>{req.quantity} {req.unit}</span>
                    <span>Dest: {req.destinationCity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Request Details & Supplier Options */}
          {activeRequest ? (
            <div className="lg:col-span-8 space-y-6">
              {/* Main Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAF0]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#063B73] bg-[#063B73]/10 px-2.5 py-0.5 rounded">
                        {activeRequest.id}
                      </span>
                      <span className="text-xs text-[#64748B]">{activeRequest.category}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#102A43] mt-1">
                      {activeRequest.title}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#64748B] block">{t('status')}</span>
                    <span className="text-xs sm:text-sm font-bold text-[#0B8F73] bg-emerald-50 px-3 py-1 rounded-lg">
                      {activeRequest.status}
                    </span>
                  </div>
                </div>

                {/* Linear Status Tracker */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-2">
                    <span>{t('sourcingLifecycle')}</span>
                    <span className="text-[#063B73] font-semibold">{activeRequest.status}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#063B73] to-[#0B8F73] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          15,
                          ((getStatusIndex(activeRequest.status) + 1) / statusList.length) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Specs Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F9FC] p-4 rounded-xl border border-[#E5EAF0] text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('quantity')}</span>
                    <span className="font-bold font-mono">{activeRequest.quantity} {activeRequest.unit}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('destination')}</span>
                    <span className="font-semibold">{activeRequest.destinationCity}, {t('ethiopia')}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('preferredOrigin')}</span>
                    <span className="font-semibold">{activeRequest.preferredOrigin}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('budget')}</span>
                    <span className="font-semibold">
                      {activeRequest.budget ? `${activeRequest.currency} ${activeRequest.budget}` : t('negotiable')}
                    </span>
                  </div>
                </div>

                {/* Technical Specs */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-1.5">
                    {t('technicalSpecs')}
                  </h4>
                  <p className="bg-[#F7F9FC] p-3 rounded-xl border border-[#E5EAF0] text-xs text-slate-700 leading-relaxed">
                    {activeRequest.specifications}
                  </p>
                </div>

                {/* SUPPLIER OPTIONS SECTION (The core value delivery) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#063B73]">
                        {t('supplierOptions')}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {t('factualQuotationTerms')}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeQuotations.length} {t('optionsAvailable')}
                    </span>
                  </div>

                  {activeQuotations.length === 0 ? (
                    <div className="p-6 bg-[#F7F9FC] border border-dashed border-[#E5EAF0] rounded-2xl text-center space-y-2">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-[#102A43]">
                        {t('noSupplierQuotationsYet')}
                      </p>
                      <p className="text-[11px] text-[#64748B] max-w-sm mx-auto">
                        {t('noQuotationsSub')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeQuotations.map((quote, idx) => (
                        <div
                          key={quote.id}
                          className="bg-white border-2 border-[#E5EAF0] hover:border-[#063B73] rounded-2xl p-4.5 space-y-3.5 shadow-xs transition-all"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B73] bg-blue-50 px-2 py-0.5 rounded">
                              {t('option')} {idx + 1}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                              {quote.supplierCountry}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">{t('supplier')}</span>
                            <h4 className="text-sm font-bold text-[#102A43]">{quote.supplierName}</h4>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">{t('quotedPrice')}:</span>
                              <span className="font-bold text-[#063B73] font-mono text-sm">
                                {quote.currency} {quote.unitPrice.toFixed(2)} / unit
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">{t('moq')}:</span>
                              <span className="font-medium">{quote.moq}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">{t('leadTime')}:</span>
                              <span className="font-medium text-right max-w-[160px] truncate">{quote.leadTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">{t('incoterm')}:</span>
                              <span className="font-semibold text-[#0B8F73]">{quote.incoterm}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => setViewingQuote(quote)}
                              className="py-2 px-3 bg-[#F7F9FC] hover:bg-slate-100 text-[#102A43] text-xs font-semibold rounded-xl border border-[#E5EAF0] transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{t('viewQuote')}</span>
                            </button>
                            <button
                              onClick={() => handleRequestIntro(quote.supplierId, quote.supplierName)}
                              className="flex-1 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl transition-colors text-center"
                            >
                              {t('requestIntroduction')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connection Status Notice */}
                {activeConnection && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-[#0B8F73] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-[#0B8F73]">
                        {t('introFacilitated')}: {activeConnection.supplierName}
                      </h4>
                      <p className="mt-0.5 text-emerald-800 leading-relaxed">
                        {t('introFacilitatedBody')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Intermediary Chat Box: Buyer ↔ ABAYLINK */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#063B73]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                      {t('abaylinkIntermediaryMessages')}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">{t('file')}: {activeRequest.id}</span>
                </div>

                {/* Chat History */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {activeMessages.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      {t('noMessagesYet')}
                    </p>
                  ) : (
                    activeMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-xs max-w-lg ${
                          msg.senderRole === 'broker'
                            ? 'bg-[#F7F9FC] border border-[#E5EAF0] text-[#102A43] mr-auto'
                            : 'bg-[#063B73] text-white ml-auto'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-75 mb-1">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Send Input */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('chatPlaceholder')}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#063B73]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('send')}</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 p-12 bg-white rounded-3xl border border-[#E5EAF0] text-center text-slate-500">
              {t('selectRequestSidebar')}
            </div>
          )}
        </div>
      )}

      {/* View Full Quote Modal */}
      {viewingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingQuote(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-[#063B73] uppercase tracking-wider">{t('formalSupplierQuotation')}</span>
                <h3 className="text-base font-bold text-[#102A43]">{viewingQuote.supplierName}</h3>
              </div>
              <button
                onClick={() => setViewingQuote(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#102A43]">
              <div className="p-3 bg-[#F7F9FC] rounded-xl space-y-1.5 border border-[#E5EAF0]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('productQuoted')}:</span>
                  <span className="font-semibold text-right max-w-[240px] truncate">{viewingQuote.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('unitPrice')}:</span>
                  <span className="font-bold text-[#063B73] font-mono text-sm">{viewingQuote.currency} {viewingQuote.unitPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('moq')}:</span>
                  <span className="font-medium">{viewingQuote.moq}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('incoterm')}:</span>
                  <span className="font-bold text-[#0B8F73]">{viewingQuote.incoterm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('leadTime')}:</span>
                  <span className="font-medium text-right max-w-[240px]">{viewingQuote.leadTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('shippingEstimate')}:</span>
                  <span className="font-medium text-right max-w-[240px]">{viewingQuote.shippingEstimate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('validUntil')}:</span>
                  <span className="font-medium text-amber-700">{viewingQuote.validUntil}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#063B73] block mb-1">{t('supplierNotes')}:</span>
                <p className="bg-[#F7F9FC] p-3 rounded-xl border border-[#E5EAF0] text-slate-700 leading-relaxed">
                  {viewingQuote.notes}
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  handleRequestIntro(viewingQuote.supplierId, viewingQuote.supplierName);
                  setViewingQuote(null);
                }}
                className="flex-1 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl"
              >
                {t('requestIntroduction')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Success Toast/Modal */}
      {connectionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setConnectionSuccessModal(null)} />
          <div className="relative bg-white rounded-2xl max-w-sm p-6 text-center space-y-3 z-10">
            <CheckCircle2 className="w-12 h-12 text-[#0B8F73] mx-auto" />
            <h3 className="text-base font-bold text-[#102A43]">{t('introRequested')}</h3>
            <p className="text-xs text-[#64748B]">
              {t('introRequestedBody')} {connectionSuccessModal}.
            </p>
            <button
              onClick={() => setConnectionSuccessModal(null)}
              className="w-full py-2 bg-[#063B73] text-white text-xs font-semibold rounded-xl"
            >
              {t('continue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
