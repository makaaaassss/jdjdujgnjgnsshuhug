/**
 * Search functionality for OnlyFans Directory
 * Handles search bar and search results
 */

const Search = {
    /**
     * Initialize search functionality
     */
    init() {
      // Get search elements
      this.mainSearchInput = document.getElementById('main-search');
      this.searchBtn = document.querySelector('.search-btn');
      
      // Set up event listeners
      this.setupEventListeners();
    },
    
    /**
     * Set up event listeners for search functionality
     */
    setupEventListeners() {
      // Search button click
      if (this.searchBtn) {
        this.searchBtn.addEventListener('click', () => {
          this.performSearch();
        });
      }
      
      // Search input enter key
      if (this.mainSearchInput) {
        this.mainSearchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch();
          }
        });
      }
    },
    
    /**
     * Perform search with current input value
     */
    performSearch() {
      if (!this.mainSearchInput) return;
      
      const query = this.mainSearchInput.value.trim();
      
      if (query === '') return;
      
      // Determine which page we're on
      if (window.location.pathname.includes('search.html')) {
        // Already on search page, update search
        this.updateSearchPage(query);
      } else {
        // Navigate to search page with query
        window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
      }
    },
    
    /**
     * Update search results on search page
     * @param {string} query - Search query
     */
    updateSearchPage(query) {
      // This will be implemented in search-page.js
      if (typeof SearchPage !== 'undefined' && SearchPage.updateSearch) {
        SearchPage.updateSearch(query);
      }
    },
    
    /**
     * Quick search for autocomplete or instant results
     * @param {string} query - Search query
     * @param {number} limit - Maximum number of results
     * @returns {Array} Search results
     */
    quickSearch(query, limit = 5) {
      if (!query || query.trim() === '' || typeof Models === 'undefined') {
        return [];
      }
      
      // Perform search using Models.searchModels
      const results = Models.searchModels(query);
      
      // Limit results
      return results.slice(0, limit);
    },
    
    /**
     * Display a dropdown with quick search results
     * @param {HTMLElement} inputElement - Input element
     * @param {Array} results - Search results
     */
    displayQuickSearchResults(inputElement, results) {
      // Check if dropdown already exists
      let dropdown = document.querySelector('.quick-search-dropdown');
      
      // Create dropdown if it doesn't exist
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'quick-search-dropdown';
        document.body.appendChild(dropdown);
      }
      
      // Clear existing results
      dropdown.innerHTML = '';
      
      // Check if there are any results
      if (results.length === 0) {
        dropdown.innerHTML = '<div class="no-results">No results found</div>';
      } else {
        // Create results list
        const resultsList = document.createElement('ul');
        
        results.forEach(result => {
          const item = document.createElement('li');
          
          item.innerHTML = `
            <a href="pages/model.html?id=${result.id}">
              <div class="result-img">
                <img src="${result.profileImage}" alt="${result.name}">
              </div>
              <div class="result-info">
                <div class="result-name">${result.name}</div>
                <div class="result-price">${utils.formatCurrency(result.price)}</div>
              </div>
            </a>
          `;
          
          resultsList.appendChild(item);
        });
        
        dropdown.appendChild(resultsList);
      }
      
      // Position dropdown
      const inputRect = inputElement.getBoundingClientRect();
      dropdown.style.top = `${inputRect.bottom + window.scrollY}px`;
      dropdown.style.left = `${inputRect.left + window.scrollX}px`;
      dropdown.style.width = `${inputRect.width}px`;
      
      // Show dropdown
      dropdown.style.display = 'block';
      
      // Handle click outside to close dropdown
      const handleClickOutside = (e) => {
        if (!dropdown.contains(e.target) && e.target !== inputElement) {
          dropdown.style.display = 'none';
          document.removeEventListener('click', handleClickOutside);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
    },
    
    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @param {string} term - Term to highlight
     * @returns {string} HTML with highlighted term
     */
    highlightSearchTerm(text, term) {
      if (!text || !term) return text;
      
      const regex = new RegExp(`(${term})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }
  };
  
  // Initialize search functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    Search.init();
  });