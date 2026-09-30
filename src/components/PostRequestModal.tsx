import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { CATEGORIES } from '../data/mockData';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Globe,
  FileCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  WifiOff,
} from 'lucide-react';

export const PostRequestModal: React.FC = () => {
  const {
    isPostRequestOpen,
    closePostRequest,
    prefilledCategory,
    prefilledProduct,
    prefilledSpecs,
    addRequest,
    currentUser,
    setActiveTab,
    setSelectedRequestId,
    t,
    language,
  } = useApp();

  const [step, setStep] = useState(1);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);
  const isOnline = useOnlineStatus();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water & Irrigation');
  const [quantity, setQuantity] = useState<number | string>(500);
  const [unit, setUnit] = useState('meters');
  const [specifications, setSpecifications] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('Ethiopia');
  const [destinationCity, setDestinationCity] = useState('Addis Ababa');
  const [customDestination, setCustomDestination] = useState('');
  const [preferredOrigin, setPreferredOrigin] = useState('No preference');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [buyerName, setBuyerName] = useState(currentUser.name || '');
  const [buyerCompany, setBuyerCompany] = useState(currentUser.company || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone || '+251 91 ');
  const [buyerEmail, setBuyerEmail] = useState(currentUser.email || '');

  useEffect(() => {
    if (isPostRequestOpen) {
      if (prefilledProduct) {
        setTitle(prefilledProduct);
      }
      if (prefilledCategory) {
        setCategory(prefilledCategory);
      }
      if (prefilledSpecs) {
        setSpecifications(prefilledSpecs);
      }
    } else {
      // Reset after closing
      setStep(1);
      setSubmittedRequest(null);
    }
  }, [isPostRequestOpen, prefilledProduct, prefilledCategory, prefilledSpecs]);

  if (!isPostRequestOpen) return null;

  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    const finalCity = destinationCity === 'Other destination' ? customDestination : destinationCity;

    const newReq = addRequest({
      buyerId: currentUser.id || 'user-buyer-guest',
      buyerName: buyerName || (language === 'am' ? 'የኢትዮጵያ የንግድ ተቋም' : 'Ethiopian Procurement Professional'),
      buyerCompany: buyerCompany || (language === 'am' ? 'የግል ድርጅት' : 'Private Enterprise'),
      buyerPhone: buyerPhone || '+251 91 000 0000',
      buyerEmail: buyerEmail || 'procurement@ethiopia.et',
      title: title || (language === 'am' ? 'የተለየ የአቅርቦት ፍላጎት' : 'Custom Sourcing Requirement'),
      category: category,
      quantity: Number(quantity) || 1,
      unit: unit,
      specifications: specifications || 'Standard commercial specifications matching local Ethiopian requirements.',
      destinationCountry: destinationCountry,
      destinationCity: finalCity || 'Addis Ababa',
      preferredOrigin: preferredOrigin,
      budget: budget,
      currency: currency,
      additionalRequirements: additionalRequirements,
    });

    setSubmittedRequest(newReq);
  };

  const originOptions = [
    'No preference',
    'Australia',
    'China',
    'Turkey',
    'India',
    'UAE',
    'Europe',
    'Other',
  ];

  const cityOptions = [
    'Addis Ababa',
    'Hawassa',
    'Dire Dawa',
    'Bahir Dar',
    'Adama / Nazret',
    'Mekelle',
    'Mojo Dry Port',
    'Other destination',
  ];

  const unitOptions = [
    'meters',
    'units',
    'metric tons',
    'm²',
    'rolls',
    'pieces',
    'liters',
    'drums',
    'cartons',
    'sets',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (submittedRequest) {
            closePostRequest();
          } else if (confirm(language === 'am' ? 'የተጀመረውን ፎርም መዝጋት ይፈልጋሉ?' : 'Discard sourcing request progress?')) {
            closePostRequest();
          }
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F7F9FC]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#063B73]">
              {t('form_badge')}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#102A43]">
              {t('form_title')}
            </h2>
          </div>
          <button
            onClick={closePostRequest}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#102A43] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar (Only before submission) */}
        {!submittedRequest && (
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-[#063B73] h-1 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Offline Notice */}
        {!isOnline && (
          <div className="px-6 py-2 bg-amber-500 text-white text-xs font-medium flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>You are currently offline. Submission requires internet connectivity.</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {submittedRequest ? (
            /* Confirmation Screen */
            <div className="py-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0B8F73] flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#102A43]">{t('confirm_title')}</h3>
                <p className="text-sm text-[#64748B] mt-1">
                  {t('confirm_sub')}
                </p>
              </div>

              {/* Request Summary Receipt */}
              <div className="bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl p-4 text-left space-y-2.5 text-xs text-[#102A43]">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-[#64748B]">{t('confirm_id')}</span>
                  <span className="font-mono font-bold text-[#063B73]">{submittedRequest.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">{t('confirm_product')}</span>
                  <span className="font-semibold text-right max-w-[200px] truncate">{submittedRequest.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">{t('confirm_qty')}</span>
                  <span className="font-semibold">{submittedRequest.quantity} {submittedRequest.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">{t('confirm_dest')}</span>
                  <span className="font-semibold">{submittedRequest.destinationCity}, {submittedRequest.destinationCountry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">{t('confirm_origin')}</span>
                  <span className="font-semibold">{submittedRequest.preferredOrigin}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-[#64748B]">{t('confirm_status')}</span>
                  <span className="font-bold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                    {submittedRequest.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-left">
                <p className="text-xs text-[#063B73] font-medium leading-relaxed">
                  {t('confirm_note')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    closePostRequest();
                    setSelectedRequestId(submittedRequest.id);
                    setActiveTab('requests');
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {t('confirm_view_my_requests')}
                </button>
                <button
                  onClick={closePostRequest}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  {t('confirm_done')}
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-4">
                <span>{t('step')} {step} {t('of')} {totalSteps}</span>
                <span className="font-semibold text-[#063B73]">
                  {step === 1 && t('step1_title')}
                  {step === 2 && t('step2_title')}
                  {step === 3 && t('step3_title')}
                  {step === 4 && t('step4_title')}
                  {step === 5 && t('step5_title')}
                  {step === 6 && t('step6_title')}
                  {step === 7 && t('step7_title')}
                  {step === 8 && t('step8_title')}
                </span>
              </div>

              {/* STEP 1: What do you need? */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step1_title')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t('step1_placeholder')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-2">
                      {t('step1_select_category')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.name)}
                          className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                            category === cat.name
                              ? 'border-[#063B73] bg-[#063B73]/5 text-[#063B73] ring-1 ring-[#063B73]'
                              : 'border-[#E5EAF0] bg-white text-[#102A43] hover:bg-[#F7F9FC]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: How much do you need? */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step2_title')} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-3">
                      {t('step2_desc')}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          {t('step2_quantity')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="500"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          {t('step2_unit')}
                        </label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        >
                          {unitOptions.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Tell us the specification */}
              {step === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step3_title')} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-2">
                      {t('step3_desc')}
                    </p>
                    <textarea
                      rows={4}
                      placeholder={t('step3_placeholder')}
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                      className="w-full p-3.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Where do you need it? */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step4_title')}
                    </label>
                    <p className="text-xs text-[#64748B] mb-3">
                      {t('step4_desc')}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          {t('step4_country')}
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Ethiopia"
                          className="w-full px-3.5 py-2.5 bg-slate-100 border border-[#E5EAF0] rounded-xl text-sm text-slate-700 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          {t('step4_city')}
                        </label>
                        <select
                          value={destinationCity}
                          onChange={(e) => setDestinationCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        >
                          {cityOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {destinationCity === 'Other destination' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                            {t('step4_other')}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jimma, Semera, Bahir Dar Industrial Park"
                            value={customDestination}
                            onChange={(e) => setCustomDestination(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Preferred sourcing country */}
              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step5_title')}
                    </label>
                    <p className="text-xs text-[#64748B] mb-3">
                      {t('step5_desc')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {originOptions.map((orig) => (
                        <button
                          key={orig}
                          type="button"
                          onClick={() => setPreferredOrigin(orig)}
                          className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                            preferredOrigin === orig
                              ? 'border-[#063B73] bg-[#063B73]/5 text-[#063B73] ring-1 ring-[#063B73]'
                              : 'border-[#E5EAF0] bg-white text-[#102A43] hover:bg-[#F7F9FC]'
                          }`}
                        >
                          {orig}
                        </button>
                      ))}
                    </div>

                    {preferredOrigin === 'No preference' && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                        <Globe className="w-4 h-4 text-[#0B8F73] shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600">
                          <strong>{t('step5_no_pref_notice')}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Target budget */}
              {step === 6 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step6_title')} <span className="text-xs font-normal text-[#64748B]">{t('step6_optional')}</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-3">
                      {t('step6_desc')}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder={t('step6_placeholder')}
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        />
                      </div>
                      <div>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="ETB">ETB (Birr)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="AUD">AUD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Additional requirements */}
              {step === 7 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step7_title')} <span className="text-xs font-normal text-[#64748B]">{t('step6_optional')}</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-2">
                      {t('step7_desc')}
                    </p>
                    <textarea
                      rows={4}
                      placeholder={t('step7_placeholder')}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      className="w-full p-3.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Contact information */}
              {step === 8 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-[#102A43] mb-1">
                      {t('step8_title')} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-3">
                      {t('step8_desc')}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">
                        {t('step8_name')}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alemayehu Tadesse"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">
                        {t('step8_company')}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Awash Valley Agro Development PLC"
                        value={buyerCompany}
                        onChange={(e) => setBuyerCompany(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">
                          {t('step8_phone')}
                        </label>
                        <input
                          type="tel"
                          placeholder="+251 91 123 4567"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">
                          {t('step8_email')}
                        </label>
                        <input
                          type="email"
                          placeholder="procurement@company.et"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#063B73] focus:bg-white text-[#102A43]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#102A43] hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('btn_back')}</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 1 && !title.trim()}
                  className="px-5 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>{step === totalSteps ? t('btn_submit_request') : t('btn_continue')}</span>
                  {step < totalSteps && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

