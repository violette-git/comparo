/**
 * Performance Optimizations for Website Showcase Application
 * This file adds lazy loading, caching, and other performance improvements
 */

// Cache for storing screenshot data
const screenshotCache = {
  data: {},
  
  // Set item in cache with expiration
  set: function(key, value, expirationMinutes = 60) {
    const expirationMs = expirationMinutes * 60 * 1000;
    const expirationTime = Date.now() + expirationMs;
    
    this.data[key] = {
      value,
      expiration: expirationTime
    };
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('screenshot_cache', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to store cache in localStorage:', error);
    }
  },
  
  // Get item from cache
  get: function(key) {
    const item = this.data[key];
    
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() > item.expiration) {
      this.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  // Delete item from cache
  delete: function(key) {
    delete this.data[key];
    
    // Update localStorage
    try {
      localStorage.setItem('screenshot_cache', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to update localStorage:', error);
    }
  },
  
  // Load cache from localStorage
  load: function() {
    try {
      const cachedData = localStorage.getItem('screenshot_cache');
      if (cachedData) {
        this.data = JSON.parse(cachedData);
        
        // Clean expired items
        const now = Date.now();
        Object.keys(this.data).forEach(key => {
          if (now > this.data[key].expiration) {
            delete this.data[key];
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      this.data = {};
    }
  }
};

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
  // Load cache from localStorage
  screenshotCache.load();
  
  // Set up lazy loading for images
  setupLazyLoading();
  
  // Optimize event listeners
  optimizeEventListeners();
}

/**
 * Set up lazy loading for images using Intersection Observer
 */
function setupLazyLoading() {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const websiteId = img.closest('.website-card')?.dataset.id;
          const deviceType = img.closest('.card-preview')?.querySelector('.device-button.active')?.dataset.device || 'desktop';
          
          // Load image if it's not already loading
          if (img.classList.contains('loading') && !img.dataset.loading) {
            loadScreenshot(img, websiteId, deviceType);
          }
          
          // Stop observing once loaded
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when image is 200px from viewport
      threshold: 0.01
    });
    
    // Observe all preview images
    document.querySelectorAll('.preview-image').forEach(img => {
      imageObserver.observe(img);
    });
    
    // Re-observe images when new cards are added
    const websiteGrid = document.querySelector('.website-grid');
    if (websiteGrid) {
      const gridObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Element node
                const newImages = node.querySelectorAll('.preview-image');
                newImages.forEach(img => imageObserver.observe(img));
              }
            });
          }
        });
      });
      
      gridObserver.observe(websiteGrid, { childList: true });
    }
  } else {
    // Fallback for browsers that don't support Intersection Observer
    console.warn('Intersection Observer not supported. Lazy loading disabled.');
    
    // Load all images immediately
    document.querySelectorAll('.preview-image.loading').forEach(img => {
      const websiteId = img.closest('.website-card')?.dataset.id;
      const deviceType = img.closest('.card-preview')?.querySelector('.device-button.active')?.dataset.device || 'desktop';
      
      loadScreenshot(img, websiteId, deviceType);
    });
  }
}

/**
 * Load a screenshot with caching
 * @param {HTMLElement} imgElement - The image element to update
 * @param {string} websiteId - Website ID
 * @param {string} deviceType - Device type (desktop, tablet, mobile)
 */
async function loadScreenshot(imgElement, websiteId, deviceType) {
  if (!websiteId || !deviceType) return;
  
  // Mark as loading
  imgElement.dataset.loading = 'true';
  
  // Check cache first
  const cacheKey = `${websiteId}_${deviceType}`;
  const cachedUrl = screenshotCache.get(cacheKey);
  
  if (cachedUrl) {
    // Use cached screenshot
    imgElement.src = cachedUrl;
    imgElement.classList.remove('loading');
    delete imgElement.dataset.loading;
    return;
  }
  
  try {
    // Get website data from state or fetch it
    let website;
    if (window.state && window.state.websites) {
      website = window.state.websites.find(w => w.id === websiteId);
    }
    
    if (!website) {
      // Fetch website data if not in state
      website = await window.getWebsiteById(websiteId);
    }
    
    if (!website) {
      throw new Error('Website not found');
    }
    
    const screenshotKey = `screenshot_${deviceType}`;
    
    if (website[screenshotKey]) {
      // Website already has screenshot
      imgElement.src = website[screenshotKey];
      imgElement.classList.remove('loading');
      
      // Cache the screenshot URL
      screenshotCache.set(cacheKey, website[screenshotKey]);
    } else {
      // Generate screenshot
      if (window.generateWebsiteScreenshot) {
        // Use existing function from main.js
        window.generateWebsiteScreenshot(website);
      } else {
        // Fallback if function not available
        console.warn('Screenshot generation function not available');
        imgElement.classList.remove('loading');
        imgElement.classList.add('error');
      }
    }
  } catch (error) {
    console.error('Error loading screenshot:', error);
    imgElement.classList.remove('loading');
    imgElement.classList.add('error');
  } finally {
    delete imgElement.dataset.loading;
  }
}

/**
 * Optimize event listeners using event delegation
 */
function optimizeEventListeners() {
  // Use event delegation for device buttons
  document.addEventListener('click', function(event) {
    // Handle device button clicks
    if (event.target.classList.contains('device-button')) {
      const deviceSwitcher = event.target.closest('.device-switcher');
      if (!deviceSwitcher) return;
      
      // Update active button
      deviceSwitcher.querySelectorAll('.device-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      event.target.classList.add('active');
      event.target.setAttribute('aria-pressed', 'true');
      
      // Handle device switching
      const deviceType = event.target.dataset.device;
      
      // If it's a card device switcher
      if (deviceSwitcher.classList.contains('card-device-switcher')) {
        const card = deviceSwitcher.closest('.website-card');
        if (card) {
          const websiteId = card.dataset.id;
          const previewImage = card.querySelector('.preview-image');
          
          if (previewImage) {
            // Check cache first
            const cacheKey = `${websiteId}_${deviceType}`;
            const cachedUrl = screenshotCache.get(cacheKey);
            
            if (cachedUrl) {
              previewImage.src = cachedUrl;
            } else {
              previewImage.classList.add('loading');
              loadScreenshot(previewImage, websiteId, deviceType);
            }
          }
        }
      } 
      // If it's the main device switcher
      else if (!deviceSwitcher.classList.contains('comparison-device-switcher')) {
        if (window.state) {
          window.state.currentDevice = deviceType;
          
          // Update all website cards
          if (window.updateAllWebsiteCardPreviews) {
            window.updateAllWebsiteCardPreviews();
          }
          
          // Update device preview
          if (window.updateDevicePreview) {
            window.updateDevicePreview();
          }
          
          // Update featured website preview
          if (window.state.websites && window.state.websites.length > 0 && window.updateFeaturedPreviewImage) {
            window.updateFeaturedPreviewImage(window.state.websites[0]);
          }
        }
      }
      // If it's a comparison device switcher
      else {
        const comparisonModal = deviceSwitcher.closest('.comparison-modal');
        if (comparisonModal) {
          const manusImage = comparisonModal.querySelector('.manus-image');
          const internImage = comparisonModal.querySelector('.intern-image');
          
          // Update images based on selected device
          if (manusImage && manusImage.dataset.websiteId) {
            const manusKey = `${manusImage.dataset.websiteId}_manus_${deviceType}`;
            const cachedmanusUrl = screenshotCache.get(manusKey);
            
            if (cachedmanusUrl) {
              manusImage.src = cachedmanusUrl;
            } else {
              manusImage.classList.add('loading');
              // This would call the appropriate function from main.js
            }
          }
          
          if (internImage && internImage.dataset.websiteId) {
            const internKey = `${internImage.dataset.websiteId}_intern_${deviceType}`;
            const cachedinternUrl = screenshotCache.get(internKey);
            
            if (cachedinternUrl) {
              internImage.src = cachedinternUrl;
            } else {
              internImage.classList.add('loading');
              // This would call the appropriate function from main.js
            }
          }
        }
      }
    }
  });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in main.js
if (typeof window !== 'undefined') {
  window.performanceOptimizations = {
    init: initPerformanceOptimizations,
    screenshotCache,
    loadScreenshot,
    debounce,
    throttle
  };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);