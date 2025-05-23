/**
 * Performance Optimization Module for OnlyFans Directory
 * Implements code splitting, lazy loading, and other performance enhancements
 */

const Performance = {
    /**
     * Initialize performance optimizations
     */
    init() {
      // Implement lazy loading for images
      this.setupLazyLoading();
      
      // Implement code splitting via dynamic imports
      this.setupCodeSplitting();
      
      // Optimize animations for performance
      this.optimizeAnimations();
      
      // Set up resource hints for faster loading
      this.setupResourceHints();
      
      // Monitor performance metrics
      this.monitorPerformance();
    },
    
    /**
     * Set up lazy loading for images
     */
    setupLazyLoading() {
      // Check if the browser supports native lazy loading
      if ('loading' in HTMLImageElement.prototype) {
        // Use native lazy loading
        document.querySelectorAll('img[data-src]').forEach(img => {
          img.src = img.dataset.src;
          img.loading = 'lazy';
          img.removeAttribute('data-src');
        });
      } else {
        // Use Intersection Observer for browsers that don't support native lazy loading
        this.setupIntersectionObserver();
      }
      
      // Set up lazy loading for new elements added dynamically
      this.observeDynamicContent();
    },
    
    /**
     * Set up Intersection Observer for lazy loading
     */
    setupIntersectionObserver() {
      // Create Intersection Observer
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
      
      // Store observer for future use
      this.imageObserver = imageObserver;
    },
    
    /**
     * Observe dynamic content for lazy loading
     */
    observeDynamicContent() {
      // Create a mutation observer to detect when new images are added to the DOM
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              // Check if node is an element
              if (node.nodeType === 1) {
                // Check if node is an image with data-src
                if (node.tagName === 'IMG' && node.hasAttribute('data-src')) {
                  if ('loading' in HTMLImageElement.prototype) {
                    node.src = node.dataset.src;
                    node.loading = 'lazy';
                    node.removeAttribute('data-src');
                  } else if (this.imageObserver) {
                    this.imageObserver.observe(node);
                  }
                }
                
                // Check child nodes
                if (node.querySelectorAll) {
                  node.querySelectorAll('img[data-src]').forEach(img => {
                    if ('loading' in HTMLImageElement.prototype) {
                      img.src = img.dataset.src;
                      img.loading = 'lazy';
                      img.removeAttribute('data-src');
                    } else if (this.imageObserver) {
                      this.imageObserver.observe(img);
                    }
                  });
                }
              }
            });
          }
        });
      });
      
      // Start observing the document
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Store observer for future use
      this.mutationObserver = mutationObserver;
    },
    
    /**
     * Set up code splitting via dynamic imports
     */
    setupCodeSplitting() {
      // Determine the current page
      const currentPath = window.location.pathname;
      
      // Load only the necessary JavaScript modules based on the current page
      if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        // Main page - Models grid, etc.
        this.loadModule('./js/models.js');
        this.loadModule('./js/search.js');
      } else if (currentPath.includes('model.html')) {
        // Individual model page
        this.loadModule('./js/model-page.js');
      } else if (currentPath.includes('search.html')) {
        // Advanced search page
        this.loadModule('./js/search-page.js');
      } else if (currentPath.includes('add-model.html')) {
        // Add model page
        this.loadModule('./js/add-model.js');
      }
      
      // Common modules loaded everywhere
      this.loadModule('./js/theme.js');
      this.loadModule('./js/utils.js');
      this.loadModule('./js/favorites.js');
      this.loadModule('./js/auth.js');
    },
    
    /**
     * Load a JavaScript module dynamically
     * @param {string} src - Module source path
     * @returns {Promise} Promise that resolves when the module is loaded
     */
    loadModule(src) {
      return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        
        // Create script element
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.type = 'module';
        
        // Add event listeners
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load module: ${src}`));
        
        // Add to document
        document.head.appendChild(script);
      });
    },
    
    /**
     * Optimize animations for performance
     */
    optimizeAnimations() {
      // Check if the browser supports the Intersection Observer API
      if ('IntersectionObserver' in window) {
        // Create an observer for animated elements
        const animationObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            // Only animate elements when they are visible
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
            } else {
              // Optionally remove animation when not visible to save resources
              // entry.target.classList.remove('animate');
            }
          });
        }, {
          rootMargin: '0px',
          threshold: 0.1
        });
        
        // Observe all elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          animationObserver.observe(el);
        });
        
        // Store observer for future use
        this.animationObserver = animationObserver;
      }
      
      // Request animation frame for smoother animations
      this.setupRafAnimations();
    },
    
    /**
     * Set up requestAnimationFrame for smoother animations
     */
    setupRafAnimations() {
      // Throttle scroll and resize events
      let ticking = false;
      
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            // Update animations based on scroll position
            this.updateScrollAnimations();
            ticking = false;
          });
          ticking = true;
        }
      });
      
      // Initial update
      this.updateScrollAnimations();
    },
    
    /**
     * Update animations based on scroll position
     */
    updateScrollAnimations() {
      // Calculate scroll position
      const scrollY = window.scrollY;
      
      // Parallax effect for hero section
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
      
      // Fade in effect for cards
      document.querySelectorAll('.model-card').forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight * 0.8) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    },
    
    /**
     * Set up resource hints for faster loading
     */
    setupResourceHints() {
      // Preconnect to external domains
      this.addResourceHint('preconnect', 'https://cdnjs.cloudflare.com');
      this.addResourceHint('preconnect', 'https://fonts.googleapis.com');
      this.addResourceHint('preconnect', 'https://fonts.gstatic.com', 'crossorigin');
      
      // Prefetch popular pages
      this.addResourceHint('prefetch', './pages/search.html');
      
      // DNS prefetch for commonly used domains
      this.addResourceHint('dns-prefetch', 'https://onlyfans.com');
    },
    
    /**
     * Add a resource hint to the document
     * @param {string} rel - Relation type (preconnect, prefetch, etc.)
     * @param {string} href - URL to hint
     * @param {string} crossorigin - Crossorigin attribute value
     */
    addResourceHint(rel, href, crossorigin = null) {
      // Check if the hint already exists
      if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
        return;
      }
      
      // Create link element
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      
      if (crossorigin) {
        link.crossOrigin = crossorigin;
      }
      
      // Add to document head
      document.head.appendChild(link);
    },
    
    /**
     * Monitor performance metrics
     */
    monitorPerformance() {
      // Check if Performance API is available
      if (!window.performance || !window.performance.getEntriesByType) {
        return;
      }
      
      // Log navigation timing metrics
      this.logNavigationTiming();
      
      // Set up performance observer for ongoing monitoring
      this.setupPerformanceObserver();
    },
    
    /**
     * Log navigation timing metrics
     */
    logNavigationTiming() {
      // Wait for window load event
      window.addEventListener('load', () => {
        // Get navigation timing entries
        const perfEntries = performance.getEntriesByType('navigation');
        
        if (perfEntries && perfEntries.length > 0) {
          const navigationTiming = perfEntries[0];
          
          // Calculate key metrics
          const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
          const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
          const firstPaint = performance.getEntriesByName('first-paint');
          
          // Log metrics
          console.info('Performance Metrics:');
          console.info(`- Page Load Time: ${pageLoadTime.toFixed(2)}ms`);
          console.info(`- DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
          
          if (firstPaint && firstPaint.length > 0) {
            console.info(`- First Paint: ${firstPaint[0].startTime.toFixed(2)}ms`);
          }
        }
      });
    },
    
    /**
     * Set up performance observer for ongoing monitoring
     */
    setupPerformanceObserver() {
      // Check if PerformanceObserver API is available
      if (!window.PerformanceObserver) {
        return;
      }
      
      // Create observer for long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.warn(`Long Task detected: ${entry.duration.toFixed(2)}ms`);
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        
        // Store observer for future use
        this.longTaskObserver = longTaskObserver;
      } catch (error) {
        console.warn('Long Task observer not supported', error);
      }
      
      // Create observer for resource timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Only log slow resources (> 1 second)
            if (entry.duration > 1000) {
              console.warn(`Slow resource load: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        
        // Store observer for future use
        this.resourceObserver = resourceObserver;
      } catch (error) {
        console.warn('Resource observer not supported', error);
      }
    }
  };
  
  // Initialize performance optimizations
  Performance.init();