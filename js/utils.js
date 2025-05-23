/**
 * Utility functions for OnlyFans Directory
 */

const utils = {
    /**
     * Format currency with $ symbol
     * @param {number} price - The price to format
     * @returns {string} Formatted price string
     */
    formatCurrency: (price) => {
      if (price === 0) return 'Free';
      return `$${price.toFixed(2)}`;
    },
    
    /**
     * Format number with commas for thousands
     * @param {number} num - The number to format
     * @returns {string} Formatted number string
     */
    formatNumber: (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Generate a random ID
     * @param {number} length - Length of the ID
     * @returns {string} Random ID
     */
    generateId: (length = 10) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    
    /**
     * Get query parameter from URL
     * @param {string} param - Parameter name
     * @returns {string} Parameter value
     */
    getQueryParam: (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },
    
    /**
     * Set query parameters in URL without reloading the page
     * @param {Object} params - Parameters to set
     */
    setQueryParams: (params) => {
      const url = new URL(window.location);
      
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === '') {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value);
        }
      }
      
      window.history.pushState({}, '', url);
    },
    
    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Time to wait in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: (func, wait = 300) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    /**
     * Show notification toast
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: (message, type = 'success', duration = 3000) => {
      const toast = document.getElementById('notification-toast');
      const messageElement = document.getElementById('notification-message');
      
      if (!toast || !messageElement) return;
      
      // Set icon based on type
      const iconElement = toast.querySelector('i');
      if (iconElement) {
        iconElement.className = '';
        switch (type) {
          case 'success':
            iconElement.className = 'fas fa-check-circle';
            iconElement.style.color = 'var(--color-success)';
            break;
          case 'error':
            iconElement.className = 'fas fa-exclamation-circle';
            iconElement.style.color = 'var(--color-error)';
            break;
          case 'info':
            iconElement.className = 'fas fa-info-circle';
            iconElement.style.color = 'var(--color-info)';
            break;
          default:
            iconElement.className = 'fas fa-check-circle';
            iconElement.style.color = 'var(--color-success)';
        }
      }
      
      // Set message
      messageElement.textContent = message;
      
      // Show notification
      toast.classList.remove('hidden');
      toast.classList.add('slide-in');
      
      // Hide notification after duration
      setTimeout(() => {
        toast.classList.remove('slide-in');
        toast.classList.add('slide-out');
        
        // Hide and reset after animation completes
        setTimeout(() => {
          toast.classList.add('hidden');
          toast.classList.remove('slide-out');
        }, 300);
      }, duration);
    },
    
    /**
     * Truncate text to a certain length and add ellipsis
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @returns {string} Truncated text
     */
    truncateText: (text, length = 100) => {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    
    /**
     * Create rating stars HTML
     * @param {number} rating - Rating value (0-5)
     * @returns {string} HTML for rating stars
     */
    createRatingStars: (rating) => {
      let starsHtml = '';
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      
      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
      }
      
      // Add half star if needed
      if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
      }
      
      // Add empty stars
      for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
      }
      
      return starsHtml;
    },
    
    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Is valid URL
     */
    isValidUrl: (url) => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    isValidEmail: (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    
    /**
     * Convert string to slug format (lowercase, dash-separated)
     * @param {string} text - Text to convert
     * @returns {string} Slug
     */
    stringToSlug: (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    },
    
    /**
     * Convert bytes to human-readable format
     * @param {number} bytes - Bytes to convert
     * @returns {string} Human-readable size
     */
    formatBytes: (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    /**
     * Get current year for copyright notices
     * @returns {number} Current year
     */
    getCurrentYear: () => {
      return new Date().getFullYear();
    },
    
    /**
     * Get file extension from filename
     * @param {string} filename - Filename
     * @returns {string} File extension
     */
    getFileExtension: (filename) => {
      return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    },
    
    /**
     * Parse URL to get base domain
     * @param {string} url - URL to parse
     * @returns {string} Domain name
     */
    getDomainFromUrl: (url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
      } catch (e) {
        return '';
      }
    },
    
    /**
     * Check if an element is in viewport
     * @param {HTMLElement} el - Element to check
     * @returns {boolean} Is in viewport
     */
    isInViewport: (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    
    /**
     * Scroll to element smoothly
     * @param {HTMLElement|string} element - Element or selector
     */
    scrollToElement: (element) => {
      const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
      
      if (!targetElement) return;
      
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  // Initialize all current year placeholders
  document.addEventListener('DOMContentLoaded', () => {
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach(el => {
      el.textContent = utils.getCurrentYear();
    });
  });