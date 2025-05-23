/**
 * Model Page JavaScript for OnlyFans Directory
 * Handles displaying individual model profiles
 */

const ModelPage = {
    /**
     * Initialize the model page
     */
    async init() {
      // Get model ID from URL
      this.modelId = utils.getQueryParam('id');
      
      // Check if model ID is provided
      if (!this.modelId) {
        this.showError('Model ID is missing');
        return;
      }
      
      // Get DOM elements
      this.modelProfileContainer = document.getElementById('model-profile');
      this.similarModelsGrid = document.getElementById('similar-models-grid');
      
      // Wait for Models to initialize
      if (typeof Models === 'undefined') {
        this.showError('Models data is not available');
        return;
      }
      
      // Load model data when Models is ready
      this.checkModelsReady();
    },
    
    /**
     * Check if Models is ready and load model data
     */
    checkModelsReady() {
      if (Models.data && Models.data.length > 0) {
        // Models is ready, load model data
        this.loadModelData();
      } else {
        // Wait and try again
        setTimeout(() => this.checkModelsReady(), 100);
      }
    },
    
    /**
     * Load model data and display profile
     */
    loadModelData() {
      // Get model data
      const model = Models.getModelById(this.modelId);
      
      // Check if model exists
      if (!model) {
        this.showError('Model not found');
        return;
      }
      
      // Display model profile
      this.displayModelProfile(model);
      
      // Display similar models
      this.displaySimilarModels(model);
      
      // Update page title
      document.title = `${model.name} - OnlyFans Directory`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `View ${model.name}'s OnlyFans profile, subscription price, content, and more.`);
      }
    },
    
    /**
     * Display model profile
     * @param {Object} model - Model data
     */
    displayModelProfile(model) {
      if (!this.modelProfileContainer) return;
      
      // Get template
      const template = document.getElementById('model-profile-template');
      if (!template) return;
      
      // Clone template
      const profileElement = template.content.cloneNode(true);
      
      // Set profile image
      const profileImage = profileElement.querySelector('.profile-image img');
      if (profileImage) {
        profileImage.src = model.profileImage;
        profileImage.alt = model.name;
      }
      
      // Set name
      const profileName = profileElement.querySelector('.profile-name');
      if (profileName) {
        profileName.textContent = model.name;
      }
      
      // Set favorite button
      const favoriteBtn = profileElement.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.setAttribute('data-id', model.id);
        
        // Check if already favorited
        if (typeof Favorites !== 'undefined' && Favorites.isFavorite(model.id)) {
          favoriteBtn.classList.add('active');
          const icon = favoriteBtn.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-heart';
          }
          
          const text = favoriteBtn.querySelector('span');
          if (text) {
            text.textContent = 'Remove from Favorites';
          }
        }
      }
      
      // Set follow button
      const followBtn = profileElement.querySelector('.follow-btn');
      if (followBtn) {
        followBtn.href = model.onlyfansUrl;
      }
      
      // Set price
      const priceElem = profileElement.querySelector('.stat-value.price');
      if (priceElem) {
        priceElem.textContent = utils.formatCurrency(model.price);
      }
      
      // Set likes
      const likesElem = profileElement.querySelector('.stat-value.likes');
      if (likesElem) {
        likesElem.textContent = utils.formatNumber(model.likes);
      }
      
      // Set media count
      const mediaElem = profileElement.querySelector('.stat-value.media-count');
      if (mediaElem) {
        mediaElem.textContent = utils.formatNumber(model.mediaCount || 0);
      }
      
      // Set rating
      const ratingElem = profileElement.querySelector('.stat-value.rating');
      if (ratingElem) {
        const rating = model.rating || 0;
        ratingElem.innerHTML = utils.createRatingStars(rating);
      }
      
      // Set tags
      const tagsContainer = profileElement.querySelector('.profile-tags');
      if (tagsContainer && model.tags) {
        model.tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'tag';
          tagElement.textContent = tag;
          tagsContainer.appendChild(tagElement);
        });
      }
      
      // Set location
      const locationElem = profileElement.querySelector('.location');
      if (locationElem) {
        locationElem.textContent = model.location || 'Not specified';
      }
      
      // Set description
      const descriptionElem = profileElement.querySelector('.description-text');
      if (descriptionElem) {
        descriptionElem.textContent = model.description || '';
      }
      
      // Set social media links
      const socialLinksContainer = profileElement.querySelector('.social-links');
      if (socialLinksContainer && model.socialMedia) {
        // Clear existing links
        socialLinksContainer.innerHTML = '';
        
        // Add Instagram
        if (model.socialMedia.instagram) {
          const link = document.createElement('a');
          link.href = `https://instagram.com/${model.socialMedia.instagram}`;
          link.target = '_blank';
          link.innerHTML = `
            <i class="fab fa-instagram"></i>
            <span>Instagram: @${model.socialMedia.instagram}</span>
          `;
          socialLinksContainer.appendChild(link);
        }
        
        // Add Twitter
        if (model.socialMedia.twitter) {
          const link = document.createElement('a');
          link.href = `https://twitter.com/${model.socialMedia.twitter}`;
          link.target = '_blank';
          link.innerHTML = `
            <i class="fab fa-twitter"></i>
            <span>Twitter: @${model.socialMedia.twitter}</span>
          `;
          socialLinksContainer.appendChild(link);
        }
        
        // Add TikTok
        if (model.socialMedia.tiktok) {
          const link = document.createElement('a');
          link.href = `https://tiktok.com/@${model.socialMedia.tiktok}`;
          link.target = '_blank';
          link.innerHTML = `
            <i class="fab fa-tiktok"></i>
            <span>TikTok: @${model.socialMedia.tiktok}</span>
          `;
          socialLinksContainer.appendChild(link);
        }
        
        // Add Website
        if (model.socialMedia.website) {
          const link = document.createElement('a');
          link.href = model.socialMedia.website;
          link.target = '_blank';
          link.innerHTML = `
            <i class="fas fa-globe"></i>
            <span>Website: ${utils.getDomainFromUrl(model.socialMedia.website)}</span>
          `;
          socialLinksContainer.appendChild(link);
        }
        
        // Add "No social media" message if no links
        if (socialLinksContainer.children.length === 0) {
          const message = document.createElement('p');
          message.className = 'no-social-media';
          message.textContent = 'No social media links available';
          socialLinksContainer.appendChild(message);
        }
      }
      
      // Clear loading indicator
      this.modelProfileContainer.innerHTML = '';
      
      // Add profile to container
      this.modelProfileContainer.appendChild(profileElement);
      
      // Update favorite buttons
      if (typeof Favorites !== 'undefined') {
        Favorites.updateFavoriteButtons();
      }
    },
    
    /**
     * Display similar models
     * @param {Object} model - Current model data
     */
    displaySimilarModels(model) {
      if (!this.similarModelsGrid) return;
      
      // Get similar models
      const similarModels = Models.getSimilarModels(model.id, 4);
      
      // Check if there are similar models
      if (similarModels.length === 0) {
        this.similarModelsGrid.innerHTML = '<p class="no-results">No similar creators found</p>';
        return;
      }
      
      // Get template
      const template = document.getElementById('similar-model-card-template');
      if (!template) return;
      
      // Clear grid
      this.similarModelsGrid.innerHTML = '';
      
      // Create and append similar model cards
      similarModels.forEach(similarModel => {
        // Clone template
        const card = template.content.cloneNode(true);
        
        // Set image
        const image = card.querySelector('.card-image img');
        if (image) {
          image.src = similarModel.profileImage;
          image.alt = similarModel.name;
        }
        
        // Set name
        const name = card.querySelector('.model-name');
        if (name) {
          name.textContent = similarModel.name;
        }
        
        // Set price
        const price = card.querySelector('.model-price');
        if (price) {
          price.textContent = utils.formatCurrency(similarModel.price);
        }
        
        // Set profile link
        const profileBtn = card.querySelector('.profile-btn');
        if (profileBtn) {
          profileBtn.href = `model.html?id=${similarModel.id}`;
        }
        
        this.similarModelsGrid.appendChild(card);
      });
    },
    
    /**
     * Show error message in profile container
     * @param {string} message - Error message
     */
    showError(message) {
      if (!this.modelProfileContainer) return;
      
      this.modelProfileContainer.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Error</h2>
          <p>${message}</p>
          <a href="../index.html" class="btn btn-primary">
            <i class="fas fa-home"></i> Return to Homepage
          </a>
        </div>
      `;
    }
  };
  
  // Initialize model page when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    ModelPage.init();
  });