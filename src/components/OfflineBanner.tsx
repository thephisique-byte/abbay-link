import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
      <WifiOff className="w-4 h-4" />
      <span>You are offline. Some information may be unavailable.</span>
    </div>
  );
};
