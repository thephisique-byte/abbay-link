import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone } from 'lucide-react';
import { Logo } from './Logo';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('abaylink_pwa_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('abaylink_pwa_dismissed', 'true');
  };

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <aside aria-label="Install ABAYLINK App" className="bg-[#063B73] text-white px-4 py-2.5 sm:py-3 border-b border-[#0B5FA5] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">Install ABAYLINK</p>
              <p className="text-[11px] text-blue-100 hidden sm:block truncate">
                Get faster access to sourcing and supplier discovery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable && (
              <button
                onClick={install}
                className="px-3 py-1.5 bg-white text-[#063B73] hover:bg-slate-100 font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {isIOS && !isInstallable && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-3 py-1.5 bg-white text-[#063B73] hover:bg-slate-100 font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                Install on iOS
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              title="Not now"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Install Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-[#102A43] space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" variant="mark" />
              <div>
                <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
                <p className="text-xs text-[#64748B]">Add ABAYLINK to Home Screen</p>
              </div>
            </div>

            <ol className="space-y-3 text-xs text-[#64748B] bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF0]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#063B73]">1.</span>
                <span>Tap the <strong>Share</strong> button in the Safari bottom bar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#063B73]">2.</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#063B73]">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-[#063B73] py-2.5 text-xs font-bold text-white hover:bg-[#0B5FA5] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
