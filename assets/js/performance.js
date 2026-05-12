// Performance Optimizations for MAESTRO PALCO

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Animate on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    elements.forEach(el => observer.observe(el));
};

// Prefetch critical resources
const prefetchResources = () => {
    const links = [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
};

// Service Worker Registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('SW registered:', registration),
            err => console.log('SW registration failed:', err)
        );
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    prefetchResources();
});

// Performance Metrics Tracking
if ('PerformanceObserver' in window) {
    // Track Core Web Vitals
    try {
        const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // Log to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: entry.name,
                        value: Math.round(entry.value)
                    });
                }
            }
        });
        
        po.observe({ type: 'largest-contentful-paint', buffered: true });
        po.observe({ type: 'first-input', buffered: true });
        po.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
        // Silently fail if not supported
    }
}