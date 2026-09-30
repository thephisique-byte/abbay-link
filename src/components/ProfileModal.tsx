import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  User as UserIcon,
  Globe,
  Check,
  Building2,
  Phone,
  Mail,
  Download,
  Calculator,
  HelpCircle,
  Shield,
  Briefcase,
  Layers,
  LogOut,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    closeProfile,
    currentUser,
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    setActiveTab,
    savedOpportunityIds,
    requests,
    t,
  } = useApp();

  const { isInstallable, install } = usePWAInstall();

  if (!isProfileOpen) return null;

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    buyer: { label: t('role_buyer'), desc: 'Post sourcing requests, review proforma quotes, connect with verified factories.' },
    supplier: { label: t('role_supplier'), desc: 'Submit formal quotations, list manufactured products, communicate with buyers.' },
    broker: { label: t('role_broker'), desc: 'ABAYLINK Sourcing Desk: match buyers & sellers, negotiate CIF terms, issue intros.' },
    admin: { label: t('role_admin'), desc: 'System management, verification audit logs, trade oversight.' },
  };

  const userReqCount = requests.filter((r) => r.buyerId === currentUser.id).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={closeProfile} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#063B73] text-white flex items-center justify-center font-bold text-base shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#102A43]">{currentUser.name}</h2>
              <p className="text-xs text-[#64748B] truncate max-w-[240px]">{currentUser.company}</p>
            </div>
          </div>

          <button
            onClick={closeProfile}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#102A43] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-[#102A43]">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => {
                closeProfile();
                setActiveTab('requests');
              }}
              className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] hover:border-[#063B73] cursor-pointer transition-colors"
            >
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Active Requests</span>
              <span className="text-lg font-extrabold text-[#063B73]">{userReqCount}</span>
            </div>

            <div
              onClick={() => {
                closeProfile();
                setActiveTab('opportunities');
              }}
              className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] hover:border-[#0B8F73] cursor-pointer transition-colors"
            >
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Saved Opportunities</span>
              <span className="text-lg font-extrabold text-[#0B8F73]">{savedOpportunityIds.length}</span>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF0]">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email:
              </span>
              <span className="font-semibold text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone:
              </span>
              <span className="font-semibold text-slate-800">{currentUser.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Location:
              </span>
              <span className="font-semibold text-slate-800">{currentUser.city}, {currentUser.country}</span>
            </div>
          </div>

          {/* User Role Switcher */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Switch Working Role
            </label>
            <div className="space-y-1.5">
              {(['buyer', 'supplier', 'broker', 'admin'] as UserRole[]).map((role) => {
                const isActive = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      if (role === 'broker' || role === 'admin') {
                        setActiveTab('broker-workspace');
                      } else if (role === 'supplier') {
                        setActiveTab('supplier-desk');
                      } else {
                        setActiveTab('requests');
                      }
                      closeProfile();
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'border-[#063B73] bg-[#063B73]/5 ring-1 ring-[#063B73]'
                        : 'border-[#E5EAF0] bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#102A43] capitalize">
                          {roleLabels[role].label}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#063B73] bg-[#063B73]/10 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {roleLabels[role].desc}
                      </p>
                    </div>

                    {isActive && <Check className="w-4 h-4 text-[#063B73] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Application Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', name: 'English' },
                { code: 'am', name: 'አማርኛ' },
                { code: 'om', name: 'Afaan Oromoo' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`p-2.5 text-center rounded-xl border text-xs font-semibold transition-colors ${
                    language === lang.code
                      ? 'border-[#063B73] bg-[#063B73] text-white shadow-2xs'
                      : 'border-[#E5EAF0] bg-white text-[#102A43] hover:bg-slate-50'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tools & PWA Install */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063B73]">
              Tools & Navigation
            </label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  closeProfile();
                  setActiveTab('calculator');
                }}
                className="w-full text-left p-2.5 rounded-xl border border-[#E5EAF0] hover:bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#063B73]" />
                  <span>Landed Cost & Duty Calculator (Djibouti / Mojo)</span>
                </div>
                <span className="text-[#063B73] font-bold">→</span>
              </button>

              <button
                onClick={() => {
                  closeProfile();
                  setActiveTab('how-it-works');
                }}
                className="w-full text-left p-2.5 rounded-xl border border-[#E5EAF0] hover:bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0B8F73]" />
                  <span>How ABAYLINK Brokerage Works</span>
                </div>
                <span className="text-[#0B8F73] font-bold">→</span>
              </button>

              {isInstallable && (
                <button
                  onClick={() => {
                    install();
                    closeProfile();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 hover:bg-blue-100/70 flex items-center justify-between text-xs text-[#063B73] font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#063B73]" />
                    <span>Install ABAYLINK Progressive Web App</span>
                  </div>
                  <span>Install</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5EAF0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={closeProfile}
            className="px-5 py-2 bg-[#063B73] text-white text-xs font-bold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
