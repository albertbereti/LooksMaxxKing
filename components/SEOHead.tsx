
import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  keywords = [], 
  image = "https://looksmaxx.ai/og-image.jpg"
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = `${title} | LooksMaxx King`;

    // 2. Helper to update or create meta tags
    const updateMeta = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    const updateOg = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', property);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    // 3. Apply Metadata
    updateMeta('description', description);
    if (keywords.length > 0) updateMeta('keywords', keywords.join(', '));
    
    // 4. Social Media Tags (OpenGraph)
    updateOg('og:title', title);
    updateOg('og:description', description);
    updateOg('og:image', image);

  }, [title, description, keywords, image]);

  return null; // Renders nothing visibly
};
