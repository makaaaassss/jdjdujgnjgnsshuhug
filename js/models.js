/**
 * Models functionality for OnlyFans Directory
 * Handles fetching, filtering, and displaying model data
 */

const Models = {
    // Data storage
    data: [],
    filteredData: [],
    
    // Pagination settings
    currentPage: 1,
    itemsPerPage: 12,
    
    // Local storage key for models data
    STORAGE_KEY: 'of_directory_models',
    
    // Dummy data flag (remove in production)
    USE_DUMMY_DATA: true,
    
    /**
     * Initialize models functionality
     */
    async init() {
      try {
        // Load models data
        await this.loadModels();
        
        // Check if we are on the index page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
          // Initialize index page
          this.initIndexPage();
        }
      } catch (error) {
        console.error('Error initializing models:', error);
        utils.showNotification('Failed to load models data', 'error');
      }
    },
    
    /**
     * Load models data from local storage or API
     */
    async loadModels() {
      // Try to get from local storage first
      const storedModels = localStorage.getItem(this.STORAGE_KEY);
      
      if (storedModels) {
        this.data = JSON.parse(storedModels);
        this.filteredData = [...this.data];
        return;
      }
      
      // If no stored data, try to load from API or use dummy data
      if (this.USE_DUMMY_DATA) {
        // Load dummy data
        this.data = this.generateDummyData();
        this.filteredData = [...this.data];
        
        // Save to local storage
        this.saveModels();
      } else {
        // In a real implementation, you would fetch from an API here
        try {
          const response = await fetch('assets/data/models.json');
          this.data = await response.json();
          this.filteredData = [...this.data];
          
          // Save to local storage
          this.saveModels();
        } catch (error) {
          console.error('Error fetching models data:', error);
          utils.showNotification('Failed to fetch models data', 'error');
          
          // Use empty array if fetch fails
          this.data = [];
          this.filteredData = [];
        }
      }
    },
    
    /**
     * Save models data to local storage
     */
    saveModels() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    },
    
    /**
     * Initialize index page
     */
    initIndexPage() {
      // Get DOM elements
      this.modelsGrid = document.getElementById('models-grid');
      this.resultsCount = document.getElementById('results-count');
      this.currentPageElem = document.getElementById('current-page');
      this.totalPagesElem = document.getElementById('total-pages');
      this.currentPageBottomElem = document.getElementById('current-page-bottom');
      this.totalPagesBottomElem = document.getElementById('total-pages-bottom');
      this.prevPageBtn = document.getElementById('prev-page');
      this.nextPageBtn = document.getElementById('next-page');
      this.prevPageBottomBtn = document.getElementById('prev-page-bottom');
      this.nextPageBottomBtn = document.getElementById('next-page-bottom');
      
      // Get filter elements
      this.sortSelect = document.getElementById('sort-select');
      this.filterTags = document.getElementById('filter-tags');
      this.priceSlider = document.getElementById('price-slider');
      this.priceValue = document.getElementById('price-value');
      
      // Set up event listeners
      this.setupIndexEventListeners();
      
      // Check for URL parameters
      this.applyUrlFilters();
      
      // Display models
      this.displayModels();
    },
    
    /**
     * Set up event listeners for index page
     */
    setupIndexEventListeners() {
      // Sort select
      if (this.sortSelect) {
        this.sortSelect.addEventListener('change', () => {
          this.sortModels(this.sortSelect.value);
          this.currentPage = 1;
          this.displayModels();
          utils.setQueryParams({ sort: this.sortSelect.value, page: 1 });
        });
      }
      
      // Filter tags
      if (this.filterTags) {
        this.filterTags.addEventListener('click', (e) => {
          if (e.target.classList.contains('tag')) {
            // Remove active class from all tags
            this.filterTags.querySelectorAll('.tag').forEach(tag => {
              tag.classList.remove('active');
            });
            
            // Add active class to clicked tag
            e.target.classList.add('active');
            
            // Apply tag filter
            const tag = e.target.getAttribute('data-tag');
            this.filterByTag(tag);
            this.currentPage = 1;
            this.displayModels();
            utils.setQueryParams({ tag, page: 1 });
          }
        });
      }
      
      // Price slider
      if (this.priceSlider && this.priceValue) {
        this.priceSlider.addEventListener('input', () => {
          const value = parseInt(this.priceSlider.value);
          this.priceValue.textContent = value === 50 ? '$50+' : `$${value}`;
        });
        
        this.priceSlider.addEventListener('change', () => {
          const value = parseInt(this.priceSlider.value);
          this.filterByPrice(value);
          this.currentPage = 1;
          this.displayModels();
          utils.setQueryParams({ price: value, page: 1 });
        });
      }
      
      // Pagination
      if (this.prevPageBtn) {
        this.prevPageBtn.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.displayModels();
            utils.setQueryParams({ page: this.currentPage });
            utils.scrollToElement('main');
          }
        });
      }
      
      if (this.nextPageBtn) {
        this.nextPageBtn.addEventListener('click', () => {
          if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            this.displayModels();
            utils.setQueryParams({ page: this.currentPage });
            utils.scrollToElement('main');
          }
        });
      }
      
      if (this.prevPageBottomBtn) {
        this.prevPageBottomBtn.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.displayModels();
            utils.setQueryParams({ page: this.currentPage });
            utils.scrollToElement('main');
          }
        });
      }
      
      if (this.nextPageBottomBtn) {
        this.nextPageBottomBtn.addEventListener('click', () => {
          if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            this.displayModels();
            utils.setQueryParams({ page: this.currentPage });
            utils.scrollToElement('main');
          }
        });
      }
    },
    
    /**
     * Apply filters from URL parameters
     */
    applyUrlFilters() {
      // Get URL parameters
      const sort = utils.getQueryParam('sort');
      const tag = utils.getQueryParam('tag');
      const price = utils.getQueryParam('price');
      const page = utils.getQueryParam('page');
      const filter = utils.getQueryParam('filter');
      
      // Apply sort
      if (sort && this.sortSelect) {
        this.sortSelect.value = sort;
        this.sortModels(sort);
      }
      
      // Apply tag filter
      if (tag && this.filterTags) {
        const tagElement = this.filterTags.querySelector(`[data-tag="${tag}"]`);
        if (tagElement) {
          // Remove active class from all tags
          this.filterTags.querySelectorAll('.tag').forEach(tag => {
            tag.classList.remove('active');
          });
          
          // Add active class to selected tag
          tagElement.classList.add('active');
          
          // Apply filter
          this.filterByTag(tag);
        }
      }
      
      // Apply price filter
      if (price && this.priceSlider && this.priceValue) {
        const priceValue = parseInt(price);
        this.priceSlider.value = priceValue;
        this.priceValue.textContent = priceValue === 50 ? '$50+' : `$${priceValue}`;
        this.filterByPrice(priceValue);
      }
      
      // Apply special filters
      if (filter === 'favorites') {
        this.filterByFavorites();
      }
      
      // Apply page
      if (page) {
        this.currentPage = parseInt(page);
      }
    },
    
    /**
     * Sort models by specified criteria
     * @param {string} sortBy - Sort criteria
     */
    sortModels(sortBy) {
      switch (sortBy) {
        case 'newest':
          this.filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          this.filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'a-z':
          this.filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'z-a':
          this.filteredData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-low':
          this.filteredData.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          this.filteredData.sort((a, b) => b.price - a.price);
          break;
        case 'popularity':
          this.filteredData.sort((a, b) => b.likes - a.likes);
          break;
        default:
          // Default to newest
          this.filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    
    /**
     * Filter models by tag
     * @param {string} tag - Tag to filter by
     */
    filterByTag(tag) {
      if (tag === 'all') {
        // Reset filter
        this.filteredData = [...this.data];
      } else {
        // Filter by tag
        this.filteredData = this.data.filter(model => 
          model.tags && model.tags.includes(tag)
        );
      }
    },
    
    /**
     * Filter models by price
     * @param {number} maxPrice - Maximum price
     */
    filterByPrice(maxPrice) {
      if (maxPrice === 50) {
        // No price filter
        return;
      }
      
      // Filter by price
      this.filteredData = this.filteredData.filter(model => model.price <= maxPrice);
    },
    
    /**
     * Filter models by favorites
     */
    filterByFavorites() {
      // Get favorites
      const favorites = Favorites.getFavorites();
      
      // Filter models
      this.filteredData = this.data.filter(model => favorites.includes(model.id));
    },
    
    /**
     * Display models on the page
     */
    displayModels() {
      if (!this.modelsGrid) return;
      
      // Clear grid
      this.modelsGrid.innerHTML = '';
      
      // Get models for current page
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const modelsToDisplay = this.filteredData.slice(startIndex, endIndex);
      
      // Update results count
      if (this.resultsCount) {
        this.resultsCount.textContent = this.filteredData.length;
      }
      
      // Update pagination
      this.updatePagination();
      
      // Check if there are no models to display
      if (modelsToDisplay.length === 0) {
        this.modelsGrid.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search"></i>
            <p>No models found matching your criteria</p>
            <button class="btn btn-primary mt-md" onclick="Models.resetFilters()">
              <i class="fas fa-undo"></i> Reset Filters
            </button>
          </div>
        `;
        return;
      }
      
      // Get template
      const template = document.getElementById('model-card-template');
      if (!template) return;
      
      // Create and append model cards
      modelsToDisplay.forEach(model => {
        const card = this.createModelCard(model, template);
        this.modelsGrid.appendChild(card);
      });
      
      // Update favorite buttons
      Favorites.updateFavoriteButtons();
    },
    
    /**
     * Create a model card from template
     * @param {Object} model - Model data
     * @param {HTMLTemplateElement} template - Template element
     * @returns {HTMLElement} Model card element
     */
    createModelCard(model, template) {
      // Clone template
      const card = template.content.cloneNode(true);
      
      // Set model ID for favorite button
      const favoriteBtn = card.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.setAttribute('data-id', model.id);
      }
      
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
      
      // Set likes
      const likes = card.querySelector('.likes-count');
      if (likes) {
        likes.textContent = utils.formatNumber(model.likes);
      }
      
      // Set description
      const description = card.querySelector('.model-description');
      if (description) {
        description.textContent = utils.truncateText(model.description, 80);
      }
      
      // Set tags
      const tagsContainer = card.querySelector('.model-tags');
      if (tagsContainer && model.tags) {
        model.tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'tag';
          tagElement.textContent = tag;
          tagsContainer.appendChild(tagElement);
        });
      }
      
      // Set profile link
      const profileBtn = card.querySelector('.profile-btn');
      if (profileBtn) {
        profileBtn.href = `pages/model.html?id=${model.id}`;
      }
      
      // Set follow link
      const followBtn = card.querySelector('.follow-btn');
      if (followBtn) {
        followBtn.href = model.onlyfansUrl;
      }
      
      return card;
    },
    
    /**
     * Update pagination elements
     */
    updatePagination() {
      const totalPages = this.getTotalPages();
      
      // Update page indicators
      if (this.currentPageElem) {
        this.currentPageElem.textContent = this.currentPage;
      }
      
      if (this.totalPagesElem) {
        this.totalPagesElem.textContent = totalPages;
      }
      
      if (this.currentPageBottomElem) {
        this.currentPageBottomElem.textContent = this.currentPage;
      }
      
      if (this.totalPagesBottomElem) {
        this.totalPagesBottomElem.textContent = totalPages;
      }
      
      // Update button states
      if (this.prevPageBtn) {
        this.prevPageBtn.disabled = this.currentPage === 1;
      }
      
      if (this.nextPageBtn) {
        this.nextPageBtn.disabled = this.currentPage === totalPages;
      }
      
      if (this.prevPageBottomBtn) {
        this.prevPageBottomBtn.disabled = this.currentPage === 1;
      }
      
      if (this.nextPageBottomBtn) {
        this.nextPageBottomBtn.disabled = this.currentPage === totalPages;
      }
    },
    
    /**
     * Get total number of pages
     * @returns {number} Total pages
     */
    getTotalPages() {
      return Math.max(1, Math.ceil(this.filteredData.length / this.itemsPerPage));
    },
    
    /**
     * Reset all filters
     */
    resetFilters() {
      // Reset filtered data
      this.filteredData = [...this.data];
      
      // Reset current page
      this.currentPage = 1;
      
      // Reset sort select
      if (this.sortSelect) {
        this.sortSelect.value = 'newest';
      }
      
      // Reset filter tags
      if (this.filterTags) {
        this.filterTags.querySelectorAll('.tag').forEach(tag => {
          tag.classList.remove('active');
        });
        
        const allTag = this.filterTags.querySelector('[data-tag="all"]');
        if (allTag) {
          allTag.classList.add('active');
        }
      }
      
      // Reset price slider
      if (this.priceSlider && this.priceValue) {
        this.priceSlider.value = 50;
        this.priceValue.textContent = '$50+';
      }
      
      // Clear URL parameters
      utils.setQueryParams({
        sort: null,
        tag: null,
        price: null,
        page: null,
        filter: null
      });
      
      // Display models
      this.displayModels();
    },
    
    /**
     * Get a model by ID
     * @param {string} id - Model ID
     * @returns {Object|null} Model data or null if not found
     */
    getModelById(id) {
      return this.data.find(model => model.id === id) || null;
    },
    
    /**
     * Add a new model
     * @param {Object} modelData - Model data
     * @returns {Object} Added model
     */
    addModel(modelData) {
      // Generate ID if not provided
      if (!modelData.id) {
        modelData.id = utils.generateId();
      }
      
      // Set creation date
      modelData.createdAt = new Date().toISOString();
      
      // Add to data
      this.data.push(modelData);
      this.filteredData = [...this.data];
      
      // Save to local storage
      this.saveModels();
      
      return modelData;
    },
    
    /**
     * Update a model
     * @param {string} id - Model ID
     * @param {Object} modelData - Updated model data
     * @returns {Object|null} Updated model or null if not found
     */
    updateModel(id, modelData) {
      // Find model index
      const index = this.data.findIndex(model => model.id === id);
      
      // Check if model exists
      if (index === -1) return null;
      
      // Update model
      this.data[index] = { ...this.data[index], ...modelData };
      this.filteredData = [...this.data];
      
      // Save to local storage
      this.saveModels();
      
      return this.data[index];
    },
    
    /**
     * Delete a model
     * @param {string} id - Model ID
     * @returns {boolean} Success
     */
    deleteModel(id) {
      // Find model index
      const index = this.data.findIndex(model => model.id === id);
      
      // Check if model exists
      if (index === -1) return false;
      
      // Remove model
      this.data.splice(index, 1);
      this.filteredData = [...this.data];
      
      // Save to local storage
      this.saveModels();
      
      return true;
    },
    
    /**
     * Get similar models based on tags
     * @param {string} modelId - Model ID to find similar models for
     * @param {number} limit - Maximum number of similar models to return
     * @returns {Array} Array of similar models
     */
    getSimilarModels(modelId, limit = 4) {
      // Get model
      const model = this.getModelById(modelId);
      if (!model || !model.tags || model.tags.length === 0) return [];
      
      // Calculate similarity score for each model
      const similarModels = this.data
        .filter(m => m.id !== modelId) // Exclude current model
        .map(m => {
          // Calculate similarity score based on matching tags
          let score = 0;
          if (m.tags && m.tags.length > 0) {
            // Count matching tags
            const matchingTags = model.tags.filter(tag => m.tags.includes(tag));
            score = matchingTags.length;
          }
          
          return { ...m, similarityScore: score };
        })
        .filter(m => m.similarityScore > 0) // Only include models with at least one matching tag
        .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity score
        .slice(0, limit); // Limit results
      
      return similarModels;
    },
    
    /**
     * Get popular tags based on model data
     * @param {number} limit - Maximum number of tags to return
     * @returns {Array} Array of popular tags and their counts
     */
    getPopularTags(limit = 10) {
      const tagCounts = {};
      
      // Count occurrences of each tag
      this.data.forEach(model => {
        if (model.tags && model.tags.length > 0) {
          model.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      // Convert to array and sort by count
      const popularTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return popularTags;
    },
    
    /**
     * Search models by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Array of matching models
     */
    searchModels(keyword) {
      if (!keyword || keyword.trim() === '') return [...this.data];
      
      const searchTerm = keyword.toLowerCase();
      
      return this.data.filter(model => {
        // Search in name
        if (model.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search in description
        if (model.description && model.description.toLowerCase().includes(searchTerm)) return true;
        
        // Search in tags
        if (model.tags && model.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
        
        // Search in location
        if (model.location && model.location.toLowerCase().includes(searchTerm)) return true;
        
        return false;
      });
    },
    
    /**
     * Generate dummy data for testing
     * @returns {Array} Array of dummy model data
     */
    generateDummyData() {
      const tags = ['fitness', 'model', 'cosplay', 'gaming', 'asmr', 'dance', 'cooking', 'art', 'music', 'travel', 'beauty', 'fashion'];
      const locations = ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Italy', 'Spain', 'Brazil', 'Japan'];
      
      // Generate 30 dummy models
      const dummyModels = [];
      
      for (let i = 1; i <= 30; i++) {
        // Get random tags (2-4 tags per model)
        const numTags = Math.floor(Math.random() * 3) + 2;
        const modelTags = [];
        for (let j = 0; j < numTags; j++) {
          const randomTag = tags[Math.floor(Math.random() * tags.length)];
          if (!modelTags.includes(randomTag)) {
            modelTags.push(randomTag);
          }
        }
        
        // Generate random price (0-50)
        const price = Math.random() < 0.1 ? 0 : Math.round(Math.random() * 30) + 3;
        
        // Generate random likes count
        const likes = Math.floor(Math.random() * 50000) + 1000;
        
        // Generate random media count
        const mediaCount = Math.floor(Math.random() * 500) + 50;
        
        // Generate random rating
        const rating = (Math.random() * 2) + 3; // 3.0 - 5.0
        
        // Random location
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Creation date (within the last year)
        const daysAgo = Math.floor(Math.random() * 365);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        dummyModels.push({
          id: `model-${i}`,
          name: `Model ${i}`,
          onlyfansUrl: `https://onlyfans.com/model${i}`,
          profileImage: `https://picsum.photos/500/500?random=${i}`,
          coverImage: `https://picsum.photos/1200/400?random=${i}`,
          description: `This is a sample model profile for demonstration purposes. This model specializes in ${modelTags.join(', ')} content and has been creating amazing content for their fans.`,
          price,
          likes,
          mediaCount,
          rating,
          tags: modelTags,
          location,
          createdAt: createdAt.toISOString(),
          socialMedia: {
            instagram: Math.random() > 0.3 ? `model${i}` : null,
            twitter: Math.random() > 0.3 ? `model${i}` : null,
            tiktok: Math.random() > 0.5 ? `model${i}` : null,
            website: Math.random() > 0.7 ? `https://model${i}.com` : null
          }
        });
      }
      
      return dummyModels;
    }
  };
  
  // Initialize models functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    Models.init();
  });