/**
 * Theme switching functionality for OnlyFans Directory
 */

const Theme = {
    // Available themes
    LIGHT: 'light',
    DARK: 'dark',
    
    // Default theme
    DEFAULT: 'light',
    
    // Local storage key
    STORAGE_KEY: 'of_directory_theme',
    
    /**
     * Initialize theme functionality
     */
    init() {
      // Get theme toggle button
      this.themeToggle = document.getElementById('theme-toggle');
      
      if (!this.themeToggle) return;
      
      // Set up event listener
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
      
      // Set initial theme
      this.setTheme(this.getCurrentTheme());
    },
    
    /**
     * Get current theme from local storage or system preference
     * @returns {string} Current theme
     */
    getCurrentTheme() {
      // Check if theme is saved in local storage
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return this.DARK;
      }
      
      // Default to light theme
      return this.DEFAULT;
    },
    
    /**
     * Set theme
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
      // Update data-theme attribute on root element
      document.documentElement.setAttribute('data-theme', theme);
      
      // Save theme to local storage
      localStorage.setItem(this.STORAGE_KEY, theme);
    },
    
    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
      // Add transition class to body
      document.body.classList.add('theme-transitioning');
      
      // Get current theme
      const currentTheme = this.getCurrentTheme();
      
      // Toggle theme
      const newTheme = currentTheme === this.LIGHT ? this.DARK : this.LIGHT;
      
      // Set new theme
      this.setTheme(newTheme);
      
      // Show notification
      const message = `Switched to ${newTheme === this.LIGHT ? 'light' : 'dark'} theme`;
      utils.showNotification(message, 'info');
      
      // Remove transition class after animation
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }
  };
  
  // Initialize theme functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
  });