// Google Analytics 4, Meta Pixel & TikTok Pixel tracking wrapper

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        fbq?: any;
        _fbq?: any;
        ttq?: any;
    }
}

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with GA4 ID
export const META_PIXEL_ID = 'XXXXXXXXXXXXXXX'; // Replace with Meta Pixel ID
export const TIKTOK_PIXEL_ID = 'XXXXXXXXXXXXXXX'; // Replace with TikTok Pixel ID

// Initialize All Analytics & Pixels
export const initAnalytics = () => {
    if (typeof window === 'undefined') return;

    // 1. Google Analytics 4
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer?.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    // 2. Meta Pixel
    if (!window.fbq) {
        (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView');
    }

    // 3. TikTok Pixel
    if (!window.ttq) {
        (function () {
            var ttq = window.ttq = window.ttq || [];
            ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "trackSelf", "untrackSelf"];
            ttq.setAndDefer = function (t: any, e: any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function (t: any) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e };
            ttq.load = function (e: any, n: any) {
                var i = "https://analytics.tiktok.com/i18n/pixel/sdk.js";
                ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                var o = document.createElement("script"); o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + "ttq";
                var a = document.getElementsByTagName("script")[0]; a.parentNode?.insertBefore(o, a)
            };
            ttq.load(TIKTOK_PIXEL_ID);
            ttq.page();
        }());
    }
};

// Track page views (for SPAs)
export const trackPageView = (url: string) => {
    if (typeof window === 'undefined') return;

    // GA4
    if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }

    // Meta Pixel
    if (window.fbq) {
        window.fbq('track', 'PageView');
    }

    // TikTok Pixel
    if (window.ttq) {
        window.ttq.page();
    }
};

// Unified Event Tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;

    // GA4 Tracking
    if (window.gtag) {
        window.gtag('event', eventName, parameters);
    }

    // Meta Pixel Tracking
    if (window.fbq) {
        const metaMap: Record<string, string> = {
            'scan_completed': 'Lead',
            'checkout_started': 'InitiateCheckout',
            'purchase': 'Purchase',
            'add_to_cart': 'AddToCart'
        };
        window.fbq('track', metaMap[eventName] || eventName, parameters);
    }

    // TikTok Pixel Tracking
    if (window.ttq) {
        const ttMap: Record<string, string> = {
            'scan_completed': 'CompleteRegistration',
            'checkout_started': 'InitiateCheckout',
            'purchase': 'CompletePayment',
            'add_to_cart': 'AddToCart'
        };
        window.ttq.track(ttMap[eventName] || eventName, parameters);
    }
};

// Predefined events for LOOKSMAXXKING
export const Events = {
    LANDING_VIEW: 'landing_view',
    SCAN_STARTED: 'scan_started',
    SCAN_COMPLETED: 'scan_completed',
    SCAN_ERROR: 'scan_error',
    EMAIL_CAPTURED: 'email_captured',
    CHECKOUT_STARTED: 'checkout_started',
    PURCHASE: 'purchase',
    ADD_TO_CART: 'add_to_cart'
};
