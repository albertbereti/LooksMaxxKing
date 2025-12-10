
import React from 'react';

export const CrownLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M2 18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V16H2V18Z" 
      className="fill-current" 
    />
    <path 
      d="M12 4L15 10L21 6L19 15H5L3 6L9 10L12 4Z" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="stroke-current fill-none"
    />
    <circle cx="12" cy="4" r="1.5" className="fill-current" />
    <circle cx="21" cy="6" r="1.5" className="fill-current" />
    <circle cx="3" cy="6" r="1.5" className="fill-current" />
  </svg>
);
