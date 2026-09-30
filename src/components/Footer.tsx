import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openSupplierRegister, openPostRequest, t } = useApp();

  return (
    <footer className="bg-white border-t border-[#E5EAF0] text-[#102A43] pt-10 pb-24 md:pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E5EAF0]">
          {/* Brand Info */}
          <div className="md:col-span-2 pr-0 md:pr-8">
            <Logo size="md" showTagline={false} />
            <p className="mt-3 text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md">
              {t('footer_desc')}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#0B8F73]">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('bridgeText')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-3">
              {t('footer_platform')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => setActiveTab('how-it-works')}
                  className="hover:text-[#063B73] transition-colors"
                >
                  {t('nav_how_it_works')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="hover:text-[#063B73] transition-colors"
                >
                  {t('nav_opportunities')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('suppliers')}
                  className="hover:text-[#063B73] transition-colors"
                >
                  {t('nav_suppliers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('products')}
                  className="hover:text-[#063B73] transition-colors"
                >
                  {t('nav_products')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="hover:text-[#063B73] transition-colors"
                >
                  {t('nav_calculator')}
                </button>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#063B73] mb-3">
              {t('footer_business')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => openPostRequest()}
                  className="hover:text-[#063B73] transition-colors text-left"
                >
                  {t('hero_cta_post')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupplierRegister()}
                  className="hover:text-[#063B73] transition-colors text-left"
                >
                  {t('areYouSupplier')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('how-it-works')}
                  className="hover:text-[#063B73] transition-colors text-left"
                >
                  {t('footer_brokerage_terms')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>{t('footer_rights')}</p>
          <p className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};
