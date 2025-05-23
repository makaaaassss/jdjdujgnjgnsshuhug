/**
 * Search Page JavaScript for OnlyFans Directory
 * Handles the advanced search functionality
 */

const SearchPage = {
    // Pagination settings
    currentPage: 1,
    itemsPerPage: 10,
    
    // Search results
    searchResults: [],
    
    /**
     * Initialize the search page
     */
    async init() {
      // Get DOM elements
      this.searchForm = document.getElementById('advanced-search-form');
      this.searchResults = document.getElementById('search-results');
      this.resultsCount = document.getElementById('results-count');
      this.paginationControls = document.getElementById('pagination-controls');
      this.sortSelect = document.getElementById('sort-results');
      this.tagsSelection = document.getElementById('tags-selection');
      this.ratingSlider = document.getElementById('rating-min');
      this.ratingValue = document.getElementById('rating-value');
      this.ratingStars = document.getElementById('rating-stars');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check for URL query parameters
      const query = utils.getQueryParam('q');
      if (query) {
        // Set the query in the keyword field
        const keywordInput = document.getElementById('keyword');
        if (keywordInput) {
          keywordInput.value = query;
        }
        
        // Perform search with the query
        this.performSearch();
      }
    },
    
    /**
     * Set up event listeners for search page
     */
    setupEventListeners() {
      // Search form submission
      if (this.searchForm) {
        this.searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.performSearch();
        });
      }
      
      // Sort select
      if (this.sortSelect) {
        this.sortSelect.addEventListener('change', () => {
          this.sortResults(this.sortSelect.value);
          this.displayResults();
        });
      }
      
      // Tags selection
      if (this.tagsSelection) {
        this.tagsSelection.addEventListener('click', (e) => {
          if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('selected');
          }
        });
      }
      
      // Rating slider
      if (this.ratingSlider && this.ratingValue && this.ratingStars) {
        this.ratingSlider.addEventListener('input', () => {
          const value = parseFloat(this.ratingSlider.value);
          this.ratingValue.textContent = value.toFixed(1);
          this.updateRatingStars(value);
        });
      }
    },
    
    /**
     * Update rating stars based on value
     * @param {number} value - Rating value
     */
    updateRatingStars(value) {
      if (!this.ratingStars) return;
      
      // Clear stars
      this.ratingStars.innerHTML = '';
      
      // Create stars HTML
      this.ratingStars.innerHTML = utils.createRatingStars(value);
    },
    
    /**
     * Perform search with form values
     */
    performSearch() {
      // Check if Models is loaded
      if (typeof Models === 'undefined' || !Models.data) {
        this.showNoResults('Models data is not available');
        return;
      }
      
      // Get form values
      const keyword = document.getElementById('keyword')?.value.trim() || '';
      const priceMin = document.getElementById('price-min')?.value || '';
      const priceMax = document.getElementById('price-max')?.value || '';
      const ratingMin = document.getElementById('rating-min')?.value || '';
      const location = document.getElementById('location')?.value || '';
      const mediaCountMin = document.getElementById('media-count-min')?.value || '';
      const likesMin = document.getElementById('likes-min')?.value || '';
      
      // Get selected tags
      const selectedTags = Array.from(this.tagsSelection?.querySelectorAll('.tag.selected') || [])
        .map(tag => tag.getAttribute('data-tag'));
      
      // Perform search
      let results = [...Models.data];
      
      // Filter by keyword
      if (keyword) {
        results = Models.searchModels(keyword);
      }
      
      // Filter by price range
      if (priceMin) {
        results = results.filter(model => model.price >= parseFloat(priceMin));
      }
      
      if (priceMax) {
        results = results.filter(model => model.price <= parseFloat(priceMax));
      }
      
      // Filter by rating
      if (ratingMin) {
        results = results.filter(model => (model.rating || 0) >= parseFloat(ratingMin));
      }
      
      // Filter by location
      if (location) {
        results = results.filter(model => model.location && model.location.toLowerCase().includes(location.toLowerCase()));
      }
      
      // Filter by media count
      if (mediaCountMin) {
        results = results.filter(model => (model.mediaCount || 0) >= parseInt(mediaCountMin));
      }
      
      // Filter by likes
      if (likesMin) {
        results = results.filter(model => model.likes >= parseInt(likesMin));
      }
      
      // Filter by tags
      if (selectedTags.length > 0) {
        results = results.filter(model => 
          model.tags && selectedTags.every(tag => model.tags.includes(tag))
        );
      }
      
      // Sort results
      const sortValue = this.sortSelect?.value || 'relevance';
      this.sortResults(sortValue, results);
      
      // Store results
      this.searchResults = results;
      
      // Reset pagination
      this.currentPage = 1;
      
      // Display results
      this.displayResults();
      
      // Update URL parameters
      this.updateUrlParameters();
    },
    
    /**
     * Sort search results
     * @param {string} sortBy - Sort criteria
     * @param {Array} results - Results to sort (optional)
     */
    sortResults(sortBy, results = null) {
      // Use provided results or stored results
      const dataToSort = results || this.searchResults;
      
      switch (sortBy) {
        case 'price-low':
          dataToSort.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          dataToSort.sort((a, b) => b.price - a.price);
          break;
        case 'rating-high':
          dataToSort.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'likes-high':
          dataToSort.sort((a, b) => b.likes - a.likes);
          break;
        case 'newest':
          dataToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'relevance':
        default:
          // Already sorted by relevance if keyword search was used
          break;
      }
      
      // If results were provided, return sorted array
      if (results) {
        return dataToSort;
      }
    },
    
    /**
     * Display search results
     */
    displayResults() {
      if (!this.searchResults) return;
      
      // Update results count
      if (this.resultsCount) {
        this.resultsCount.textContent = this.searchResults.length;
      }
      
      // Check if there are any results
      if (this.searchResults.length === 0) {
        this.showNoResults('No creators found matching your criteria');
        return;
      }
      
      // Calculate pagination
      const totalPages = Math.ceil(this.searchResults.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const resultsToDisplay = this.searchResults.slice(startIndex, endIndex);
      
      // Clear results container
      if (this.searchResults) {
        this.searchResults.innerHTML = '';
      }
      
      // Get template
      const template = document.getElementById('search-result-template');
      if (!template) return;
      
      // Create and append result items
      resultsToDisplay.forEach(result => {
        // Clone template
        const resultElement = template.content.cloneNode(true);
        
        // Set image
        const image = resultElement.querySelector('.result-image img');
        if (image) {
          image.src = result.profileImage;
          image.alt = result.name;
        }
        
        // Set name
        const name = resultElement.querySelector('.result-name');
        if (name) {
          name.textContent = result.name;
        }
        
        // Set price
        const price = resultElement.querySelector('.result-price');
        if (price) {
          price.textContent = utils.formatCurrency(result.price);
        }
        
        // Set rating
        const rating = resultElement.querySelector('.result-rating .stars-container');
        if (rating) {
          rating.innerHTML = utils.createRatingStars(result.rating || 0);
        }
        
        // Set description
        const description = resultElement.querySelector('.result-description');
        if (description) {
          description.textContent = utils.truncateText(result.description, 120);
        }
        
        // Set tags
        const tagsContainer = resultElement.querySelector('.result-tags');
        if (tagsContainer && result.tags) {
          result.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
          });
        }
        
        // Set likes
        const likes = resultElement.querySelector('.likes-count');
        if (likes) {
          likes.textContent = utils.formatNumber(result.likes);
        }
        
        // Set media count
        const media = resultElement.querySelector('.media-count');
        if (media) {
          media.textContent = utils.formatNumber(result.mediaCount || 0);
        }
        
        // Set location
        const location = resultElement.querySelector('.location');
        if (location) {
          location.textContent = result.location || 'Not specified';
        }
        
        // Set favorite button
        const favoriteBtn = resultElement.querySelector('.favorite-btn');
        if (favoriteBtn) {
          favoriteBtn.setAttribute('data-id', result.id);
          
          // Check if already favorited
          if (typeof Favorites !== 'undefined' && Favorites.isFavorite(result.id)) {
            favoriteBtn.classList.add('active');
            const icon = favoriteBtn.querySelector('i');
            if (icon) {
              icon.className = 'fas fa-heart';
            }
          }
        }
        
        // Set profile link
        const profileBtn = resultElement.querySelector('.profile-btn');
        if (profileBtn) {
          profileBtn.href = `model.html?id=${result.id}`;
        }
        
        // Set follow link
        const followBtn = resultElement.querySelector('.follow-btn');
        if (followBtn) {
          followBtn.href = result.onlyfansUrl;
        }
        
        this.searchResults.appendChild(resultElement);
      });
      
      // Update pagination controls
      this.updatePagination(totalPages);
      
      // Update favorite buttons
      if (typeof Favorites !== 'undefined') {
        Favorites.updateFavoriteButtons();
      }
    },
    
    /**
     * Show no results message
     * @param {string} message - Message to display
     */
    showNoResults(message) {
      if (!this.searchResults) return;
      
      this.searchResults.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>${message}</p>
        </div>
      `;
      
      // Hide pagination
      if (this.paginationControls) {
        this.paginationControls.innerHTML = '';
      }
    },
    
    /**
     * Update pagination controls
     * @param {number} totalPages - Total number of pages
     */
    updatePagination(totalPages) {
      if (!this.paginationControls) return;
      
      // Clear pagination controls
      this.paginationControls.innerHTML = '';
      
      // Check if pagination is needed
      if (totalPages <= 1) return;
      
      // Create pagination
      const pagination = document.createElement('div');
      pagination.className = 'pagination';
      
      // Previous button
      const prevButton = document.createElement('button');
      prevButton.className = 'btn btn-outline pagination-prev';
      prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
      prevButton.disabled = this.currentPage === 1;
      prevButton.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.displayResults();
          utils.scrollToElement(this.searchResults);
        }
      });
      
      // Page numbers
      const pageNumbers = document.createElement('div');
      pageNumbers.className = 'pagination-numbers';
      
      // Determine which page numbers to show
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      // Adjust startPage if endPage is at the maximum
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
      
      // First page
      if (startPage > 1) {
        const firstPage = document.createElement('button');
        firstPage.className = 'pagination-number';
        firstPage.textContent = '1';
        firstPage.addEventListener('click', () => {
          this.currentPage = 1;
          this.displayResults();
          utils.scrollToElement(this.searchResults);
        });
        pageNumbers.appendChild(firstPage);
        
        // Ellipsis
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          pageNumbers.appendChild(ellipsis);
        }
      }
      
      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.className = 'pagination-number';
        if (i === this.currentPage) {
          pageNumber.classList.add('active');
        }
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
          this.currentPage = i;
          this.displayResults();
          utils.scrollToElement(this.searchResults);
        });
        pageNumbers.appendChild(pageNumber);
      }
      
      // Last page
      if (endPage < totalPages) {
        // Ellipsis
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          pageNumbers.appendChild(ellipsis);
        }
        
        const lastPage = document.createElement('button');
        lastPage.className = 'pagination-number';
        lastPage.textContent = totalPages;
        lastPage.addEventListener('click', () => {
          this.currentPage = totalPages;
          this.displayResults();
          utils.scrollToElement(this.searchResults);
        });
        pageNumbers.appendChild(lastPage);
      }
      
      // Next button
      const nextButton = document.createElement('button');
      nextButton.className = 'btn btn-outline pagination-next';
      nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
      nextButton.disabled = this.currentPage === totalPages;
      nextButton.addEventListener('click', () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.displayResults();
          utils.scrollToElement(this.searchResults);
        }
      });
      
      // Append all elements
      pagination.appendChild(prevButton);
      pagination.appendChild(pageNumbers);
      pagination.appendChild(nextButton);
      
      this.paginationControls.appendChild(pagination);
    },
    
    /**
     * Update URL parameters based on search criteria
     */
    updateUrlParameters() {
      const params = {};
      
      // Get form values
      const keyword = document.getElementById('keyword')?.value.trim() || '';
      const priceMin = document.getElementById('price-min')?.value || '';
      const priceMax = document.getElementById('price-max')?.value || '';
      const ratingMin = document.getElementById('rating-min')?.value || '';
      const location = document.getElementById('location')?.value || '';
      const mediaCountMin = document.getElementById('media-count-min')?.value || '';
      const likesMin = document.getElementById('likes-min')?.value || '';
      
      // Get selected tags
      const selectedTags = Array.from(this.tagsSelection?.querySelectorAll('.tag.selected') || [])
        .map(tag => tag.getAttribute('data-tag'));
      
      // Add parameters
      if (keyword) params.q = keyword;
      if (priceMin) params.price_min = priceMin;
      if (priceMax) params.price_max = priceMax;
      if (ratingMin) params.rating = ratingMin;
      if (location) params.location = location;
      if (mediaCountMin) params.media = mediaCountMin;
      if (likesMin) params.likes = likesMin;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      if (this.sortSelect?.value !== 'relevance') params.sort = this.sortSelect.value;
      if (this.currentPage > 1) params.page = this.currentPage;
      
      // Update URL
      utils.setQueryParams(params);
    },
    
    /**
     * Update search with new query
     * @param {string} query - Search query
     */
    updateSearch(query) {
      // Set the query in the keyword field
      const keywordInput = document.getElementById('keyword');
      if (keywordInput) {
        keywordInput.value = query;
      }
      
      // Perform search
      this.performSearch();
    }
  };
  
  // Initialize search page when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    SearchPage.init();
  });