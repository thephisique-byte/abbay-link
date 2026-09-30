import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PostRequestModal } from './components/PostRequestModal';
import { SupplierRegistrationModal } from './components/SupplierRegistrationModal';
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { OfflineBanner } from './components/OfflineBanner';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Home } from './pages/Home';
import { Opportunities } from './pages/Opportunities';
import { Suppliers } from './pages/Suppliers';
import { Products } from './pages/Products';
import { HowItWorks } from './pages/HowItWorks';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { BrokerDashboard } from './pages/BrokerDashboard';
import { SupplierDesk } from './pages/SupplierDesk';
import { MessagesPage } from './pages/MessagesPage';
import { LandedCostCalculator } from './components/LandedCostCalculator';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
      {activeTab === 'home' && <Home />}
      {activeTab === 'opportunities' && <Opportunities />}
      {activeTab === 'suppliers' && <Suppliers />}
      {activeTab === 'products' && <Products />}
      {activeTab === 'how-it-works' && <HowItWorks />}
      {activeTab === 'requests' && <BuyerDashboard />}
      {activeTab === 'broker-workspace' && <BrokerDashboard />}
      {activeTab === 'supplier-desk' && <SupplierDesk />}
      {activeTab === 'messages' && <MessagesPage />}
      {activeTab === 'calculator' && (
        <div className="max-w-5xl mx-auto py-2">
          <LandedCostCalculator />
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#102A43] font-sans antialiased selection:bg-[#063B73] selection:text-white">
        {/* Offline Status Connectivity Warning */}
        <OfflineBanner />

        {/* In-App Subtle PWA Install Banner */}
        <PWAInstallBanner />

        {/* Marketplace Header + Category Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <MainContent />

        {/* Modals & Drawers */}
        <PostRequestModal />
        <ProductDetailModal />
        <SupplierRegistrationModal />
        <SearchModal />
        <ProfileModal />

        {/* Global Footer */}
        <Footer />

        {/* Mobile App Bottom Navigation (5 tabs + floating action) */}
        <BottomNav />
      </div>
    </AppProvider>
  );
}
