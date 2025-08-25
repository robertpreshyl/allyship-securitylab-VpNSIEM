(function initCounters(){
  const els = document.querySelectorAll('[data-counter] .metric-number');
  if (!els.length) return;

  const animate = (el)=>{
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals')||'0',10);
    const suffix = el.getAttribute('data-suffix')||'';
    const duration = 1200;
    const start = performance.now();
    const startVal = 0;
    const formatter = new Intl.NumberFormat(undefined, {maximumFractionDigits:decimals});
    const compactFormatter = new Intl.NumberFormat(undefined, {notation:'compact', maximumFractionDigits:1});
    function tick(now){
      const t = Math.min(1, (now - start)/duration);
      const eased = t<0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOut
      let val = startVal + (target - startVal) * eased;
      if (decimals>0) val = parseFloat(val.toFixed(decimals));
      el.textContent = formatter.format(val) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else {
        const useCompact = target >= 1000000 && el.getAttribute('data-compact') !== 'false';
        el.textContent = (useCompact ? compactFormatter.format(target) : formatter.format(target)) + suffix;
      }
    }
    requestAnimationFrame(tick);
  };
  const isInViewport = (el)=>{
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight * 0.9) && r.bottom > 0;
  };

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if (e.isIntersecting){
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.35, rootMargin: '0px 0px -10% 0px'});
    els.forEach(el=>io.observe(el));
  } else {
    // Fallback: animate when visible on scroll/resize, and once after load
    const check = ()=>{
      els.forEach(el=>{ if (isInViewport(el)) animate(el); });
    };
    check();
    window.addEventListener('scroll', check, {passive:true});
    window.addEventListener('resize', check);
    setTimeout(check, 800);
  }
})();

// Enhance keyboard navigation for top nav
(function initNavA11y(){
  const nav = document.querySelector('.nav-menu');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('.nav-link'));
  nav.addEventListener('keydown', (e)=>{
    const current = document.activeElement;
    const idx = links.indexOf(current);
    if (idx === -1) return;
    if (e.key === 'ArrowRight'){
      e.preventDefault();
      links[(idx+1)%links.length].focus();
    } else if (e.key === 'ArrowLeft'){
      e.preventDefault();
      links[(idx-1+links.length)%links.length].focus();
    }
  });
})();
// Enhanced Theme Management
class ThemeManager {
    constructor() {
        const stored = localStorage.getItem('theme');
        if (stored) {
            this.theme = stored;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
        this.addSystemThemeDetection();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        // Inform UA for built-in form control theming
        document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button state
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add transition effect
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    addSystemThemeDetection() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Enhanced Smooth Scrolling with Intersection Observer
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupProgressIndicator();
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('section, .feature-card, .metric-card, .spec-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Enhanced Mobile Menu Management
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.bindEvents();
        this.addTouchGestures();
    }

    createMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // Clone the navigation menu for mobile
        const mobileMenu = navMenu.cloneNode(true);
        mobileMenu.classList.add('mobile-menu');
        mobileMenu.classList.remove('nav-menu');
        
        // Insert after navbar
        const navbar = document.querySelector('.navbar');
        navbar.parentNode.insertBefore(mobileMenu, navbar.nextSibling);

        // Add mobile menu styles
        this.addMobileMenuStyles();
    }

    addMobileMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu {
                display: none;
                position: fixed;
                top: 4.5rem;
                left: 0;
                right: 0;
                background: var(--surface);
                border-bottom: 1px solid var(--border);
                padding: 2rem;
                z-index: 999;
                flex-direction: column;
                gap: 1.5rem;
                box-shadow: var(--shadow-xl);
                backdrop-filter: blur(20px);
                transform: translateY(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .mobile-menu.active {
                display: flex;
                transform: translateY(0);
            }
            
            .mobile-menu .nav-link {
                padding: 1rem;
                border-radius: 0.75rem;
                transition: var(--transition);
                font-size: 1.125rem;
                font-weight: 600;
                text-align: center;
            }
            
            .mobile-menu .nav-link:hover {
                background: var(--surface-elevated);
                color: var(--accent-color);
            }
            
            @media (min-width: 769px) {
                .mobile-menu {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => this.toggle());
            
            // Close menu when clicking on links
            const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    this.close();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    addTouchGestures() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu) return;

        let startY = 0;
        let currentY = 0;

        mobileMenu.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        mobileMenu.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            if (diff > 50) { // Swipe up to close
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenuBtn) {
            this.isOpen = true;
            mobileMenu.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenuBtn) {
            this.isOpen = false;
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Enhanced Navbar Observer with Parallax Effect
class NavbarObserver {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.navbar.classList.remove('scrolled');
                    } else {
                        this.navbar.classList.add('scrolled');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            observer.observe(hero);
        }

        // Add scrolled style
        this.addScrolledStyles();
        this.addParallaxEffect();
    }

    addScrolledStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .navbar.scrolled {
                background: rgba(2, 6, 23, 0.98);
                backdrop-filter: blur(25px);
                box-shadow: var(--shadow-lg);
            }
            
            [data-theme="light"] .navbar.scrolled {
                background: rgba(248, 250, 252, 0.98);
            }
        `;
        document.head.appendChild(style);
    }

    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero::before');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
}

// Enhanced Analytics and Performance Monitoring
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackClicks();
        this.trackScrollDepth();
        this.trackPerformance();
        this.trackUserEngagement();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`🚀 Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track Core Web Vitals
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.entryType === 'largest-contentful-paint') {
                                console.log(`📊 LCP: ${entry.startTime.toFixed(2)}ms`);
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    console.log('PerformanceObserver not supported');
                }
            }
        });
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link, .cta-link')) {
                const element = e.target;
                const action = element.textContent.trim();
                const href = element.href || 'N/A';
                console.log(`🖱️ Clicked: ${action} -> ${href}`);
            }
        });
    }

    trackScrollDepth() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id || 'unknown';
                        console.log(`👁️ Viewed section: ${sectionId}`);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => observer.observe(section));
    }

    trackPerformance() {
        // Monitor for performance issues
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) {
                        console.log(`⚠️ Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    trackUserEngagement() {
        let timeOnPage = 0;
        const interval = setInterval(() => {
            timeOnPage += 10;
            if (timeOnPage % 30 === 0) { // Log every 30 seconds
                console.log(`⏱️ Time on page: ${timeOnPage}s`);
            }
        }, 10000);

        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            console.log(`👋 User spent ${timeOnPage}s on page`);
        });
    }
}

// Enhanced Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.addServiceWorker();
        this.optimizeAnimations();
        this.addResourceHints();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    preloadCriticalResources() {
        // Preload dashboard and registration pages
        const criticalLinks = [
            'https://asl.allyshipglobal.com/ui/login/loginname',
            'https://asl.allyshipglobal.com/ui/login/userselection'
        ];

        criticalLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
    }

    addResourceHints() {
        // DNS prefetch for external domains
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = '//fonts.googleapis.com';
        document.head.appendChild(dnsPrefetch);
    }
}

// Enhanced Accessibility Features
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLink();
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
        this.addFocusManagement();
        this.addScreenReaderSupport();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Add styles for skip link
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--accent-color);
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                transition: top 0.3s;
                font-weight: 600;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Improve focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu on Escape
                const mobileMenu = document.querySelector('.mobile-menu.active');
                if (mobileMenu) {
                    const mobileMenuInstance = new MobileMenu();
                    mobileMenuInstance.close();
                }
            }

            // Tab navigation improvements
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    addAriaLabels() {
        // Add aria-labels to interactive elements without text
        const interactiveElements = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
        interactiveElements.forEach(element => {
            if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
                const role = element.getAttribute('role') || element.tagName.toLowerCase();
                element.setAttribute('aria-label', `${role} button`);
            }
        });
    }

    addFocusManagement() {
        // Ensure focus is visible for keyboard users
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation .btn:focus,
            .keyboard-navigation .nav-link:focus,
            .keyboard-navigation .theme-btn:focus {
                outline: 3px solid var(--accent-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    addScreenReaderSupport() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
    }
}

// Enhanced Error Handling and Fallbacks
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        this.handleUncaughtErrors();
        this.addFallbacks();
        this.addOfflineSupport();
    }

    handleUncaughtErrors() {
        window.addEventListener('error', (e) => {
            console.error('🚨 JavaScript error:', e.error);
            this.showUserFriendlyError('A technical issue occurred. Please refresh the page.');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 Unhandled promise rejection:', e.reason);
            this.showUserFriendlyError('A network issue occurred. Please check your connection.');
        });
    }

    showUserFriendlyError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 300px;
            font-weight: 600;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    addFallbacks() {
        // CSS Grid fallback
        if (!CSS.supports('display', 'grid')) {
            document.documentElement.classList.add('no-grid');
            
            const style = document.createElement('style');
            style.textContent = `
                .no-grid .features-grid,
                .no-grid .metrics-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .no-grid .feature-card,
                .no-grid .metric-card {
                    flex: 1 1 300px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addOfflineSupport() {
        window.addEventListener('online', () => {
            console.log('🌐 Back online');
        });

        window.addEventListener('offline', () => {
            console.log('📡 You are offline');
            this.showUserFriendlyError('You are currently offline. Some features may not work.');
        });
    }
}

// Enhanced User Experience Features
class UserExperience {
    constructor() {
        this.init();
    }

    init() {
        this.addLoadingStates();
        this.addHoverEffects();
        this.addScrollEffects();
        this.addMicroInteractions();
    }

    addLoadingStates() {
        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.href && btn.href.includes('asl.allyshipglobal.com')) {
                    btn.innerHTML = '<span class="loading-spinner"></span> Loading...';
                    btn.style.pointerEvents = 'none';
                }
            });
        });

        // Add loading spinner styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    addHoverEffects() {
        // Enhanced hover effects for interactive elements
        document.querySelectorAll('.feature-card, .metric-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addScrollEffects() {
        // Parallax scrolling effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    addMicroInteractions() {
        // Add subtle animations for better UX
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new ThemeManager();
    new SmoothScroll();
    new MobileMenu();
    new NavbarObserver();
    
    // Performance and analytics
    new PerformanceOptimizer();
    new Analytics();
    
    // Accessibility
    new AccessibilityEnhancer();
    
    // Error handling
    new ErrorHandler();
    
    // User experience
    new UserExperience();
    
    // Add main content id for skip link
    const hero = document.querySelector('.hero');
    if (hero && !hero.id) {
        hero.id = 'main-content';
    }

    // Add loading animation
    document.body.classList.add('loaded');
});

// Export for potential external use
window.NetBirdLab = {
    ThemeManager,
    SmoothScroll,
    MobileMenu,
    NavbarObserver,
    Analytics,
    PerformanceOptimizer,
    AccessibilityEnhancer,
    ErrorHandler,
    UserExperience
};
