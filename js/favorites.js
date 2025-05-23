/**
 * Favorites functionality for OnlyFans Directory
 * Uses local storage to save and manage favorite models
 */

const Favorites = {
    // Local storage key
    STORAGE_KEY: 'of_directory_favorites',
    
    // Max number of favorites
    MAX_FAVORITES: 100,
    
    /**
     * Initialize favorites functionality
     */
    init() {
      // Get favorites button
      this.favoritesBtn = document.getElementById('favorites-btn');
      this.favoritesCountBadge = document.getElementById('favorites-count');
      this.footerFavoritesBtn = document.getElementById('footer-favorites');
      
      // Update favorites count
      this.updateFavoritesCount();
      
      // Set up event listeners
      this.setupEventListeners();
    },
    
    /**
     * Set up event listeners for favorite functionality
     */
    setupEventListeners() {
      // Add event listener to favorites buttons
      if (this.favoritesBtn) {
        this.favoritesBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showFavorites();
        });
      }
      
      if (this.footerFavoritesBtn) {
        this.footerFavoritesBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showFavorites();
        });
      }
      
      // Set up event delegation for favorite buttons on cards
      document.addEventListener('click', (e) => {
        // Check if click was on a favorite button
        if (e.target.closest('.favorite-btn')) {
          const favoriteBtn = e.target.closest('.favorite-btn');
          const modelId = favoriteBtn.getAttribute('data-id');
          
          if (modelId) {
            this.toggleFavorite(modelId, favoriteBtn);
          }
        }
      });
    },
    
    /**
     * Get favorites from local storage
     * @returns {Array} Array of favorite model IDs
     */
    getFavorites() {
      const favorites = localStorage.getItem(this.STORAGE_KEY);
      return favorites ? JSON.parse(favorites) : [];
    },
    
    /**
     * Save favorites to local storage
     * @param {Array} favorites - Array of favorite model IDs
     */
    saveFavorites(favorites) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      this.updateFavoritesCount();
    },
    
    /**
     * Check if a model is in favorites
     * @param {string} modelId - Model ID to check
     * @returns {boolean} Is in favorites
     */
    isFavorite(modelId) {
      const favorites = this.getFavorites();
      return favorites.includes(modelId);
    },
    
    /**
     * Add a model to favorites
     * @param {string} modelId - Model ID to add
     */
    addFavorite(modelId) {
      const favorites = this.getFavorites();
      
      // Check if already in favorites
      if (favorites.includes(modelId)) return;
      
      // Check if reached max favorites
      if (favorites.length >= this.MAX_FAVORITES) {
        utils.showNotification(`You can only have ${this.MAX_FAVORITES} favorites. Please remove some before adding more.`, 'error');
        return;
      }
      
      // Add to favorites
      favorites.push(modelId);
      this.saveFavorites(favorites);
      
      // Show notification
      utils.showNotification('Added to favorites', 'success');
    },
    
    /**
     * Remove a model from favorites
     * @param {string} modelId - Model ID to remove
     */
    removeFavorite(modelId) {
      const favorites = this.getFavorites();
      
      // Filter out model ID
      const updatedFavorites = favorites.filter(id => id !== modelId);
      
      // Save updated favorites
      this.saveFavorites(updatedFavorites);
      
      // Show notification
      utils.showNotification('Removed from favorites', 'info');
    },
    
    /**
     * Toggle favorite status for a model
     * @param {string} modelId - Model ID to toggle
     * @param {HTMLElement} buttonElement - Button element that was clicked
     */
    toggleFavorite(modelId, buttonElement) {
      // Check if already in favorites
      if (this.isFavorite(modelId)) {
        // Remove from favorites
        this.removeFavorite(modelId);
        
        // Update button
        if (buttonElement) {
          buttonElement.classList.remove('active');
          
          // Update icon
          const icon = buttonElement.querySelector('i');
          if (icon) {
            icon.className = 'far fa-heart';
          }
          
          // Update text if present
          const text = buttonElement.querySelector('span');
          if (text) {
            text.textContent = 'Add to Favorites';
          }
        }
      } else {
        // Add to favorites
        this.addFavorite(modelId);
        
        // Update button
        if (buttonElement) {
          buttonElement.classList.add('active');
          
          // Update icon
          const icon = buttonElement.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-heart';
          }
          
          // Update text if present
          const text = buttonElement.querySelector('span');
          if (text) {
            text.textContent = 'Remove from Favorites';
          }
        }
      }
    },
    
    /**
     * Update all favorite buttons on the page
     */
    updateFavoriteButtons() {
      // Get all favorite buttons
      const favoriteButtons = document.querySelectorAll('.favorite-btn[data-id]');
      
      // Update each button
      favoriteButtons.forEach(button => {
        const modelId = button.getAttribute('data-id');
        
        if (this.isFavorite(modelId)) {
          button.classList.add('active');
          
          // Update icon
          const icon = button.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-heart';
          }
          
          // Update text if present
          const text = button.querySelector('span');
          if (text) {
            text.textContent = 'Remove from Favorites';
          }
        } else {
          button.classList.remove('active');
          
          // Update icon
          const icon = button.querySelector('i');
          if (icon) {
            icon.className = 'far fa-heart';
          }
          
          // Update text if present
          const text = button.querySelector('span');
          if (text) {
            text.textContent = 'Add to Favorites';
          }
        }
      });
    },
    
    /**
     * Update favorites count badge
     */
    updateFavoritesCount() {
      // Get favorites count
      const count = this.getFavorites().length;
      
      // Update badge
      if (this.favoritesCountBadge) {
        this.favoritesCountBadge.textContent = count;
        
        // Show/hide badge
        if (count > 0) {
          this.favoritesCountBadge.style.display = 'flex';
        } else {
          this.favoritesCountBadge.style.display = 'none';
        }
      }
    },
    
    /**
     * Show favorites page or modal
     */
    showFavorites() {
      // Get favorites
      const favorites = this.getFavorites();
      
      // Check if there are any favorites
      if (favorites.length === 0) {
        utils.showNotification('You have no favorites yet', 'info');
        return;
      }
      
      // For now, just navigate to the index page with a favorites filter
      // In a future version, this could show a modal or a dedicated favorites page
      window.location.href = 'index.html?filter=favorites';
    }
  };
  
  // Initialize favorites functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    Favorites.init();
  });