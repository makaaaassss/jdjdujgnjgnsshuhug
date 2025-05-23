/**
 * Enhanced Features Module for OnlyFans Directory
 * Adds new features and improvements to the website
 */

const Features = {
    /**
     * Initialize enhanced features
     */
    init() {
      // Add verification badges to models
      this.addVerificationBadges();
      
      // Add featured models highlight
      this.highlightFeaturedModels();
      
      // Add sharing functionality
      this.setupSharing();
      
      // Add image zoom functionality
      this.setupImageZoom();
      
      // Add keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Add quick filter buttons
      this.addQuickFilters();
      
      // Add model comparison feature
      this.setupModelComparison();
      
      // Add recently viewed models
      this.trackRecentlyViewed();
      
      // Add search suggestions
      this.setupSearchSuggestions();
      
      // Add dark mode support for images
      this.setupDarkModeImages();
    },
    
    /**
     * Add verification badges to models
     */
    addVerificationBadges() {
      // Add verification badges to model cards
      document.querySelectorAll('.model-card').forEach(card => {
        // Check if model is verified (random for demo)
        const isVerified = Math.random() > 0.7;
        
        if (isVerified) {
          // Add verified class to card
          card.classList.add('verified');
          
          // Add verification badge
          const badgeContainer = document.createElement('div');
          badgeContainer.className = 'verification-badge';
          badgeContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
          
          // Add to card image
          const cardImage = card.querySelector('.card-image');
          if (cardImage) {
            cardImage.appendChild(badgeContainer);
          }
        }
      });
      
      // Add verification badge to model profile
      const profileNameContainer = document.querySelector('.profile-name-actions');
      if (profileNameContainer) {
        // Check URL parameters for model ID
        const modelId = new URLSearchParams(window.location.search).get('id');
        
        if (modelId) {
          // Get model data (in a real app, this would check the model's data)
          // For demo, use random verification
          const isVerified = modelId.includes('1') || modelId.includes('3') || modelId.includes('5');
          
          if (isVerified) {
            // Add verification badge
            const verificationBadge = document.createElement('div');
            verificationBadge.className = 'profile-verification';
            verificationBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verified Creator';
            
            // Add after profile name
            const profileName = profileNameContainer.querySelector('.profile-name');
            if (profileName) {
              profileName.after(verificationBadge);
            }
          }
        }
      }
    },
    
    /**
     * Highlight featured models
     */
    highlightFeaturedModels() {
      // Highlight featured models (random for demo)
      document.querySelectorAll('.model-card').forEach((card, index) => {
        // Mark some cards as featured (every 5th card)
        if (index % 5 === 0) {
          card.classList.add('featured');
        }
        
        // Mark some cards as new (every 7th card)
        if (index % 7 === 0) {
          card.classList.add('new');
        }
      });
    },
    
    /**
     * Set up sharing functionality
     */
    setupSharing() {
      // Create share button template
      const shareButton = document.createElement('template');
      shareButton.innerHTML = `
        <button class="btn btn-outline btn-sm share-btn" aria-label="Share">
          <i class="fas fa-share-alt"></i>
        </button>
      `;
      
      // Add share buttons to model cards
      document.querySelectorAll('.card-actions').forEach(actions => {
        // Clone share button
        const button = shareButton.content.cloneNode(true).querySelector('button');
        
        // Get model data
        const card = actions.closest('.model-card');
        if (card) {
          const modelName = card.querySelector('.model-name')?.textContent || 'Creator';
          const profileBtn = card.querySelector('.profile-btn');
          const modelUrl = profileBtn?.href || window.location.href;
          
          // Set data attributes
          button.setAttribute('data-name', modelName);
          button.setAttribute('data-url', modelUrl);
          
          // Add click event
          button.addEventListener('click', (e) => {
            e.preventDefault();
            this.shareModel(modelName, modelUrl);
          });
          
          // Add to card actions
          const followBtn = actions.querySelector('.follow-btn');
          if (followBtn) {
            followBtn.before(button);
          } else {
            actions.prepend(button);
          }
        }
      });
      
      // Add share button to model profile
      const profileActions = document.querySelector('.profile-actions');
      if (profileActions) {
        // Clone share button
        const button = shareButton.content.cloneNode(true).querySelector('button');
        button.classList.remove('btn-sm');
        
        // Get model data
        const profileName = document.querySelector('.profile-name')?.textContent || 'Creator';
        const modelUrl = window.location.href;
        
        // Set data attributes
        button.setAttribute('data-name', profileName);
        button.setAttribute('data-url', modelUrl);
        
        // Add click event
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.shareModel(profileName, modelUrl);
        });
        
        // Add to profile actions
        const followBtn = profileActions.querySelector('.follow-btn');
        if (followBtn) {
          followBtn.before(button);
        } else {
          profileActions.prepend(button);
        }
      }
    },
    
    /**
     * Share model information
     * @param {string} modelName - Model name
     * @param {string} modelUrl - Model profile URL
     */
    shareModel(modelName, modelUrl) {
      // Check if Web Share API is supported
      if (navigator.share) {
        navigator.share({
          title: `${modelName} - OnlyFans Directory`,
          text: `Check out ${modelName} on OnlyFans Directory`,
          url: modelUrl
        })
        .then(() => {
          utils.showNotification('Shared successfully', 'success');
        })
        .catch(error => {
          console.error('Error sharing:', error);
          this.showShareModal(modelName, modelUrl);
        });
      } else {
        // Fallback to custom share modal
        this.showShareModal(modelName, modelUrl);
      }
    },
    
    /**
     * Show share modal with copy link option
     * @param {string} modelName - Model name
     * @param {string} modelUrl - Model profile URL
     */
    showShareModal(modelName, modelUrl) {
      // Create modal content
      const shareContent = `
        <div class="share-modal-content">
          <p>Share ${modelName}'s profile:</p>
          <div class="share-options">
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(modelUrl)}&text=${encodeURIComponent(`Check out ${modelName} on OnlyFans Directory`)}" target="_blank" class="share-option twitter">
              <i class="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(modelUrl)}" target="_blank" class="share-option facebook">
              <i class="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://www.reddit.com/submit?url=${encodeURIComponent(modelUrl)}&title=${encodeURIComponent(`${modelName} - OnlyFans Directory`)}" target="_blank" class="share-option reddit">
              <i class="fab fa-reddit"></i> Reddit
            </a>
            <a href="mailto:?subject=${encodeURIComponent(`${modelName} - OnlyFans Directory`)}&body=${encodeURIComponent(`Check out ${modelName} on OnlyFans Directory: ${modelUrl}`)}" class="share-option email">
              <i class="fas fa-envelope"></i> Email
            </a>
          </div>
          <div class="copy-link">
            <input type="text" value="${modelUrl}" readonly>
            <button class="btn btn-primary copy-btn">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
        </div>
      `;
      
      // Show modal
      if (typeof App !== 'undefined' && App.showModal) {
        App.showModal({
          title: 'Share Profile',
          content: shareContent,
          confirmText: 'Close',
          cancelText: ''
        });
        
        // Set up copy button
        setTimeout(() => {
          const copyBtn = document.querySelector('.copy-btn');
          if (copyBtn) {
            copyBtn.addEventListener('click', () => {
              const input = document.querySelector('.copy-link input');
              if (input) {
                input.select();
                document.execCommand('copy');
                utils.showNotification('Link copied to clipboard', 'success');
                
                // Update button text
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                  copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
              }
            });
          }
        }, 100);
      } else {
        // Fallback to simple copy to clipboard
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = modelUrl;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        utils.showNotification('Link copied to clipboard', 'success');
      }
    },
    
    /**
     * Set up image zoom functionality
     */
    setupImageZoom() {
      // Add zoom functionality to profile images
      const profileImage = document.querySelector('.profile-image');
      if (profileImage) {
        profileImage.classList.add('zoomable');
        
        profileImage.addEventListener('click', () => {
          const img = profileImage.querySelector('img');
          if (img) {
            this.openLightbox(img.src);
          }
        });
      }
      
      // Add zoom functionality to gallery images
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.add('zoomable');
        
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          if (img) {
            this.openLightbox(img.src);
          }
        });
      });
    },
    
    /**
     * Open lightbox with image
     * @param {string} src - Image source URL
     */
    openLightbox(src) {
      // Create lightbox element
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <img src="${src}" alt="Zoomed image">
          <button class="lightbox-close" aria-label="Close lightbox">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(lightbox);
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      
      // Add animation class
      setTimeout(() => {
        lightbox.classList.add('show');
      }, 10);
      
      // Set up close functionality
      const closeLightbox = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      };
      
      // Close on button click
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      
      // Close on overlay click
      lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
      
      // Close on ESC key
      document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', closeOnEsc);
        }
      });
    },
    
    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Only if not in input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
          return;
        }
        
        // Ctrl+K: Focus search
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('main-search');
          if (searchInput) {
            searchInput.focus();
          }
        }
        
        // Shift+F: Toggle favorites
        if (e.shiftKey && e.key === 'f') {
          e.preventDefault();
          const favoritesBtn = document.getElementById('favorites-btn');
          if (favoritesBtn) {
            favoritesBtn.click();
          }
        }
        
        // Shift+T: Toggle theme
        if (e.shiftKey && e.key === 't') {
          e.preventDefault();
          const themeToggle = document.getElementById('theme-toggle');
          if (themeToggle) {
            themeToggle.click();
          }
        }
      });
      
      // Add help modal for keyboard shortcuts
      const headerActions = document.querySelector('.header-actions');
      if (headerActions) {
        const helpButton = document.createElement('button');
        helpButton.className = 'keyboard-help-btn';
        helpButton.setAttribute('aria-label', 'Keyboard shortcuts help');
        helpButton.innerHTML = '<i class="fas fa-keyboard"></i>';
        
        helpButton.addEventListener('click', () => {
          this.showKeyboardShortcutsHelp();
        });
        
        headerActions.appendChild(helpButton);
      }
    },
    
    /**
     * Show keyboard shortcuts help modal
     */
    showKeyboardShortcutsHelp() {
      const helpContent = `
        <div class="keyboard-shortcuts-help">
          <div class="shortcut-group">
            <h3>Navigation</h3>
            <div class="shortcut">
              <div class="key-combo">
                <kbd>Ctrl</kbd> + <kbd>K</kbd>
              </div>
              <div class="shortcut-desc">Focus search</div>
            </div>
            <div class="shortcut">
              <div class="key-combo">
                <kbd>Shift</kbd> + <kbd>F</kbd>
              </div>
              <div class="shortcut-desc">Toggle favorites</div>
            </div>
            <div class="shortcut">
              <div class="key-combo">
                <kbd>Shift</kbd> + <kbd>T</kbd>
              </div>
              <div class="shortcut-desc">Toggle dark/light theme</div>
            </div>
          </div>
        </div>
      `;
      
      if (typeof App !== 'undefined' && App.showModal) {
        App.showModal({
          title: 'Keyboard Shortcuts',
          content: helpContent,
          confirmText: 'Close',
          cancelText: ''
        });
      }
    },
    
    /**
     * Add quick filter buttons to the index page
     */
    addQuickFilters() {
      const filterSection = document.querySelector('.filter-section .container');
      if (filterSection) {
        // Create quick filters container
        const quickFilters = document.createElement('div');
        quickFilters.className = 'quick-filters';
        quickFilters.innerHTML = `
          <h3>Quick Filters</h3>
          <div class="quick-filter-buttons">
            <button class="quick-filter-btn" data-filter="price" data-value="0">
              <i class="fas fa-dollar-sign"></i> Free Creators
            </button>
            <button class="quick-filter-btn" data-filter="tag" data-value="fitness">
              <i class="fas fa-dumbbell"></i> Fitness
            </button>
            <button class="quick-filter-btn" data-filter="tag" data-value="gaming">
              <i class="fas fa-gamepad"></i> Gaming
            </button>
            <button class="quick-filter-btn" data-filter="tag" data-value="cosplay">
              <i class="fas fa-mask"></i> Cosplay
            </button>
            <button class="quick-filter-btn" data-filter="rating" data-value="4.5">
              <i class="fas fa-star"></i> Top Rated
            </button>
            <button class="quick-filter-btn" data-filter="new" data-value="true">
              <i class="fas fa-certificate"></i> New Creators
            </button>
          </div>
        `;
        
        // Add to filter section
        filterSection.appendChild(quickFilters);
        
        // Add event listeners
        quickFilters.querySelectorAll('.quick-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            const value = btn.getAttribute('data-value');
            
            // Apply filter
            this.applyQuickFilter(filter, value);
            
            // Toggle active state
            quickFilters.querySelectorAll('.quick-filter-btn').forEach(b => {
              b.classList.remove('active');
            });
            btn.classList.add('active');
          });
        });
      }
    },
    
    /**
     * Apply quick filter to models
     * @param {string} filter - Filter type
     * @param {string} value - Filter value
     */
    applyQuickFilter(filter, value) {
      // In a real implementation, this would update the models listing
      // For demo, just show notification
      utils.showNotification(`Applied filter: ${filter} = ${value}`, 'info');
      
      // Update URL parameters
      const url = new URL(window.location.href);
      url.searchParams.set(filter, value);
      window.history.pushState({}, '', url);
      
      // If Models module is available, apply the filter
      if (typeof Models !== 'undefined') {
        // Reset filters first
        Models.filteredData = [...Models.data];
        
        // Apply the filter
        switch (filter) {
          case 'price':
            Models.filteredData = Models.filteredData.filter(model => model.price === parseInt(value));
            break;
          case 'tag':
            Models.filteredData = Models.filteredData.filter(model => model.tags && model.tags.includes(value));
            break;
          case 'rating':
            Models.filteredData = Models.filteredData.filter(model => (model.rating || 0) >= parseFloat(value));
            break;
          case 'new':
            // Sort by created date and get newest 10
            Models.filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            Models.filteredData = Models.filteredData.slice(0, 10);
            break;
        }
        
        // Reset page and display models
        Models.currentPage = 1;
        Models.displayModels();
      }
    },
    
    /**
     * Set up model comparison feature
     */
    setupModelComparison() {
      // Create comparison button template
      const compareButton = document.createElement('template');
      compareButton.innerHTML = `
        <button class="btn btn-outline btn-sm compare-btn" aria-label="Compare">
          <i class="fas fa-balance-scale"></i>
        </button>
      `;
      
      // Add compare buttons to model cards
      document.querySelectorAll('.card-actions').forEach(actions => {
        // Clone compare button
        const button = compareButton.content.cloneNode(true).querySelector('button');
        
        // Get model data
        const card = actions.closest('.model-card');
        if (card) {
          const modelId = card.querySelector('.favorite-btn')?.getAttribute('data-id');
          
          if (modelId) {
            // Set data attribute
            button.setAttribute('data-id', modelId);
            
            // Add click event
            button.addEventListener('click', (e) => {
              e.preventDefault();
              this.toggleModelForComparison(modelId, button);
            });
            
            // Add to card actions
            actions.prepend(button);
          }
        }
      });
      
      // Create comparison bar
      const comparisonBar = document.createElement('div');
      comparisonBar.className = 'comparison-bar hidden';
      comparisonBar.innerHTML = `
        <div class="comparison-bar-content">
          <div class="comparison-title">
            <i class="fas fa-balance-scale"></i>
            <span>Comparing <span class="comparison-count">0</span> creators</span>
          </div>
          <div class="comparison-items"></div>
          <div class="comparison-actions">
            <button class="btn btn-primary btn-sm compare-now-btn" disabled>
              <i class="fas fa-columns"></i> Compare
            </button>
            <button class="btn btn-outline btn-sm clear-comparison-btn">
              <i class="fas fa-times"></i> Clear
            </button>
          </div>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(comparisonBar);
      
      // Set up comparison bar events
      const compareNowBtn = comparisonBar.querySelector('.compare-now-btn');
      if (compareNowBtn) {
        compareNowBtn.addEventListener('click', () => {
          this.showModelComparison();
        });
      }
      
      const clearComparisonBtn = comparisonBar.querySelector('.clear-comparison-btn');
      if (clearComparisonBtn) {
        clearComparisonBtn.addEventListener('click', () => {
          this.clearModelComparison();
        });
      }
    },
    
    /**
     * Toggle model for comparison
     * @param {string} modelId - Model ID
     * @param {HTMLElement} button - Compare button element
     */
    toggleModelForComparison(modelId, button) {
      // Get comparison data from localStorage
      const comparisonData = this.getComparisonData();
      
      // Check if model is already in comparison
      const modelIndex = comparisonData.indexOf(modelId);
      
      if (modelIndex === -1) {
        // Check if reached max models (4)
        if (comparisonData.length >= 4) {
          utils.showNotification('You can compare up to 4 creators at once', 'error');
          return;
        }
        
        // Add model to comparison
        comparisonData.push(modelId);
        
        // Update button state
        button.classList.add('active');
      } else {
        // Remove model from comparison
        comparisonData.splice(modelIndex, 1);
        
        // Update button state
        button.classList.remove('active');
      }
      
      // Save comparison data
      this.saveComparisonData(comparisonData);
      
      // Update comparison bar
      this.updateComparisonBar();
    },
    
    /**
     * Get comparison data from localStorage
     * @returns {Array} Array of model IDs
     */
    getComparisonData() {
      const data = localStorage.getItem('of_directory_comparison');
      return data ? JSON.parse(data) : [];
    },
    
    /**
     * Save comparison data to localStorage
     * @param {Array} data - Array of model IDs
     */
    saveComparisonData(data) {
      localStorage.setItem('of_directory_comparison', JSON.stringify(data));
    },
    
    /**
     * Update comparison bar
     */
    updateComparisonBar() {
      const comparisonData = this.getComparisonData();
      const comparisonBar = document.querySelector('.comparison-bar');
      
      if (!comparisonBar) return;
      
      // Update count
      const countElement = comparisonBar.querySelector('.comparison-count');
      if (countElement) {
        countElement.textContent = comparisonData.length;
      }
      
      // Update items
      const itemsContainer = comparisonBar.querySelector('.comparison-items');
      if (itemsContainer) {
        itemsContainer.innerHTML = '';
        
        // Add items
        comparisonData.forEach(modelId => {
          // Get model data
          const model = this.getModelById(modelId);
          
          if (model) {
            const item = document.createElement('div');
            item.className = 'comparison-item';
            item.innerHTML = `
              <div class="comparison-item-image">
                <img src="${model.profileImage}" alt="${model.name}">
              </div>
              <div class="comparison-item-name">${model.name}</div>
              <button class="comparison-item-remove" data-id="${model.id}">
                <i class="fas fa-times"></i>
              </button>
            `;
            
            // Add remove event
            const removeBtn = item.querySelector('.comparison-item-remove');
            if (removeBtn) {
              removeBtn.addEventListener('click', () => {
                this.removeModelFromComparison(model.id);
              });
            }
            
            itemsContainer.appendChild(item);
          }
        });
      }
      
      // Update compare button state
      const compareNowBtn = comparisonBar.querySelector('.compare-now-btn');
      if (compareNowBtn) {
        compareNowBtn.disabled = comparisonData.length < 2;
      }
      
      // Show/hide comparison bar
      if (comparisonData.length > 0) {
        comparisonBar.classList.remove('hidden');
      } else {
        comparisonBar.classList.add('hidden');
      }
      
      // Update all compare buttons on the page
      document.querySelectorAll('.compare-btn').forEach(btn => {
        const btnModelId = btn.getAttribute('data-id');
        
        if (btnModelId && comparisonData.includes(btnModelId)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },
    
    /**
     * Get model by ID
     * @param {string} modelId - Model ID
     * @returns {Object|null} Model data or null if not found
     */
    getModelById(modelId) {
      if (typeof Models !== 'undefined' && Models.getModelById) {
        return Models.getModelById(modelId);
      }
      
      // Fallback: Create dummy model data
      return {
        id: modelId,
        name: `Creator ${modelId}`,
        profileImage: `https://picsum.photos/200?random=${modelId}`,
        price: Math.floor(Math.random() * 30) + 5,
        likes: Math.floor(Math.random() * 50000) + 1000,
        mediaCount: Math.floor(Math.random() * 500) + 50,
        rating: (Math.random() * 2) + 3
      };
    },
    
    /**
     * Remove model from comparison
     * @param {string} modelId - Model ID
     */
    removeModelFromComparison(modelId) {
      // Get comparison data
      const comparisonData = this.getComparisonData();
      
      // Remove model
      const modelIndex = comparisonData.indexOf(modelId);
      if (modelIndex !== -1) {
        comparisonData.splice(modelIndex, 1);
      }
      
      // Save comparison data
      this.saveComparisonData(comparisonData);
      
      // Update comparison bar
      this.updateComparisonBar();
    },
    
    /**
     * Clear model comparison
     */
    clearModelComparison() {
      // Clear comparison data
      this.saveComparisonData([]);
      
      // Update comparison bar
      this.updateComparisonBar();
    },
    
    /**
     * Show model comparison
     */
    showModelComparison() {
      // Get comparison data
      const comparisonData = this.getComparisonData();
      
      if (comparisonData.length < 2) {
        utils.showNotification('Select at least 2 creators to compare', 'error');
        return;
      }
      
      // Get model data
      const models = comparisonData.map(modelId => this.getModelById(modelId)).filter(Boolean);
      
      // Create comparison table
      let comparisonTable = `
        <div class="comparison-table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Attribute</th>
                ${models.map(model => `<th>${model.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Profile</td>
                ${models.map(model => `
                  <td>
                    <div class="comparison-profile">
                      <img src="${model.profileImage}" alt="${model.name}">
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td>Price</td>
                ${models.map(model => `
                  <td>${utils.formatCurrency(model.price)}</td>
                `).join('')}
              </tr>
              <tr>
                <td>Likes</td>
                ${models.map(model => `
                  <td>${utils.formatNumber(model.likes)}</td>
                `).join('')}
              </tr>
              <tr>
                <td>Media Count</td>
                ${models.map(model => `
                  <td>${utils.formatNumber(model.mediaCount || 0)}</td>
                `).join('')}
              </tr>
              <tr>
                <td>Rating</td>
                ${models.map(model => `
                  <td>
                    <div class="stars-container">
                      ${utils.createRatingStars(model.rating || 0)}
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td>Tags</td>
                ${models.map(model => `
                  <td>
                    <div class="comparison-tags">
                      ${model.tags ? model.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : 'N/A'}
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td>Actions</td>
                ${models.map(model => `
                  <td>
                    <div class="comparison-actions">
                      <a href="${model.onlyfansUrl || '#'}" class="btn btn-primary btn-sm" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Follow
                      </a>
                      <a href="pages/model.html?id=${model.id}" class="btn btn-outline btn-sm">
                        <i class="fas fa-user"></i> Profile
                      </a>
                    </div>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;
      
      // Show modal with comparison table
      if (typeof App !== 'undefined' && App.showModal) {
        App.showModal({
          title: 'Creator Comparison',
          content: comparisonTable,
          confirmText: 'Close',
          cancelText: '',
          confirmClass: 'btn-primary'
        });
      }
    },
    
    /**
     * Track recently viewed models
     */
    trackRecentlyViewed() {
      // Check if we're on a model page
      const modelId = new URLSearchParams(window.location.search).get('id');
      
      if (modelId) {
        // Get recently viewed models from localStorage
        const recentlyViewed = this.getRecentlyViewed();
        
        // Check if model is already in recently viewed
        const modelIndex = recentlyViewed.indexOf(modelId);
        
        if (modelIndex !== -1) {
          // Remove model from current position
          recentlyViewed.splice(modelIndex, 1);
        }
        
        // Add model to the beginning
        recentlyViewed.unshift(modelId);
        
        // Keep only the 10 most recent
        if (recentlyViewed.length > 10) {
          recentlyViewed.pop();
        }
        
        // Save to localStorage
        this.saveRecentlyViewed(recentlyViewed);
      }
      
      // Add recently viewed section to index page
      const modelsSection = document.querySelector('.models-section .container');
      if (modelsSection && window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        // Get recently viewed models
        const recentlyViewed = this.getRecentlyViewed();
        
        // Only show if there are recently viewed models
        if (recentlyViewed.length > 0) {
          // Create recently viewed section
          const recentlyViewedSection = document.createElement('div');
          recentlyViewedSection.className = 'recently-viewed-section';
          recentlyViewedSection.innerHTML = `
            <h2>Recently Viewed</h2>
            <div class="recently-viewed-grid"></div>
          `;
          
          // Add to page
          modelsSection.prepend(recentlyViewedSection);
          
          // Populate recently viewed grid
          const recentlyViewedGrid = recentlyViewedSection.querySelector('.recently-viewed-grid');
          if (recentlyViewedGrid && typeof Models !== 'undefined') {
            // Get model data for recently viewed
            const recentModels = recentlyViewed
              .map(id => Models.getModelById(id))
              .filter(Boolean);
            
            // Get template
            const template = document.getElementById('similar-model-card-template');
            if (template && recentModels.length > 0) {
              // Add models to grid
              recentModels.forEach(model => {
                // Clone template
                const card = template.content.cloneNode(true);
                
                // Set image
                const image = card.querySelector('.card-image img');
                if (image) {
                  image.src = model.profileImage;
                  image.alt = model.name;
                }
                
                // Set name
                const name = card.querySelector('.model-name');
                if (name) {
                  name.textContent = model.name;
                }
                
                // Set price
                const price = card.querySelector('.model-price');
                if (price) {
                  price.textContent = utils.formatCurrency(model.price);
                }
                
                // Set profile link
                const profileBtn = card.querySelector('.profile-btn');
                if (profileBtn) {
                  profileBtn.href = `pages/model.html?id=${model.id}`;
                }
                
                recentlyViewedGrid.appendChild(card);
              });
            }
          }
        }
      }
    },
    
    /**
     * Get recently viewed models from localStorage
     * @returns {Array} Array of model IDs
     */
    getRecentlyViewed() {
      const data = localStorage.getItem('of_directory_recently_viewed');
      return data ? JSON.parse(data) : [];
    },
    
    /**
     * Save recently viewed models to localStorage
     * @param {Array} data - Array of model IDs
     */
    saveRecentlyViewed(data) {
      localStorage.setItem('of_directory_recently_viewed', JSON.stringify(data));
    },
    
    /**
     * Set up search suggestions
     */
    setupSearchSuggestions() {
      const searchInput = document.getElementById('main-search');
      if (!searchInput) return;
      
      // Create suggestions container
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'search-suggestions';
      suggestionsContainer.innerHTML = `
        <div class="search-suggestions-content"></div>
      `;
      
      // Add to page
      document.body.appendChild(suggestionsContainer);
      
      // Set up event listeners
      searchInput.addEventListener('input', utils.debounce(() => {
        const query = searchInput.value.trim();
        
        if (query.length >= 2) {
          this.showSearchSuggestions(query, suggestionsContainer);
        } else {
          this.hideSearchSuggestions(suggestionsContainer);
        }
      }, 300));
      
      // Hide suggestions on blur
      searchInput.addEventListener('blur', () => {
        setTimeout(() => {
          this.hideSearchSuggestions(suggestionsContainer);
        }, 200);
      });
      
      // Show suggestions on focus
      searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim();
        
        if (query.length >= 2) {
          this.showSearchSuggestions(query, suggestionsContainer);
        }
      });
    },
    
    /**
     * Show search suggestions
     * @param {string} query - Search query
     * @param {HTMLElement} container - Suggestions container
     */
    showSearchSuggestions(query, container) {
      // Get content container
      const content = container.querySelector('.search-suggestions-content');
      if (!content) return;
      
      // Get suggestions
      let suggestions = [];
      
      if (typeof Models !== 'undefined' && Models.searchModels) {
        // Get models matching query
        suggestions = Models.searchModels(query).slice(0, 5);
      }
      
      // Get popular tags matching query
      const matchingTags = this.getTagSuggestions(query, 3);
      
      // Check if we have any suggestions
      if (suggestions.length === 0 && matchingTags.length === 0) {
        this.hideSearchSuggestions(container);
        return;
      }
      
      // Create suggestions HTML
      let suggestionsHtml = '';
      
      // Add tag suggestions
      if (matchingTags.length > 0) {
        suggestionsHtml += `
          <div class="suggestions-group">
            <div class="suggestions-group-title">Popular Tags</div>
            <div class="tag-suggestions">
              ${matchingTags.map(tag => `
                <a href="index.html?tag=${tag}" class="tag-suggestion">
                  <i class="fas fa-tag"></i> ${tag}
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      // Add model suggestions
      if (suggestions.length > 0) {
        suggestionsHtml += `
          <div class="suggestions-group">
            <div class="suggestions-group-title">Creators</div>
            <div class="model-suggestions">
              ${suggestions.map(model => `
                <a href="pages/model.html?id=${model.id}" class="model-suggestion">
                  <div class="model-suggestion-image">
                    <img src="${model.profileImage}" alt="${model.name}">
                  </div>
                  <div class="model-suggestion-info">
                    <div class="model-suggestion-name">${model.name}</div>
                    <div class="model-suggestion-price">${utils.formatCurrency(model.price)}</div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      // Add view all results link
      suggestionsHtml += `
        <div class="suggestions-footer">
          <a href="pages/search.html?q=${encodeURIComponent(query)}" class="view-all-results">
            <i class="fas fa-search"></i> View all results for "${query}"
          </a>
        </div>
      `;
      
      // Update content
      content.innerHTML = suggestionsHtml;
      
      // Position container
      const inputRect = searchInput.getBoundingClientRect();
      container.style.top = `${inputRect.bottom + window.scrollY}px`;
      container.style.left = `${inputRect.left + window.scrollX}px`;
      container.style.width = `${inputRect.width}px`;
      
      // Show container
      container.classList.add('show');
    },
    
    /**
     * Hide search suggestions
     * @param {HTMLElement} container - Suggestions container
     */
    hideSearchSuggestions(container) {
      container.classList.remove('show');
    },
    
    /**
     * Get tag suggestions matching query
     * @param {string} query - Search query
     * @param {number} limit - Maximum number of suggestions
     * @returns {Array} Array of matching tags
     */
    getTagSuggestions(query, limit = 3) {
      // Available tags
      const availableTags = [
        'fitness', 'model', 'cosplay', 'gaming', 'asmr', 'dance',
        'cooking', 'art', 'music', 'travel', 'beauty', 'fashion'
      ];
      
      // Filter tags matching query
      return availableTags
        .filter(tag => tag.includes(query.toLowerCase()))
        .slice(0, limit);
    },
    
    /**
     * Set up dark mode support for images
     */
    setupDarkModeImages() {
      // Apply filter to images in dark mode
      document.addEventListener('themeChanged', (e) => {
        const theme = e.detail.theme;
        
        // Get all images except logos
        const images = document.querySelectorAll('img:not(.logo img)');
        
        if (theme === 'dark') {
          // Apply dark mode filter
          images.forEach(img => {
            img.style.filter = 'brightness(0.9) contrast(1.1)';
          });
        } else {
          // Remove filter
          images.forEach(img => {
            img.style.filter = '';
          });
        }
      });
    }
  };
  
  // Initialize enhanced features
  document.addEventListener('DOMContentLoaded', () => {
    Features.init();
  });
  
  // Add styles for new features
  const featureStyles = document.createElement('style');
  featureStyles.textContent = `
    /* Quick Filters */
    .quick-filters {
      margin-top: var(--spacing-md);
      border-top: 1px solid var(--color-border-light);
      padding-top: var(--spacing-md);
    }
    
    :root[data-theme="dark"] .quick-filters {
      border-color: var(--color-border-medium);
    }
    
    .quick-filters h3 {
      font-size: var(--font-size-md);
      margin-bottom: var(--spacing-sm);
    }
    
    .quick-filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }
    
    .quick-filter-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-surface-1);
      border: 1px solid var(--color-border-light);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-foreground);
      cursor: pointer;
      transition: all var(--transition-normal);
    }
    
    .quick-filter-btn:hover {
      background-color: var(--color-surface-3);
      transform: translateY(-2px);
    }
    
    .quick-filter-btn.active {
      background-color: var(--color-accent-100);
      color: var(--color-accent-700);
      border-color: var(--color-accent-300);
    }
    
    :root[data-theme="dark"] .quick-filter-btn {
      background-color: var(--color-neutral-200);
      border-color: var(--color-neutral-300);
    }
    
    :root[data-theme="dark"] .quick-filter-btn:hover {
      background-color: var(--color-neutral-300);
    }
    
    :root[data-theme="dark"] .quick-filter-btn.active {
      background-color: var(--color-accent-200);
      color: var(--color-accent-800);
      border-color: var(--color-accent-400);
      box-shadow: var(--neon-glow-small);
    }
    
    /* Keyboard Shortcuts Help */
    .keyboard-help-btn {
      background: none;
      border: none;
      color: var(--color-neutral-600);
      font-size: var(--font-size-lg);
      cursor: pointer;
      padding: var(--spacing-xs);
      transition: color var(--transition-fast);
    }
    
    .keyboard-help-btn:hover {
      color: var(--color-primary-600);
    }
    
    .keyboard-shortcuts-help {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .shortcut-group {
      margin-bottom: var(--spacing-md);
    }
    
    .shortcut-group h3 {
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-md);
      border-bottom: 1px solid var(--color-border-light);
      padding-bottom: var(--spacing-xs);
    }
    
    .shortcut {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
    }
    
    .key-combo {
      display: flex;
      gap: var(--spacing-xs);
      align-items: center;
    }
    
    .key-combo kbd {
      background-color: var(--color-surface-3);
      border: 1px solid var(--color-border-medium);
      border-radius: var(--border-radius-sm);
      padding: 2px 6px;
      font-size: var(--font-size-xs);
      color: var(--color-foreground);
      box-shadow: 0 2px 0 var(--color-border-medium);
    }
    
    .shortcut-desc {
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
    }
    
    /* Comparison Bar */
    .comparison-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--color-surface-1);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: var(--z-index-fixed);
      transform: translateY(100%);
      transition: transform var(--transition-normal);
      border-top: 1px solid var(--color-border-light);
    }
    
    .comparison-bar.hidden {
      display: none;
    }
    
    .comparison-bar:not(.hidden) {
      transform: translateY(0);
    }
    
    .comparison-bar-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      max-width: var(--container-xl);
      margin: 0 auto;
    }
    
    .comparison-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
    }
    
    .comparison-items {
      display: flex;
      gap: var(--spacing-md);
      flex: 1;
      overflow-x: auto;
      padding: var(--spacing-xs) 0;
    }
    
    .comparison-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background-color: var(--color-surface-2);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      border: 1px solid var(--color-border-light);
    }
    
    .comparison-item-image {
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius-full);
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .comparison-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .comparison-item-name {
      font-size: var(--font-size-sm);
      white-space: nowrap;
    }
    
    .comparison-item-remove {
      background: none;
      border: none;
      color: var(--color-neutral-500);
      cursor: pointer;
      padding: 2px;
      font-size: var(--font-size-xs);
      transition: color var(--transition-fast);
    }
    
    .comparison-item-remove:hover {
      color: var(--color-error);
    }
    
    .comparison-actions {
      display: flex;
      gap: var(--spacing-sm);
      white-space: nowrap;
    }
    
    /* Dark theme comparison bar */
    :root[data-theme="dark"] .comparison-bar {
      background-color: var(--color-neutral-100);
      border-color: var(--color-neutral-300);
      box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
    }
    
    :root[data-theme="dark"] .comparison-item {
      background-color: var(--color-neutral-200);
      border-color: var(--color-neutral-300);
    }
    
    /* Comparison Table */
    .comparison-table-container {
      max-width: 100%;
      overflow-x: auto;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }
    
    .comparison-table th,
    .comparison-table td {
      padding: var(--spacing-sm);
      text-align: center;
      border: 1px solid var(--color-border-light);
    }
    
    .comparison-table th {
      background-color: var(--color-surface-2);
      font-weight: var(--font-weight-semibold);
    }
    
    .comparison-table th:first-child,
    .comparison-table td:first-child {
      text-align: left;
      font-weight: var(--font-weight-medium);
      background-color: var(--color-surface-2);
    }
    
    .comparison-profile {
      width: 64px;
      height: 64px;
      border-radius: var(--border-radius-full);
      overflow: hidden;
      margin: 0 auto;
    }
    
    .comparison-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .comparison-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-xs);
    }
    
    .comparison-tags .tag {
      margin: 0;
      font-size: 10px;
      padding: 2px 6px;
    }
    
    .comparison-table .comparison-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    
    .comparison-table .comparison-actions .btn {
      font-size: var(--font-size-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
    }
    
    /* Dark theme comparison table */
    :root[data-theme="dark"] .comparison-table th,
    :root[data-theme="dark"] .comparison-table td {
      border-color: var(--color-neutral-300);
    }
    
    :root[data-theme="dark"] .comparison-table th,
    :root[data-theme="dark"] .comparison-table td:first-child {
      background-color: var(--color-neutral-200);
    }
    
    /* Search Suggestions */
    .search-suggestions {
      position: absolute;
      background-color: var(--color-surface-1);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-index-dropdown);
      border: 1px solid var(--color-border-light);
      max-height: 400px;
      overflow-y: auto;
      display: none;
    }
    
    .search-suggestions.show {
      display: block;
    }
    
    .suggestions-group {
      padding: var(--spacing-sm);
      border-bottom: 1px solid var(--color-border-light);
    }
    
    .suggestions-group:last-child {
      border-bottom: none;
    }
    
    .suggestions-group-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--color-neutral-600);
      margin-bottom: var(--spacing-xs);
    }
    
    .tag-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }
    
    .tag-suggestion {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-neutral-100);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-xs);
      color: var(--color-neutral-700);
      transition: all var(--transition-fast);
    }
    
    .tag-suggestion:hover {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-900);
    }
    
    .model-suggestions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    
    .model-suggestion {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      transition: background-color var(--transition-fast);
    }
    
    .model-suggestion:hover {
      background-color: var(--color-neutral-100);
    }
    
    .model-suggestion-image {
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius-full);
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .model-suggestion-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .model-suggestion-info {
      flex: 1;
    }
    
    .model-suggestion-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-foreground);
    }
    
    .model-suggestion-price {
      font-size: var(--font-size-xs);
      color: var(--color-accent-600);
    }
    
    .suggestions-footer {
      padding: var(--spacing-sm);
      border-top: 1px solid var(--color-border-light);
      text-align: center;
    }
    
    .view-all-results {
      font-size: var(--font-size-sm);
      color: var(--color-primary-600);
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
    }
    
    .view-all-results:hover {
      text-decoration: underline;
    }
    
    /* Dark theme search suggestions */
    :root[data-theme="dark"] .search-suggestions {
      background-color: var(--color-neutral-100);
      border-color: var(--color-neutral-300);
      box-shadow: var(--neon-glow-medium);
    }
    
    :root[data-theme="dark"] .suggestions-group,
    :root[data-theme="dark"] .suggestions-footer {
      border-color: var(--color-neutral-300);
    }
    
    :root[data-theme="dark"] .tag-suggestion {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-800);
    }
    
    :root[data-theme="dark"] .tag-suggestion:hover {
      background-color: var(--color-neutral-300);
      color: var(--color-neutral-900);
    }
    
    :root[data-theme="dark"] .model-suggestion:hover {
      background-color: var(--color-neutral-200);
    }
    
    /* Share Modal */
    .share-modal-content {
      text-align: center;
    }
    
    .share-options {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
      margin: var(--spacing-md) 0;
    }
    
    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-foreground);
      transition: transform var(--transition-fast);
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-md);
    }
    
    .share-option:hover {
      transform: translateY(-3px);
      background-color: var(--color-neutral-100);
    }
    
    .share-option i {
      font-size: var(--font-size-xl);
    }
    
    .share-option.twitter i {
      color: #1DA1F2;
    }
    
    .share-option.facebook i {
      color: #4267B2;
    }
    
    .share-option.reddit i {
      color: #FF4500;
    }
    
    .share-option.email i {
      color: var(--color-neutral-500);
    }
    
    .copy-link {
      display: flex;
      margin-top: var(--spacing-md);
      gap: var(--spacing-xs);
    }
    
    .copy-link input {
      flex: 1;
      font-size: var(--font-size-sm);
    }
    
    /* Lightbox */
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: var(--z-index-modal);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-normal);
    }
    
    .lightbox.show {
      opacity: 1;
    }
    
    .lightbox-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
    }
    
    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      z-index: 1;
    }
    
    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: var(--border-radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: var(--font-size-2xl);
      cursor: pointer;
      transition: transform var(--transition-fast);
    }
    
    .lightbox-close:hover {
      transform: scale(1.1);
    }
    
    /* Recently Viewed Section */
    .recently-viewed-section {
      margin-bottom: var(--spacing-2xl);
    }
    
    .recently-viewed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .quick-filter-buttons {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: var(--spacing-xs);
        -webkit-overflow-scrolling: touch;
      }
      
      .comparison-bar-content {
        flex-wrap: wrap;
        padding: var(--spacing-sm);
      }
      
      .comparison-title {
        width: 100%;
        margin-bottom: var(--spacing-sm);
      }
      
      .comparison-items {
        order: 3;
        width: 100%;
      }
      
      .comparison-actions {
        order: 2;
      }
      
      .share-options {
        flex-wrap: wrap;
      }
      
      .recently-viewed-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }
    }
    
    @media (max-width: 480px) {
      .comparison-bar-content {
        gap: var(--spacing-sm);
      }
      
      .lightbox-content img {
        max-height: 80vh;
      }
    }
  `;
  document.head.appendChild(featureStyles);