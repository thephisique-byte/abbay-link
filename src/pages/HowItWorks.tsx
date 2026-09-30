import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Globe2,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { openPostRequest, t } = useApp();

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: <FileText className="w-6 h-6 text-[#063B73]" />,
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: <Globe2 className="w-6 h-6 text-[#0B8F73]" />,
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: <Scale className="w-6 h-6 text-[#063B73]" />,
    },
    {
      num: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: <Users className="w-6 h-6 text-[#0B8F73]" />,
    },
    {
      num: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
      icon: <CheckCircle2 className="w-6 h-6 text-[#35A878]" />,
    },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-[#E5EAF0]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#063B73]">
          {t('tradeIntermediaryModel')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43]">
          {t('howItWorksTitle')}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          {t('howItWorksDetailedSubtitle')}
        </p>
      </div>

      {/* 5 Steps Linear Flow */}
      <div className="space-y-6">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-white rounded-2xl border border-[#E5EAF0] p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-[#063B73] transition-colors shadow-xs"
          >
            <div className="flex sm:flex-col items-center justify-between w-full sm:w-16 shrink-0 gap-2">
              <span className="text-base font-bold font-mono text-[#063B73] bg-[#063B73]/10 px-3 py-1 rounded-xl">
                {s.num}
              </span>
              <div className="p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0]">
                {s.icon}
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <h3 className="text-lg font-bold text-[#102A43]">{s.title}</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Principles */}
      <div className="bg-[#F7F9FC] border border-[#E5EAF0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-[#102A43]">
          {t('keyIntermediaryPrinciples')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] space-y-2">
            <span className="font-bold text-[#063B73] block">{t('noInventoryOwnership')}</span>
            <p className="text-slate-600 leading-relaxed">
              {t('noInventoryDesc')}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] space-y-2">
            <span className="font-bold text-[#063B73] block">{t('neutralComparison')}</span>
            <p className="text-slate-600 leading-relaxed">
              {t('neutralComparisonDesc')}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] space-y-2">
            <span className="font-bold text-[#063B73] block">{t('transparentSourcingFee')}</span>
            <p className="text-slate-600 leading-relaxed">
              {t('transparentFeeDesc')}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5EAF0] space-y-2">
            <span className="font-bold text-[#063B73] block">{t('ethiopianLogistics')}</span>
            <p className="text-slate-600 leading-relaxed">
              {t('ethiopianLogisticsDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => openPostRequest()}
          className="px-8 py-3.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-sm sm:text-base font-bold rounded-xl shadow-md shadow-[#063B73]/20 transition-all inline-flex items-center gap-2"
        >
          <span>{t('postYourRequest')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
