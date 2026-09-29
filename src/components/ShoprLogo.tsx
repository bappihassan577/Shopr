import React from 'react';

interface ShoprLogoProps {
  className?: string;
  height?: number | string;
}

export const ShoprLogo: React.FC<ShoprLogoProps> = ({
  className = '',
  height = 40
}) => {
  return (
    <div 
      className={`inline-flex items-center shrink-0 select-none overflow-visible ${className}`} 
      style={{ height }}
    >
      <img
        src="/shopr-logo.svg"
        alt="Shopr"
        className="h-full w-auto max-w-[200px] object-contain shrink-0"
        style={{ display: 'block' }}
      />
    </div>
  );
};
