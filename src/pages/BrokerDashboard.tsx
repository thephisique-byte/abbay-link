import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestStatus } from '../types';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Plus,
  Building2,
  Shield,
  X,
} from 'lucide-react';

export const BrokerDashboard: React.FC = () => {
  const {
    requests,
    suppliers,
    quotations,
    connections,
    updateRequestStatus,
    addSupplierMatch,
    removeSupplierMatch,
    updateBrokerNotes,
    updateBrokerFee,
    addQuotation,
    t,
  } = useApp();

  const [selectedReqId, setSelectedReqId] = useState<string>(
    requests.length > 0 ? requests[0].id : ''
  );

  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [isFindSupplierOpen, setIsFindSupplierOpen] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

  // New Quote form
  const [quoteSupplierId, setQuoteSupplierId] = useState('');
  const [quoteProduct, setQuoteProduct] = useState('');
  const [quoteUnitPrice, setQuoteUnitPrice] = useState<number | string>(18.50);
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [quoteMoq, setQuoteMoq] = useState('500 meters');
  const [quoteLeadTime, setQuoteLeadTime] = useState('14 days production + 20 days sea freight');
  const [quoteIncoterm, setQuoteIncoterm] = useState('CIF Djibouti Port');
  const [quotePackaging, setQuotePackaging] = useState('Export strapped bundles with end seals');
  const [quoteShippingEstimate, setQuoteShippingEstimate] = useState('USD 2,200 to Djibouti');
  const [quoteValidUntil, setQuoteValidUntil] = useState('2026-11-30');
  const [quoteNotes, setQuoteNotes] = useState('Standard manufacturer warranty. Hydrostatic test certs included.');

  // Broker Fee edit
  const [feeType, setFeeType] = useState<'Percentage' | 'Fixed' | 'Negotiated'>('Percentage');
  const [feeValue, setFeeValue] = useState<number | string>(2.5);
  const [feeCurrency, setFeeCurrency] = useState('USD');
  const [brokerNotesText, setBrokerNotesText] = useState('');

  const currentRequest = requests.find((r) => r.id === selectedReqId);
  const currentQuotations = quotations.filter((q) => q.requestId === selectedReqId);
  const currentMatches = suppliers.filter((s) => currentRequest?.matchedSupplierIds.includes(s.id));

  // Status options
  const statusOptions: RequestStatus[] = [
    'Submitted',
    'Under Review',
    'Finding Suppliers',
    'Supplier Matched',
    'Quotation Requested',
    'Quotation Received',
    'Buyer Review',
    'Connected',
    'Completed',
    'Closed',
  ];

  const handleSaveFee = () => {
    if (!selectedReqId) return;
    updateBrokerFee(selectedReqId, {
      type: feeType,
      value: feeValue,
      currency: feeCurrency,
    });
  };

  const handleSaveNotes = () => {
    if (!selectedReqId) return;
    updateBrokerNotes(selectedReqId, brokerNotesText);
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId || !quoteSupplierId) return;

    const sup = suppliers.find((s) => s.id === quoteSupplierId);
    if (!sup) return;

    addQuotation({
      requestId: selectedReqId,
      supplierId: quoteSupplierId,
      supplierName: sup.name,
      supplierCountry: sup.country,
      product: quoteProduct || currentRequest?.title || 'Sourced Industrial Product',
      unitPrice: Number(quoteUnitPrice),
      currency: quoteCurrency,
      moq: quoteMoq,
      leadTime: quoteLeadTime,
      incoterm: quoteIncoterm,
      packaging: quotePackaging,
      shippingEstimate: quoteShippingEstimate,
      validUntil: quoteValidUntil,
      notes: quoteNotes,
    });

    setIsAddQuoteOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Broker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] bg-[#063B73]/10 px-2.5 py-0.5 rounded">
              {t('internalIntermediaryConsole')}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {t('staffOnly')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] mt-1">
            {t('brokerDeskTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            {t('brokerDeskSubtitle')}
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold uppercase tracking-wider text-[10px]">{t('openRequests')}</span>
            <FileText className="w-4 h-4 text-[#063B73]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#063B73] font-mono tabular-nums">
            {requests.length || 12}
          </div>
          <p className="text-[11px] text-slate-500">{t('activeFiles')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold uppercase tracking-wider text-[10px]">{t('supplierMatches')}</span>
            <Building2 className="w-4 h-4 text-[#0B8F73]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B8F73] font-mono tabular-nums">
            {suppliers.length * 4 || 24}
          </div>
          <p className="text-[11px] text-slate-500">{t('targetedManufacturerMatches')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold uppercase tracking-wider text-[10px]">{t('quotationsCount')}</span>
            <DollarSign className="w-4 h-4 text-[#063B73]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#063B73] font-mono tabular-nums">
            {quotations.length || 8}
          </div>
          <p className="text-[11px] text-slate-500">{t('formalProformasOnRecord')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold uppercase tracking-wider text-[10px]">{t('activeDeals')}</span>
            <TrendingUp className="w-4 h-4 text-[#35A878]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#35A878] font-mono tabular-nums">
            {connections.length || 5}
          </div>
          <p className="text-[11px] text-slate-500">{t('facilitatedTradeDiscussions')}</p>
        </div>
      </div>

      {/* Main Split Layout: Requests on Left, Operations Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Request Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              {t('inquiryQueue')} ({requests.length})
            </h3>
            <span className="text-[11px] text-slate-400">{t('selectToManage')}</span>
          </div>

          <div className="space-y-2.5">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedReqId(req.id);
                  setBrokerNotesText(req.brokerNotes || '');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedReqId === req.id
                    ? 'bg-white border-[#063B73] shadow-md ring-1 ring-[#063B73]'
                    : 'bg-white border-[#E5EAF0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-[#063B73]">{req.id}</span>
                  <span className="text-[10px] font-bold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                    {req.status}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#102A43] line-clamp-1">{req.title}</h4>
                <div className="text-[11px] text-slate-500 mt-1">
                  {t('buyer')}: <span className="font-semibold text-slate-700">{req.buyerCompany}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span>{req.quantity} {req.unit}</span>
                  <span>{t('origin')}: {req.preferredOrigin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Request Brokerage Operations */}
        {currentRequest ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Header & Status Controller */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#063B73] bg-[#063B73]/10 px-2.5 py-0.5 rounded">
                      {currentRequest.id}
                    </span>
                    <span className="text-xs text-[#64748B]">{currentRequest.category}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#102A43] mt-1">
                    {currentRequest.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B] font-medium">{t('updateStatus')}:</span>
                  <select
                    value={currentRequest.status}
                    onChange={(e) => updateRequestStatus(currentRequest.id, e.target.value as RequestStatus)}
                    className="px-3 py-1.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs font-bold text-[#063B73]"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buyer Dossier */}
              <div className="bg-[#F7F9FC] p-4 rounded-2xl border border-[#E5EAF0] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                  {t('buyerProfileRequirements')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('buyerName')}</span>
                    <span className="font-bold text-[#102A43]">{currentRequest.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('company')}</span>
                    <span className="font-semibold text-[#102A43]">{currentRequest.buyerCompany}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('contact')}</span>
                    <span className="font-semibold text-[#102A43]">{currentRequest.buyerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('volumeRequired')}</span>
                    <span className="font-bold font-mono text-[#063B73]">{currentRequest.quantity} {currentRequest.unit}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('destinationPortHub')}</span>
                    <span className="font-semibold text-[#102A43]">{currentRequest.destinationCity}, {t('ethiopia')}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('preferredOrigin')}</span>
                    <span className="font-semibold text-[#102A43]">{currentRequest.preferredOrigin}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    {t('technicalSpecs')}:
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">{currentRequest.specifications}</p>
                </div>
              </div>

              {/* SUPPLIER MATCHING SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                      {t('matchedPotentialSuppliers')} ({currentMatches.length})
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      {t('candidateManufacturersQueried')}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsFindSupplierOpen(true)}
                    className="px-3 py-1.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('findAddSupplierMatch')}</span>
                  </button>
                </div>

                {currentMatches.length === 0 ? (
                  <div className="p-4 bg-[#F7F9FC] border border-dashed border-[#E5EAF0] rounded-xl text-center text-xs text-slate-500">
                    {t('noSuppliersMatchedYet')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentMatches.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-3 bg-white rounded-xl border border-[#E5EAF0] flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#102A43]">
                            <span>{sup.flag}</span>
                            <span>{sup.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {sup.country} · {t('moq')}: {sup.moq}
                          </div>
                        </div>
                        <button
                          onClick={() => removeSupplierMatch(currentRequest.id, sup.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Remove match"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* QUOTATION MANAGEMENT SECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                      {t('recordedSupplierQuotations')} ({currentQuotations.length})
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      {t('formalProformaComparison')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (currentMatches.length > 0) {
                        setQuoteSupplierId(currentMatches[0].id);
                      } else if (suppliers.length > 0) {
                        setQuoteSupplierId(suppliers[0].id);
                      }
                      setIsAddQuoteOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#0B8F73] hover:bg-[#35A878] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('recordSupplierQuotation')}</span>
                  </button>
                </div>

                {currentQuotations.length === 0 ? (
                  <div className="p-4 bg-[#F7F9FC] border border-dashed border-[#E5EAF0] rounded-xl text-center text-xs text-slate-500">
                    {t('noQuotationsRecordedYet')}
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#E5EAF0] rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F7F9FC] text-[#64748B] font-bold text-[10px] uppercase border-b border-[#E5EAF0]">
                        <tr>
                          <th className="p-3">{t('supplier')}</th>
                          <th className="p-3">{t('country')}</th>
                          <th className="p-3">{t('unitPrice')}</th>
                          <th className="p-3">{t('moq')}</th>
                          <th className="p-3">{t('leadTime')}</th>
                          <th className="p-3">{t('incoterm')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentQuotations.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-[#102A43]">{q.supplierName}</td>
                            <td className="p-3 text-slate-600">{q.supplierCountry}</td>
                            <td className="p-3 font-mono font-bold text-[#063B73]">
                              {q.currency} {q.unitPrice.toFixed(2)}
                            </td>
                            <td className="p-3 text-slate-600">{q.moq}</td>
                            <td className="p-3 text-slate-600">{q.leadTime}</td>
                            <td className="p-3 font-semibold text-[#0B8F73]">{q.incoterm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* BROKERAGE BUSINESS MODEL & FEE CONFIGURATION */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#063B73]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                      {t('intermediaryFeeInternal')}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {t('notVisibleToBuyer')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t('feeModel')}</label>
                    <select
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount</option>
                      <option value="Negotiated">Negotiated Transaction Fee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t('feeValue')}</label>
                    <input
                      type="text"
                      value={feeValue}
                      onChange={(e) => setFeeValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{t('feeCurrency')}</label>
                    <select
                      value={feeCurrency}
                      onChange={(e) => setFeeCurrency(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="ETB">ETB (Birr)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSaveFee}
                      className="w-full py-1.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white rounded-lg text-xs font-semibold"
                    >
                      {t('updateFee')}
                    </button>
                  </div>
                </div>
              </div>

              {/* INTERNAL BROKER NOTES */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                  {t('internalDeskNotes')}
                </h4>
                <textarea
                  rows={3}
                  value={brokerNotesText}
                  onChange={(e) => setBrokerNotesText(e.target.value)}
                  placeholder="Record supplier negotiation terms, Djibouti transit notes, or commercial payment remarks..."
                  className="w-full p-3 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-slate-800 focus:bg-white"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-[#102A43] text-xs font-semibold rounded-lg"
                >
                  {t('saveNotes')}
                </button>
              </div>

              {/* SOURCING ACTIVITY TIMELINE */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                  {t('sourcingProgressTimeline')}
                </h4>
                <div className="space-y-2 border-l-2 border-[#063B73]/20 pl-3 ml-2 text-xs">
                  {currentRequest.activityTimeline.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#102A43]">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      {item.note && <p className="text-slate-600 text-[11px]">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 bg-white rounded-3xl border border-[#E5EAF0] text-center text-slate-500">
            {t('selectRequestQueue')}
          </div>
        )}
      </div>

      {/* Find Supplier Matching Modal */}
      {isFindSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFindSupplierOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 z-10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#102A43]">{t('searchSupplierDatabase')}</h3>
              <button onClick={() => setIsFindSupplierOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder={t('suppliersSearchPlaceholder')}
              value={supplierSearchTerm}
              onChange={(e) => setSupplierSearchTerm(e.target.value)}
              className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs"
            />

            <div className="flex-1 overflow-y-auto space-y-2">
              {suppliers
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
                    s.country.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
                    s.products.some((p) => p.toLowerCase().includes(supplierSearchTerm.toLowerCase()))
                )
                .map((sup) => (
                  <div
                    key={sup.id}
                    className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF0] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#102A43] flex items-center gap-1.5">
                        <span>{sup.flag}</span>
                        <span>{sup.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sup.country} · {sup.products.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedReqId) {
                          addSupplierMatch(selectedReqId, sup.id);
                          setIsFindSupplierOpen(false);
                        }
                      }}
                      className="px-3 py-1 bg-[#063B73] hover:bg-[#0B5FA5] text-white font-semibold rounded-lg shrink-0"
                    >
                      {t('addMatch')}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Quotation Modal */}
      {isAddQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsAddQuoteOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#102A43]">{t('recordSupplierQuotation')}</h3>
              <button onClick={() => setIsAddQuoteOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t('selectMatchedSupplier')}</label>
                <select
                  value={quoteSupplierId}
                  onChange={(e) => setQuoteSupplierId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                  required
                >
                  <option value="">-- {t('chooseSupplier')} --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.flag} {s.name} ({s.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{t('productQuoted')}</label>
                <input
                  type="text"
                  value={quoteProduct}
                  onChange={(e) => setQuoteProduct(e.target.value)}
                  placeholder="e.g. HDPE Pipe PE100 PN16 OD200mm"
                  className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">{t('unitPrice')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={quoteUnitPrice}
                    onChange={(e) => setQuoteUnitPrice(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t('currency')}</label>
                  <select
                    value={quoteCurrency}
                    onChange={(e) => setQuoteCurrency(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ETB">ETB (Birr)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">{t('moq')}</label>
                  <input
                    type="text"
                    value={quoteMoq}
                    onChange={(e) => setQuoteMoq(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t('incoterm')}</label>
                  <input
                    type="text"
                    value={quoteIncoterm}
                    onChange={(e) => setQuoteIncoterm(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">{t('leadTime')}</label>
                <input
                  type="text"
                  value={quoteLeadTime}
                  onChange={(e) => setQuoteLeadTime(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{t('shippingEstimate')}</label>
                <input
                  type="text"
                  value={quoteShippingEstimate}
                  onChange={(e) => setQuoteShippingEstimate(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{t('supplierNotes')}</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white font-semibold rounded-xl"
                >
                  {t('saveFormalQuotation')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
