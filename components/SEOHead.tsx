
import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  structuredData?: object; // New: JSON-LD Support
  canonicalUrl?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  keywords = [], 
  image = "https://looksmaxx.ai/og-image.jpg",
  structuredData,
  canonicalUrl
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
    updateMeta('author', 'LooksMaxx King AI');
    updateMeta('robots', 'index, follow');
    
    // 4. Social Media Tags (OpenGraph)
    updateOg('og:title', title);
    updateOg('og:description', description);
    updateOg('og:image', image);
    updateOg('og:url', window.location.href);
    updateOg('og:site_name', 'LooksMaxx King');

    // 5. Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        twitterCard.setAttribute('content', 'summary_large_image');
        document.head.appendChild(twitterCard);
    }

    // 6. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl || window.location.href.split('?')[0]);

    // 7. Structured Data (JSON-LD)
    // Remove old schema script if exists
    const oldScript = document.getElementById('seo-json-ld');
    if (oldScript) oldScript.remove();

    if (structuredData) {
        const script = document.createElement('script');
        script.id = 'seo-json-ld';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
        // Optional: Reset title or meta if needed, but usually fine to leave until next mount
    };

  }, [title, description, keywords, image, structuredData, canonicalUrl]);

  return null;
};
