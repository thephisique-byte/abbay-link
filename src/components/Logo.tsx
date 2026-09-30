import React from 'react';
import { useApp } from '../context/AppContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'mark' | 'mobile' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  variant = 'full',
}) => {
  const { t } = useApp();
  const sizeMap = {
    sm: { height: 26, markSize: 26, textClass: 'text-base font-bold tracking-tight', tagClass: 'text-[10px]' },
    md: { height: 32, markSize: 32, textClass: 'text-lg sm:text-xl font-bold tracking-tight', tagClass: 'text-xs' },
    lg: { height: 44, markSize: 44, textClass: 'text-2xl font-extrabold tracking-tight', tagClass: 'text-sm' },
    xl: { height: 56, markSize: 56, textClass: 'text-3xl font-extrabold tracking-tight', tagClass: 'text-base' },
  };

  const currentSize = sizeMap[size];

  // Official ABAYLINK Vector Mark
  const LogoMark = (
    <svg
      width={variant === 'mobile' ? 26 : currentSize.markSize}
      height={variant === 'mobile' ? 26 : currentSize.markSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
      aria-label="ABAYLINK Logo Mark"
    >
      <defs>
        <linearGradient id="abayNavyBlue" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#063B73" />
          <stop offset="50%" stopColor="#0B5FA5" />
          <stop offset="100%" stopColor="#0B79D0" />
        </linearGradient>

        <linearGradient id="abayTealGreen" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B8F73" />
          <stop offset="50%" stopColor="#1DA57A" />
          <stop offset="100%" stopColor="#35A878" />
        </linearGradient>
      </defs>

      {/* Main Stylized "A" Arch (Navy to Blue) */}
      <path
        d="M 50 12 C 53 12 56 15 58 20 L 84 82 C 86 86 83 90 77 90 L 63 90 C 60 90 57 87 56 84 L 51 68 C 50 65 46 65 45 68 L 40 84 C 39 87 36 90 33 90 L 21 90 C 15 90 12 85 15 81 L 42 20 C 44 15 47 12 50 12 Z"
        fill="url(#abayNavyBlue)"
      />

      {/* Negative Cutout */}
      <path
        d="M 50 28 L 61 57 L 39 57 Z"
        fill="#FFFFFF"
        opacity="0.96"
      />

      {/* Dynamic Swooshing Bridge Crossbar (Teal to Green) */}
      <path
        d="M 12 88 C 22 75 38 60 62 55 C 76 52 89 53 96 54 C 98 54 99 56 97 58 C 88 62 76 65 62 67 C 42 70 28 80 18 90 C 15 93 10 91 12 88 Z"
        fill="url(#abayTealGreen)"
      />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  if (variant === 'mobile') {
    return (
      <div className={`inline-flex items-center gap-2 select-none ${className}`}>
        {LogoMark}
        <span className="text-base font-extrabold tracking-tight text-[#063B73]">
          ABAY<span className="text-[#0B8F73]">LINK</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {LogoMark}
      <div className="flex flex-col leading-none">
        <span
          className={`${currentSize.textClass} font-bold tracking-tight text-[#063B73] group-hover:text-[#0B5FA5] transition-colors`}
        >
          ABAY<span className="text-[#0B8F73]">LINK</span>
        </span>
        {showTagline && (
          <span className={`${currentSize.tagClass} font-medium text-[#64748B] mt-0.5 tracking-normal`}>
            {t('tagline')}
          </span>
        )}
      </div>
    </div>
  );
};
