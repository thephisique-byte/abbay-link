import React from 'react';
import { useApp } from '../context/AppContext';
import { REFERENCE_PRODUCTS } from '../data/mockData';
import {
  X,
  Plus,
  Building2,
  CheckCircle2,
  Globe,
  FileText,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    closeProductDetail,
    openPostRequest,
    suppliers,
    setActiveTab,
    t,
  } = useApp();

  if (!selectedProductId) return null;

  const product = REFERENCE_PRODUCTS.find((p) => p.id === selectedProductId);

  if (!product) return null;

  const matchingSuppliers = suppliers.filter(
    (s) =>
      s.categories.includes(product.category) ||
      s.products.some((pr) => pr.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])) ||
      s.country.toLowerCase() === product.origin.toLowerCase()
  );

  const handleSourceThisProduct = () => {
    const specsString = Object.entries(product.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    closeProductDetail();
    openPostRequest(product.category, product.name, specsString);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeProductDetail}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAF0] flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#063B73]">{product.category}</span>
            {product.subCategory && (
              <>
                <span>/</span>
                <span>{product.subCategory}</span>
              </>
            )}
          </div>

          <button
            onClick={closeProductDetail}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Product Info & Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Container */}
            <div className="rounded-xl overflow-hidden bg-slate-100 border border-[#E5EAF0] aspect-4/3 relative flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Package className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs mt-2 font-medium">Standard Reference Specification</p>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#063B73] shadow-xs border border-slate-200">
                Origin: {product.origin}
              </div>
            </div>

            {/* Product Meta & Highlights */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manufacturer: <strong className="text-[#102A43]">{product.manufacturer}</strong></span>
                </p>
              </div>

              {/* Price / Sourcing Note */}
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Indication:</span>
                  <span className="font-bold text-[#063B73]">{product.estimatedPrice || 'Request quotation'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Typical MOQ:</span>
                  <span className="font-semibold text-[#102A43]">{product.typicalMOQ}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Availability:</span>
                  <span className="font-medium text-[#0B8F73]">{product.supplierAvailability || 'Verified Sourcing'}</span>
                </div>
              </div>

              {/* Primary Sourcing CTA */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSourceThisProduct}
                  className="w-full py-3 px-4 bg-[#063B73] hover:bg-[#0B5FA5] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Source This Product</span>
                </button>
                <p className="text-[11px] text-center text-[#64748B]">
                  ABAYLINK broker desk will match verified manufacturers & facilitate proforma quotes.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Specification Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Detailed Technical Specs Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Technical Parameters
            </h3>
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={`border-b border-[#E5EAF0] last:border-0 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-semibold text-[#64748B] w-1/3 border-r border-[#E5EAF0]">
                        {key}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-[#102A43]">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                Commercial Applications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.applications.map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0B8F73] shrink-0" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Documents & Test Reports */}
          {product.documents && product.documents.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                Compliance Documents & Factory Certificates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                  >
                    <FileText className="w-4 h-4 text-[#063B73] shrink-0" />
                    <span className="font-medium truncate">{doc}</span>
                    <span className="ml-auto text-[10px] text-[#0B8F73] font-bold">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Potential Suppliers Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
                Matched Manufacturers & Suppliers ({matchingSuppliers.length})
              </h3>
              <button
                onClick={() => {
                  closeProductDetail();
                  setActiveTab('suppliers');
                }}
                className="text-xs font-semibold text-[#063B73] hover:underline"
              >
                View all suppliers →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingSuppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="p-3 bg-white rounded-xl border border-[#E5EAF0] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102A43] truncate">{sup.name}</span>
                    <span className="text-[10px] font-semibold text-[#0B8F73] bg-emerald-50 px-2 py-0.5 rounded">
                      {sup.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    {sup.flag} {sup.country} · MOQ: {sup.moq}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interested In This Product Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#063B73]/5 via-[#0B8F73]/5 to-transparent rounded-2xl border border-[#063B73]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-[#102A43]">Interested in this product?</h4>
              <p className="text-xs text-[#64748B]">
                Submit your volume requirements to receive formal proforma quotes from matched factories.
              </p>
            </div>

            <button
              onClick={handleSourceThisProduct}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Source This Product</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar CTA */}
        <div className="p-4 border-t border-[#E5EAF0] bg-[#F8FAFC] flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs text-[#64748B]">
            <span>Ready to obtain proforma invoice and origin certificate?</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeProductDetail}
              className="px-4 py-2 border border-[#E5EAF0] bg-white hover:bg-slate-50 text-[#102A43] text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSourceThisProduct}
              className="flex-1 sm:flex-initial px-5 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Source This Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
