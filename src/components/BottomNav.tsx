import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  Plus,
  FileText,
  MessageSquare,
  User as UserIcon,
  Briefcase,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openPostRequest,
    openProfile,
    currentRole,
    requests,
    currentUser,
    messages,
    t,
  } = useApp();

  const userReqCount = requests.filter(
    (r) => r.buyerId === currentUser.id || currentRole === 'broker' || currentRole === 'admin'
  ).length;

  return (
    <>
      {/* Floating Persistent Primary Action: + Post Request */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => openPostRequest()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#063B73] hover:bg-[#0B5FA5] text-white text-xs font-bold rounded-full shadow-lg shadow-[#063B73]/30 border border-white/20 active:scale-95 transition-transform min-h-[44px]"
          aria-label="Post Sourcing Request"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post Request</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (5 tabs: Home, Explore, Requests, Messages, Profile) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5EAF0] pb-safe shadow-lg"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] transition-colors ${
              activeTab === 'home' ? 'text-[#063B73]' : 'text-[#64748B] hover:text-[#063B73]'
            }`}
            aria-label="Home"
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className={`text-[10px] mt-1 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
              Home
            </span>
          </button>

          {/* 2. Explore (Marketplace Products & Categories) */}
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] transition-colors ${
              activeTab === 'products' ? 'text-[#063B73]' : 'text-[#64748B] hover:text-[#063B73]'
            }`}
            aria-label="Explore"
          >
            <Compass className={`w-5 h-5 ${activeTab === 'products' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className={`text-[10px] mt-1 ${activeTab === 'products' ? 'font-bold' : 'font-medium'}`}>
              Explore
            </span>
          </button>

          {/* 3. Requests */}
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
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] relative transition-colors ${
              activeTab === 'requests' || activeTab === 'broker-workspace' || activeTab === 'supplier-desk'
                ? 'text-[#063B73]'
                : 'text-[#64748B] hover:text-[#063B73]'
            }`}
            aria-label="Requests"
          >
            {currentRole === 'broker' || currentRole === 'admin' ? (
              <Briefcase
                className={`w-5 h-5 ${
                  activeTab === 'broker-workspace' ? 'stroke-[2.5]' : 'stroke-[1.75]'
                }`}
              />
            ) : (
              <FileText
                className={`w-5 h-5 ${
                  activeTab === 'requests' || activeTab === 'supplier-desk' ? 'stroke-[2.5]' : 'stroke-[1.75]'
                }`}
              />
            )}

            {userReqCount > 0 && (
              <span className="absolute top-1.5 right-3 w-4 h-4 bg-[#0B8F73] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {userReqCount}
              </span>
            )}
            <span
              className={`text-[10px] mt-1 ${
                activeTab === 'requests' || activeTab === 'broker-workspace' || activeTab === 'supplier-desk'
                  ? 'font-bold'
                  : 'font-medium'
              }`}
            >
              Requests
            </span>
          </button>

          {/* 4. Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] relative transition-colors ${
              activeTab === 'messages' ? 'text-[#063B73]' : 'text-[#64748B] hover:text-[#063B73]'
            }`}
            aria-label="Messages"
          >
            <MessageSquare
              className={`w-5 h-5 ${activeTab === 'messages' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`}
            />
            {messages.length > 0 && (
              <span className="absolute top-1.5 right-3 w-2 h-2 bg-[#063B73] rounded-full" />
            )}
            <span className={`text-[10px] mt-1 ${activeTab === 'messages' ? 'font-bold' : 'font-medium'}`}>
              Messages
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={openProfile}
            className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] transition-colors text-[#64748B] hover:text-[#063B73]"
            aria-label="Profile"
          >
            <UserIcon className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
