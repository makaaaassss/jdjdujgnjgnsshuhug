/**
 * Add Model JavaScript for OnlyFans Directory
 * Handles the form for adding new models
 */

const AddModelPage = {
    /**
     * Initialize the add model page
     */
    init() {
      // Get form elements
      this.form = document.getElementById('add-model-form');
      this.resetButton = document.getElementById('reset-form');
      this.nameInput = document.getElementById('model-name');
      this.onlyfansUrlInput = document.getElementById('model-onlyfans-url');
      this.priceInput = document.getElementById('model-price');
      this.freeCheckbox = document.getElementById('model-free');
      this.profileImageInput = document.getElementById('model-profile-image');
      this.coverImageInput = document.getElementById('model-cover-image');
      this.descriptionInput = document.getElementById('model-description');
      this.descriptionCharCount = document.getElementById('description-char-count');
      this.tagInput = document.getElementById('tag-input');
      this.tagsList = document.getElementById('tags-list');
      this.tagSuggestions = document.getElementById('tags-suggestions');
      this.hiddenTagsInput = document.getElementById('model-tags');
      
      // Initialize image previews
      this.profileImagePreview = document.getElementById('profile-image-preview');
      this.coverImagePreview = document.getElementById('cover-image-preview');
      
      // Set up event listeners
      this.setupEventListeners();
    },
    
    /**
     * Set up event listeners for the form
     */
    setupEventListeners() {
      // Form submission
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleFormSubmit();
        });
      }
      
      // Reset button
      if (this.resetButton) {
        this.resetButton.addEventListener('click', () => {
          this.resetForm();
        });
      }
      
      // Free checkbox
      if (this.freeCheckbox && this.priceInput) {
        this.freeCheckbox.addEventListener('change', () => {
          if (this.freeCheckbox.checked) {
            this.priceInput.value = '0';
            this.priceInput.disabled = true;
          } else {
            this.priceInput.value = '';
            this.priceInput.disabled = false;
          }
        });
      }
      
      // Profile image preview
      if (this.profileImageInput && this.profileImagePreview) {
        this.profileImageInput.addEventListener('change', () => {
          this.handleImageUpload(this.profileImageInput, this.profileImagePreview);
        });
      }
      
      // Cover image preview
      if (this.coverImageInput && this.coverImagePreview) {
        this.coverImageInput.addEventListener('change', () => {
          this.handleImageUpload(this.coverImageInput, this.coverImagePreview);
        });
      }
      
      // Description character count
      if (this.descriptionInput && this.descriptionCharCount) {
        this.descriptionInput.addEventListener('input', () => {
          this.updateDescriptionCharCount();
        });
        
        // Initial count
        this.updateDescriptionCharCount();
      }
      
      // Tag input
      if (this.tagInput) {
        this.tagInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            this.addTag(this.tagInput.value);
          }
        });
        
        this.tagInput.addEventListener('input', () => {
          this.filterTagSuggestions(this.tagInput.value);
        });
      }
      
      // Tag suggestions
      if (this.tagSuggestions) {
        this.tagSuggestions.addEventListener('click', (e) => {
          if (e.target.classList.contains('tag-suggestion')) {
            const tag = e.target.getAttribute('data-tag');
            this.addTag(tag);
          }
        });
      }
    },
    
    /**
     * Handle form submission
     */
    handleFormSubmit() {
      // Validate form
      if (!this.validateForm()) return;
      
      // Get form data
      const formData = this.getFormData();
      
      // Check if Models is available
      if (typeof Models === 'undefined') {
        utils.showNotification('Cannot add model: Models data is not available', 'error');
        return;
      }
      
      try {
        // Add model to the database
        const newModel = Models.addModel(formData);
        
        // Show success notification
        utils.showNotification(`Successfully added ${newModel.name} to the directory`, 'success');
        
        // Reset form
        this.resetForm();
        
        // Redirect to the model page after a short delay
        setTimeout(() => {
          window.location.href = `model.html?id=${newModel.id}`;
        }, 1500);
      } catch (error) {
        console.error('Error adding model:', error);
        utils.showNotification('Failed to add model', 'error');
      }
    },
    
    /**
     * Validate form inputs
     * @returns {boolean} Is form valid
     */
    validateForm() {
      // Required fields
      if (!this.nameInput.value.trim()) {
        utils.showNotification('Please enter a name', 'error');
        this.nameInput.focus();
        return false;
      }
      
      if (!this.onlyfansUrlInput.value.trim()) {
        utils.showNotification('Please enter an OnlyFans username', 'error');
        this.onlyfansUrlInput.focus();
        return false;
      }
      
      if (!this.priceInput.value && !this.freeCheckbox.checked) {
        utils.showNotification('Please enter a price or select Free Account', 'error');
        this.priceInput.focus();
        return false;
      }
      
      if (!this.profileImageInput.files.length) {
        utils.showNotification('Please select a profile image', 'error');
        return false;
      }
      
      if (!this.descriptionInput.value.trim()) {
        utils.showNotification('Please enter a description', 'error');
        this.descriptionInput.focus();
        return false;
      }
      
      // Check if at least one tag is added
      const tags = this.getSelectedTags();
      if (tags.length === 0) {
        utils.showNotification('Please add at least one tag', 'error');
        this.tagInput.focus();
        return false;
      }
      
      return true;
    },
    
    /**
     * Get form data as an object
     * @returns {Object} Form data
     */
    getFormData() {
      // Get selected tags
      const tags = this.getSelectedTags();
      
      // Create data object
      const formData = {
        id: utils.generateId(),
        name: this.nameInput.value.trim(),
        onlyfansUrl: `https://onlyfans.com/${this.onlyfansUrlInput.value.trim()}`,
        price: this.freeCheckbox.checked ? 0 : parseFloat(this.priceInput.value) || 0,
        description: this.descriptionInput.value.trim(),
        tags,
        likes: parseInt(document.getElementById('model-likes')?.value) || 0,
        mediaCount: parseInt(document.getElementById('model-media-count')?.value) || 0,
        location: document.getElementById('model-location')?.value || '',
        createdAt: new Date().toISOString(),
        socialMedia: {
          instagram: document.getElementById('model-instagram')?.value || null,
          twitter: document.getElementById('model-twitter')?.value || null,
          tiktok: document.getElementById('model-tiktok')?.value || null,
          website: document.getElementById('model-website')?.value || null
        }
      };
      
      // Add profile image
      if (this.profileImageInput.files.length) {
        formData.profileImage = this.getImageDataUrl(this.profileImageInput.files[0]);
      }
      
      // Add cover image
      if (this.coverImageInput.files.length) {
        formData.coverImage = this.getImageDataUrl(this.coverImageInput.files[0]);
      }
      
      return formData;
    },
    
    /**
     * Get array of selected tags
     * @returns {Array} Selected tags
     */
    getSelectedTags() {
      const tagElements = this.tagsList?.querySelectorAll('.tag');
      if (!tagElements) return [];
      
      return Array.from(tagElements).map(el => el.getAttribute('data-tag'));
    },
    
    /**
     * Get image data URL (base64)
     * @param {File} file - Image file
     * @returns {string} Temporary URL
     */
    getImageDataUrl(file) {
      // In a real implementation, you would upload the image to a server
      // For now, we'll use a placeholder or URL.createObjectURL for the demo
      return URL.createObjectURL(file);
    },
    
    /**
     * Handle image upload and preview
     * @param {HTMLInputElement} input - File input element
     * @param {HTMLElement} previewElement - Preview container element
     */
    handleImageUpload(input, previewElement) {
      if (!input.files || !input.files[0]) return;
      
      const file = input.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        utils.showNotification('Please select an image file', 'error');
        input.value = '';
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        utils.showNotification('Image file size is too large (max 5MB)', 'error');
        input.value = '';
        return;
      }
      
      // Create a preview
      const reader = new FileReader();
      
      reader.onload = (e) => {
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      
      reader.readAsDataURL(file);
    },
    
    /**
     * Update description character count
     */
    updateDescriptionCharCount() {
      if (!this.descriptionInput || !this.descriptionCharCount) return;
      
      const count = this.descriptionInput.value.length;
      this.descriptionCharCount.textContent = count;
      
      // Change color if approaching limit
      if (count > 250) {
        this.descriptionCharCount.style.color = 'var(--color-warning)';
      } else {
        this.descriptionCharCount.style.color = '';
      }
      
      // Show warning if over limit
      if (count > 300) {
        this.descriptionCharCount.style.color = 'var(--color-error)';
      }
    },
    
    /**
     * Add a tag to the selected tags list
     * @param {string} tag - Tag to add
     */
    addTag(tag) {
      if (!this.tagsList || !this.tagInput) return;
      
      // Clean and normalize tag
      tag = tag.trim().toLowerCase();
      
      // Remove commas
      tag = tag.replace(/,/g, '');
      
      // Skip if empty
      if (!tag) return;
      
      // Check if tag already exists
      const existingTags = this.getSelectedTags();
      if (existingTags.includes(tag)) {
        this.tagInput.value = '';
        return;
      }
      
      // Create tag element
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.setAttribute('data-tag', tag);
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove">×</span>
      `;
      
      // Add remove event
      const removeBtn = tagElement.querySelector('.tag-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          tagElement.remove();
          this.updateHiddenTagsInput();
        });
      }
      
      // Add to list
      this.tagsList.appendChild(tagElement);
      
      // Clear input
      this.tagInput.value = '';
      
      // Update hidden input
      this.updateHiddenTagsInput();
      
      // Reset suggestions
      this.filterTagSuggestions('');
    },
    
    /**
     * Filter tag suggestions based on input
     * @param {string} input - Tag input value
     */
    filterTagSuggestions(input) {
      if (!this.tagSuggestions) return;
      
      const suggestions = this.tagSuggestions.querySelectorAll('.tag-suggestion');
      
      if (!input) {
        // Show all suggestions
        suggestions.forEach(suggestion => {
          suggestion.style.display = '';
        });
        return;
      }
      
      // Filter suggestions
      const filter = input.trim().toLowerCase();
      
      suggestions.forEach(suggestion => {
        const tag = suggestion.getAttribute('data-tag');
        
        if (tag.includes(filter)) {
          suggestion.style.display = '';
        } else {
          suggestion.style.display = 'none';
        }
      });
    },
    
    /**
     * Update hidden tags input with selected tags
     */
    updateHiddenTagsInput() {
      if (!this.hiddenTagsInput) return;
      
      const tags = this.getSelectedTags();
      this.hiddenTagsInput.value = tags.join(',');
    },
    
    /**
     * Reset the form
     */
    resetForm() {
      // Confirm reset
      if (this.form.elements.length > 0 && !confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        return;
      }
      
      // Reset form
      this.form.reset();
      
      // Reset image previews
      if (this.profileImagePreview) {
        this.profileImagePreview.innerHTML = `
          <i class="fas fa-user"></i>
          <span>No image selected</span>
        `;
      }
      
      if (this.coverImagePreview) {
        this.coverImagePreview.innerHTML = `
          <i class="fas fa-image"></i>
          <span>No image selected</span>
        `;
      }
      
      // Reset tags
      if (this.tagsList) {
        this.tagsList.innerHTML = '';
      }
      
      // Reset hidden tags input
      if (this.hiddenTagsInput) {
        this.hiddenTagsInput.value = '';
      }
      
      // Reset price input
      if (this.priceInput) {
        this.priceInput.disabled = false;
      }
      
      // Reset description count
      this.updateDescriptionCharCount();
      
      // Reset tag suggestions
      this.filterTagSuggestions('');
    }
  };
  
  // Initialize add model page when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    AddModelPage.init();
  });