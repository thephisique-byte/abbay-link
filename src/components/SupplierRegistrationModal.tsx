import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { X, CheckCircle2, UploadCloud } from 'lucide-react';

export const SupplierRegistrationModal: React.FC = () => {
  const { isSupplierRegisterOpen, closeSupplierRegister, registerSupplier, t } = useApp();

  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('Turkey');
  const [website, setWebsite] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Water & Irrigation']);
  const [exportMarkets, setExportMarkets] = useState('East Africa, Middle East');
  const [moq, setMoq] = useState('1 x 20ft container / 500 units');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isSupplierRegisterOpen) return null;

  const toggleCategory = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catName));
      }
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !email.trim()) return;

    registerSupplier({
      name: companyName,
      country,
      flag: country === 'Australia' ? '🇦🇺' : country === 'Turkey' ? '🇹🇷' : country === 'China' ? '🇨🇳' : country === 'India' ? '🇮🇳' : country === 'UAE' ? '🇦🇪' : '🌍',
      website: website || 'https://supplier.example.com',
      contactPerson,
      email,
      phone,
      categories: selectedCategories,
      products: products.split(',').map((p) => p.trim()).filter(Boolean),
      exportMarkets: exportMarkets.split(',').map((m) => m.trim()).filter(Boolean),
      moq: moq || 'Standard MOQ',
      description: description || `${companyName} is an international manufacturer and supplier.`,
      yearEstablished: 2012,
      certifications: ['ISO 9001:2015', 'CE Certified'],
    });

    setSubmitted(true);
  };

  const countryFlags: Record<string, string> = {
    Australia: '🇦🇺 Australia',
    China: '🇨🇳 China',
    Turkey: '🇹🇷 Turkey',
    India: '🇮🇳 India',
    UAE: '🇦🇪 UAE',
    Europe: '🇪🇺 Europe',
    Other: '🌐 Other International',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSupplierRegister} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F7F9FC]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#063B73]">
              {t('supplierPortal')}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#102A43]">
              {t('becomeSupplier')}
            </h2>
          </div>
          <button
            onClick={closeSupplierRegister}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#102A43]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0B8F73] flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-[#102A43]">{t('requestSubmitted')}</h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
                {t('supplierUnderReview')}
              </p>
              <div className="p-3 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('company')}</span>
                  <span className="font-semibold text-[#102A43]">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">{t('country')}</span>
                  <span className="font-semibold text-[#102A43]">{country}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-[#64748B]">{t('status')}</span>
                  <span className="font-bold text-[#063B73] bg-blue-50 px-2 py-0.5 rounded">
                    {t('underReview')}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                {t('verificationDisclaimer')}
              </p>
              <button
                onClick={closeSupplierRegister}
                className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl"
              >
                {t('close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl text-xs text-[#063B73]">
                {t('supplierFormSubtitle')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('companyName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anadolu Flow Dynamics AS"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('country')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  >
                    {Object.entries(countryFlags).map(([c, label]) => (
                      <option key={c} value={c}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('website')}
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('contactPerson')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export Sales Manager"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="export@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    placeholder="+90 212 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  {t('sourcingCategories')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={`p-2 text-left rounded-lg text-xs font-medium border transition-colors ${
                        selectedCategories.includes(cat.name)
                          ? 'bg-[#063B73]/10 border-[#063B73] text-[#063B73] font-semibold'
                          : 'bg-white border-[#E5EAF0] text-[#64748B]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  {t('productsOffered')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Centrifugal Pumps, HDPE Pipes, Waterproofing Membranes"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('moq')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500 meters or 1 unit"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    {t('exportMarkets')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. East Africa, Middle East"
                    value={exportMarkets}
                    onChange={(e) => setExportMarkets(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  {t('companyOverview')}
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of manufacturing facilities, factory certifications, and export logistics capability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#E5EAF0] rounded-xl text-xs text-[#102A43]"
                />
              </div>

              {/* Upload simulation */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  {t('catalogueUpload')}
                </label>
                <label className="border-2 border-dashed border-[#E5EAF0] hover:border-[#063B73] rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-[#F7F9FC] hover:bg-white transition-colors">
                  <UploadCloud className="w-5 h-5 text-[#063B73]" />
                  <span className="text-xs text-[#64748B]">
                    {fileName ? fileName : t('uploadPdfDoc')}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {t('submitSupplierApplication')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
