import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { CategoryBar } from './CategoryBar';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  User as UserIcon,
  Globe,
  Check,
  Briefcase,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openPostRequest,
    openSearch,
    currentRole,
    setCurrentRole,
    currentUser,
    language,
    setLanguage,
    t,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    buyer: { label: t('role_buyer'), desc: t('role_buyer_desc') },
    supplier: { label: t('role_supplier'), desc: t('role_supplier_desc') },
    broker: { label: t('role_broker'), desc: t('role_broker_desc') },
    admin: { label: t('role_admin'), desc: t('role_admin_desc') },
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5EAF0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: ABAYLINK Logo */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#063B73] rounded-lg"
            aria-label="ABAYLINK Home"
          >
            <span className="hidden sm:inline-block">
              <Logo size="md" showTagline={false} variant="full" />
            </span>
            <span className="sm:hidden">
              <Logo size="sm" showTagline={false} variant="mobile" />
            </span>
          </button>
        </div>

        {/* CENTER: Marketplace Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2">
          <div
            onClick={openSearch}
            className="w-full bg-[#F8FAFC] hover:bg-slate-100/80 border border-[#E5EAF0] hover:border-[#063B73] rounded-xl px-3.5 py-2 flex items-center gap-2.5 cursor-pointer transition-colors shadow-2xs group"
          >
            <Search className="w-4 h-4 text-[#063B73] shrink-0 group-hover:scale-105 transition-transform" />
            <span className="text-xs text-[#64748B] truncate select-none">
              Search products, materials, equipment or suppliers...
            </span>
          </div>
        </div>

        {/* RIGHT: Quick Links, Search (Mobile), Language, Profile, Post Request */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            onClick={openSearch}
            className="md:hidden p-2 text-[#64748B] hover:text-[#063B73] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            title={t('search')}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Nav Shortcuts */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#64748B] mr-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`hover:text-[#063B73] transition-colors ${
                activeTab === 'products' ? 'text-[#063B73] font-bold' : ''
              }`}
            >
              {t('nav_products')}
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`hover:text-[#063B73] transition-colors ${
                activeTab === 'suppliers' ? 'text-[#063B73] font-bold' : ''
              }`}
            >
              {t('nav_suppliers')}
            </button>
            <button
              onClick={() => {
                if (currentRole === 'broker' || currentRole === 'admin') {
                  setActiveTab('broker-workspace');
                } else if (currentRole === 'supplier') {
                  setActiveTab('supplier-desk');
                } else {
                  setActiveTab('requests');
                }
              }}
              className={`hover:text-[#063B73] transition-colors ${
                activeTab === 'requests' || activeTab === 'broker-workspace' || activeTab === 'supplier-desk'
                  ? 'text-[#063B73] font-bold'
                  : ''
              }`}
            >
              {t('nav_my_requests')}
            </button>
          </nav>

          {/* Universal Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-[#64748B] hover:text-[#063B73] hover:bg-[#F8FAFC] rounded-lg transition-colors flex items-center"
              title="Select Language / ቋንቋ ይምረጡ"
              aria-label="Language selector"
            >
              <Globe className="w-5 h-5" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5EAF0] shadow-xl rounded-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    language === 'en'
                      ? 'bg-[#063B73]/5 text-[#063B73] font-bold'
                      : 'text-[#102A43] hover:bg-slate-50'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-4 h-4 text-[#063B73]" />}
                </button>

                <button
                  onClick={() => {
                    setLanguage('am');
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    language === 'am'
                      ? 'bg-[#063B73]/5 text-[#063B73] font-bold'
                      : 'text-[#102A43] hover:bg-slate-50'
                  }`}
                >
                  <span>አማርኛ (Amharic)</span>
                  {language === 'am' && <Check className="w-4 h-4 text-[#063B73]" />}
                </button>

                <button
                  onClick={() => {
                    setLanguage('om');
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    language === 'om'
                      ? 'bg-[#063B73]/5 text-[#063B73] font-bold'
                      : 'text-[#102A43] hover:bg-slate-50'
                  }`}
                >
                  <span>Afaan Oromoo</span>
                  {language === 'om' && <Check className="w-4 h-4 text-[#063B73]" />}
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 text-[#64748B] hover:text-[#063B73] hover:bg-[#F8FAFC] rounded-lg transition-colors flex items-center"
              title="Profile & Roles"
              aria-label="User Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5EAF0] shadow-2xl rounded-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#E5EAF0] mb-1.5">
                  <p className="text-xs font-bold text-[#102A43] truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{currentUser.company || currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B8F73]"></span>
                    <span className="text-[10px] font-bold uppercase text-[#063B73] tracking-wide">
                      {roleLabels[currentRole].label}
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('role_switch_title')}
                  </p>
                  {(['buyer', 'supplier', 'broker', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setIsProfileOpen(false);
                        if (role === 'broker' || role === 'admin') {
                          setActiveTab('broker-workspace');
                        } else if (role === 'supplier') {
                          setActiveTab('supplier-desk');
                        } else {
                          setActiveTab('requests');
                        }
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentRole === role
                          ? 'bg-[#063B73]/10 text-[#063B73] font-semibold'
                          : 'text-[#102A43] hover:bg-slate-50'
                      }`}
                    >
                      <span>{roleLabels[role].label}</span>
                      {currentRole === role && <Check className="w-3.5 h-3.5 text-[#063B73]" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#E5EAF0] mt-1.5 pt-1.5 px-2">
                  <button
                    onClick={() => {
                      setActiveTab('calculator');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#102A43] hover:bg-slate-50 transition-colors"
                  >
                    {t('nav_calculator')}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('how-it-works');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#102A43] hover:bg-slate-50 transition-colors"
                  >
                    {t('nav_how_it_works')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Post Request */}
          <button
            onClick={() => openPostRequest()}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav_post_request')}</span>
            <span className="sm:hidden">Request</span>
          </button>
        </div>
      </div>
      <CategoryBar />
    </header>
  );
};
