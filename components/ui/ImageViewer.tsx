
import React, { useEffect } from 'react';

interface ImageViewerProps {
  src: string | null;
  onClose: () => void;
  alt?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src, onClose, alt = "View" }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!src) return null;

  return (
    <div 
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-fade-in" 
        onClick={onClose}
    >
        <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300" 
            onClick={(e) => e.stopPropagation()} 
        />
        
        <div className="absolute top-6 right-6 flex gap-4">
            <button 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = src;
                    link.download = `looksmaxx-${Date.now()}.jpg`;
                    link.click();
                }}
            >
                DOWNLOAD
            </button>
            <button 
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors"
                onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
  );
};
