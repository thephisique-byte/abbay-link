import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, FileText, CheckCircle2 } from 'lucide-react';

export const SupplierDesk: React.FC = () => {
  const { requests, currentUser, addQuotation, t } = useApp();
  const [selectedReqForQuote, setSelectedReqForQuote] = useState<string | null>(null);

  // Quote inputs
  const [unitPrice, setUnitPrice] = useState<number | string>(22.0);
  const [currency, setCurrency] = useState('USD');
  const [moq, setMoq] = useState('500 meters');
  const [leadTime, setLeadTime] = useState('21 days production + 25 days transit');
  const [incoterm, setIncoterm] = useState('CIF Djibouti Port');
  const [notes, setNotes] = useState('Standard export seaworthy packing included. Mill test certificates provided.');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const matchingRequests = requests.filter((r) => r.status !== 'Closed');

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;

    const req = requests.find((r) => r.id === selectedReqForQuote);
    if (!req) return;

    addQuotation({
      requestId: selectedReqForQuote,
      supplierId: currentUser.id,
      supplierName: currentUser.company || currentUser.name,
      supplierCountry: currentUser.country,
      product: req.title,
      unitPrice: Number(unitPrice),
      currency,
      moq,
      leadTime,
      incoterm,
      packaging: 'Standard export pallets / strapping',
      shippingEstimate: `${currency} 1,800 to Djibouti Port`,
      validUntil: '2026-11-30',
      notes,
    });

    setSubmittedSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            {t('supplierPartnerConsole')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {t('globalSupplierDesk')}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {t('supplierDeskSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-white border border-[#E5EAF0] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#102A43]">
            <Building2 className="w-4 h-4 text-[#063B73]" />
            <span>{currentUser.company} ({currentUser.country})</span>
          </div>
        </div>
      </div>

      {/* Grid of Matching Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
            {t('openSourcingInquiries')} ({matchingRequests.length})
          </h3>

          <div className="space-y-3">
            {matchingRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all bg-white ${
                  selectedReqForQuote === req.id
                    ? 'border-[#063B73] shadow-md ring-1 ring-[#063B73]'
                    : 'border-[#E5EAF0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-[#063B73]">{req.id}</span>
                  <span className="text-[11px] font-semibold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                    {req.category}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#102A43]">{req.title}</h4>
                <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2">{req.specifications}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('requiredQuantity')}</span>
                    <span className="font-bold font-mono">{req.quantity} {req.unit}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('destinationHub')}</span>
                    <span className="font-semibold">{req.destinationCity}, {t('ethiopia')}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">{t('preferredOrigin')}</span>
                    <span className="font-semibold">{req.preferredOrigin}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {t('facilitatedByAbaylink')}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReqForQuote(req.id);
                      setSubmittedSuccess(false);
                    }}
                    className="px-4 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    {t('submitQuotation')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quotation Submission Box */}
        <div className="lg:col-span-5">
          {selectedReqForQuote ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#063B73] pb-2 border-b border-[#E5EAF0]">
                {t('submitQuotationToIntermediary')}
              </h3>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#0B8F73] mx-auto" />
                  <h4 className="text-base font-bold text-[#102A43]">{t('quotationSubmitted')}</h4>
                  <p className="text-xs text-[#64748B]">
                    {t('quotationSubmittedDesc')}
                  </p>
                  <button
                    onClick={() => setSelectedReqForQuote(null)}
                    className="px-4 py-2 bg-[#063B73] text-white text-xs font-semibold rounded-xl"
                  >
                    {t('done')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-3 text-xs">
                  <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF0]">
                    <span className="text-[10px] text-[#64748B] block">{t('rfqReference')}</span>
                    <span className="font-bold text-[#102A43] font-mono">{selectedReqForQuote}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-[#102A43]">{t('unitPrice')}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#102A43]">{t('currency')}</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl font-medium"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-[#102A43]">{t('moq')}</label>
                      <input
                        type="text"
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#102A43]">{t('incoterm')}</label>
                      <select
                        value={incoterm}
                        onChange={(e) => setIncoterm(e.target.value)}
                        className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl font-medium"
                      >
                        <option value="CIF Djibouti Port">CIF Djibouti Port</option>
                        <option value="FOB Origin Port">FOB Origin Port</option>
                        <option value="CFR Djibouti">CFR Djibouti</option>
                        <option value="EXW Factory">EXW Factory</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#102A43]">{t('productionShippingLeadTime')}</label>
                    <input
                      type="text"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#102A43]">{t('packagingTechnicalNotes')}</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white font-semibold rounded-xl shadow-sm transition-colors"
                  >
                    {t('submitFormalQuoteToAbaylink')}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-[#F7F9FC] border border-[#E5EAF0] rounded-2xl p-8 text-center text-xs text-[#64748B] space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-[#102A43]">{t('selectRfqFromList')}</p>
              <p>{t('clickSubmitQuotation')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
