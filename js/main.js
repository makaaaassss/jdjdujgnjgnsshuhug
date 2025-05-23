/**
 * Main JavaScript file for OnlyFans Directory
 * Initializes the application and handles global functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
      // Add global event listeners
      this.setupEventListeners();
      
      // Update popular tags in footer
      this.updatePopularTags();
    },
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
      // Handle tag clicks in footer
      const popularTags = document.getElementById('popular-tags');
      if (popularTags) {
        popularTags.addEventListener('click', (e) => {
          if (e.target.tagName === 'A' && e.target.hasAttribute('data-tag')) {
            e.preventDefault();
            const tag = e.target.getAttribute('data-tag');
            
            // Redirect to index with tag filter
            window.location.href = `${this.getIndexPath()}?tag=${tag}`;
          }
        });
      }
    },
    
    /**
     * Update popular tags in footer
     */
    updatePopularTags() {
      // Get popular tags container
      const popularTagsContainer = document.getElementById('popular-tags');
      if (!popularTagsContainer || typeof Models === 'undefined') return;
      
      // Get popular tags from Models
      const popularTags = Models.getPopularTags(8);
      
      // Update container if there are tags
      if (popularTags.length > 0) {
        popularTagsContainer.innerHTML = '';
        
        popularTags.forEach(({ tag, count }) => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="#" data-tag="${tag}">${tag} <span class="tag-count">(${count})</span></a>`;
          popularTagsContainer.appendChild(li);
        });
      }
    },
    
    /**
     * Get the path to index.html based on current location
     * @returns {string} Path to index.html
     */
    getIndexPath() {
      // Check if we're in a subdirectory
      if (window.location.pathname.includes('/pages/')) {
        return '../index.html';
      }
      
      return 'index.html';
    },
    
    /**
     * Show a modal with the specified content
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.content - Modal content (HTML)
     * @param {Function} options.onConfirm - Callback for confirm button
     * @param {Function} options.onCancel - Callback for cancel button
     * @param {string} options.confirmText - Text for confirm button
     * @param {string} options.cancelText - Text for cancel button
     * @param {string} options.confirmClass - Class for confirm button
     */
    showModal(options) {
      // Default options
      const defaultOptions = {
        title: 'Confirmation',
        content: '',
        onConfirm: null,
        onCancel: null,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmClass: 'btn-primary'
      };
      
      // Merge options
      const settings = { ...defaultOptions, ...options };
      
      // Check if modal container exists
      let modalContainer = document.querySelector('.modal-container');
      
      // Create modal container if it doesn't exist
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
      }
      
      // Create modal HTML
      modalContainer.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal">
          <div class="modal-header">
            <h3>${settings.title}</h3>
            <button class="modal-close" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            ${settings.content}
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline modal-cancel">${settings.cancelText}</button>
            <button class="btn ${settings.confirmClass} modal-confirm">${settings.confirmText}</button>
          </div>
        </div>
      `;
      
      // Show modal
      modalContainer.classList.add('active');
      
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Set up event listeners
      const closeModal = () => {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove modal after animation
        setTimeout(() => {
          modalContainer.remove();
        }, 300);
      };
      
      // Close button
      const closeBtn = modalContainer.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (settings.onCancel) settings.onCancel();
          closeModal();
        });
      }
      
      // Overlay click
      const overlay = modalContainer.querySelector('.modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => {
          if (settings.onCancel) settings.onCancel();
          closeModal();
        });
      }
      
      // Cancel button
      const cancelBtn = modalContainer.querySelector('.modal-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (settings.onCancel) settings.onCancel();
          closeModal();
        });
      }
      
      // Confirm button
      const confirmBtn = modalContainer.querySelector('.modal-confirm');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (settings.onConfirm) settings.onConfirm();
          closeModal();
        });
      }
      
      // Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          if (settings.onCancel) settings.onCancel();
          closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
    },
    
    /**
     * Show a confirmation modal
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback for confirm button
     * @param {Object} options - Additional options
     */
    confirm(message, onConfirm, options = {}) {
      this.showModal({
        title: options.title || 'Confirmation',
        content: `<p>${message}</p>`,
        onConfirm,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        confirmClass: options.confirmClass || 'btn-primary'
      });
    },
    
    /**
     * Show an alert modal
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    alert(message, options = {}) {
      this.showModal({
        title: options.title || 'Alert',
        content: `<p>${message}</p>`,
        confirmText: options.confirmText || 'OK',
        cancelText: '',
        confirmClass: options.confirmClass || 'btn-primary'
      });
    }
  };
  
  // Initialize the application when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });