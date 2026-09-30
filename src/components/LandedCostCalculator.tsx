import React, { useState } from 'react';
import { Calculator, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandedCostCalculator: React.FC = () => {
  const { openPostRequest, t } = useApp();

  // Inputs
  const [unitPrice, setUnitPrice] = useState<number | string>(16.80);
  const [quantity, setQuantity] = useState<number | string>(500);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRateToETB] = useState<number>(140); // Indicative ETB conversion
  const [shippingCost, setShippingCost] = useState<number | string>(2100);
  const [insuranceCost, setInsuranceCost] = useState<number | string>(250);
  const [customsDutyPercent, setCustomsDutyPercent] = useState<number | string>(15);
  const [djiboutiPortCosts, setDjiboutiPortCosts] = useState<number | string>(800);
  const [inlandTransport, setInlandTransport] = useState<number | string>(1200);
  const [otherClearing, setOtherClearing] = useState<number | string>(450);

  // Target Selling Price for optional margin check
  const [targetSellingPricePerUnitETB, setTargetSellingPricePerUnitETB] = useState<number | string>(3800);

  // Calculations
  const qtyNum = Number(quantity) || 1;
  const priceNum = Number(unitPrice) || 0;
  const shipNum = Number(shippingCost) || 0;
  const insNum = Number(insuranceCost) || 0;
  const dutyPctNum = Number(customsDutyPercent) || 0;
  const portNum = Number(djiboutiPortCosts) || 0;
  const inlandNum = Number(inlandTransport) || 0;
  const otherNum = Number(otherClearing) || 0;

  // 1. Estimated Product Cost
  const estimatedProductCost = priceNum * qtyNum;

  // 2. Estimated Logistics (Freight + Djibouti Port + Inland)
  const estimatedLogisticsCost = shipNum + portNum + inlandNum;

  // 3. Estimated Import Costs (Insurance + Customs Duty calculated on CIF)
  const cifValue = estimatedProductCost + shipNum + insNum;
  const estimatedCustomsDuty = (cifValue * dutyPctNum) / 100;
  const estimatedImportCosts = insNum + estimatedCustomsDuty + otherNum;

  // 4. Estimated Total Landed Cost (USD or chosen foreign currency)
  const estimatedTotalLandedCost = estimatedProductCost + estimatedLogisticsCost + estimatedImportCosts;
  const estimatedLandedCostPerUnit = qtyNum > 0 ? estimatedTotalLandedCost / qtyNum : 0;

  // In ETB
  const totalLandedCostETB = estimatedTotalLandedCost * exchangeRateToETB;
  const unitLandedCostETB = estimatedLandedCostPerUnit * exchangeRateToETB;

  // Margin
  const sellPriceETB = Number(targetSellingPricePerUnitETB) || 0;
  const unitProfitETB = sellPriceETB - unitLandedCostETB;
  const grossMarginPercent = sellPriceETB > 0 ? (unitProfitETB / sellPriceETB) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EAF0] p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E5EAF0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#063B73]/10 text-[#063B73]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#102A43]">
                {t('landedCostTitle')}
              </h3>
              <p className="text-xs text-[#64748B]">
                {t('landedCostSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-medium">{t('currency')}:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F9FC] border border-[#E5EAF0] rounded-lg text-xs font-semibold text-[#063B73]"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
      </div>

      {/* Mandatory Prominent Disclaimer Banner */}
      <div className="my-5 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">{t('estimateNotice')}: </strong>
          {t('landedCostDisclaimer')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Columns */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#F7F9FC] p-4 rounded-xl border border-[#E5EAF0] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
              1. {t('productTerms')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('supplierPrice')} ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs font-semibold text-[#102A43]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('calcQuantity')}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs font-semibold text-[#102A43]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F7F9FC] p-4 rounded-xl border border-[#E5EAF0] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
              2. {t('freightLogistics')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('seaFreightDjibouti')} ({currency})
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('djiboutiPortTransit')} ({currency})
                </label>
                <input
                  type="number"
                  value={djiboutiPortCosts}
                  onChange={(e) => setDjiboutiPortCosts(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('inlandTrucking')} ({currency})
                </label>
                <input
                  type="number"
                  value={inlandTransport}
                  onChange={(e) => setInlandTransport(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F7F9FC] p-4 rounded-xl border border-[#E5EAF0] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
              3. {t('insuranceDutiesClearance')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('marineInsurance')} ({currency})
                </label>
                <input
                  type="number"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('customsTariff')} (%)
                </label>
                <input
                  type="number"
                  value={customsDutyPercent}
                  onChange={(e) => setCustomsDutyPercent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  {t('clearingTerminal')} ({currency})
                </label>
                <input
                  type="number"
                  value={otherClearing}
                  onChange={(e) => setOtherClearing(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-[#102A43]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#F7F9FC] border border-[#E5EAF0] rounded-2xl p-5">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] pb-2 border-b border-slate-200">
              {t('costBreakdown')}
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('estProductCost')}:</span>
                <span className="font-semibold text-[#102A43] font-mono tabular-nums">
                  {currency} {estimatedProductCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('estLogistics')}:</span>
                <span className="font-semibold text-[#102A43] font-mono tabular-nums">
                  {currency} {estimatedLogisticsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">{t('estImportDuties')}:</span>
                <span className="font-semibold text-[#102A43] font-mono tabular-nums">
                  {currency} {estimatedImportCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Total Landed Cost */}
              <div className="pt-3 border-t border-slate-200">
                <div className="p-3 bg-white rounded-xl border border-[#063B73]/20 space-y-1">
                  <div className="text-[11px] font-bold text-[#063B73] uppercase tracking-wide">
                    {t('estTotalLandedCost')}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#063B73] font-mono tabular-nums">
                    {currency} {estimatedTotalLandedCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    ≈ ETB {totalLandedCostETB.toLocaleString(undefined, { maximumFractionDigits: 0 })} (at 1:{exchangeRateToETB})
                  </div>
                </div>
              </div>

              {/* Per Unit */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#64748B] font-medium">{t('estLandedPerUnit')}:</span>
                <span className="font-bold text-[#0B8F73] font-mono tabular-nums text-sm">
                  {currency} {estimatedLandedCostPerUnit.toFixed(2)} (≈ ETB {unitLandedCostETB.toFixed(0)})
                </span>
              </div>
            </div>

            {/* Optional Margin Analysis */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-[#102A43]">
                {t('optionalPricing')}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{t('targetSellingPrice')}:</span>
                <input
                  type="number"
                  value={targetSellingPricePerUnitETB}
                  onChange={(e) => setTargetSellingPricePerUnitETB(e.target.value)}
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-right"
                />
              </div>

              {sellPriceETB > 0 && (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                  <span>{t('estimatedGrossMargin')}:</span>
                  <span className="font-bold font-mono">
                    {grossMarginPercent.toFixed(1)}% (ETB {unitProfitETB.toFixed(0)}/unit)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => openPostRequest()}
              className="w-full py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{t('sourceWithRealQuotes')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
